import { describe, it, expect } from 'vitest';
import { parseSlides, extractMarkerId } from '../src/parser.js';

describe('extractMarkerId', () => {
  it('should extract id from a valid section marker', () => {
    expect(extractMarkerId('<!-- section:id=introduction -->')).toBe('introduction');
  });

  it('should extract id with hyphens and numbers', () => {
    expect(extractMarkerId('<!-- section:id=my-section-2 -->')).toBe('my-section-2');
  });

  it('should extract special __title__ marker', () => {
    expect(extractMarkerId('<!-- section:id=__title__ -->')).toBe('__title__');
  });

  it('should extract special __toc__ marker', () => {
    expect(extractMarkerId('<!-- section:id=__toc__ -->')).toBe('__toc__');
  });

  it('should return null when no marker is present', () => {
    expect(extractMarkerId('# Just a heading')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(extractMarkerId('')).toBeNull();
  });

  it('should return null for regular HTML comments', () => {
    expect(extractMarkerId('<!-- This is a comment -->')).toBeNull();
  });

  it('should extract marker even with surrounding content', () => {
    const content = 'some text\n<!-- section:id=demo -->\nmore text';
    expect(extractMarkerId(content)).toBe('demo');
  });
});

describe('parseSlides', () => {
  it('should parse a minimal slides.md with frontmatter only', () => {
    const content = '---\ntheme: seriph\ntitle: Test\n---\n\n# Test\n';
    const slides = parseSlides(content);
    expect(slides.length).toBeGreaterThanOrEqual(1);
    expect(slides[0].isFrontmatter).toBe(true);
  });

  it('should separate slides by --- delimiter', () => {
    const content = [
      '---',
      'theme: seriph',
      '---',
      '',
      '# Title',
      '---',
      '',
      '# Slide 2',
      '---',
      '',
      '# Slide 3',
    ].join('\n');
    const slides = parseSlides(content);
    // frontmatter + title + slide2 + slide3 = 4
    expect(slides).toHaveLength(4);
  });

  it('should mark the first section as frontmatter', () => {
    const content = '---\ntheme: seriph\ntitle: Test\n---\n\n# Title';
    const slides = parseSlides(content);
    expect(slides[0].isFrontmatter).toBe(true);
    expect(slides[0].rawContent).toContain('theme: seriph');
  });

  it('should not mark subsequent sections as frontmatter', () => {
    const content = '---\ntheme: seriph\n---\n\n# Title\n---\n\n# Section';
    const slides = parseSlides(content);
    for (let i = 1; i < slides.length; i++) {
      expect(slides[i].isFrontmatter).toBe(false);
    }
  });

  it('should extract section marker ids', () => {
    const content = [
      '---',
      'theme: seriph',
      '---',
      '<!-- section:id=__title__ -->',
      '',
      '# My Talk',
      '---',
      '<!-- section:id=intro -->',
      '',
      '# Introduction',
    ].join('\n');
    const slides = parseSlides(content);
    expect(slides[1].id).toBe('__title__');
    expect(slides[2].id).toBe('intro');
  });

  it('should set id to null for sections without markers', () => {
    const content = '---\ntheme: seriph\n---\n\n# Title\n---\n\n# No marker here';
    const slides = parseSlides(content);
    const nonFrontmatter = slides.filter((s) => !s.isFrontmatter);
    for (const slide of nonFrontmatter) {
      expect(slide.id).toBeNull();
    }
  });

  it('should not split on --- inside fenced code blocks', () => {
    const content = [
      '---',
      'theme: seriph',
      '---',
      '',
      '# Code slide',
      '',
      '```yaml',
      '---',
      'key: value',
      '---',
      '```',
      '---',
      '',
      '# Next slide',
    ].join('\n');
    const slides = parseSlides(content);
    // frontmatter + code slide + next slide = 3
    expect(slides).toHaveLength(3);
    expect(slides[1].rawContent).toContain('```yaml');
    expect(slides[1].rawContent).toContain('key: value');
  });

  it('should handle empty content', () => {
    const slides = parseSlides('');
    expect(slides).toHaveLength(0);
  });

  it('should handle content with no separators', () => {
    const slides = parseSlides('# Just a heading\n\nSome content');
    expect(slides).toHaveLength(1);
    expect(slides[0].isFrontmatter).toBe(false);
  });

  it('should preserve raw content including sub-frontmatter', () => {
    const content = [
      '---',
      'theme: seriph',
      '---',
      '<!-- section:id=__title__ -->',
      '',
      '# Title',
      '---',
      'transition: fade',
      'layout: center',
      '---',
      '<!-- section:id=intro -->',
      '',
      '# Introduction',
      '',
      'Custom content here',
    ].join('\n');
    const slides = parseSlides(content);
    expect(slides[2].rawContent).toContain('transition: fade');
    expect(slides[2].rawContent).toContain('Custom content here');
    expect(slides[2].id).toBe('intro');
  });

  it('should handle slides with presenter notes', () => {
    const content = [
      '---',
      'theme: seriph',
      '---',
      '<!-- section:id=demo -->',
      '',
      '# Demo',
      '',
      'Content',
      '',
      '<!--',
      'Speaker notes here',
      '-->',
    ].join('\n');
    const slides = parseSlides(content);
    expect(slides[1].id).toBe('demo');
    expect(slides[1].rawContent).toContain('Speaker notes here');
  });

  it('should not split on --- inside backtick code blocks with different languages', () => {
    const content = [
      '---',
      'theme: seriph',
      '---',
      '',
      '# Code',
      '',
      '```markdown',
      '---',
      'title: nested',
      '---',
      '',
      '# Nested heading',
      '```',
    ].join('\n');
    const slides = parseSlides(content);
    // frontmatter + code slide = 2
    expect(slides).toHaveLength(2);
  });

  it('should handle triple backtick code blocks with tildes', () => {
    const content = [
      '---',
      'theme: seriph',
      '---',
      '',
      '# Code',
      '',
      '~~~',
      '---',
      'inside tilde block',
      '---',
      '~~~',
    ].join('\n');
    const slides = parseSlides(content);
    expect(slides).toHaveLength(2);
  });
});
