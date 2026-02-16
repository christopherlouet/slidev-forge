import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, readFile, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { generate } from '../src/generator.js';
import { mergeDefaults } from '../src/config.js';

describe('generator', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'slidev-gen-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should generate a complete project from minimal config', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    const result = await generate(config, tempDir);

    expect(result.files.length).toBeGreaterThan(0);
    expect(result.destDir).toBe(tempDir);
  });

  it('should create slides.md', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const slides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
    expect(slides).toContain('Mon Talk');
    expect(slides).toContain('theme: seriph');
  });

  it('should create package.json', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const pkg = JSON.parse(await readFile(join(tempDir, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('mon-talk');
    expect(pkg.dependencies['@slidev/cli']).toBeDefined();
  });

  it('should create README.md', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const readme = await readFile(join(tempDir, 'README.md'), 'utf-8');
    expect(readme).toContain('Mon Talk');
  });

  it('should create styles/index.css', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const css = await readFile(join(tempDir, 'styles/index.css'), 'utf-8');
    expect(css).toContain('h1');
    expect(css).toContain('background-clip');
  });

  it('should copy static files', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const npmrc = await readFile(join(tempDir, '.npmrc'), 'utf-8');
    expect(npmrc).toContain('shamefully-hoist');

    const prettier = await readFile(join(tempDir, '.prettierrc.json'), 'utf-8');
    expect(prettier).toContain('slidev');
  });

  it('should create docs/ directory with .gitkeep', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const info = await stat(join(tempDir, 'docs'));
    expect(info.isDirectory()).toBe(true);
  });

  it('should create dist/ directory with .gitkeep', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const info = await stat(join(tempDir, 'dist'));
    expect(info.isDirectory()).toBe(true);
  });

  it('should generate deploy.yml when github-pages in deploy', async () => {
    const config = mergeDefaults({
      title: 'Mon Talk',
      author: 'Chris',
      deploy: ['github-pages'],
    });
    await generate(config, tempDir);

    const deploy = await readFile(
      join(tempDir, '.github/workflows/deploy.yml'),
      'utf-8',
    );
    expect(deploy).toContain('mon-talk');
  });

  it('should not generate deploy.yml when github-pages not in deploy', async () => {
    const config = mergeDefaults({
      title: 'Mon Talk',
      author: 'Chris',
      deploy: ['vercel'],
    });
    await generate(config, tempDir);

    await expect(
      stat(join(tempDir, '.github/workflows/deploy.yml')),
    ).rejects.toThrow();
  });

  it('should return list of all generated files', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    const result = await generate(config, tempDir);

    expect(result.files).toContain('slides.md');
    expect(result.files).toContain('package.json');
    expect(result.files).toContain('README.md');
    expect(result.files).toContain('styles/index.css');
  });

  it('should create public/ directory with .gitkeep', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const info = await stat(join(tempDir, 'public'));
    expect(info.isDirectory()).toBe(true);
  });

  it('should skip git init when noGit option is true', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir, { noGit: true });

    await expect(
      stat(join(tempDir, '.git')),
    ).rejects.toThrow();
  });

  it('should init git by default', async () => {
    const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });
    await generate(config, tempDir);

    const gitDir = await stat(join(tempDir, '.git'));
    expect(gitDir.isDirectory()).toBe(true);
  });

  describe('v1.3 integration', () => {
    it('should generate slides with all v1.3 frontmatter fields', async () => {
      const config = mergeDefaults({
        title: 'Advanced Talk',
        author: 'Jane',
        fonts: { sans: 'Inter', mono: 'Fira Code' },
        line_numbers: true,
        aspect_ratio: '4/3',
        color_schema: 'dark',
        favicon: 'logo.png',
        download: true,
        addons: ['slidev-addon-qrcode'],
        language: 'en',
      });
      await generate(config, tempDir);

      const slides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
      expect(slides).toContain('lineNumbers: true');
      expect(slides).toContain("aspectRatio: '4/3'");
      expect(slides).toContain('colorSchema: dark');
      expect(slides).toContain('favicon: logo.png');
      expect(slides).toContain('download: true');
      expect(slides).toContain('lang: en');
      expect(slides).toContain('fonts:');
      expect(slides).toContain('  sans: Inter');
      expect(slides).toContain('addons:');
      expect(slides).toContain('  - slidev-addon-qrcode');
      expect(slides).toContain('# Table of Contents');
    });

    it('should add addons as package.json dependencies', async () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        addons: ['slidev-addon-qrcode'],
      });
      await generate(config, tempDir);

      const pkg = JSON.parse(await readFile(join(tempDir, 'package.json'), 'utf-8'));
      expect(pkg.dependencies['slidev-addon-qrcode']).toBe('latest');
    });

    it('should generate English README when language is en', async () => {
      const config = mergeDefaults({
        title: 'My Talk',
        author: 'Jane',
        language: 'en',
      });
      await generate(config, tempDir);

      const readme = await readFile(join(tempDir, 'README.md'), 'utf-8');
      expect(readme).toContain('By **Jane**');
    });
  });
});
