import { describe, it, expect } from 'vitest';
import { generateSectionNotes } from '../src/templates/section-content.js';
import { generateSlides } from '../src/templates/slides.js';
import { generateMultiFile } from '../src/templates/multi-file.js';
import { mergeDefaults } from '../src/config.js';
import { t } from '../src/i18n.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

describe('generateSectionNotes', () => {
  describe('custom notes via section.notes', () => {
    it('should use custom notes when section.notes is provided', () => {
      const config = makeConfig();
      const section = { name: 'Intro', type: 'default', notes: 'Remember to smile' };
      const notes = generateSectionNotes(section, config);
      const notesStr = notes.join('\n');
      expect(notesStr).toContain('Remember to smile');
    });

    it('should prioritize custom notes over default contextual notes', () => {
      const config = makeConfig({ language: 'fr' });
      const section = { name: 'Code', type: 'code', notes: 'Mon texte custom' };
      const notes = generateSectionNotes(section, config);
      const notesStr = notes.join('\n');
      expect(notesStr).toContain('Mon texte custom');
      // Should NOT contain the default note for code
      expect(notesStr).not.toContain(t('note_code', 'fr'));
    });
  });

  describe('contextual default notes by section type', () => {
    const sectionTypes = [
      'default', 'two-cols', 'image-right', 'quote', 'qna',
      'thanks', 'about', 'code', 'diagram', 'cover',
      'iframe', 'steps', 'fact',
    ];

    for (const sectionType of sectionTypes) {
      it(`should generate contextual notes for type "${sectionType}" in FR`, () => {
        const config = makeConfig({ language: 'fr' });
        const section = { name: 'Section', type: sectionType };
        const notes = generateSectionNotes(section, config);
        const notesStr = notes.join('\n');
        // Notes should contain <!-- and --> (Slidev presenter notes format)
        expect(notesStr).toContain('<!--');
        expect(notesStr).toContain('-->');
        // Notes should NOT be empty between the comment markers
        const content = notesStr.replace(/<!--/g, '').replace(/-->/g, '').trim();
        expect(content.length).toBeGreaterThan(0);
      });

      it(`should generate contextual notes for type "${sectionType}" in EN`, () => {
        const config = makeConfig({ language: 'en' });
        const section = { name: 'Section', type: sectionType };
        const notes = generateSectionNotes(section, config);
        const notesStr = notes.join('\n');
        expect(notesStr).toContain('<!--');
        expect(notesStr).toContain('-->');
        const content = notesStr.replace(/<!--/g, '').replace(/-->/g, '').trim();
        expect(content.length).toBeGreaterThan(0);
      });
    }

    it('should generate different notes for different section types', () => {
      const config = makeConfig({ language: 'fr' });
      const defaultNotes = generateSectionNotes({ name: 'A', type: 'default' }, config).join('\n');
      const codeNotes = generateSectionNotes({ name: 'B', type: 'code' }, config).join('\n');
      const quoteNotes = generateSectionNotes({ name: 'C', type: 'quote' }, config).join('\n');
      // All three should be different
      expect(defaultNotes).not.toBe(codeNotes);
      expect(defaultNotes).not.toBe(quoteNotes);
      expect(codeNotes).not.toBe(quoteNotes);
    });

    it('should generate different notes for FR vs EN', () => {
      const frNotes = generateSectionNotes(
        { name: 'A', type: 'default' },
        makeConfig({ language: 'fr' }),
      ).join('\n');
      const enNotes = generateSectionNotes(
        { name: 'A', type: 'default' },
        makeConfig({ language: 'en' }),
      ).join('\n');
      expect(frNotes).not.toBe(enNotes);
    });
  });

  describe('notes for new v3.0 section types', () => {
    const newTypes = ['section-divider', 'statement', 'image-left', 'image'];

    for (const sectionType of newTypes) {
      it(`should generate contextual notes for new type "${sectionType}"`, () => {
        const config = makeConfig({ language: 'fr' });
        const section = { name: 'Section', type: sectionType };
        const notes = generateSectionNotes(section, config);
        const notesStr = notes.join('\n');
        expect(notesStr).toContain('<!--');
        expect(notesStr).toContain('-->');
        const content = notesStr.replace(/<!--/g, '').replace(/-->/g, '').trim();
        expect(content.length).toBeGreaterThan(0);
      });
    }
  });

  describe('notes format', () => {
    it('should wrap notes in HTML comment markers for Slidev', () => {
      const config = makeConfig();
      const section = { name: 'Intro', type: 'default' };
      const notes = generateSectionNotes(section, config);
      const notesStr = notes.join('\n');
      // Should follow Slidev presenter notes format
      expect(notesStr).toMatch(/<!--[\s\S]+-->/);
    });

    it('should have empty line before the comment block', () => {
      const config = makeConfig();
      const section = { name: 'Intro', type: 'default' };
      const notes = generateSectionNotes(section, config);
      expect(notes[0]).toBe('');
      expect(notes[1]).toBe('<!--');
    });
  });
});

describe('notes in single-file mode (generateSlides)', () => {
  it('should include presenter notes for each section', () => {
    const config = makeConfig({
      sections: [
        { name: 'Intro', type: 'default' },
        { name: 'Code', type: 'code' },
      ],
    });
    const slides = generateSlides(config);
    // Each section should have its own notes block
    const noteBlocks = slides.match(/<!--[\s\S]*?-->/g) || [];
    // At minimum: section markers (<!-- section:id=... -->) + notes for each section
    // Filter to only presenter notes (not markers or other comments)
    const presenterNotes = noteBlocks.filter(b => !b.includes('section:id=') && !b.includes('Contenu') && !b.includes('Section content') && !b.includes('Votre code') && !b.includes('Your code'));
    expect(presenterNotes.length).toBeGreaterThanOrEqual(2);
  });

  it('should use custom notes when section.notes is set', () => {
    const config = makeConfig({
      sections: [
        { name: 'Intro', type: 'default', notes: 'Commencer par une anecdote' },
      ],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('Commencer par une anecdote');
  });

  it('should use contextual notes for preset conference', () => {
    const config = makeConfig({ preset: 'conference', language: 'fr' });
    const slides = generateSlides(config);
    // Should contain contextual notes, not the old generic format
    expect(slides).toContain('<!--');
    // Should NOT contain the old generic note format
    expect(slides).not.toContain('Notes pour la section');
  });
});

describe('notes in multi-file mode (generateMultiFile)', () => {
  it('should include presenter notes in each page file', () => {
    const config = makeConfig({
      sections: [
        { name: 'Intro', type: 'default' },
        { name: 'Code', type: 'code' },
      ],
    });
    const result = generateMultiFile(config);
    // Check section pages (skip TOC at index 0)
    for (let i = 1; i < result.pages.length; i++) {
      const page = result.pages[i];
      expect(page.content).toContain('<!--');
      expect(page.content).toContain('-->');
    }
  });

  it('should use custom notes in multi-file pages', () => {
    const config = makeConfig({
      sections: [
        { name: 'Intro', type: 'default', notes: 'Notes pour le mode multi-file' },
      ],
    });
    const result = generateMultiFile(config);
    const introPage = result.pages.find(p => p.path.includes('intro'));
    expect(introPage).toBeDefined();
    expect(introPage.content).toContain('Notes pour le mode multi-file');
  });
});
