import { describe, it, expect } from 'vitest';
import { generatePackageJson } from '../../src/templates/package-json.js';
import { mergeDefaults } from '../../src/config.js';

describe('generatePackageJson', () => {
  const minimalConfig = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });

  it('should return valid JSON', () => {
    const output = generatePackageJson(minimalConfig);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it('should use project_name as package name', () => {
    const pkg = JSON.parse(generatePackageJson(minimalConfig));
    expect(pkg.name).toBe('mon-talk');
  });

  it('should be type: module', () => {
    const pkg = JSON.parse(generatePackageJson(minimalConfig));
    expect(pkg.type).toBe('module');
  });

  it('should be private: true', () => {
    const pkg = JSON.parse(generatePackageJson(minimalConfig));
    expect(pkg.private).toBe(true);
  });

  it('should include dev, build, export scripts', () => {
    const pkg = JSON.parse(generatePackageJson(minimalConfig));
    expect(pkg.scripts.dev).toContain('slidev');
    expect(pkg.scripts.build).toContain('slidev');
    expect(pkg.scripts.export).toContain('slidev');
  });

  it('should include @slidev/cli as dependency', () => {
    const pkg = JSON.parse(generatePackageJson(minimalConfig));
    expect(pkg.dependencies['@slidev/cli']).toBeDefined();
  });

  it('should include the configured theme as dependency', () => {
    const pkg = JSON.parse(generatePackageJson(minimalConfig));
    expect(pkg.dependencies['@slidev/theme-seriph']).toBeDefined();
  });

  it('should include a custom theme when specified', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', slidev_theme: 'apple-basic' });
    const pkg = JSON.parse(generatePackageJson(config));
    expect(pkg.dependencies['@slidev/theme-apple-basic']).toBeDefined();
  });

  it('should include vue as dependency', () => {
    const pkg = JSON.parse(generatePackageJson(minimalConfig));
    expect(pkg.dependencies.vue).toBeDefined();
  });

  it('should include playwright-chromium and prettier as devDependencies', () => {
    const pkg = JSON.parse(generatePackageJson(minimalConfig));
    expect(pkg.devDependencies['playwright-chromium']).toBeDefined();
    expect(pkg.devDependencies.prettier).toBeDefined();
    expect(pkg.devDependencies['prettier-plugin-slidev']).toBeDefined();
  });
});
