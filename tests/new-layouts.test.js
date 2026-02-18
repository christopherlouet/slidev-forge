import { describe, it, expect } from 'vitest';
import { generateSectionContent, generateSectionNotes } from '../src/templates/section-content.js';
import { generateSlides } from '../src/templates/slides.js';
import { generateMultiFile } from '../src/templates/multi-file.js';
import { mergeDefaults } from '../src/config.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

function fmStr(section, config, id = 'test') {
  return generateSectionContent(section, config, id).frontmatter.join('\n');
}

function bodyStr(section, config, id = 'test') {
  return generateSectionContent(section, config, id).body.join('\n');
}

// ─────────────────────────────────────────────────────
// T013 - section-divider (layout: section)
// ─────────────────────────────────────────────────────
describe('section-divider type', () => {
  describe('frontmatter', () => {
    it('should use layout: section', () => {
      const config = makeConfig();
      const fm = fmStr({ name: 'Part 2', type: 'section-divider' }, config);
      expect(fm).toContain('layout: section');
    });

    it('should include transition', () => {
      const config = makeConfig({ transition: 'fade' });
      const fm = fmStr({ name: 'Part 2', type: 'section-divider' }, config);
      expect(fm).toContain('transition: fade');
    });
  });

  describe('body', () => {
    it('should include section marker', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Part 2', type: 'section-divider' }, config, 'part-2');
      expect(body).toContain('<!-- section:id=part-2 -->');
    });

    it('should include title as heading', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Part 2', type: 'section-divider' }, config);
      expect(body).toContain('# Part 2');
    });

    it('should be minimal - marker and title only, no placeholder comment', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Part 2', type: 'section-divider' }, config);
      // Should have marker + title, no placeholder comment
      expect(body).toContain('<!-- section:id=test -->');
      expect(body).not.toContain('Contenu');
      const lines = body.split('\n').filter(l => l.trim() !== '');
      expect(lines.length).toBeLessThanOrEqual(2);
    });
  });

  describe('notes', () => {
    it('should generate contextual notes', () => {
      const config = makeConfig();
      const notes = generateSectionNotes({ name: 'Part 2', type: 'section-divider' }, config).join('\n');
      expect(notes).toContain('<!--');
      expect(notes).toContain('-->');
    });
  });
});

// ─────────────────────────────────────────────────────
// T014 - statement (layout: statement)
// ─────────────────────────────────────────────────────
describe('statement type', () => {
  describe('frontmatter', () => {
    it('should use layout: statement', () => {
      const config = makeConfig();
      const fm = fmStr({ name: 'Key Insight', type: 'statement' }, config);
      expect(fm).toContain('layout: statement');
    });

    it('should include transition', () => {
      const config = makeConfig({ transition: 'zoom' });
      const fm = fmStr({ name: 'Key Insight', type: 'statement' }, config);
      expect(fm).toContain('transition: zoom');
    });
  });

  describe('body', () => {
    it('should include section marker', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Key Insight', type: 'statement' }, config, 'key-insight');
      expect(body).toContain('<!-- section:id=key-insight -->');
    });

    it('should include title as heading', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Key Insight', type: 'statement' }, config);
      expect(body).toContain('# Key Insight');
    });

    it('should be minimal - marker and title only, no placeholder comment', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Key Insight', type: 'statement' }, config);
      expect(body).toContain('<!-- section:id=test -->');
      expect(body).not.toContain('Contenu');
      const lines = body.split('\n').filter(l => l.trim() !== '');
      expect(lines.length).toBeLessThanOrEqual(2);
    });
  });

  describe('notes', () => {
    it('should generate contextual notes', () => {
      const config = makeConfig();
      const notes = generateSectionNotes({ name: 'Key Insight', type: 'statement' }, config).join('\n');
      expect(notes).toContain('<!--');
      expect(notes).toContain('-->');
    });
  });
});

// ─────────────────────────────────────────────────────
// T015 - image-left (layout: image-left)
// ─────────────────────────────────────────────────────
describe('image-left type', () => {
  describe('frontmatter', () => {
    it('should use layout: image-left', () => {
      const config = makeConfig();
      const fm = fmStr({ name: 'Visual', type: 'image-left' }, config);
      expect(fm).toContain('layout: image-left');
    });

    it('should include default image', () => {
      const config = makeConfig();
      const fm = fmStr({ name: 'Visual', type: 'image-left' }, config);
      expect(fm).toContain('image: https://cover.sli.dev');
    });

    it('should use custom image when provided', () => {
      const config = makeConfig();
      const fm = fmStr({ name: 'Visual', type: 'image-left', image: 'https://example.com/photo.jpg' }, config);
      expect(fm).toContain('image: https://example.com/photo.jpg');
    });

    it('should include transition', () => {
      const config = makeConfig({ transition: 'fade' });
      const fm = fmStr({ name: 'Visual', type: 'image-left' }, config);
      expect(fm).toContain('transition: fade');
    });
  });

  describe('body', () => {
    it('should include section marker', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Visual', type: 'image-left' }, config, 'visual');
      expect(body).toContain('<!-- section:id=visual -->');
    });

    it('should include title as heading', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Visual', type: 'image-left' }, config);
      expect(body).toContain('# Visual');
    });

    it('should include content placeholder in FR', () => {
      const config = makeConfig({ language: 'fr' });
      const body = bodyStr({ name: 'Visual', type: 'image-left' }, config);
      expect(body).toContain('<!--');
    });

    it('should include content placeholder in EN', () => {
      const config = makeConfig({ language: 'en' });
      const body = bodyStr({ name: 'Visual', type: 'image-left' }, config);
      expect(body).toContain('<!--');
    });
  });

  describe('notes', () => {
    it('should generate contextual notes', () => {
      const config = makeConfig();
      const notes = generateSectionNotes({ name: 'Visual', type: 'image-left' }, config).join('\n');
      expect(notes).toContain('<!--');
      expect(notes).toContain('-->');
    });
  });
});

