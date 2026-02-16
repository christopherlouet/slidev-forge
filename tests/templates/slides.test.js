import { describe, it, expect } from 'vitest';
import { generateSlides } from '../../src/templates/slides.js';
import { mergeDefaults } from '../../src/config.js';

describe('generateSlides', () => {
  const minimalConfig = mergeDefaults({ title: 'Mon Talk', author: 'Chris' });

  it('should return a string', () => {
    expect(typeof generateSlides(minimalConfig)).toBe('string');
  });

  it('should start with YAML frontmatter', () => {
    const slides = generateSlides(minimalConfig);
    expect(slides.startsWith('---\n')).toBe(true);
    expect(slides).toContain('theme: seriph');
    expect(slides).toContain('title: Mon Talk');
    expect(slides).toContain('author: Chris');
  });

  it('should include transition in frontmatter', () => {
    const slides = generateSlides(minimalConfig);
    expect(slides).toContain('transition: slide-left');
  });

  it('should include mdc: true in frontmatter', () => {
    const slides = generateSlides(minimalConfig);
    expect(slides).toContain('mdc: true');
  });

  it('should include export config in frontmatter', () => {
    const slides = generateSlides(minimalConfig);
    expect(slides).toContain('export:');
    expect(slides).toContain('format: pdf');
  });

  it('should have a title slide with the presentation title', () => {
    const slides = generateSlides(minimalConfig);
    expect(slides).toContain('# Mon Talk');
  });

  it('should include GitHub link when github is set', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', github: 'myuser' });
    const slides = generateSlides(config);
    expect(slides).toContain('github.com/myuser');
    expect(slides).toContain('carbon-logo-github');
  });

  it('should include a Toc slide', () => {
    const slides = generateSlides(minimalConfig);
    expect(slides).toContain('<Toc');
  });

  it('should generate section slides from config.sections', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Oh My Zsh', 'tmux', 'fzf'],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('# Oh My Zsh');
    expect(slides).toContain('# tmux');
    expect(slides).toContain('# fzf');
  });

  it('should include a Références slide at the end', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Intro', 'Références'],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('# Références');
  });

  it('should include subtitle when provided', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', subtitle: 'A cool talk' });
    const slides = generateSlides(config);
    expect(slides).toContain('A cool talk');
  });

  it('should include event_name when provided', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      event_name: "Tech'Dej Oxxeo",
    });
    const slides = generateSlides(config);
    expect(slides).toContain("Tech'Dej Oxxeo");
  });

  it('should use custom slidev_theme', () => {
    const config = mergeDefaults({ title: 'Test', author: 'Me', slidev_theme: 'apple-basic' });
    const slides = generateSlides(config);
    expect(slides).toContain('theme: apple-basic');
  });

  it('should separate slides with ---', () => {
    const slides = generateSlides(minimalConfig);
    const separators = slides.split('\n---\n').length - 1;
    expect(separators).toBeGreaterThanOrEqual(3);
  });
});
