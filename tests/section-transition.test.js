import { describe, it, expect } from 'vitest';
import { generateSectionContent } from '../src/templates/section-content.js';
import { generateSlides } from '../src/templates/slides.js';
import { generateMultiFile } from '../src/templates/multi-file.js';
import { mergeDefaults } from '../src/config.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

function fmStr(section, config, id = 'test') {
  return generateSectionContent(section, config, id).frontmatter.join('\n');
}

describe('per-section transitions', () => {
  describe('section.transition overrides config.transition', () => {
    it('should use section transition when provided', () => {
      const config = makeConfig({ transition: 'slide-left' });
      const fm = fmStr({ name: 'Intro', type: 'default', transition: 'fade' }, config);
      expect(fm).toContain('transition: fade');
      expect(fm).not.toContain('transition: slide-left');
    });

    it('should use config transition when section has no transition', () => {
      const config = makeConfig({ transition: 'zoom' });
      const fm = fmStr({ name: 'Intro', type: 'default' }, config);
      expect(fm).toContain('transition: zoom');
    });

    it('should work with slide-up transition', () => {
      const config = makeConfig({ transition: 'slide-left' });
      const fm = fmStr({ name: 'Intro', type: 'default', transition: 'slide-up' }, config);
      expect(fm).toContain('transition: slide-up');
    });

    it('should work with none transition', () => {
      const config = makeConfig({ transition: 'fade' });
      const fm = fmStr({ name: 'Intro', type: 'default', transition: 'none' }, config);
      expect(fm).toContain('transition: none');
    });
  });

  describe('works across section types', () => {
    it('should apply section transition to two-cols type', () => {
      const config = makeConfig({ transition: 'slide-left' });
      const fm = fmStr({ name: 'Compare', type: 'two-cols', transition: 'fade' }, config);
      expect(fm).toContain('transition: fade');
      expect(fm).toContain('layout: two-cols');
    });

    it('should apply section transition to cover type', () => {
      const config = makeConfig({ transition: 'slide-left' });
      const fm = fmStr({ name: 'Chapter', type: 'cover', transition: 'zoom' }, config);
      expect(fm).toContain('transition: zoom');
      expect(fm).toContain('layout: cover');
    });

    it('should apply section transition to code type', () => {
      const config = makeConfig({ transition: 'slide-left' });
      const fm = fmStr({ name: 'Demo', type: 'code', transition: 'fade' }, config);
      expect(fm).toContain('transition: fade');
    });

    it('should apply section transition to fact type', () => {
      const config = makeConfig({ transition: 'slide-left' });
      const fm = fmStr({ name: 'Stats', type: 'fact', value: '99%', description: 'uptime', transition: 'zoom' }, config);
      expect(fm).toContain('transition: zoom');
    });
  });

  describe('integration - single-file mode', () => {
    it('should use section transition in single-file output', () => {
      const config = makeConfig({
        transition: 'slide-left',
        sections: [
          { name: 'Intro', type: 'default' },
          { name: 'Highlight', type: 'default', transition: 'fade' },
        ],
      });
      const slides = generateSlides(config);
      // Global transition for first section
      expect(slides).toContain('transition: slide-left');
      // Section-specific transition for second
      expect(slides).toContain('transition: fade');
    });

    it('should have different transitions for different sections', () => {
      const config = makeConfig({
        transition: 'slide-left',
        sections: [
          { name: 'A', type: 'default', transition: 'fade' },
          { name: 'B', type: 'default', transition: 'zoom' },
        ],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('transition: fade');
      expect(slides).toContain('transition: zoom');
    });
  });

  describe('integration - multi-file mode', () => {
    it('should use section transition in multi-file page', () => {
      const config = makeConfig({
        transition: 'slide-left',
        sections: [
          { name: 'Intro', type: 'default', transition: 'fade' },
        ],
      });
      const result = generateMultiFile(config);
      const introPage = result.pages.find(p => p.path.includes('intro'));
      expect(introPage).toBeDefined();
      expect(introPage.content).toContain('transition: fade');
      expect(introPage.content).not.toContain('transition: slide-left');
    });

    it('should use config transition in multi-file when section has none', () => {
      const config = makeConfig({
        transition: 'zoom',
        sections: [
          { name: 'Intro', type: 'default' },
        ],
      });
      const result = generateMultiFile(config);
      const introPage = result.pages.find(p => p.path.includes('intro'));
      expect(introPage).toBeDefined();
      expect(introPage.content).toContain('transition: zoom');
    });
  });
});
