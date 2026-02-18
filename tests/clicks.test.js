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

describe('clicks: true - v-click generation', () => {
  describe('default type', () => {
    it('should add v-clicks wrapper when clicks is true', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Intro', type: 'default', clicks: true }, config);
      expect(body).toContain('<v-clicks>');
      expect(body).toContain('</v-clicks>');
    });

    it('should NOT add v-clicks when clicks is absent', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Intro', type: 'default' }, config);
      expect(body).not.toContain('<v-clicks>');
      expect(body).not.toContain('</v-clicks>');
    });

    it('should NOT add v-clicks when clicks is false', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Intro', type: 'default', clicks: false }, config);
      expect(body).not.toContain('<v-clicks>');
    });
  });

  describe('two-cols type', () => {
    it('should wrap right column in v-click when clicks is true', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Compare', type: 'two-cols', clicks: true }, config);
      expect(body).toContain('::right::');
      expect(body).toContain('<v-click>');
      expect(body).toContain('</v-click>');
    });

    it('should NOT wrap right column when clicks is absent', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Compare', type: 'two-cols' }, config);
      expect(body).toContain('::right::');
      expect(body).not.toContain('<v-click>');
    });
  });

  describe('quote type', () => {
    it('should wrap attribution in v-click when clicks is true', () => {
      const config = makeConfig({ language: 'fr' });
      const body = bodyStr({ name: 'Citation', type: 'quote', clicks: true }, config);
      expect(body).toContain('> ');
      expect(body).toContain('<v-click>');
      expect(body).toContain('</v-click>');
      // The attribution (-- Author) should be inside v-click
      expect(body).toMatch(/<v-click>\s*\n\s*-- /);
    });

    it('should NOT wrap attribution when clicks is absent', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Citation', type: 'quote' }, config);
      expect(body).not.toContain('<v-click>');
    });
  });

  describe('fact type', () => {
    it('should wrap description in v-click when clicks is true', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Stats', type: 'fact', value: '99%', description: 'uptime', clicks: true }, config);
      expect(body).toContain('99%');
      expect(body).toContain('<v-click>');
      expect(body).toContain('</v-click>');
      // The description should be inside v-click
      expect(body).toMatch(/<v-click>\s*\n.*uptime[\s\S]*<\/v-click>/);
    });

    it('should NOT wrap description when clicks is absent', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Stats', type: 'fact', value: '99%', description: 'uptime' }, config);
      expect(body).not.toContain('<v-click>');
    });
  });

  describe('diagram type', () => {
    it('should wrap mermaid block in v-click when clicks is true', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Arch', type: 'diagram', clicks: true }, config);
      expect(body).toContain('<v-click>');
      expect(body).toContain('```mermaid');
      expect(body).toContain('</v-click>');
    });

    it('should NOT wrap mermaid block when clicks is absent', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Arch', type: 'diagram' }, config);
      expect(body).not.toContain('<v-click>');
    });
  });

  describe('types that should NOT change with clicks', () => {
    it('steps type should be unchanged (already has v-clicks)', () => {
      const config = makeConfig();
      const withClicks = bodyStr({ name: 'Steps', type: 'steps', items: ['A', 'B'], clicks: true }, config);
      const without = bodyStr({ name: 'Steps', type: 'steps', items: ['A', 'B'] }, config);
      expect(withClicks).toBe(without);
    });

    it('code type should be unchanged (use highlights instead)', () => {
      const config = makeConfig();
      const withClicks = bodyStr({ name: 'Demo', type: 'code', clicks: true }, config);
      const without = bodyStr({ name: 'Demo', type: 'code' }, config);
      expect(withClicks).toBe(without);
    });

    it('cover type should be unchanged', () => {
      const config = makeConfig();
      const withClicks = bodyStr({ name: 'Ch', type: 'cover', clicks: true }, config);
      const without = bodyStr({ name: 'Ch', type: 'cover' }, config);
      expect(withClicks).toBe(without);
    });

    it('qna type should be unchanged', () => {
      const config = makeConfig();
      const withClicks = bodyStr({ name: 'Q&A', type: 'qna', clicks: true }, config);
      const without = bodyStr({ name: 'Q&A', type: 'qna' }, config);
      expect(withClicks).toBe(without);
    });

    it('thanks type should be unchanged', () => {
      const config = makeConfig();
      const withClicks = bodyStr({ name: 'Merci', type: 'thanks', clicks: true }, config);
      const without = bodyStr({ name: 'Merci', type: 'thanks' }, config);
      expect(withClicks).toBe(without);
    });

    it('about type should be unchanged', () => {
      const config = makeConfig();
      const withClicks = bodyStr({ name: 'Bio', type: 'about', clicks: true }, config);
      const without = bodyStr({ name: 'Bio', type: 'about' }, config);
      expect(withClicks).toBe(without);
    });

    it('iframe type should be unchanged', () => {
      const config = makeConfig();
      const withClicks = bodyStr({ name: 'Demo', type: 'iframe', url: 'https://example.com', clicks: true }, config);
      const without = bodyStr({ name: 'Demo', type: 'iframe', url: 'https://example.com' }, config);
      expect(withClicks).toBe(without);
    });

    it('image-right type should be unchanged', () => {
      const config = makeConfig();
      const withClicks = bodyStr({ name: 'Visual', type: 'image-right', clicks: true }, config);
      const without = bodyStr({ name: 'Visual', type: 'image-right' }, config);
      expect(withClicks).toBe(without);
    });
  });
});

describe('clicks in single-file mode (generateSlides)', () => {
  it('should generate v-clicks for default section with clicks:true', () => {
    const config = makeConfig({
      sections: [{ name: 'Intro', type: 'default', clicks: true }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('<v-clicks>');
  });
});

describe('clicks in multi-file mode (generateMultiFile)', () => {
  it('should generate v-clicks in page files when clicks:true', () => {
    const config = makeConfig({
      sections: [{ name: 'Intro', type: 'default', clicks: true }],
    });
    const result = generateMultiFile(config);
    const introPage = result.pages.find(p => p.path.includes('intro'));
    expect(introPage).toBeDefined();
    expect(introPage.content).toContain('<v-clicks>');
  });

  it('should NOT generate v-clicks in page files when clicks is absent', () => {
    const config = makeConfig({
      sections: [{ name: 'Intro', type: 'default' }],
    });
    const result = generateMultiFile(config);
    const introPage = result.pages.find(p => p.path.includes('intro'));
    expect(introPage).toBeDefined();
    expect(introPage.content).not.toContain('<v-clicks>');
  });
});
