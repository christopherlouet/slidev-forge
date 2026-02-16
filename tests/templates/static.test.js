import { describe, it, expect } from 'vitest';
import { getStaticFiles } from '../../src/templates/static.js';
import { mergeDefaults } from '../../src/config.js';

describe('getStaticFiles', () => {
  it('should return an array of file descriptors', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const files = getStaticFiles(config);
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      expect(f).toHaveProperty('src');
      expect(f).toHaveProperty('dest');
    }
  });

  it('should always include .npmrc and .prettierrc.json', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).toContain('.npmrc');
    expect(dests).toContain('.prettierrc.json');
  });

  it('should always include .gitignore', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).toContain('.gitignore');
  });

  it('should include snippets when options.snippets is true', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).toContain('snippets/external.ts');
  });

  it('should include netlify.toml when deploy includes netlify', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', deploy: ['netlify'] });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).toContain('netlify.toml');
  });

  it('should include vercel.json when deploy includes vercel', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', deploy: ['vercel'] });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).toContain('vercel.json');
  });

  it('should not include netlify.toml when deploy excludes netlify', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', deploy: ['github-pages'] });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).not.toContain('netlify.toml');
  });

  it('should not include vercel.json when deploy excludes vercel', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', deploy: ['github-pages'] });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).not.toContain('vercel.json');
  });

  it('should include components by default', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).toContain('components/Counter.vue');
    expect(dests).toContain('components/CodeComparison.vue');
  });

  it('should include layouts by default', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).toContain('layouts/two-cols-header.vue');
    expect(dests).toContain('layouts/image-right.vue');
    expect(dests).toContain('layouts/quote.vue');
  });

  it('should not include components when options.components is false', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      options: { components: false },
    });
    const files = getStaticFiles(config);
    const dests = files.map((f) => f.dest);
    expect(dests).not.toContain('components/Counter.vue');
    expect(dests).not.toContain('components/CodeComparison.vue');
    expect(dests).not.toContain('layouts/two-cols-header.vue');
    expect(dests).not.toContain('layouts/image-right.vue');
    expect(dests).not.toContain('layouts/quote.vue');
  });
});
