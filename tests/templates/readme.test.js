import { describe, it, expect } from 'vitest';
import { generateReadme } from '../../src/templates/readme.js';
import { mergeDefaults } from '../../src/config.js';

describe('generateReadme', () => {
  const minimalConfig = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });

  it('should contain the presentation title', () => {
    const readme = generateReadme(minimalConfig);
    expect(readme).toContain('Mon Talk');
  });

  it('should contain the author name', () => {
    const readme = generateReadme(minimalConfig);
    expect(readme).toContain('Chris');
  });

  it('should contain setup instructions', () => {
    const readme = generateReadme(minimalConfig);
    expect(readme).toContain('npm install');
    expect(readme).toContain('npm run dev');
  });

  it('should contain export instructions', () => {
    const readme = generateReadme(minimalConfig);
    expect(readme).toContain('npm run export');
  });

  it('should include event_name when provided', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      event_name: "Tech'Dej Oxxeo",
    });
    const readme = generateReadme(config);
    expect(readme).toContain("Tech'Dej Oxxeo");
  });

  it('should include subtitle when provided', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', subtitle: 'A cool subtitle' });
    const readme = generateReadme(config);
    expect(readme).toContain('A cool subtitle');
  });
});
