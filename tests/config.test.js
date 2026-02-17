import { describe, it, expect, vi } from 'vitest';
import { resolve } from 'node:path';
import { loadConfig, mergeDefaults, validateConfig, normalizeSections, SECTION_TYPES, PRESETS } from '../src/config.js';
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

    it('should contain v1.4 types code, diagram, cover, iframe, steps, fact', () => {
      expect(SECTION_TYPES).toContain('code');
      expect(SECTION_TYPES).toContain('diagram');
      expect(SECTION_TYPES).toContain('cover');
      expect(SECTION_TYPES).toContain('iframe');
      expect(SECTION_TYPES).toContain('steps');
      expect(SECTION_TYPES).toContain('fact');
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

    it('should preserve lang attribute on code sections', () => {
      const result = normalizeSections([{ name: 'API', type: 'code', lang: 'typescript' }]);
      expect(result[0]).toEqual({ name: 'API', type: 'code', lang: 'typescript' });
    });

    it('should preserve url attribute on iframe sections', () => {
      const result = normalizeSections([{ name: 'Demo', type: 'iframe', url: 'https://example.com' }]);
      expect(result[0]).toEqual({ name: 'Demo', type: 'iframe', url: 'https://example.com' });
    });

    it('should preserve image attribute on cover sections', () => {
      const result = normalizeSections([{ name: 'Chapter', type: 'cover', image: 'https://example.com/bg.jpg' }]);
      expect(result[0]).toEqual({ name: 'Chapter', type: 'cover', image: 'https://example.com/bg.jpg' });
    });

    it('should preserve diagram attribute on diagram sections', () => {
      const result = normalizeSections([{ name: 'Arch', type: 'diagram', diagram: 'sequenceDiagram' }]);
      expect(result[0]).toEqual({ name: 'Arch', type: 'diagram', diagram: 'sequenceDiagram' });
    });

    it('should preserve items attribute on steps sections', () => {
      const result = normalizeSections([{ name: 'Steps', type: 'steps', items: ['A', 'B', 'C'] }]);
      expect(result[0]).toEqual({ name: 'Steps', type: 'steps', items: ['A', 'B', 'C'] });
    });

    it('should preserve value and description on fact sections', () => {
      const result = normalizeSections([{ name: 'Stats', type: 'fact', value: '10x', description: 'faster' }]);
      expect(result[0]).toEqual({ name: 'Stats', type: 'fact', value: '10x', description: 'faster' });
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

  describe('mergeDefaults v1.3 fields', () => {
    it('should default language to fr', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      expect(config.language).toBe('fr');
    });

    it('should keep valid language unchanged', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', language: 'en' });
      expect(config.language).toBe('en');
    });

    it('should fallback invalid language to fr with warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({ title: 'Test', author: 'Me', language: 'ja' });
      expect(config.language).toBe('fr');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('ja'));
      warnSpy.mockRestore();
    });

    it('should pass through valid aspect_ratio', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', aspect_ratio: '4/3' });
      expect(config.aspect_ratio).toBe('4/3');
    });

    it('should accept 16/9 aspect_ratio', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', aspect_ratio: '16/9' });
      expect(config.aspect_ratio).toBe('16/9');
    });

    it('should delete invalid aspect_ratio with warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({ title: 'Test', author: 'Me', aspect_ratio: 'abc' });
      expect(config.aspect_ratio).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('abc'));
      warnSpy.mockRestore();
    });

    it('should delete numeric aspect_ratio with warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({ title: 'Test', author: 'Me', aspect_ratio: 1.77 });
      expect(config.aspect_ratio).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('1.77'));
      warnSpy.mockRestore();
    });

    it('should pass through valid color_schema light', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', color_schema: 'light' });
      expect(config.color_schema).toBe('light');
    });

    it('should pass through valid color_schema dark', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', color_schema: 'dark' });
      expect(config.color_schema).toBe('dark');
    });

    it('should pass through valid color_schema auto', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', color_schema: 'auto' });
      expect(config.color_schema).toBe('auto');
    });

    it('should delete invalid color_schema with warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({ title: 'Test', author: 'Me', color_schema: 'blue' });
      expect(config.color_schema).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('blue'));
      warnSpy.mockRestore();
    });

    it('should pass through valid addons array', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        addons: ['slidev-addon-qrcode'],
      });
      expect(config.addons).toEqual(['slidev-addon-qrcode']);
    });

    it('should delete non-array addons with warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({ title: 'Test', author: 'Me', addons: 'qrcode' });
      expect(config.addons).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('addons'));
      warnSpy.mockRestore();
    });

    it('should pass through fonts object', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        fonts: { sans: 'Inter', mono: 'Fira Code' },
      });
      expect(config.fonts).toEqual({ sans: 'Inter', mono: 'Fira Code' });
    });

    it('should pass through line_numbers boolean', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', line_numbers: true });
      expect(config.line_numbers).toBe(true);
    });

    it('should pass through favicon string', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', favicon: 'logo.png' });
      expect(config.favicon).toBe('logo.png');
    });

    it('should pass through download boolean', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', download: true });
      expect(config.download).toBe(true);
    });

    it('should not include optional fields when not specified', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      expect(config.fonts).toBeUndefined();
      expect(config.line_numbers).toBeUndefined();
      expect(config.aspect_ratio).toBeUndefined();
      expect(config.color_schema).toBeUndefined();
      expect(config.addons).toBeUndefined();
      expect(config.favicon).toBeUndefined();
      expect(config.download).toBeUndefined();
    });
  });

  describe('PRESETS', () => {
    it('should export 4 presets', () => {
      expect(Object.keys(PRESETS)).toEqual(['conference', 'workshop', 'lightning', 'pitch']);
    });

    it('should return arrays of section objects with name and type', () => {
      for (const [key, presetFn] of Object.entries(PRESETS)) {
        const sections = presetFn('fr');
        expect(Array.isArray(sections)).toBe(true);
        expect(sections.length).toBeGreaterThan(0);
        for (const section of sections) {
          expect(section).toHaveProperty('name');
          expect(section).toHaveProperty('type');
        }
      }
    });

    it('conference should have 7 sections', () => {
      const sections = PRESETS.conference('fr');
      expect(sections).toHaveLength(7);
    });

    it('workshop should have 7 sections', () => {
      const sections = PRESETS.workshop('fr');
      expect(sections).toHaveLength(7);
    });

    it('lightning should have 4 sections', () => {
      const sections = PRESETS.lightning('fr');
      expect(sections).toHaveLength(4);
    });

    it('pitch should have 7 sections', () => {
      const sections = PRESETS.pitch('fr');
      expect(sections).toHaveLength(7);
    });

    it('conference should use code and qna types', () => {
      const sections = PRESETS.conference('fr');
      const types = sections.map((s) => s.type);
      expect(types).toContain('code');
      expect(types).toContain('qna');
      expect(types).toContain('thanks');
    });

    it('workshop should use steps and code types', () => {
      const sections = PRESETS.workshop('fr');
      const types = sections.map((s) => s.type);
      expect(types).toContain('steps');
      expect(types).toContain('code');
    });

    it('lightning should use code and fact types', () => {
      const sections = PRESETS.lightning('fr');
      const types = sections.map((s) => s.type);
      expect(types).toContain('code');
      expect(types).toContain('fact');
    });

    it('pitch should use fact and about types', () => {
      const sections = PRESETS.pitch('fr');
      const types = sections.map((s) => s.type);
      expect(types).toContain('fact');
      expect(types).toContain('about');
    });

    it('should use translated section names for en', () => {
      const frSections = PRESETS.conference('fr');
      const enSections = PRESETS.conference('en');
      // "À propos" vs "About"
      expect(frSections[1].name).not.toBe(enSections[1].name);
    });
  });

  describe('mergeDefaults preset resolution', () => {
    it('should use preset sections when no sections provided', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', preset: 'conference' });
      expect(config.sections.length).toBe(7);
    });

    it('should prefer explicit sections over preset', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        preset: 'conference',
        sections: ['A', 'B'],
      });
      expect(config.sections).toEqual([
        { name: 'A', type: 'default' },
        { name: 'B', type: 'default' },
      ]);
    });

    it('should warn and ignore unknown preset', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const config = mergeDefaults({ title: 'Test', author: 'Me', preset: 'unknown' });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unknown'));
      // Falls back to default sections
      expect(config.sections).toEqual([
        { name: 'Introduction', type: 'default' },
        { name: 'Références', type: 'default' },
      ]);
      warnSpy.mockRestore();
    });

    it('should use language for preset section names', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', preset: 'conference', language: 'en' });
      const names = config.sections.map((s) => s.name);
      // English names should differ from French
      const frConfig = mergeDefaults({ title: 'Test', author: 'Me', preset: 'conference', language: 'fr' });
      const frNames = frConfig.sections.map((s) => s.name);
      expect(names).not.toEqual(frNames);
    });
  });
});
