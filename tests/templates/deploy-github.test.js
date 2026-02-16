import { describe, it, expect } from 'vitest';
import { generateDeployYml } from '../../src/templates/deploy-github.js';
import { mergeDefaults } from '../../src/config.js';

describe('generateDeployYml', () => {
  const config = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });

  it('should return a non-empty string', () => {
    const output = generateDeployYml(config);
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(0);
  });

  it('should include the project name in the base path', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('/mon-talk/');
  });

  it('should use a custom project name in the base path', () => {
    const custom = mergeDefaults({
      title: 'Test',
      author: 'Me',
      project_name: 'my-slides',
    });
    const output = generateDeployYml(custom);
    expect(output).toContain('/my-slides/');
  });

  it('should use official actions/deploy-pages action', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('actions/deploy-pages');
  });

  it('should use official actions/upload-pages-artifact action', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('actions/upload-pages-artifact');
  });

  it('should use actions/configure-pages action', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('actions/configure-pages');
  });

  it('should build with npx slidev, not global install', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('npx slidev build');
    expect(output).not.toContain('npm i -g');
    expect(output).not.toContain('npm install -g');
  });

  it('should NOT use crazy-max action', () => {
    const output = generateDeployYml(config);
    expect(output).not.toContain('crazy-max');
  });

  it('should include pages:write permission', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('pages: write');
  });

  it('should include id-token:write permission', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('id-token: write');
  });

  it('should trigger on push to main', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('push');
    expect(output).toContain('main');
  });

  it('should use Node.js 20', () => {
    const output = generateDeployYml(config);
    expect(output).toContain("node-version: '20'");
  });

  it('should include github-pages environment', () => {
    const output = generateDeployYml(config);
    expect(output).toContain('environment');
    expect(output).toContain('github-pages');
  });
});
