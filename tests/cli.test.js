import { describe, it, expect } from 'vitest';
import { parseArgs, buildConfigFromArgs } from '../src/cli.js';

describe('cli', () => {
  describe('parseArgs', () => {
    it('should detect YAML mode when a .yaml file is provided', () => {
      const result = parseArgs(['presentation.yaml']);
      expect(result.mode).toBe('yaml');
      expect(result.yamlPath).toBe('presentation.yaml');
    });

    it('should detect YAML mode for .yml extension', () => {
      const result = parseArgs(['config.yml']);
      expect(result.mode).toBe('yaml');
      expect(result.yamlPath).toBe('config.yml');
    });

    it('should detect interactive mode when no arguments', () => {
      const result = parseArgs([]);
      expect(result.mode).toBe('interactive');
    });

    it('should accept an optional destination directory', () => {
      const result = parseArgs(['config.yaml', './my-project']);
      expect(result.yamlPath).toBe('config.yaml');
      expect(result.destDir).toBe('./my-project');
    });

    it('should detect help flag', () => {
      const result = parseArgs(['--help']);
      expect(result.mode).toBe('help');
    });
  });

  describe('buildConfigFromArgs', () => {
    it('should build a config object from interactive answers', () => {
      const answers = {
        title: 'Mon Talk',
        author: 'Chris',
        visual_theme: 'dracula',
        project_name: 'mon-talk',
        sections: 'Intro, Contenu, Références',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.title).toBe('Mon Talk');
      expect(config.author).toBe('Chris');
      expect(config.visual_theme).toBe('dracula');
      expect(config.sections).toEqual(['Intro', 'Contenu', 'Références']);
    });

    it('should parse comma-separated sections', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        project_name: 'test',
        sections: 'A, B,C ,  D  ',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.sections).toEqual(['A', 'B', 'C', 'D']);
    });

    it('should use default sections when empty', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        project_name: 'test',
        sections: '',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.sections).toEqual(['Introduction', 'Références']);
    });
  });
});
