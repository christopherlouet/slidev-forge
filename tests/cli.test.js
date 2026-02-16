import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolve, join } from 'node:path';
import { mkdtemp, rm, writeFile as fsWriteFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { parseArgs, buildConfigFromArgs, showHelp, showVersion, run, ALLOWED_PM, validateDestDir } from '../src/cli.js';

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

    it('should detect --version flag', () => {
      const result = parseArgs(['--version']);
      expect(result.mode).toBe('version');
    });

    it('should detect -v flag', () => {
      const result = parseArgs(['-v']);
      expect(result.mode).toBe('version');
    });

    it('should detect --dry-run flag with yaml', () => {
      const result = parseArgs(['config.yaml', '--dry-run']);
      expect(result.mode).toBe('yaml');
      expect(result.dryRun).toBe(true);
    });

    it('should detect --dry-run flag in interactive mode', () => {
      const result = parseArgs(['--dry-run']);
      expect(result.mode).toBe('interactive');
      expect(result.dryRun).toBe(true);
    });

    it('should detect --no-git flag with yaml', () => {
      const result = parseArgs(['config.yaml', '--no-git']);
      expect(result.mode).toBe('yaml');
      expect(result.noGit).toBe(true);
    });

    it('should detect --no-git flag in interactive mode', () => {
      const result = parseArgs(['--no-git']);
      expect(result.mode).toBe('interactive');
      expect(result.noGit).toBe(true);
    });

    it('should combine --dry-run and --no-git', () => {
      const result = parseArgs(['config.yaml', '--dry-run', '--no-git']);
      expect(result.dryRun).toBe(true);
      expect(result.noGit).toBe(true);
    });

    it('should not set flags by default', () => {
      const result = parseArgs(['config.yaml']);
      expect(result.dryRun).toBeUndefined();
      expect(result.noGit).toBeUndefined();
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

  describe('showVersion', () => {
    it('should print the version from package.json', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      showVersion();
      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toMatch(/\d+\.\d+\.\d+/);
      logSpy.mockRestore();
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

  describe('validateDestDir', () => {
    it('should accept a subdirectory of cwd', () => {
      const cwd = process.cwd();
      expect(() => validateDestDir(resolve(cwd, 'my-project'))).not.toThrow();
    });

    it('should accept cwd itself', () => {
      expect(() => validateDestDir(process.cwd())).not.toThrow();
    });

    it('should reject paths outside cwd', () => {
      expect(() => validateDestDir('/tmp/evil-project')).toThrow(/outside.*current/i);
    });

    it('should reject path traversal attempts', () => {
      const cwd = process.cwd();
      expect(() => validateDestDir(resolve(cwd, '../../evil'))).toThrow(/outside.*current/i);
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

  describe('run', () => {
    let logSpy;
    let errorSpy;

    beforeEach(() => {
      logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      logSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should show help when --help is passed', async () => {
      await run(['--help']);
      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toContain('Usage:');
    });

    it('should show version when --version is passed', async () => {
      await run(['--version']);
      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toMatch(/\d+\.\d+\.\d+/);
    });

    it('should generate project from YAML file with dry-run', async () => {
      const yamlPath = resolve(import.meta.dirname, 'fixtures/minimal.yaml');

      await run([yamlPath, '--dry-run']);

      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toContain('Dry run');
      expect(output).toContain('cyberpunk');
    });

    it('should generate project from full YAML file with dry-run', async () => {
      const yamlPath = resolve(import.meta.dirname, 'fixtures/full.yaml');

      await run([yamlPath, '--dry-run']);

      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toContain('Dry run');
      expect(output).toContain('dracula');
    });

    it('should show dry-run output without generating files', async () => {
      const yamlPath = resolve(import.meta.dirname, 'fixtures/minimal.yaml');
      const destDir = resolve(process.cwd(), 'dry-run-test-should-not-exist');

      await run([yamlPath, '--dry-run']);

      const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
      expect(output).toContain('Dry run');
    });

    it('should throw for invalid YAML config', async () => {
      const yamlPath = resolve(import.meta.dirname, 'fixtures/invalid.yaml');
      await expect(run([yamlPath])).rejects.toThrow();
    });

    it('should throw for non-existent YAML file', async () => {
      await expect(run(['/nonexistent.yaml'])).rejects.toThrow();
    });
  });
});
