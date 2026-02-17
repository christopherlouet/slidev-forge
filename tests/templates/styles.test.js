import { describe, it, expect } from 'vitest';
import { generateStyles } from '../../src/templates/styles.js';
import { mergeDefaults } from '../../src/config.js';
import { THEMES } from '../../src/themes.js';

describe('generateStyles', () => {
  it('should return a CSS string', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const css = generateStyles(config);
    expect(css).toContain('h1');
    expect(css).toContain('{');
  });

  it('should use cyberpunk colors by default', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const css = generateStyles(config);
    const theme = THEMES.cyberpunk;
    expect(css).toContain(theme.h1Colors[0]);
    expect(css).toContain(theme.h1Colors[1]);
  });

  it('should use dracula colors when visual_theme is dracula', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', visual_theme: 'dracula' });
    const css = generateStyles(config);
    const theme = THEMES.dracula;
    expect(css).toContain(theme.h1Colors[0]);
    expect(css).toContain(theme.h1Colors[1]);
  });

  it('should include background-clip for gradient text', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const css = generateStyles(config);
    expect(css).toContain('background-clip');
  });

  it('should include link styles', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const css = generateStyles(config);
    const theme = THEMES.cyberpunk;
    expect(css).toContain('a {');
    expect(css).toContain(theme.linkColor);
  });

  it('should include link hover styles with accent color', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const css = generateStyles(config);
    const theme = THEMES.cyberpunk;
    expect(css).toContain('a:hover');
    expect(css).toContain(theme.accentColor);
  });

  it('should include code block background styles', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const css = generateStyles(config);
    const theme = THEMES.cyberpunk;
    expect(css).toContain('.slidev-code-wrapper');
    expect(css).toContain(theme.codeBlockBg);
  });

  it('should include list marker styles', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me' });
    const css = generateStyles(config);
    const theme = THEMES.cyberpunk;
    expect(css).toContain('li::marker');
    expect(css).toContain(theme.accentColor);
  });

  it('should generate valid CSS for github-light with light colors', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', visual_theme: 'github-light' });
    const css = generateStyles(config);
    const theme = THEMES['github-light'];
    expect(css).toContain(theme.h1Colors[0]);
    expect(css).toContain(theme.linkColor);
    expect(css).toContain(theme.codeBlockBg);
  });

  it.each(Object.keys(THEMES))('should generate valid CSS for theme "%s"', (themeName) => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', visual_theme: themeName });
    const css = generateStyles(config);
    expect(css).toContain('h1');
    expect(css).toContain(THEMES[themeName].h1Colors[0]);
    expect(css).toContain(THEMES[themeName].linkColor);
    expect(css).toContain(THEMES[themeName].codeBlockBg);
  });

  describe('v1.6 logo', () => {
    it('should include logo CSS when logo is configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', logo: 'logo.png' });
      const css = generateStyles(config);
      expect(css).toContain('.slidev-layout::after');
      expect(css).toContain('logo.png');
    });

    it('should not include logo CSS when logo is not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const css = generateStyles(config);
      expect(css).not.toContain('.slidev-layout::after');
    });
  });
});
