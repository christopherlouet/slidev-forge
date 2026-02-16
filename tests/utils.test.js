import { describe, it, expect } from 'vitest';
import { slugify, sanitizeProjectName, validateHexColor } from '../src/utils.js';

describe('utils', () => {
  describe('slugify', () => {
    it('should convert spaces to hyphens', () => {
      expect(slugify('Mon Super Talk')).toBe('mon-super-talk');
    });

    it('should remove accents', () => {
      expect(slugify('Café Résumé')).toBe('cafe-resume');
    });

    it('should handle mixed accents and spaces', () => {
      expect(slugify('Booster son environnement Linux')).toBe(
        'booster-son-environnement-linux',
      );
    });

    it('should remove special characters', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
    });

    it('should collapse multiple hyphens', () => {
      expect(slugify('foo---bar')).toBe('foo-bar');
    });

    it('should trim leading and trailing hyphens', () => {
      expect(slugify('--hello--')).toBe('hello');
    });

    it('should return empty string for empty input', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle strings with only special characters', () => {
      expect(slugify('!!!@@@###')).toBe('');
    });

    it('should preserve numbers', () => {
      expect(slugify('Version 2.0')).toBe('version-2-0');
    });

    it('should handle apostrophes', () => {
      expect(slugify("Tech'Dej Oxxeo")).toBe('tech-dej-oxxeo');
    });
  });

  describe('sanitizeProjectName', () => {
    it('should slugify a normal project name', () => {
      expect(sanitizeProjectName('my-project')).toBe('my-project');
    });

    it('should clean spaces and special chars', () => {
      expect(sanitizeProjectName('My Project!')).toBe('my-project');
    });

    it('should remove path traversal sequences', () => {
      expect(sanitizeProjectName('../../evil')).toBe('evil');
    });

    it('should remove dot-slash sequences', () => {
      expect(sanitizeProjectName('./my-project')).toBe('my-project');
    });

    it('should handle multiple path traversals', () => {
      expect(sanitizeProjectName('../../../etc/passwd')).toBe('etc-passwd');
    });

    it('should remove leading dots', () => {
      expect(sanitizeProjectName('..hidden')).toBe('hidden');
    });

    it('should handle accented project names', () => {
      expect(sanitizeProjectName('Présentation été')).toBe('presentation-ete');
    });

    it('should throw for empty result after sanitization', () => {
      expect(() => sanitizeProjectName('')).toThrow(
        'Project name cannot be empty',
      );
    });

    it('should throw when only dots and slashes', () => {
      expect(() => sanitizeProjectName('../../..')).toThrow(
        'Project name cannot be empty',
      );
    });
  });

  describe('validateHexColor', () => {
    it('should accept valid 6-digit hex colors', () => {
      expect(validateHexColor('#FF00FF')).toBe(true);
      expect(validateHexColor('#000000')).toBe(true);
      expect(validateHexColor('#FFFFFF')).toBe(true);
      expect(validateHexColor('#0969DA')).toBe(true);
    });

    it('should accept lowercase hex colors', () => {
      expect(validateHexColor('#ff00ff')).toBe(true);
      expect(validateHexColor('#abcdef')).toBe(true);
    });

    it('should accept mixed case hex colors', () => {
      expect(validateHexColor('#aaBBcc')).toBe(true);
    });

    it('should reject hex without hash prefix', () => {
      expect(validateHexColor('FF00FF')).toBe(false);
    });

    it('should reject invalid hex characters', () => {
      expect(validateHexColor('#GGGGGG')).toBe(false);
      expect(validateHexColor('#ZZZZZZ')).toBe(false);
    });

    it('should reject wrong length', () => {
      expect(validateHexColor('#FFF')).toBe(false);
      expect(validateHexColor('#12345')).toBe(false);
      expect(validateHexColor('#1234567')).toBe(false);
    });

    it('should reject non-hex formats', () => {
      expect(validateHexColor('rgb(255,0,0)')).toBe(false);
      expect(validateHexColor('red')).toBe(false);
    });

    it('should reject empty and null values', () => {
      expect(validateHexColor('')).toBe(false);
      expect(validateHexColor(null)).toBe(false);
      expect(validateHexColor(undefined)).toBe(false);
    });
  });
});
