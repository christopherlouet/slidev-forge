import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mergeGlobalConfig } from '../src/global-config.js';

describe('global-config', () => {
  describe('mergeGlobalConfig', () => {
    it('should return user config when no global config', () => {
      const result = mergeGlobalConfig({}, { title: 'Test', author: 'Me' });
      expect(result.title).toBe('Test');
      expect(result.author).toBe('Me');
    });

    it('should apply global defaults for missing user fields', () => {
      const global = { visual_theme: 'dracula', language: 'en' };
      const user = { title: 'Test', author: 'Me' };
      const result = mergeGlobalConfig(global, user);
      expect(result.title).toBe('Test');
      expect(result.visual_theme).toBe('dracula');
      expect(result.language).toBe('en');
    });

    it('should let user config override global config', () => {
      const global = { visual_theme: 'dracula', language: 'en' };
      const user = { title: 'Test', author: 'Me', visual_theme: 'nord' };
      const result = mergeGlobalConfig(global, user);
      expect(result.visual_theme).toBe('nord');
    });

    it('should preserve all user config fields', () => {
      const global = { visual_theme: 'dracula' };
      const user = {
        title: 'Test',
        author: 'Me',
        subtitle: 'Sub',
        github: 'user',
      };
      const result = mergeGlobalConfig(global, user);
      expect(result.title).toBe('Test');
      expect(result.subtitle).toBe('Sub');
      expect(result.github).toBe('user');
      expect(result.visual_theme).toBe('dracula');
    });

    it('should handle empty global config', () => {
      const user = { title: 'Test', author: 'Me' };
      const result = mergeGlobalConfig({}, user);
      expect(result).toEqual(user);
    });
  });
});
