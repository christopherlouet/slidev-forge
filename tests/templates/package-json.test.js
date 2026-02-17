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

  it('should not duplicate @slidev/theme-default when slidev_theme is "default"', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', slidev_theme: 'default' });
    const output = generatePackageJson(config);
    const occurrences = output.match(/@slidev\/theme-default/g);
    expect(occurrences).toHaveLength(1);
  });

  it('should have both theme-default and custom theme when slidev_theme is not "default"', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', slidev_theme: 'seriph' });
    const pkg = JSON.parse(generatePackageJson(config));
    expect(pkg.dependencies['@slidev/theme-default']).toBeDefined();
    expect(pkg.dependencies['@slidev/theme-seriph']).toBeDefined();
  });

  describe('v1.3 addons dependencies', () => {
    it('should add addons as dependencies with latest version', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        addons: ['slidev-addon-qrcode'],
      });
      const pkg = JSON.parse(generatePackageJson(config));
      expect(pkg.dependencies['slidev-addon-qrcode']).toBe('latest');
    });

    it('should add multiple addons as dependencies', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        addons: ['slidev-addon-qrcode', 'slidev-addon-excalidraw'],
      });
      const pkg = JSON.parse(generatePackageJson(config));
      expect(pkg.dependencies['slidev-addon-qrcode']).toBe('latest');
      expect(pkg.dependencies['slidev-addon-excalidraw']).toBe('latest');
    });

    it('should not add addon deps when addons is empty', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', addons: [] });
      const pkg = JSON.parse(generatePackageJson(config));
      const depKeys = Object.keys(pkg.dependencies);
      expect(depKeys.every((k) => k.startsWith('@slidev') || k === 'vue')).toBe(true);
    });

    it('should not add addon deps when addons is not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const pkg = JSON.parse(generatePackageJson(config));
      const depKeys = Object.keys(pkg.dependencies);
      expect(depKeys.every((k) => k.startsWith('@slidev') || k === 'vue')).toBe(true);
    });
  });
});
