import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { slugify, sanitizeProjectName, validateHexColor, expandHome, generateSectionIds, validateUrl, validateGitHubUsername, escapeHtmlAttribute } from '../src/utils.js';

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
      expect(slugify("Tech'Dej Event")).toBe('tech-dej-event');
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

  describe('expandHome', () => {
    const home = homedir();

    it('should expand bare ~ to home directory', () => {
      expect(expandHome('~')).toBe(home);
    });

    it('should expand ~/path to home + path', () => {
      expect(expandHome('~/presentations/my-talk')).toBe(
        resolve(home, 'presentations/my-talk'),
      );
    });

    it('should expand ~/single to home + single', () => {
      expect(expandHome('~/my-talk')).toBe(resolve(home, 'my-talk'));
    });

    it('should return absolute paths unchanged', () => {
      expect(expandHome('/tmp/my-project')).toBe('/tmp/my-project');
    });

    it('should return relative paths unchanged', () => {
      expect(expandHome('my-project')).toBe('my-project');
    });

    it('should return dot-relative paths unchanged', () => {
      expect(expandHome('./my-project')).toBe('./my-project');
    });

    it('should return parent-relative paths unchanged', () => {
      expect(expandHome('../other/project')).toBe('../other/project');
    });

    it('should not expand ~ in the middle of a path', () => {
      expect(expandHome('/some/~/path')).toBe('/some/~/path');
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

  describe('validateUrl', () => {
    it('should accept https URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
    });

    it('should accept http URLs', () => {
      expect(validateUrl('http://example.com')).toBe(true);
    });

    it('should reject javascript: protocol', () => {
      expect(validateUrl('javascript:alert(1)')).toBe(false);
    });

    it('should reject data: protocol', () => {
      expect(validateUrl('data:text/html,<h1>hi</h1>')).toBe(false);
    });

    it('should reject vbscript: protocol', () => {
      expect(validateUrl('vbscript:MsgBox("hi")')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateUrl('')).toBe(false);
    });

    it('should reject non-URL strings', () => {
      expect(validateUrl('not a url')).toBe(false);
    });

    it('should accept URLs with paths and params', () => {
      expect(validateUrl('https://example.com/path?q=1&b=2#hash')).toBe(true);
    });
  });

  describe('validateGitHubUsername', () => {
    it('should accept valid usernames', () => {
      expect(validateGitHubUsername('octocat')).toBe(true);
      expect(validateGitHubUsername('user-name')).toBe(true);
      expect(validateGitHubUsername('a')).toBe(true);
    });

    it('should reject usernames with special characters', () => {
      expect(validateGitHubUsername('user<script>')).toBe(false);
      expect(validateGitHubUsername('user"name')).toBe(false);
      expect(validateGitHubUsername('user/name')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateGitHubUsername('')).toBe(false);
    });

    it('should reject usernames starting with hyphen', () => {
      expect(validateGitHubUsername('-username')).toBe(false);
    });

    it('should reject usernames ending with hyphen', () => {
      expect(validateGitHubUsername('username-')).toBe(false);
    });

    it('should accept usernames with numbers', () => {
      expect(validateGitHubUsername('user123')).toBe(true);
      expect(validateGitHubUsername('123user')).toBe(true);
    });
  });

  describe('escapeHtmlAttribute', () => {
    it('should escape double quotes', () => {
      expect(escapeHtmlAttribute('"hello"')).toBe('&quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeHtmlAttribute("it's")).toBe('it&#039;s');
    });

    it('should escape angle brackets', () => {
      expect(escapeHtmlAttribute('<script>')).toBe('&lt;script&gt;');
    });

    it('should escape ampersand', () => {
      expect(escapeHtmlAttribute('a&b')).toBe('a&amp;b');
    });

    it('should handle combined injection payload', () => {
      expect(escapeHtmlAttribute('" onload="alert(1)')).toBe('&quot; onload=&quot;alert(1)');
    });

    it('should return safe strings unchanged', () => {
      expect(escapeHtmlAttribute('normaluser')).toBe('normaluser');
    });

    it('should handle empty string', () => {
      expect(escapeHtmlAttribute('')).toBe('');
    });
  });

  describe('generateSectionIds', () => {
    it('should generate slugified ids from section names', () => {
      const sections = [
        { name: 'Introduction', type: 'default' },
        { name: 'Demo', type: 'code' },
      ];
      const ids = generateSectionIds(sections);
      expect(ids.get(sections[0])).toBe('introduction');
      expect(ids.get(sections[1])).toBe('demo');
    });

    it('should deduplicate identical names with numeric suffix', () => {
      const sections = [
        { name: 'Topic', type: 'default' },
        { name: 'Topic', type: 'default' },
        { name: 'Topic', type: 'default' },
      ];
      const ids = generateSectionIds(sections);
      expect(ids.get(sections[0])).toBe('topic');
      expect(ids.get(sections[1])).toBe('topic-2');
      expect(ids.get(sections[2])).toBe('topic-3');
    });

    it('should handle accented names', () => {
      const sections = [{ name: 'Références', type: 'default' }];
      const ids = generateSectionIds(sections);
      expect(ids.get(sections[0])).toBe('references');
    });

    it('should handle special characters in names', () => {
      const sections = [{ name: 'Q&A Session!', type: 'qna' }];
      const ids = generateSectionIds(sections);
      expect(ids.get(sections[0])).toBe('q-a-session');
    });

    it('should return a map with all sections', () => {
      const sections = [
        { name: 'A', type: 'default' },
        { name: 'B', type: 'default' },
        { name: 'C', type: 'default' },
      ];
      const ids = generateSectionIds(sections);
      expect(ids.size).toBe(3);
    });
  });
});
