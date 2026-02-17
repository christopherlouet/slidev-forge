import { describe, it, expect } from 'vitest';
import { computeDiff, mergeSlides } from '../src/merger.js';
import { parseSlides } from '../src/parser.js';
import { mergeDefaults } from '../src/config.js';
import { generateSlides } from '../src/templates/slides.js';

describe('computeDiff', () => {
  it('should return keep actions when YAML matches slides', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction', 'Demo'],
    });
    const slides = parseSlides(generateSlides(config));
    const diff = computeDiff(config.sections, slides);
    const keeps = diff.filter((a) => a.type === 'keep');
    expect(keeps).toHaveLength(2);
  });

  it('should detect added sections', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction', 'Demo'],
    });
    const slides = parseSlides(generateSlides(config));
    // Now add a section to config
    const newSections = [...config.sections, { name: 'Conclusion', type: 'default' }];
    const diff = computeDiff(newSections, slides);
    const adds = diff.filter((a) => a.type === 'add');
    expect(adds).toHaveLength(1);
    expect(adds[0].sectionName).toBe('Conclusion');
  });

  it('should detect removed sections', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction', 'Demo', 'Conclusion'],
    });
    const slides = parseSlides(generateSlides(config));
    // Remove a section from YAML
    const reducedSections = [config.sections[0], config.sections[2]];
    const diff = computeDiff(reducedSections, slides);
    const removes = diff.filter((a) => a.type === 'remove');
    expect(removes).toHaveLength(1);
    expect(removes[0].sectionName).toBe('Demo');
  });

  it('should return update-meta for frontmatter changes', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction'],
    });
    const slides = parseSlides(generateSlides(config));
    const diff = computeDiff(config.sections, slides);
    const meta = diff.filter((a) => a.type === 'update-meta');
    expect(meta).toHaveLength(1);
  });

  it('should handle empty sections array', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction'],
    });
    const slides = parseSlides(generateSlides(config));
    const diff = computeDiff([], slides);
    const removes = diff.filter((a) => a.type === 'remove');
    expect(removes.length).toBeGreaterThanOrEqual(1);
  });
});

describe('mergeSlides', () => {
  it('should regenerate frontmatter from config', () => {
    const config = mergeDefaults({
      title: 'Old Title',
      author: 'Me',
      sections: ['Intro'],
    });
    const originalSlides = generateSlides(config);
    const parsed = parseSlides(originalSlides);
    // Change title in config
    const newConfig = mergeDefaults({
      title: 'New Title',
      author: 'Me',
      sections: ['Intro'],
    });
    const result = mergeSlides(newConfig, parsed);
    expect(result).toContain('title: New Title');
    expect(result).not.toContain('title: Old Title');
  });

  it('should preserve user-modified content in existing sections', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction'],
    });
    const originalSlides = generateSlides(config);
    // Simulate user editing the intro section
    const editedSlides = originalSlides.replace(
      /# Introduction\n\n.*?(?=\n\n<!--)/s,
      '# Introduction\n\nMy custom content that I wrote manually',
    );
    const parsed = parseSlides(editedSlides);
    const result = mergeSlides(config, parsed);
    expect(result).toContain('My custom content that I wrote manually');
  });

  it('should add new sections from YAML', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction'],
    });
    const originalSlides = generateSlides(config);
    const parsed = parseSlides(originalSlides);
    // Add a section to config
    const newConfig = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction', 'Demo'],
    });
    const result = mergeSlides(newConfig, parsed);
    expect(result).toContain('<!-- section:id=introduction -->');
    expect(result).toContain('<!-- section:id=demo -->');
  });

  it('should remove sections deleted from YAML', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction', 'Demo', 'Conclusion'],
    });
    const originalSlides = generateSlides(config);
    const parsed = parseSlides(originalSlides);
    // Remove Demo from YAML
    const newConfig = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction', 'Conclusion'],
    });
    const result = mergeSlides(newConfig, parsed);
    expect(result).toContain('<!-- section:id=introduction -->');
    expect(result).toContain('<!-- section:id=conclusion -->');
    expect(result).not.toContain('<!-- section:id=demo -->');
  });

  it('should preserve manual sections (without markers)', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction'],
    });
    const originalSlides = generateSlides(config);
    // Inject a manual section between title and intro
    const parts = originalSlides.split('\n---\n');
    // parts: [frontmatter, title, toc, intro]
    // Insert manual section after toc
    const manualSection = '\n# My Manual Slide\n\nCustom content\n';
    parts.splice(3, 0, manualSection);
    const editedSlides = parts.join('\n---\n');
    const parsed = parseSlides(editedSlides);
    const result = mergeSlides(config, parsed);
    expect(result).toContain('My Manual Slide');
    expect(result).toContain('Custom content');
  });

  it('should reorder sections to match YAML order', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction', 'Demo', 'Conclusion'],
    });
    const originalSlides = generateSlides(config);
    const parsed = parseSlides(originalSlides);
    // Reverse the order in YAML
    const newConfig = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Conclusion', 'Demo', 'Introduction'],
    });
    const result = mergeSlides(newConfig, parsed);
    const conclusionPos = result.indexOf('<!-- section:id=conclusion -->');
    const demoPos = result.indexOf('<!-- section:id=demo -->');
    const introPos = result.indexOf('<!-- section:id=introduction -->');
    expect(conclusionPos).toBeLessThan(demoPos);
    expect(demoPos).toBeLessThan(introPos);
  });

  it('should produce valid slidev markdown (starts with --- frontmatter)', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Intro'],
    });
    const originalSlides = generateSlides(config);
    const parsed = parseSlides(originalSlides);
    const result = mergeSlides(config, parsed);
    expect(result.trimStart().startsWith('---')).toBe(true);
  });

  it('should handle no changes gracefully', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: ['Introduction', 'Demo'],
    });
    const originalSlides = generateSlides(config);
    const parsed = parseSlides(originalSlides);
    const result = mergeSlides(config, parsed);
    // Should produce valid output
    expect(result).toContain('<!-- section:id=introduction -->');
    expect(result).toContain('<!-- section:id=demo -->');
    expect(result).toContain('title: Test');
  });
});
