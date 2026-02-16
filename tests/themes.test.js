import { describe, it, expect } from 'vitest';
import { THEMES, DEFAULT_THEME, getTheme } from '../src/themes.js';

describe('themes', () => {
  describe('THEMES', () => {
    const expectedThemes = [
      'cyberpunk',
      'matrix',
      'dracula',
      'catppuccin',
      'nord',
      'gruvbox',
      'tokyo-night',
    ];

    it('should define all 7 visual themes', () => {
      expect(Object.keys(THEMES)).toHaveLength(7);
      for (const name of expectedThemes) {
        expect(THEMES[name]).toBeDefined();
      }
    });

    it.each(expectedThemes)('theme "%s" should have required properties', (name) => {
      const theme = THEMES[name];
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('description');
      expect(theme).toHaveProperty('h1Colors');
      expect(theme).toHaveProperty('titleStyle');
      expect(typeof theme.name).toBe('string');
      expect(typeof theme.description).toBe('string');
      expect(theme.h1Colors).toHaveLength(2);
      expect(typeof theme.titleStyle).toBe('object');
    });

    it.each(expectedThemes)('theme "%s" h1Colors should be valid hex colors', (name) => {
      const hexPattern = /^#[0-9a-fA-F]{6}$/;
      for (const color of THEMES[name].h1Colors) {
        expect(color).toMatch(hexPattern);
      }
    });

    it.each(expectedThemes)('theme "%s" titleStyle should have h1Color and textColor', (name) => {
      const style = THEMES[name].titleStyle;
      expect(style).toHaveProperty('h1Color');
      expect(style).toHaveProperty('textColor');
    });
  });

  describe('DEFAULT_THEME', () => {
    it('should be "cyberpunk"', () => {
      expect(DEFAULT_THEME).toBe('cyberpunk');
    });

    it('should exist in THEMES', () => {
      expect(THEMES[DEFAULT_THEME]).toBeDefined();
    });
  });

  describe('getTheme', () => {
    it('should return the requested theme', () => {
      const theme = getTheme('dracula');
      expect(theme.name).toBe('Dracula');
    });

    it('should return default theme for unknown name', () => {
      const theme = getTheme('nonexistent');
      expect(theme).toEqual(THEMES[DEFAULT_THEME]);
    });

    it('should return default theme for undefined', () => {
      const theme = getTheme(undefined);
      expect(theme).toEqual(THEMES[DEFAULT_THEME]);
    });

    it('should return default theme for null', () => {
      const theme = getTheme(null);
      expect(theme).toEqual(THEMES[DEFAULT_THEME]);
    });

    it('should return default theme for empty string', () => {
      const theme = getTheme('');
      expect(theme).toEqual(THEMES[DEFAULT_THEME]);
    });
  });
});
