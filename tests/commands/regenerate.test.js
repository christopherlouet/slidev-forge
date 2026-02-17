import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stringify } from 'yaml';
import { runRegenerate } from '../../src/commands/regenerate.js';

describe('runRegenerate', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'slidev-forge-regen-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  async function setupProject(yamlConfig, slidesContent) {
    await writeFile(join(tempDir, 'presentation.yaml'), stringify(yamlConfig), 'utf-8');
    await writeFile(join(tempDir, 'slides.md'), slidesContent, 'utf-8');
    await mkdir(join(tempDir, 'styles'), { recursive: true });
    await writeFile(join(tempDir, 'styles', 'index.css'), 'h1 { color: red; }', 'utf-8');
  }

  it('should fail when no presentation.yaml exists', async () => {
    const result = await runRegenerate([], tempDir);
    expect(result.success).toBe(false);
    expect(result.error).toContain('presentation.yaml');
  });

  it('should fail when no slides.md exists', async () => {
    await writeFile(
      join(tempDir, 'presentation.yaml'),
      stringify({ title: 'Test', author: 'Me' }),
      'utf-8',
    );
    const result = await runRegenerate([], tempDir);
    expect(result.success).toBe(false);
    expect(result.error).toContain('slides.md');
  });

  it('should successfully regenerate when adding a section', async () => {
    // Setup initial project
    const initialYaml = { title: 'Test', author: 'Me', sections: ['Introduction'] };
    const initialSlides = [
      '---',
      'theme: seriph',
      'title: Test',
      'author: Me',
      '---',
      '<!-- section:id=__title__ -->',
      '',
      '# Test',
      '---',
      'transition: slide-left',
      'hideInToc: true',
      '---',
      '<!-- section:id=__toc__ -->',
      '',
      '# Sommaire',
      '',
      '<Toc minDepth="1" maxDepth="2"></Toc>',
      '---',
      'transition: slide-left',
      '---',
      '<!-- section:id=introduction -->',
      '',
      '# Introduction',
      '',
      'My custom content',
    ].join('\n');

    await setupProject(initialYaml, initialSlides);

    // Update YAML to add a section
    const updatedYaml = { title: 'Test', author: 'Me', sections: ['Introduction', 'Demo'] };
    await writeFile(join(tempDir, 'presentation.yaml'), stringify(updatedYaml), 'utf-8');

    const result = await runRegenerate([], tempDir);
    expect(result.success).toBe(true);

    const newSlides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
    expect(newSlides).toContain('<!-- section:id=introduction -->');
    expect(newSlides).toContain('<!-- section:id=demo -->');
    expect(newSlides).toContain('My custom content');
  });

  it('should create a backup before regenerating', async () => {
    const yaml = { title: 'Test', author: 'Me', sections: ['Intro'] };
    const slides = [
      '---',
      'theme: seriph',
      'title: Test',
      '---',
      '<!-- section:id=__title__ -->',
      '',
      '# Test',
      '---',
      'transition: slide-left',
      'hideInToc: true',
      '---',
      '<!-- section:id=__toc__ -->',
      '',
      '# Sommaire',
      '---',
      'transition: slide-left',
      '---',
      '<!-- section:id=intro -->',
      '',
      '# Intro',
    ].join('\n');

    await setupProject(yaml, slides);
    const result = await runRegenerate([], tempDir);
    expect(result.success).toBe(true);
    expect(result.backupPath).toBeTruthy();

    const backup = await readFile(result.backupPath, 'utf-8');
    expect(backup).toContain('# Test');
  });

  it('should not modify files in dry-run mode', async () => {
    const yaml = { title: 'Test', author: 'Me', sections: ['Intro'] };
    const originalContent = [
      '---',
      'theme: seriph',
      'title: Test',
      '---',
      '<!-- section:id=__title__ -->',
      '',
      '# Test',
      '---',
      'transition: slide-left',
      'hideInToc: true',
      '---',
      '<!-- section:id=__toc__ -->',
      '',
      '# Sommaire',
      '---',
      'transition: slide-left',
      '---',
      '<!-- section:id=intro -->',
      '',
      '# Intro',
    ].join('\n');

    await setupProject(yaml, originalContent);

    const updatedYaml = { title: 'New Title', author: 'Me', sections: ['Intro', 'Demo'] };
    await writeFile(join(tempDir, 'presentation.yaml'), stringify(updatedYaml), 'utf-8');

    const result = await runRegenerate(['--dry-run'], tempDir);
    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);

    // File should not be modified
    const afterSlides = await readFile(join(tempDir, 'slides.md'), 'utf-8');
    expect(afterSlides).toBe(originalContent);
  });

  it('should return diff actions in result', async () => {
    const yaml = { title: 'Test', author: 'Me', sections: ['Intro'] };
    const slides = [
      '---',
      'theme: seriph',
      'title: Test',
      '---',
      '<!-- section:id=__title__ -->',
      '',
      '# Test',
      '---',
      'transition: slide-left',
      'hideInToc: true',
      '---',
      '<!-- section:id=__toc__ -->',
      '',
      '# Sommaire',
      '---',
      'transition: slide-left',
      '---',
      '<!-- section:id=intro -->',
      '',
      '# Intro',
    ].join('\n');

    await setupProject(yaml, slides);

    const updatedYaml = { title: 'Test', author: 'Me', sections: ['Intro', 'Demo'] };
    await writeFile(join(tempDir, 'presentation.yaml'), stringify(updatedYaml), 'utf-8');

    const result = await runRegenerate([], tempDir);
    expect(result.actions).toBeDefined();
    const adds = result.actions.filter((a) => a.type === 'add');
    expect(adds).toHaveLength(1);
    expect(adds[0].sectionName).toBe('Demo');
  });
});