// ─────────────────────────────────────────────────────
// T016 - image (layout: image)
// ─────────────────────────────────────────────────────
describe('image type', () => {
  describe('frontmatter', () => {
    it('should use layout: image', () => {
      const config = makeConfig();
      const fm = fmStr({ name: 'Fullscreen', type: 'image' }, config);
      expect(fm).toContain('layout: image');
    });

    it('should include default image', () => {
      const config = makeConfig();
      const fm = fmStr({ name: 'Fullscreen', type: 'image' }, config);
      expect(fm).toContain('image: https://cover.sli.dev');
    });

    it('should use custom image when provided', () => {
      const config = makeConfig();
      const fm = fmStr({ name: 'Fullscreen', type: 'image', image: 'https://example.com/hero.jpg' }, config);
      expect(fm).toContain('image: https://example.com/hero.jpg');
    });

    it('should include transition', () => {
      const config = makeConfig({ transition: 'zoom' });
      const fm = fmStr({ name: 'Fullscreen', type: 'image' }, config);
      expect(fm).toContain('transition: zoom');
    });
  });

  describe('body', () => {
    it('should include section marker', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Fullscreen', type: 'image' }, config, 'fullscreen');
      expect(body).toContain('<!-- section:id=fullscreen -->');
    });

    it('should include title as heading', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Fullscreen', type: 'image' }, config);
      expect(body).toContain('# Fullscreen');
    });

    it('should be minimal - marker and title only, no placeholder comment', () => {
      const config = makeConfig();
      const body = bodyStr({ name: 'Fullscreen', type: 'image' }, config);
      expect(body).toContain('<!-- section:id=test -->');
      expect(body).not.toContain('Contenu');
      const lines = body.split('\n').filter(l => l.trim() !== '');
      expect(lines.length).toBeLessThanOrEqual(2);
    });
  });

  describe('notes', () => {
    it('should generate contextual notes', () => {
      const config = makeConfig();
      const notes = generateSectionNotes({ name: 'Fullscreen', type: 'image' }, config).join('\n');
      expect(notes).toContain('<!--');
      expect(notes).toContain('-->');
    });
  });
});

// ─────────────────────────────────────────────────────
// Integration tests
// ─────────────────────────────────────────────────────
describe('new layouts - integration', () => {
  describe('single-file mode', () => {
    it('should generate all 4 new layouts in a presentation', () => {
      const config = makeConfig({
        sections: [
          { name: 'Part 1', type: 'section-divider' },
          { name: 'Key Insight', type: 'statement' },
          { name: 'Photo Left', type: 'image-left' },
          { name: 'Hero Shot', type: 'image' },
        ],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('layout: section');
      expect(slides).toContain('layout: statement');
      expect(slides).toContain('layout: image-left');
      expect(slides).toContain('layout: image');
    });
  });

  describe('multi-file mode', () => {
    it('should generate section-divider page with correct layout', () => {
      const config = makeConfig({
        sections: [{ name: 'Part 1', type: 'section-divider' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages.find(p => p.path.includes('part-1'));
      expect(page).toBeDefined();
      expect(page.content).toContain('layout: section');
      expect(page.content).toContain('# Part 1');
    });

    it('should generate statement page with correct layout', () => {
      const config = makeConfig({
        sections: [{ name: 'Key Insight', type: 'statement' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages.find(p => p.path.includes('key-insight'));
      expect(page).toBeDefined();
      expect(page.content).toContain('layout: statement');
    });

    it('should generate image-left page with layout and image', () => {
      const config = makeConfig({
        sections: [{ name: 'Photo', type: 'image-left' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages.find(p => p.path.includes('photo'));
      expect(page).toBeDefined();
      expect(page.content).toContain('layout: image-left');
      expect(page.content).toContain('image:');
    });

    it('should generate image page with layout and image', () => {
      const config = makeConfig({
        sections: [{ name: 'Hero', type: 'image' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages.find(p => p.path.includes('hero'));
      expect(page).toBeDefined();
      expect(page.content).toContain('layout: image');
      expect(page.content).toContain('image:');
    });
  });
});
