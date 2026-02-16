import { describe, it, expect, vi } from 'vitest';
import { resolve } from 'node:path';
import { loadConfig, mergeDefaults, validateConfig, normalizeSections, SECTION_TYPES } from '../src/config.js';
import { getTheme } from '../src/themes.js';

const FIXTURES = resolve(import.meta.dirname, 'fixtures');

describe('config', () => {
  describe('loadConfig', () => {
    it('should load and parse a valid YAML file', async () => {
      const config = await loadConfig(resolve(FIXTURES, 'minimal.yaml'));
      expect(config.title).toBe('Mon Talk');
      expect(config.author).toBe('Chris');
    });

    it('should load a full YAML file with all fields', async () => {
      const config = await loadConfig(resolve(FIXTURES, 'full.yaml'));
      expect(config.title).toBe('Introduction to Web Development');
      expect(config.slidev_theme).toBe('apple-basic');
      expect(config.visual_theme).toBe('dracula');
      expect(config.sections).toHaveLength(4);
      expect(config.sections[0]).toEqual({ name: 'Getting Started' });
      expect(config.sections[1]).toEqual({ name: 'HTML & CSS', type: 'two-cols' });
      expect(config.deploy).toEqual(['github-pages', 'vercel']);
    });

    it('should throw for non-existent file', async () => {
      await expect(loadConfig('/nonexistent.yaml')).rejects.toThrow();
    });

    it('should throw for invalid YAML', async () => {
      await expect(loadConfig(resolve(FIXTURES, 'invalid.yaml'))).rejects.toThrow();
    });

    it('should handle special characters in fields', async () => {
      const config = await loadConfig(resolve(FIXTURES, 'full.yaml'));
      expect(config.author).toBe('Jane Doe');
      expect(config.sections[3]).toEqual({ name: 'Best Practices', type: 'quote' });
    });
  });

  describe('mergeDefaults', () => {
    it('should fill missing fields with defaults', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      expect(config.slidev_theme).toBe('seriph');
      expect(config.visual_theme).toBe('cyberpunk');
      expect(config.transition).toBe('slide-left');
      expect(config.deploy).toEqual(['github-pages']);
      expect(config.sections).toEqual([
        { name: 'Introduction', type: 'default' },
        { name: 'Références', type: 'default' },
      ]);
    });

    it('should not override user-provided values', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        visual_theme: 'dracula',
        transition: 'fade',
        deploy: ['vercel'],
      });
      expect(config.visual_theme).toBe('dracula');
      expect(config.transition).toBe('fade');
      expect(config.deploy).toEqual(['vercel']);
    });

    it('should generate project_name from title if not provided', () => {
      const config = mergeDefaults({ title: 'Mon Super Talk !', author: 'Me' });
      expect(config.project_name).toBe('mon-super-talk');
    });

    it('should use provided project_name if given', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        project_name: 'custom-name',
      });
      expect(config.project_name).toBe('custom-name');
    });

    it('should set default export options', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      expect(config.export).toEqual({
        format: 'pdf',
        dark: false,
        with_clicks: false,
      });
    });

    it('should sanitize project_name with special characters', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        project_name: 'My Project!',
      });
      expect(config.project_name).toBe('my-project');
    });

    it('should sanitize project_name with path traversal', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        project_name: '../../evil',
      });
      expect(config.project_name).toBe('evil');
    });

    it('should sanitize project_name generated from title', () => {
      const config = mergeDefaults({
        title: 'Présentation été 2026!',
        author: 'Me',
      });
      expect(config.project_name).toBe('presentation-ete-2026');
    });

    it('should fallback visual_theme to default when unknown', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        visual_theme: 'nonexistent-theme',
      });
      expect(config.visual_theme).toBe('cyberpunk');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('nonexistent-theme'),
      );
      warnSpy.mockRestore();
    });

    it('should keep valid visual_theme unchanged', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        visual_theme: 'dracula',
      });
      expect(config.visual_theme).toBe('dracula');
    });

    it('should fallback transition to default when unknown', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        transition: 'nonexistent-transition',
      });
      expect(config.transition).toBe('slide-left');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('nonexistent-transition'),
      );
      warnSpy.mockRestore();
    });

    it('should keep valid transition unchanged', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        transition: 'fade',
      });
      expect(config.transition).toBe('fade');
    });

    it('should default deploy to github-pages only', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      expect(config.deploy).toEqual(['github-pages']);
    });

    it('should respect explicit deploy config', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        deploy: ['vercel', 'netlify'],
      });
      expect(config.deploy).toEqual(['vercel', 'netlify']);
    });
  });

  describe('mergeDefaults edge cases', () => {
    it('should handle title with quotes', () => {
      const config = mergeDefaults({ title: 'It\'s a "great" talk', author: 'Me' });
      expect(config.project_name).toBe('it-s-a-great-talk');
    });

    it('should handle title with backticks', () => {
      const config = mergeDefaults({ title: 'Using `code` in slides', author: 'Me' });
      expect(config.project_name).toBe('using-code-in-slides');
    });

    it('should handle title with only special characters', () => {
      expect(() => mergeDefaults({ title: '!!!???', author: 'Me' })).toThrow(
        /empty after sanitization/,
      );
    });

    it('should preserve user sections array (normalized)', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: ['A', 'B', 'C'],
      });
      expect(config.sections).toEqual([
        { name: 'A', type: 'default' },
        { name: 'B', type: 'default' },
        { name: 'C', type: 'default' },
      ]);
    });

    it('should allow custom visual_theme with colors', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        visual_theme: 'custom',
        colors: { primary: '#FF0000', secondary: '#0000FF' },
      });
      expect(config.visual_theme).toBe('custom');
      expect(config.colors).toBeDefined();
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should register custom theme so getTheme("custom") works', () => {
      mergeDefaults({
        title: 'Test',
        author: 'Me',
        visual_theme: 'custom',
        colors: { primary: '#AA00BB', secondary: '#00CCDD' },
      });
      const theme = getTheme('custom');
      expect(theme.name).toBe('Custom');
      expect(theme.h1Colors).toEqual(['#AA00BB', '#00CCDD']);
      expect(theme.linkColor).toBe('#AA00BB');
      expect(theme.accentColor).toBe('#00CCDD');
    });

    it('should throw when custom theme has no colors', () => {
      expect(() =>
        mergeDefaults({
          title: 'Test',
          author: 'Me',
          visual_theme: 'custom',
        }),
      ).toThrow(/colors/i);
    });

    it('should merge partial export options with defaults', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        export: { dark: true },
      });
      expect(config.export).toEqual({
        format: 'pdf',
        dark: true,
        with_clicks: false,
      });
    });

    it('should merge partial options with defaults', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        options: { snippets: false },
      });
      expect(config.options).toEqual({ snippets: false, components: true });
    });
  });

  describe('SECTION_TYPES', () => {
    it('should contain default, two-cols, image-right, quote', () => {
      expect(SECTION_TYPES).toContain('default');
      expect(SECTION_TYPES).toContain('two-cols');
      expect(SECTION_TYPES).toContain('image-right');
      expect(SECTION_TYPES).toContain('quote');
    });

    it('should contain special types qna, thanks, about', () => {
      expect(SECTION_TYPES).toContain('qna');
      expect(SECTION_TYPES).toContain('thanks');
      expect(SECTION_TYPES).toContain('about');
    });
  });

  describe('normalizeSections', () => {
    it('should convert string array to objects with type default', () => {
      const result = normalizeSections(['Intro', 'Demo']);
      expect(result).toEqual([
        { name: 'Intro', type: 'default' },
        { name: 'Demo', type: 'default' },
      ]);
    });

    it('should add default type to objects without type', () => {
      const result = normalizeSections([{ name: 'Intro' }, { name: 'Demo' }]);
      expect(result).toEqual([
        { name: 'Intro', type: 'default' },
        { name: 'Demo', type: 'default' },
      ]);
    });

    it('should preserve valid type on objects', () => {
      const result = normalizeSections([
        { name: 'Intro', type: 'default' },
        { name: 'Code', type: 'two-cols' },
        { name: 'Visual', type: 'image-right' },
        { name: 'Citation', type: 'quote' },
      ]);
      expect(result[1].type).toBe('two-cols');
      expect(result[2].type).toBe('image-right');
      expect(result[3].type).toBe('quote');
    });

    it('should fallback unknown type to default with warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = normalizeSections([{ name: 'Bad', type: 'nonexistent' }]);
      expect(result[0].type).toBe('default');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('nonexistent'));
      warnSpy.mockRestore();
    });

    it('should handle mixed strings and objects', () => {
      const result = normalizeSections([
        'Intro',
        { name: 'Code', type: 'two-cols' },
        'Références',
      ]);
      expect(result).toEqual([
        { name: 'Intro', type: 'default' },
        { name: 'Code', type: 'two-cols' },
        { name: 'Références', type: 'default' },
      ]);
    });
  });

  describe('mergeDefaults sections normalization', () => {
    it('should normalize default string sections to objects', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      expect(config.sections).toEqual([
        { name: 'Introduction', type: 'default' },
        { name: 'Références', type: 'default' },
      ]);
    });

    it('should normalize user string sections to objects', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: ['A', 'B', 'C'],
      });
      expect(config.sections).toEqual([
        { name: 'A', type: 'default' },
        { name: 'B', type: 'default' },
        { name: 'C', type: 'default' },
      ]);
    });

    it('should normalize user object sections', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [
          { name: 'Intro' },
          { name: 'Code', type: 'two-cols' },
        ],
      });
      expect(config.sections[0].type).toBe('default');
      expect(config.sections[1].type).toBe('two-cols');
    });
  });

  describe('validateConfig', () => {
    it('should pass for valid minimal config', () => {
      expect(() => validateConfig({ title: 'Test', author: 'Me' })).not.toThrow();
    });

    it('should throw when title is missing', () => {
      expect(() => validateConfig({ author: 'Me' })).toThrow(/title/i);
    });

    it('should throw when title is empty', () => {
      expect(() => validateConfig({ title: '', author: 'Me' })).toThrow(/title/i);
    });

    it('should throw when author is missing', () => {
      expect(() => validateConfig({ title: 'Test' })).toThrow(/author/i);
    });

    it('should pass for full config', () => {
      expect(() =>
        validateConfig({
          title: 'Test',
          author: 'Me',
          visual_theme: 'dracula',
          sections: ['Intro'],
          deploy: ['vercel'],
        }),
      ).not.toThrow();
    });

    it('should throw when title is only whitespace', () => {
      expect(() => validateConfig({ title: '   ', author: 'Me' })).toThrow(/title/i);
    });

    it('should throw when author is empty', () => {
      expect(() => validateConfig({ title: 'Test', author: '' })).toThrow(/author/i);
    });

    it('should throw when author is only whitespace', () => {
      expect(() => validateConfig({ title: 'Test', author: '   ' })).toThrow(/author/i);
    });
  });
});
