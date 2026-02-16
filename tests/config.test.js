import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { loadConfig, mergeDefaults, validateConfig } from '../src/config.js';

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
      expect(config.title).toBe('Booster son environnement Linux');
      expect(config.slidev_theme).toBe('apple-basic');
      expect(config.visual_theme).toBe('dracula');
      expect(config.sections).toHaveLength(4);
      expect(config.deploy).toEqual(['github-pages', 'vercel']);
    });

    it('should throw for non-existent file', async () => {
      await expect(loadConfig('/nonexistent.yaml')).rejects.toThrow();
    });

    it('should throw for invalid YAML', async () => {
      await expect(loadConfig(resolve(FIXTURES, 'invalid.yaml'))).rejects.toThrow();
    });

    it('should handle accents and special characters', async () => {
      const config = await loadConfig(resolve(FIXTURES, 'full.yaml'));
      expect(config.author).toBe('Christopher Louët');
      expect(config.sections).toContain('Références');
    });
  });

  describe('mergeDefaults', () => {
    it('should fill missing fields with defaults', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      expect(config.slidev_theme).toBe('seriph');
      expect(config.visual_theme).toBe('cyberpunk');
      expect(config.transition).toBe('slide-left');
      expect(config.deploy).toEqual(['github-pages', 'vercel', 'netlify']);
      expect(config.sections).toEqual(['Introduction', 'Références']);
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
  });
});
