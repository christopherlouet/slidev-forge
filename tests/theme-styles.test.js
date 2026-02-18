import { describe, it, expect } from 'vitest';
import { THEMES, getTheme, buildCustomTheme } from '../src/themes.js';
import { generateStyles } from '../src/templates/styles.js';
import { mergeDefaults } from '../src/config.js';
import { generateSlides } from '../src/templates/slides.js';

// ─────────────────────────────────────────────────────
// T001 - ThemeDefinition optional properties
// ─────────────────────────────────────────────────────
describe('ThemeDefinition optional properties', () => {
  it('all 10 existing themes should be valid without optional props', () => {
    for (const [name, theme] of Object.entries(THEMES)) {
      expect(theme.name).toBeDefined();
      expect(theme.backgroundColor).toBeDefined();
      expect(theme.textColor).toBeDefined();
      // Optional props can be undefined - no crash
      expect(() => getTheme(name)).not.toThrow();
    }
  });

  it('matrix should have font property', () => {
    expect(THEMES.matrix.font).toBe('Fira Code');
  });

  it('matrix should have defaultTransition property', () => {
    expect(THEMES.matrix.defaultTransition).toBe('fade');
  });

  it('matrix should have extraCSS property', () => {
    expect(THEMES.matrix.extraCSS).toBeDefined();
    expect(typeof THEMES.matrix.extraCSS).toBe('string');
    expect(THEMES.matrix.extraCSS.length).toBeGreaterThan(0);
  });

  it('themes without optional props should have undefined values', () => {
    // nord has no special effects
    expect(THEMES.nord.font).toBeUndefined();
    expect(THEMES.nord.extraCSS).toBeUndefined();
    expect(THEMES.nord.defaultTransition).toBeUndefined();
  });

  it('buildCustomTheme should not include optional props', () => {
    const custom = buildCustomTheme({ primary: '#FF0000', secondary: '#00FF00' });
    expect(custom.font).toBeUndefined();
    expect(custom.extraCSS).toBeUndefined();
    expect(custom.defaultTransition).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────
// T002 - CSS background + textColor for all themes
// ─────────────────────────────────────────────────────
describe('CSS background and textColor', () => {
  const allThemeNames = Object.keys(THEMES);

  it.each(allThemeNames)('theme "%s" CSS should contain background', (name) => {
    const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: name });
    const css = generateStyles(config);
    const theme = getTheme(name);
    expect(css).toContain(theme.backgroundColor);
  });

  it.each(allThemeNames)('theme "%s" CSS should contain textColor', (name) => {
    const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: name });
    const css = generateStyles(config);
    const theme = getTheme(name);
    expect(css).toContain(theme.textColor);
  });

  it('github-light should have white background in CSS', () => {
    const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'github-light' });
    const css = generateStyles(config);
    expect(css).toContain('#FFFFFF');
  });

  it('matrix should have dark background in CSS', () => {
    const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'matrix' });
    const css = generateStyles(config);
    expect(css).toContain('#0A0A0A');
  });

  it('CSS should contain code block border with accent color', () => {
    const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'dracula' });
    const css = generateStyles(config);
    expect(css).toContain('border');
    expect(css).toContain(THEMES.dracula.accentColor);
  });

  it('custom theme CSS should use custom backgroundColor', () => {
    const config = mergeDefaults({
      title: 'Test', author: 'A',
      visual_theme: 'custom',
      colors: { primary: '#FF0000', secondary: '#00FF00' },
    });
    const css = generateStyles(config);
    // custom theme backgroundColor = '#1A1A2E'
    expect(css).toContain('#1A1A2E');
  });
});

// ─────────────────────────────────────────────────────
// T003 - Matrix "Terminal pro" theme
// ─────────────────────────────────────────────────────
describe('Matrix Terminal pro', () => {
  describe('CSS effects', () => {
    it('Matrix CSS should contain text-shadow glow on h1', () => {
      const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'matrix' });
      const css = generateStyles(config);
      expect(css).toContain('text-shadow');
      expect(css).toContain('#00FF41');
    });

    it('Matrix CSS should contain green border on code blocks', () => {
      const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'matrix' });
      const css = generateStyles(config);
      expect(css).toContain('border');
      expect(css).toContain('#00FF41');
    });

    it('Matrix CSS should have at least 10 CSS rules', () => {
      const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'matrix' });
      const css = generateStyles(config);
      // Count CSS rule blocks (opening braces)
      const ruleCount = (css.match(/\{/g) || []).length;
      expect(ruleCount).toBeGreaterThanOrEqual(10);
    });

    it('non-Matrix theme should NOT have text-shadow glow', () => {
      const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'nord' });
      const css = generateStyles(config);
      expect(css).not.toContain('text-shadow');
    });
  });

  describe('fonts and transition', () => {
    it('Matrix slides should include fonts.mono in frontmatter', () => {
      const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'matrix' });
      const slides = generateSlides(config);
      expect(slides).toContain('fonts:');
      expect(slides).toContain("mono: 'Fira Code'");
    });

    it('Matrix slides should use fade transition by default', () => {
      const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'matrix' });
      const slides = generateSlides(config);
      expect(slides).toContain('transition: fade');
    });

    it('explicit transition should override Matrix defaultTransition', () => {
      const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'matrix', transition: 'zoom' });
      const slides = generateSlides(config);
      expect(slides).toContain('transition: zoom');
      expect(slides).not.toMatch(/^transition: fade$/m);
    });

    it('non-Matrix theme should NOT inject fonts.mono', () => {
      const config = mergeDefaults({ title: 'Test', author: 'A', visual_theme: 'nord' });
      const slides = generateSlides(config);
      expect(slides).not.toContain("mono: 'Fira Code'");
    });

    it('theme with user-defined fonts should merge with theme font', () => {
      const config = mergeDefaults({
        title: 'Test', author: 'A', visual_theme: 'matrix',
        fonts: { sans: 'Inter' },
      });
      const slides = generateSlides(config);
      expect(slides).toContain("sans: 'Inter'");
      expect(slides).toContain("mono: 'Fira Code'");
    });
  });
});
