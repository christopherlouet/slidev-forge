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
      sections: ['Getting Started', 'JavaScript', 'Best Practices'],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('# Getting Started');
    expect(slides).toContain('# JavaScript');
    expect(slides).toContain('# Best Practices');
  });

  it('should include a References slide at the end', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Intro', 'References'],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('# References');
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
      event_name: 'Tech Meetup',
    });
    const slides = generateSlides(config);
    expect(slides).toContain('Tech Meetup');
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

  it('should use config.transition on toc and section slides, not hardcoded value', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      transition: 'fade',
      sections: ['Intro', 'Demo'],
    });
    const slides = generateSlides(config);
    // Split into individual slides
    const parts = slides.split('\n---\n');
    // Parts after frontmatter+title: toc slide and section slides
    const tocAndSections = parts.slice(2);
    for (const part of tocAndSections) {
      if (part.includes('transition:')) {
        expect(part).toContain('transition: fade');
        expect(part).not.toContain('transition: slide-left');
      }
    }
  });

  it('should generate two-cols layout for section type two-cols', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Comparison', type: 'two-cols' }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('layout: two-cols');
    expect(slides).toContain('# Comparison');
  });

  it('should generate image-right layout for section type image-right', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Visual', type: 'image-right' }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('layout: image-right');
    expect(slides).toContain('# Visual');
  });

  it('should generate quote layout for section type quote', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Citation', type: 'quote' }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('# Citation');
    expect(slides).toContain('> ');
  });

  it('should generate default layout for section type default', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Normal', type: 'default' }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('# Normal');
    expect(slides).not.toContain('layout: two-cols');
    expect(slides).not.toContain('layout: image-right');
  });

  it('should include presenter notes in section slides', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Intro', 'Demo'],
    });
    const slides = generateSlides(config);
    const parts = slides.split('\n---\n');
    // Filter parts that contain section headings (not toc, not frontmatter)
    const sectionParts = parts.filter((p) => p.includes('# Intro') || p.includes('# Demo'));
    expect(sectionParts).toHaveLength(2);
    for (const part of sectionParts) {
      expect(part).toContain('<!--');
      expect(part).toContain('Notes');
    }
  });

  it('should generate qna slide with centered layout', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Q&A', type: 'qna' }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('layout: center');
    expect(slides).toContain('Q&A');
  });

  it('should generate thanks slide', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Merci', type: 'thanks' }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('layout: center');
    expect(slides).toContain('Merci');
  });

  it('should include GitHub link in thanks slide when github is set', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      github: 'janedoe',
      sections: [{ name: 'Merci', type: 'thanks' }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('janedoe');
  });

  it('should generate about slide with placeholder', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'A propos', type: 'about' }],
    });
    const slides = generateSlides(config);
    expect(slides).toContain('A propos');
    expect(slides).toContain('Me');
  });

  it('should not contain hardcoded slide-left when transition is fade', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      transition: 'fade',
    });
    const slides = generateSlides(config);
    // The frontmatter should have "transition: fade"
    // No slide should have "transition: slide-left"
    const lines = slides.split('\n');
    const transitionLines = lines.filter((l) => l.trim().startsWith('transition:'));
    for (const line of transitionLines) {
      expect(line.trim()).toBe('transition: fade');
    }
  });
});
