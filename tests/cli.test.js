import { describe, it, expect, vi } from 'vitest';
import { parseArgs, buildConfigFromArgs, showHelp, ALLOWED_PM } from '../src/cli.js';

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

    it('should include subtitle when provided', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        project_name: 'test',
        sections: '',
        subtitle: 'A great talk',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.subtitle).toBe('A great talk');
    });

    it('should include event_name when provided', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        project_name: 'test',
        sections: '',
        event_name: 'DevFest 2026',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.event_name).toBe('DevFest 2026');
    });

    it('should include github when provided', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        project_name: 'test',
        sections: '',
        github: 'christopherlouet',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.github).toBe('christopherlouet');
    });

    it('should not include optional fields when empty', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        project_name: 'test',
        sections: '',
        subtitle: '',
        event_name: '',
        github: '',
      };
      const config = buildConfigFromArgs(answers);
      expect(config).not.toHaveProperty('subtitle');
      expect(config).not.toHaveProperty('event_name');
      expect(config).not.toHaveProperty('github');
    });
  });

  describe('showHelp', () => {
    it('should print usage information', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      showHelp();
      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toContain('Usage:');
      logSpy.mockRestore();
    });

    it('should list all available themes', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      showHelp();
      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toContain('cyberpunk');
      expect(output).toContain('matrix');
      expect(output).toContain('dracula');
      expect(output).toContain('catppuccin');
      expect(output).toContain('nord');
      expect(output).toContain('gruvbox');
      expect(output).toContain('tokyo-night');
      expect(output).toContain('github-light');
      expect(output).toContain('rose-pine');
      expect(output).toContain('one-dark-pro');
      logSpy.mockRestore();
    });

    it('should indicate the default theme', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      showHelp();
      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toContain('defaut');
      logSpy.mockRestore();
    });

    it('should show YAML example', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      showHelp();
      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toContain('Exemple de YAML');
      logSpy.mockRestore();
    });
  });

  describe('ALLOWED_PM', () => {
    it('should export a whitelist of allowed package managers', () => {
      expect(ALLOWED_PM).toBeDefined();
      expect(Array.isArray(ALLOWED_PM)).toBe(true);
    });

    it('should contain npm, pnpm, yarn and bun', () => {
      expect(ALLOWED_PM).toContain('npm');
      expect(ALLOWED_PM).toContain('pnpm');
      expect(ALLOWED_PM).toContain('yarn');
      expect(ALLOWED_PM).toContain('bun');
    });

    it('should not contain unexpected values', () => {
      expect(ALLOWED_PM).toHaveLength(4);
    });
  });
});
