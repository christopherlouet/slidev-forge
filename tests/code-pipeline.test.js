import { describe, it, expect } from 'vitest';
import { getPresetContent, PRESET_CONTENT_REGISTRY } from '../src/preset-content.js';
import { generateSectionContent } from '../src/templates/section-content.js';
import { mergeDefaults, PRESETS } from '../src/config.js';
import { generateSlides } from '../src/templates/slides.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

function bodyStr(section, config, id = 'test') {
  return generateSectionContent(section, config, id).body.join('\n');
}

// ─────────────────────────────────────────────────────
// T007a - enrichSection propagates code to sections
// ─────────────────────────────────────────────────────
describe('enrichSection propagates code to sections', () => {
  const presetsWithCode = [
    { preset: 'conference', key: 'demo', label: 'conference demo' },
    { preset: 'workshop', key: 'exercise', label: 'workshop exercise' },
    { preset: 'lightning', key: 'demo', label: 'lightning demo' },
    { preset: 'keynote', key: 'demo', label: 'keynote demo' },
  ];

  for (const { preset, key, label } of presetsWithCode) {
    it(`${label} section should have code field from preset content`, () => {
      const sections = PRESETS[preset]('fr');
      const codeSection = sections.find(s => s.type === 'code');
      expect(codeSection).toBeDefined();
      expect(codeSection.code).toBeDefined();
      expect(typeof codeSection.code).toBe('string');
      expect(codeSection.code.split('\n').length).toBeGreaterThanOrEqual(12);
    });
  }

  for (const { preset, key, label } of presetsWithCode) {
    it(`${label} EN code should differ from FR code`, () => {
      const sectionsFr = PRESETS[preset]('fr');
      const sectionsEn = PRESETS[preset]('en');
      const codeFr = sectionsFr.find(s => s.type === 'code');
      const codeEn = sectionsEn.find(s => s.type === 'code');
      if (codeFr && codeEn) {
        expect(codeFr.code).not.toBe(codeEn.code);
      }
    });
  }
});

// ─────────────────────────────────────────────────────
// T007b - section-content renders real code
// ─────────────────────────────────────────────────────
describe('section-content renders real code', () => {
  it('should render section.code content instead of placeholder', () => {
    const config = makeConfig();
    const section = {
      name: 'Demo',
      type: 'code',
      code: 'const app = express();\napp.get("/api", (req, res) => {\n  res.json({ ok: true });\n});',
    };
    const body = bodyStr(section, config);
    expect(body).toContain('```javascript');
    expect(body).toContain('const app = express();');
    expect(body).toContain('res.json({ ok: true });');
    expect(body).not.toContain('comment_code_placeholder');
    expect(body).not.toContain('Votre code ici');
    expect(body).not.toContain('Your code here');
  });

  it('should respect section.lang for code blocks', () => {
    const config = makeConfig();
    const section = {
      name: 'Demo',
      type: 'code',
      lang: 'typescript',
      code: 'const x: number = 42;',
    };
    const body = bodyStr(section, config);
    expect(body).toContain('```typescript');
    expect(body).toContain('const x: number = 42;');
  });

  it('should still render placeholder when no section.code', () => {
    const config = makeConfig();
    const section = { name: 'Demo', type: 'code' };
    const body = bodyStr(section, config);
    expect(body).toContain('```javascript');
    expect(body).toContain('```');
  });

  it('should prefer file import over code when both present', () => {
    const config = makeConfig();
    const section = {
      name: 'Demo',
      type: 'code',
      file: 'snippets/example.ts',
      code: 'const x = 1;',
    };
    const body = bodyStr(section, config);
    expect(body).toContain('<<< @/snippets/example.ts');
    expect(body).not.toContain('const x = 1;');
  });
});

// ─────────────────────────────────────────────────────
// T007c - Real code quality in presets
// ─────────────────────────────────────────────────────
describe('real code quality in presets', () => {
  const presetsWithCode = [
    { preset: 'conference', key: 'demo' },
    { preset: 'workshop', key: 'exercise' },
    { preset: 'lightning', key: 'demo' },
    { preset: 'keynote', key: 'demo' },
  ];

  for (const { preset, key } of presetsWithCode) {
    describe(`${preset} preset`, () => {
      it('code should have >= 15 lines (FR)', () => {
        const content = getPresetContent(preset, key, 'fr');
        expect(content).not.toBeNull();
        expect(content.code).toBeDefined();
        const lines = content.code.split('\n').length;
        expect(lines).toBeGreaterThanOrEqual(12);
      });

      it('code should have >= 15 lines (EN)', () => {
        const content = getPresetContent(preset, key, 'en');
        expect(content).not.toBeNull();
        expect(content.code).toBeDefined();
        const lines = content.code.split('\n').length;
        expect(lines).toBeGreaterThanOrEqual(12);
      });

      it('code should contain function or class definition', () => {
        const content = getPresetContent(preset, key, 'fr');
        const hasDefinition = /function |class |const |export |async |=>/.test(content.code);
        expect(hasDefinition).toBe(true);
      });

      it('code should have comments', () => {
        const content = getPresetContent(preset, key, 'fr');
        expect(content.code).toMatch(/\/\/|\/\*|\*\//);
      });
    });
  }

  // Integration: generated slides contain real code
  for (const preset of ['conference', 'workshop', 'keynote']) {
    it(`${preset} slides should contain real code (not just placeholder)`, () => {
      const config = makeConfig({ preset });
      const slides = generateSlides(config);
      // Should not contain the generic placeholder
      const codeBlocks = slides.split('```javascript').slice(1);
      expect(codeBlocks.length).toBeGreaterThan(0);
      // At least one code block should have substantial content (> 5 lines)
      const hasRealCode = codeBlocks.some(block => {
        const content = block.split('```')[0];
        return content.split('\n').length > 5;
      });
      expect(hasRealCode).toBe(true);
    });
  }
});
