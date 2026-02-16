import { describe, it, expect, beforeEach } from 'vitest';
import { registerPlugin, getPluginGenerator, clearPlugins, getRegisteredPlugins } from '../src/plugins.js';
import { generateSlides } from '../src/templates/slides.js';
import { mergeDefaults } from '../src/config.js';

describe('plugins', () => {
  beforeEach(() => {
    clearPlugins();
  });

  describe('registerPlugin', () => {
    it('should register a valid plugin', () => {
      registerPlugin({
        type: 'custom-test',
        generate: (section, config) => `# ${section.name}`,
      });
      expect(getRegisteredPlugins()).toContain('custom-test');
    });

    it('should throw if plugin has no type', () => {
      expect(() => registerPlugin({ type: '', generate: () => '' })).toThrow('valid "type"');
    });

    it('should throw if plugin has no generate function', () => {
      expect(() => registerPlugin({ type: 'bad', generate: null })).toThrow('"generate" function');
    });

    it('should overwrite existing plugin of same type', () => {
      registerPlugin({ type: 'x', generate: () => 'first' });
      registerPlugin({ type: 'x', generate: () => 'second' });
      const gen = getPluginGenerator('x');
      expect(gen({name: 'Test', type: 'x'}, {})).toBe('second');
    });
  });

  describe('getPluginGenerator', () => {
    it('should return undefined for unregistered type', () => {
      expect(getPluginGenerator('nonexistent')).toBeUndefined();
    });

    it('should return the generate function for registered type', () => {
      const generate = (section, config) => `custom: ${section.name}`;
      registerPlugin({ type: 'my-type', generate });
      expect(getPluginGenerator('my-type')).toBe(generate);
    });
  });

  describe('clearPlugins', () => {
    it('should remove all registered plugins', () => {
      registerPlugin({ type: 'a', generate: () => '' });
      registerPlugin({ type: 'b', generate: () => '' });
      expect(getRegisteredPlugins()).toHaveLength(2);
      clearPlugins();
      expect(getRegisteredPlugins()).toHaveLength(0);
    });
  });

  describe('getRegisteredPlugins', () => {
    it('should return empty array when no plugins', () => {
      expect(getRegisteredPlugins()).toEqual([]);
    });

    it('should return list of registered type names', () => {
      registerPlugin({ type: 'alpha', generate: () => '' });
      registerPlugin({ type: 'beta', generate: () => '' });
      const types = getRegisteredPlugins();
      expect(types).toContain('alpha');
      expect(types).toContain('beta');
    });
  });

  describe('integration with slides generation', () => {
    it('should use plugin generator for custom section type', () => {
      registerPlugin({
        type: 'custom-widget',
        generate: (section, config) => {
          return `transition: ${config.transition}\n---\n\n# ${section.name}\n\nCustom widget content\n`;
        },
      });

      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'My Widget', type: 'custom-widget' }],
      });

      const slides = generateSlides(config);
      expect(slides).toContain('# My Widget');
      expect(slides).toContain('Custom widget content');
    });

    it('should fall back to default for non-plugin types', () => {
      registerPlugin({
        type: 'only-this-type',
        generate: () => 'plugin output',
      });

      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Normal', type: 'default' }],
      });

      const slides = generateSlides(config);
      expect(slides).toContain('# Normal');
      expect(slides).not.toContain('plugin output');
    });

    it('should use plugin over built-in for same type name', () => {
      registerPlugin({
        type: 'code',
        generate: (section, config) => `PLUGIN CODE: ${section.name}`,
      });

      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Code Slide', type: 'code' }],
      });

      const slides = generateSlides(config);
      expect(slides).toContain('PLUGIN CODE: Code Slide');
    });
  });
});
