import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolve } from 'node:path';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stringify, parse } from 'yaml';
import { parseArgs } from '../src/cli.js';

const FIXTURES = resolve(import.meta.dirname, 'fixtures');

describe('subcommand parsing', () => {
  it('should detect validate subcommand', () => {
    const result = parseArgs(['validate', 'config.yaml']);
    expect(result.mode).toBe('subcommand');
    expect(result.subcommand).toBe('validate');
    expect(result.subcommandArgs).toEqual(['config.yaml']);
  });

  it('should detect add subcommand', () => {
    const result = parseArgs(['add', 'section', 'My Section', '--type', 'code']);
    expect(result.mode).toBe('subcommand');
    expect(result.subcommand).toBe('add');
    expect(result.subcommandArgs).toEqual(['section', 'My Section', '--type', 'code']);
  });

  it('should detect theme subcommand', () => {
    const result = parseArgs(['theme', 'dracula']);
    expect(result.mode).toBe('subcommand');
    expect(result.subcommand).toBe('theme');
    expect(result.subcommandArgs).toEqual(['dracula']);
  });

  it('should detect config subcommand', () => {
    const result = parseArgs(['config', 'set', 'title', 'New Title']);
    expect(result.mode).toBe('subcommand');
    expect(result.subcommand).toBe('config');
    expect(result.subcommandArgs).toEqual(['set', 'title', 'New Title']);
  });

  it('should not treat yaml files as subcommands', () => {
    const result = parseArgs(['config.yaml']);
    expect(result.mode).toBe('yaml');
    expect(result.yamlPath).toBe('config.yaml');
  });

  it('should still handle --help and --version', () => {
    expect(parseArgs(['--help']).mode).toBe('help');
    expect(parseArgs(['--version']).mode).toBe('version');
  });

  it('should handle theme subcommand with no args', () => {
    const result = parseArgs(['theme']);
    expect(result.mode).toBe('subcommand');
    expect(result.subcommand).toBe('theme');
    expect(result.subcommandArgs).toEqual([]);
  });
});

describe('validate command', () => {
  it('should validate a correct YAML file', async () => {
    const { runValidate } = await import('../src/commands/validate.js');
    const logs = [];
    const origLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    await runValidate([join(FIXTURES, 'minimal.yaml')]);

    console.log = origLog;
    const output = logs.join('\n');
    expect(output).toContain('valid');
  });
});

describe('add command', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'add-test-'));
    const config = { title: 'Test', author: 'Me', sections: [{ name: 'Intro', type: 'default' }] };
    await writeFile(join(tempDir, 'presentation.yaml'), stringify(config), 'utf-8');
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should add a section to presentation.yaml', async () => {
    const { runAdd } = await import('../src/commands/add.js');
    const origCwd = process.cwd();
    process.chdir(tempDir);
    const origLog = console.log;
    const logs = [];
    console.log = (...args) => logs.push(args.join(' '));

    try {
      await runAdd(['section', 'New Section', '--type', 'code']);
    } finally {
      process.chdir(origCwd);
      console.log = origLog;
    }

    const content = await readFile(join(tempDir, 'presentation.yaml'), 'utf-8');
    const config = parse(content);
    expect(config.sections).toHaveLength(2);
    expect(config.sections[1].name).toBe('New Section');
    expect(config.sections[1].type).toBe('code');
  });
});

describe('theme command', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'theme-test-'));
    const config = { title: 'Test', author: 'Me', visual_theme: 'cyberpunk' };
    await writeFile(join(tempDir, 'presentation.yaml'), stringify(config), 'utf-8');
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should change theme in presentation.yaml', async () => {
    const { runTheme } = await import('../src/commands/theme.js');
    const origCwd = process.cwd();
    process.chdir(tempDir);
    const origLog = console.log;
    const logs = [];
    console.log = (...args) => logs.push(args.join(' '));

    try {
      await runTheme(['dracula']);
    } finally {
      process.chdir(origCwd);
      console.log = origLog;
    }

    const content = await readFile(join(tempDir, 'presentation.yaml'), 'utf-8');
    const config = parse(content);
    expect(config.visual_theme).toBe('dracula');
  });

  it('should list themes when no argument given', async () => {
    const { runTheme } = await import('../src/commands/theme.js');
    const logs = [];
    const origLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    await runTheme([]);

    console.log = origLog;
    const output = logs.join('\n');
    expect(output).toContain('cyberpunk');
    expect(output).toContain('dracula');
  });
});

describe('config command', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'config-test-'));
    const config = { title: 'Test', author: 'Me' };
    await writeFile(join(tempDir, 'presentation.yaml'), stringify(config), 'utf-8');
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should get a config value', async () => {
    const { runConfig } = await import('../src/commands/config.js');
    const origCwd = process.cwd();
    process.chdir(tempDir);
    const logs = [];
    const origLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    try {
      await runConfig(['get', 'title']);
    } finally {
      process.chdir(origCwd);
      console.log = origLog;
    }

    expect(logs.join('\n')).toContain('Test');
  });

  it('should set a config value', async () => {
    const { runConfig } = await import('../src/commands/config.js');
    const origCwd = process.cwd();
    process.chdir(tempDir);
    const origLog = console.log;
    const logs = [];
    console.log = (...args) => logs.push(args.join(' '));

    try {
      await runConfig(['set', 'title', 'New Title']);
    } finally {
      process.chdir(origCwd);
      console.log = origLog;
    }

    const content = await readFile(join(tempDir, 'presentation.yaml'), 'utf-8');
    const config = parse(content);
    expect(config.title).toBe('New Title');
  });

  it('should parse boolean values on set', async () => {
    const { runConfig } = await import('../src/commands/config.js');
    const origCwd = process.cwd();
    process.chdir(tempDir);
    const origLog = console.log;
    console.log = () => {};

    try {
      await runConfig(['set', 'download', 'true']);
    } finally {
      process.chdir(origCwd);
      console.log = origLog;
    }

    const content = await readFile(join(tempDir, 'presentation.yaml'), 'utf-8');
    const config = parse(content);
    expect(config.download).toBe(true);
  });
});
