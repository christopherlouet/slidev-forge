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

  describe('v1.4 integration', () => {
    it('should generate slides with all 6 new section types', async () => {
      const config = mergeDefaults({
        title: 'V1.4 Demo',
        author: 'Tester',
        language: 'en',
        sections: [
          { name: 'Code', type: 'code', lang: 'python' },
          { name: 'Diagram', type: 'diagram' },
          { name: 'Cover', type: 'cover', image: 'https://example.com/bg.jpg' },
          { name: 'Iframe', type: 'iframe', url: 'https://codepen.io/test' },
          { name: 'Steps', type: 'steps', items: ['A', 'B'] },
          { name: 'Fact', type: 'fact', value: '42', description: 'the answer' },
        ],
      });
      await generate(config, tempDir);

      const slides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
      expect(slides).toContain('```python');
      expect(slides).toContain('```mermaid');
      expect(slides).toContain('layout: cover');
      expect(slides).toContain('background: https://example.com/bg.jpg');
      expect(slides).toContain('<iframe');
      expect(slides).toContain('<v-clicks>');
      expect(slides).toContain('- A');
      expect(slides).toContain('text-8xl');
      expect(slides).toContain('42');
      expect(slides).toContain('the answer');
    });

    it('should generate from v14-sections.yaml fixture', async () => {
      const { loadConfig } = await import('../src/config.js');
      const userConfig = await loadConfig(join(import.meta.dirname, 'fixtures/v14-sections.yaml'));
      const config = mergeDefaults(userConfig);
      await generate(config, tempDir);

      const slides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
      expect(slides).toContain('```typescript');
      expect(slides).toContain('sequenceDiagram');
      expect(slides).toContain('background: https://example.com/bg.jpg');
      expect(slides).toContain('https://codepen.io/example');
      expect(slides).toContain('- Fast');
      expect(slides).toContain('99.9%');
      expect(slides).toContain('uptime');
    });
  });

  describe('v1.5 integration', () => {
    it('should generate slides from conference preset', async () => {
      const config = mergeDefaults({
        title: 'Conference Talk',
        author: 'Jane',
        preset: 'conference',
        language: 'en',
      });
      await generate(config, tempDir);

      const slides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
      expect(slides).toContain('# Introduction');
      expect(slides).toContain('# About');
      expect(slides).toContain('# Demo');
      expect(slides).toContain('# Q&A');
      expect(slides).toContain('# Thank you');
    });

    it('should generate from preset-conference.yaml fixture', async () => {
      const { loadConfig } = await import('../src/config.js');
      const userConfig = await loadConfig(join(import.meta.dirname, 'fixtures/preset-conference.yaml'));
      const config = mergeDefaults(userConfig);
      await generate(config, tempDir);

      const slides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
      expect(slides).toContain('# Introduction');
      expect(slides).toContain('layout: center');
    });

    it('should generate slides from lightning preset', async () => {
      const config = mergeDefaults({
        title: 'Quick Talk',
        author: 'Me',
        preset: 'lightning',
        language: 'fr',
      });
      await generate(config, tempDir);

      const slides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
      expect(slides).toContain('# Problème');
      expect(slides).toContain('# Solution');
      expect(slides).toContain('text-8xl');
    });
  });
});
