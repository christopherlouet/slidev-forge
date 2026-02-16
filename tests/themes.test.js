import { describe, it, expect } from 'vitest';
import {
  THEMES,
  DEFAULT_THEME,
  TRANSITIONS,
  DEFAULT_TRANSITION,
  getTheme,
  buildCustomTheme,
} from '../src/themes.js';

const hexPattern = /^#[0-9a-fA-F]{6}$/;

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
      'github-light',
      'rose-pine',
      'one-dark-pro',
    ];

    it('should define all 10 visual themes', () => {
      expect(Object.keys(THEMES)).toHaveLength(10);
      for (const name of expectedThemes) {
        expect(THEMES[name]).toBeDefined();
      }
    });

    it.each(expectedThemes)('theme "%s" should have base properties', (name) => {
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

    it.each(expectedThemes)('theme "%s" should have enriched color properties', (name) => {
      const theme = THEMES[name];
      expect(theme).toHaveProperty('accentColor');
      expect(theme).toHaveProperty('linkColor');
      expect(theme).toHaveProperty('codeBlockBg');
      expect(theme).toHaveProperty('backgroundColor');
      expect(theme).toHaveProperty('textColor');
    });

    it.each(expectedThemes)('theme "%s" h1Colors should be valid hex colors', (name) => {
      for (const color of THEMES[name].h1Colors) {
        expect(color).toMatch(hexPattern);
      }
    });

    it.each(expectedThemes)('theme "%s" all color fields should be valid hex', (name) => {
      const theme = THEMES[name];
      expect(theme.accentColor).toMatch(hexPattern);
      expect(theme.linkColor).toMatch(hexPattern);
      expect(theme.codeBlockBg).toMatch(hexPattern);
      expect(theme.backgroundColor).toMatch(hexPattern);
      expect(theme.textColor).toMatch(hexPattern);
      expect(theme.titleStyle.h1Color).toMatch(hexPattern);
      expect(theme.titleStyle.textColor).toMatch(hexPattern);
    });

    it.each(expectedThemes)('theme "%s" titleStyle should have h1Color and textColor', (name) => {
      const style = THEMES[name].titleStyle;
      expect(style).toHaveProperty('h1Color');
      expect(style).toHaveProperty('textColor');
    });
  });

  describe('matrix theme improvement', () => {
    it('should have an enriched palette beyond just green', () => {
      const matrix = THEMES.matrix;
      const allColors = [
        ...matrix.h1Colors,
        matrix.accentColor,
        matrix.linkColor,
        matrix.textColor,
      ];
      const uniqueHues = new Set(allColors);
      expect(uniqueHues.size).toBeGreaterThanOrEqual(3);
    });

    it('should have a dark terminal-style code block background', () => {
      const matrix = THEMES.matrix;
      // codeBlockBg should be very dark (first 2 hex chars after # should be low)
      const r = parseInt(matrix.codeBlockBg.slice(1, 3), 16);
      const g = parseInt(matrix.codeBlockBg.slice(3, 5), 16);
      const b = parseInt(matrix.codeBlockBg.slice(5, 7), 16);
      expect(r + g + b).toBeLessThan(100);
    });
  });

  describe('github-light theme', () => {
    it('should have a light background', () => {
      const theme = THEMES['github-light'];
      const r = parseInt(theme.backgroundColor.slice(1, 3), 16);
      const g = parseInt(theme.backgroundColor.slice(3, 5), 16);
      const b = parseInt(theme.backgroundColor.slice(5, 7), 16);
      expect(r + g + b).toBeGreaterThan(600);
    });

    it('should have dark text for readability', () => {
      const theme = THEMES['github-light'];
      const r = parseInt(theme.textColor.slice(1, 3), 16);
      const g = parseInt(theme.textColor.slice(3, 5), 16);
      const b = parseInt(theme.textColor.slice(5, 7), 16);
      expect(r + g + b).toBeLessThan(200);
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

  describe('TRANSITIONS', () => {
    it('should contain expected transitions', () => {
      expect(TRANSITIONS).toContain('slide-left');
      expect(TRANSITIONS).toContain('fade');
      expect(TRANSITIONS).toContain('none');
    });
  });

  describe('DEFAULT_TRANSITION', () => {
    it('should be "slide-left"', () => {
      expect(DEFAULT_TRANSITION).toBe('slide-left');
    });

    it('should exist in TRANSITIONS', () => {
      expect(TRANSITIONS).toContain(DEFAULT_TRANSITION);
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

  describe('buildCustomTheme', () => {
    it('should build a theme from primary and secondary colors', () => {
      const theme = buildCustomTheme({ primary: '#FF0000', secondary: '#0000FF' });
      expect(theme.name).toBe('Custom');
      expect(theme.h1Colors).toEqual(['#FF0000', '#0000FF']);
      expect(theme.linkColor).toBe('#FF0000');
      expect(theme.accentColor).toBe('#0000FF');
    });

    it('should have all required theme properties', () => {
      const theme = buildCustomTheme({ primary: '#AA00BB', secondary: '#00CCDD' });
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('description');
      expect(theme).toHaveProperty('h1Colors');
      expect(theme).toHaveProperty('titleStyle');
      expect(theme).toHaveProperty('accentColor');
      expect(theme).toHaveProperty('linkColor');
      expect(theme).toHaveProperty('codeBlockBg');
      expect(theme).toHaveProperty('backgroundColor');
      expect(theme).toHaveProperty('textColor');
    });

    it('should throw when colors is missing', () => {
      expect(() => buildCustomTheme(undefined)).toThrow(/colors/i);
    });

    it('should throw when primary is missing', () => {
      expect(() => buildCustomTheme({ secondary: '#0000FF' })).toThrow(/primary/i);
    });

    it('should throw when secondary is missing', () => {
      expect(() => buildCustomTheme({ primary: '#FF0000' })).toThrow(/secondary/i);
    });

    it('should throw when primary is not a valid hex color', () => {
      expect(() => buildCustomTheme({ primary: 'red', secondary: '#0000FF' })).toThrow(/primary.*valid hex/i);
    });

    it('should throw when secondary is not a valid hex color', () => {
      expect(() => buildCustomTheme({ primary: '#FF0000', secondary: 'blue' })).toThrow(/secondary.*valid hex/i);
    });

    it('should throw for 3-digit hex shorthand', () => {
      expect(() => buildCustomTheme({ primary: '#F00', secondary: '#00F' })).toThrow(/valid hex/i);
    });

    it('should accept valid lowercase hex colors', () => {
      const theme = buildCustomTheme({ primary: '#ff0000', secondary: '#0000ff' });
      expect(theme.h1Colors).toEqual(['#ff0000', '#0000ff']);
    });
  });
});
