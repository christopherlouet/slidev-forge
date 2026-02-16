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

  it.each(Object.keys(THEMES))('should generate valid CSS for theme "%s"', (themeName) => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', visual_theme: themeName });
    const css = generateStyles(config);
    expect(css).toContain('h1');
    expect(css).toContain(THEMES[themeName].h1Colors[0]);
  });
});
