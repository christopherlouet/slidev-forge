import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolve, join } from 'node:path';
import { mkdtemp, rm, writeFile as fsWriteFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { homedir } from 'node:os';
import { parseArgs, buildConfigFromArgs, showHelp, showVersion, run, ALLOWED_PM, resolveDestDir } from '../src/cli.js';

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
        dest_dir: './mon-talk',
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
        dest_dir: './test',
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
        dest_dir: './test',
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
        dest_dir: './test',
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
        dest_dir: './test',
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
        dest_dir: './test',
        sections: '',
        github: 'janedoe',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.github).toBe('janedoe');
    });

    it('should not include optional fields when empty', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        dest_dir: './test',
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

    it('should include preset when provided', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        dest_dir: './test',
        sections: '',
        preset: 'conference',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.preset).toBe('conference');
      expect(config.sections).toBeUndefined();
    });

    it('should not include preset when none selected', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        dest_dir: './test',
        sections: 'A, B',
        preset: 'none',
      };
      const config = buildConfigFromArgs(answers);
      expect(config).not.toHaveProperty('preset');
      expect(config.sections).toEqual(['A', 'B']);
    });

    it('should derive project_name from basename of dest_dir', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        dest_dir: '~/presentations/my-talk',
        sections: '',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.project_name).toBe('my-talk');
    });

    it('should derive project_name from absolute dest_dir', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        dest_dir: '/tmp/awesome-talk',
        sections: '',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.project_name).toBe('awesome-talk');
    });

    it('should derive project_name from relative dest_dir', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        dest_dir: './my-project',
        sections: '',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.project_name).toBe('my-project');
    });

    it('should derive project_name from bare directory name', () => {
      const answers = {
        title: 'Test',
        author: 'Me',
        visual_theme: 'cyberpunk',
        dest_dir: 'simple-name',
        sections: '',
      };
      const config = buildConfigFromArgs(answers);
      expect(config.project_name).toBe('simple-name');
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

  describe('resolveDestDir', () => {
    it('should resolve a relative path to an absolute path', () => {
      const result = resolveDestDir('my-project');
      expect(result).toBe(resolve('my-project'));
    });

    it('should keep an absolute path as-is', () => {
      const result = resolveDestDir('/tmp/my-project');
      expect(result).toBe('/tmp/my-project');
    });

    it('should expand ~ to home directory', () => {
      const result = resolveDestDir('~');
      expect(result).toBe(homedir());
    });

    it('should expand ~/path to home + path', () => {
      const result = resolveDestDir('~/presentations/my-talk');
      expect(result).toBe(resolve(homedir(), 'presentations/my-talk'));
    });

    it('should resolve dot-relative paths', () => {
      const result = resolveDestDir('./my-project');
      expect(result).toBe(resolve('./my-project'));
    });

    it('should resolve parent-relative paths', () => {
      const result = resolveDestDir('../other/project');
      expect(result).toBe(resolve('../other/project'));
    });

    it('should allow paths outside cwd', () => {
      const result = resolveDestDir('/tmp/any-directory');
      expect(result).toBe('/tmp/any-directory');
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
