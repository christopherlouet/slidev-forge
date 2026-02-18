import { describe, it, expect } from 'vitest';
import { generateSectionContent } from '../src/templates/section-content.js';
import { generateSlides } from '../src/templates/slides.js';
import { generateMultiFile } from '../src/templates/multi-file.js';
import { mergeDefaults } from '../src/config.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

function bodyStr(section, config, id = 'test') {
  return generateSectionContent(section, config, id).body.join('\n');
}

describe('code highlights - progressive line highlighting', () => {
  describe('highlights option', () => {
    it('should generate {highlights} when highlights is a range', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', highlights: '1-3|5-8|10' }, config);
      expect(body).toContain('```javascript {1-3|5-8|10}');
      expect(body).not.toContain('{lines:true}');
    });

    it('should generate {lines:true} when highlights is "all"', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', highlights: 'all' }, config);
      expect(body).toContain('```javascript {lines:true}');
    });

    it('should generate {lines:true} when highlights is absent', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code' }, config);
      expect(body).toContain('```javascript {lines:true}');
    });

    it('should generate {highlights} with comma-separated lines', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', highlights: '1,3,5' }, config);
      expect(body).toContain('```javascript {1,3,5}');
    });

    it('should combine highlights with custom language', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', lang: 'typescript', highlights: '2-4|6' }, config);
      expect(body).toContain('```typescript {2-4|6}');
    });

    it('should still include code placeholder with highlights', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', highlights: '1-3' }, config);
      expect(body).toContain('// ');
      expect(body).toContain('```', 2);
    });
  });

  describe('file import', () => {
    it('should generate <<< import when file is set', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', file: 'snippets/example.ts' }, config);
      expect(body).toContain('<<< @/snippets/example.ts');
      expect(body).not.toContain('```javascript');
    });

    it('should not include inline code placeholder with file import', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', file: 'snippets/example.ts' }, config);
      expect(body).not.toContain('// ');
    });

    it('should combine file and highlights', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', file: 'snippets/example.ts', highlights: '1-3|5' }, config);
      expect(body).toContain('<<< @/snippets/example.ts {1-3|5}{lines:true}');
    });

    it('should use file without highlights (no spec suffix)', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', file: 'code/app.js' }, config);
      expect(body).toContain('<<< @/code/app.js');
      expect(body).not.toContain('{');
    });

    it('should handle file with highlights=all (no spec suffix)', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', file: 'snippets/demo.ts', highlights: 'all' }, config);
      expect(body).toContain('<<< @/snippets/demo.ts');
      expect(body).not.toContain('{');
    });

    it('should still include section title with file import', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Code Demo', type: 'code', file: 'snippets/example.ts' }, config);
      expect(body).toContain('# Code Demo');
    });

    it('should still include section marker with file import', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', file: 'snippets/example.ts' }, config, 'demo');
      expect(body).toContain('<!-- section:id=demo -->');
    });
  });

  describe('file + lang interaction', () => {
    it('should ignore lang when file is set (Slidev infers from extension)', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Demo', type: 'code', file: 'snippets/example.ts', lang: 'python' }, config);
      expect(body).toContain('<<< @/snippets/example.ts');
      expect(body).not.toContain('python');
    });
  });

  describe('integration - single-file mode', () => {
    it('should generate highlights in single-file output', () => {
      const config = makeConfig({
        sections: [{ name: 'Demo', type: 'code', lang: 'typescript', highlights: '1-3|5' }],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('```typescript {1-3|5}');
    });

    it('should generate file import in single-file output', () => {
      const config = makeConfig({
        sections: [{ name: 'Demo', type: 'code', file: 'snippets/app.ts' }],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('<<< @/snippets/app.ts');
    });
  });

  describe('integration - multi-file mode', () => {
    it('should generate highlights in multi-file page', () => {
      const config = makeConfig({
        sections: [{ name: 'Demo', type: 'code', highlights: '2-4|6' }],
      });
      const result = generateMultiFile(config);
      const demoPage = result.pages.find(p => p.path.includes('demo'));
      expect(demoPage).toBeDefined();
      expect(demoPage.content).toContain('```javascript {2-4|6}');
    });

    it('should generate file import in multi-file page', () => {
      const config = makeConfig({
        sections: [{ name: 'Demo', type: 'code', file: 'snippets/demo.ts' }],
      });
      const result = generateMultiFile(config);
      const demoPage = result.pages.find(p => p.path.includes('demo'));
      expect(demoPage).toBeDefined();
      expect(demoPage.content).toContain('<<< @/snippets/demo.ts');
    });
  });
});
