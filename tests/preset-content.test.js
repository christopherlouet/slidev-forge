import { describe, it, expect } from 'vitest';
import { getPresetContent, PRESET_CONTENT_REGISTRY } from '../src/preset-content.js';
import { generateSectionContent } from '../src/templates/section-content.js';
import { generateSlides } from '../src/templates/slides.js';
import { mergeDefaults } from '../src/config.js';
import { PRESETS } from '../src/config.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

function bodyStr(section, config, id = 'test') {
  return generateSectionContent(section, config, id).body.join('\n');
}

// ─────────────────────────────────────────────────────
// T017 - Module structure
// ─────────────────────────────────────────────────────
describe('getPresetContent', () => {
  it('should return content for a known preset and section', () => {
    const content = getPresetContent('conference', 'intro', 'fr');
    expect(content).not.toBeNull();
    expect(content.content).toBeDefined();
    expect(Array.isArray(content.content)).toBe(true);
  });

  it('should return null for unknown preset', () => {
    const content = getPresetContent('nonexistent', 'intro', 'fr');
    expect(content).toBeNull();
  });

  it('should return null for unknown section name', () => {
    const content = getPresetContent('conference', 'nonexistent', 'fr');
    expect(content).toBeNull();
  });

  it('should return content in FR', () => {
    const content = getPresetContent('conference', 'intro', 'fr');
    expect(content).not.toBeNull();
    expect(content.content.length).toBeGreaterThanOrEqual(2);
  });

  it('should return content in EN', () => {
    const content = getPresetContent('conference', 'intro', 'en');
    expect(content).not.toBeNull();
    expect(content.content.length).toBeGreaterThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────────────
// T018/T019 - Content completeness per preset
// ─────────────────────────────────────────────────────
describe('preset content completeness', () => {
  const presetNames = ['conference', 'workshop', 'lightning', 'pitch'];
  const languages = ['fr', 'en'];

  for (const preset of presetNames) {
    describe(`${preset} preset`, () => {
      it('should have content entries in registry', () => {
        expect(PRESET_CONTENT_REGISTRY[preset]).toBeDefined();
        const keys = Object.keys(PRESET_CONTENT_REGISTRY[preset]);
        expect(keys.length).toBeGreaterThanOrEqual(3);
      });

      for (const lang of languages) {
        it(`should have non-empty content for all registry keys in ${lang}`, () => {
          const keys = Object.keys(PRESET_CONTENT_REGISTRY[preset]);
          for (const key of keys) {
            const content = getPresetContent(preset, key, lang);
            expect(content, `Missing content for ${preset}/${key} in ${lang}`).not.toBeNull();
            expect(content.content.length, `Content too short for ${preset}/${key} in ${lang}`).toBeGreaterThanOrEqual(1);
          }
        });

        it(`should enrich preset sections with content in ${lang}`, () => {
          const sections = PRESETS[preset](lang);
          const sectionsWithContent = sections.filter(s => s.content && s.content.length > 0);
          expect(sectionsWithContent.length, `Not enough enriched sections for ${preset} in ${lang}`).toBeGreaterThanOrEqual(3);
        });
      }
    });
  }
});

// ─────────────────────────────────────────────────────
// Registry structure
// ─────────────────────────────────────────────────────
describe('PRESET_CONTENT_REGISTRY', () => {
  it('should be exported and contain all 4 presets', () => {
    expect(PRESET_CONTENT_REGISTRY).toBeDefined();
    expect(PRESET_CONTENT_REGISTRY).toHaveProperty('conference');
    expect(PRESET_CONTENT_REGISTRY).toHaveProperty('workshop');
    expect(PRESET_CONTENT_REGISTRY).toHaveProperty('lightning');
    expect(PRESET_CONTENT_REGISTRY).toHaveProperty('pitch');
  });
});

// ─────────────────────────────────────────────────────
// Content-specific checks
// ─────────────────────────────────────────────────────
describe('preset content specifics', () => {
  describe('conference preset', () => {
    it('should have code content for demo section', () => {
      const content = getPresetContent('conference', 'demo', 'fr');
      expect(content).not.toBeNull();
      expect(content.code).toBeDefined();
      expect(content.code.length).toBeGreaterThan(0);
    });
  });

  describe('workshop preset', () => {
    it('should have items for prerequis section', () => {
      const content = getPresetContent('workshop', 'prerequis', 'fr');
      if (content) {
        expect(content.items).toBeDefined();
        expect(content.items.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('should have items for prereq section in EN', () => {
      const content = getPresetContent('workshop', 'prerequisites', 'en');
      if (content) {
        expect(content.items).toBeDefined();
        expect(content.items.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('lightning preset', () => {
    it('should have value/description for CTA section', () => {
      const content = getPresetContent('lightning', 'cta', 'fr');
      expect(content).not.toBeNull();
      expect(content.value).toBeDefined();
      expect(content.description).toBeDefined();
    });
  });

  describe('pitch preset', () => {
    it('should have value for market section', () => {
      const content = getPresetContent('pitch', 'market', 'fr');
      expect(content).not.toBeNull();
      expect(content.value).toBeDefined();
    });
  });
});

// ─────────────────────────────────────────────────────
// Integration: content used in section-content.ts
// ─────────────────────────────────────────────────────
describe('section.content integration with section-content.ts', () => {
  it('should render content lines in default type body', () => {
    const config = makeConfig();
    const section = {
      name: 'Intro',
      type: 'default',
      content: ['- Point A', '- Point B', '- Point C'],
    };
    const body = bodyStr(section, config);
    expect(body).toContain('- Point A');
    expect(body).toContain('- Point B');
    expect(body).toContain('- Point C');
    // Should NOT contain placeholder comment when content is provided
    expect(body).not.toContain('Contenu de la section');
  });

  it('should still show placeholder when no content', () => {
    const config = makeConfig();
    const section = { name: 'Intro', type: 'default' };
    const body = bodyStr(section, config);
    expect(body).toContain('<!--');
  });

  it('should render content in two-cols left column', () => {
    const config = makeConfig();
    const section = {
      name: 'Compare',
      type: 'two-cols',
      content: ['Left side content here'],
    };
    const body = bodyStr(section, config);
    expect(body).toContain('Left side content here');
    expect(body).toContain('::right::');
  });

  it('should render content in image-right body', () => {
    const config = makeConfig();
    const section = {
      name: 'Visual',
      type: 'image-right',
      content: ['Description of image context'],
    };
    const body = bodyStr(section, config);
    expect(body).toContain('Description of image context');
  });

  it('should render content in image-left body', () => {
    const config = makeConfig();
    const section = {
      name: 'Visual',
      type: 'image-left',
      content: ['Right side content here'],
    };
    const body = bodyStr(section, config);
    expect(body).toContain('Right side content here');
  });
});

// ─────────────────────────────────────────────────────
// Integration: full preset generates enriched slides
// ─────────────────────────────────────────────────────
describe('preset generates enriched slides', () => {
  it('conference preset should produce slides with real content (not just placeholders)', () => {
    const config = makeConfig({ preset: 'conference' });
    const slides = generateSlides(config);
    // Should have at least some non-placeholder bullet points
    expect(slides).toMatch(/- [A-Z]/);
  });

  it('workshop preset should produce slides with step items', () => {
    const config = makeConfig({ preset: 'workshop' });
    const slides = generateSlides(config);
    // Should have step items (from prerequis section)
    expect(slides).toContain('<v-clicks>');
  });
});
