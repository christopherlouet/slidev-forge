import { describe, it, expect } from 'vitest';
import { generateMultiFile } from '../../src/templates/multi-file.js';
import { mergeDefaults } from '../../src/config.js';

describe('generateMultiFile', () => {
  it('should generate main slides.md with src imports', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [
        { name: 'Introduction', type: 'default' },
        { name: 'Demo', type: 'code' },
      ],
    });

    const result = generateMultiFile(config);
    expect(result.slidesMain).toContain('theme: seriph');
    expect(result.slidesMain).toContain('title: Test');
    expect(result.slidesMain).toContain('src: ./pages/01-toc.md');
    expect(result.slidesMain).toContain('src: ./pages/02-introduction.md');
    expect(result.slidesMain).toContain('src: ./pages/03-demo.md');
  });

  it('should generate individual page files', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [
        { name: 'Introduction', type: 'default' },
        { name: 'Q&A', type: 'qna' },
      ],
    });

    const result = generateMultiFile(config);
    expect(result.pages).toHaveLength(3); // TOC + 2 sections
    expect(result.pages[0].path).toBe('pages/01-toc.md');
    expect(result.pages[1].path).toBe('pages/02-introduction.md');
    expect(result.pages[2].path).toBe('pages/03-q-a.md');
  });

  it('should include TOC page with proper content', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Intro', type: 'default' }],
    });

    const result = generateMultiFile(config);
    const tocPage = result.pages[0];
    expect(tocPage.content).toContain('Sommaire');
    expect(tocPage.content).toContain('<Toc');
  });

  it('should include section title in page content', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'My Section', type: 'default' }],
    });

    const result = generateMultiFile(config);
    const sectionPage = result.pages[1];
    expect(sectionPage.content).toContain('# My Section');
  });

  it('should include title slide inline in slides.md', () => {
    const config = mergeDefaults({
      title: 'My Talk',
      author: 'Me',
      sections: [{ name: 'Intro', type: 'default' }],
    });

    const result = generateMultiFile(config);
    expect(result.slidesMain).toContain('# My Talk');
  });

  it('should handle cover layout in page', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Cover Slide', type: 'cover' }],
    });

    const result = generateMultiFile(config);
    const coverPage = result.pages[1];
    expect(coverPage.content).toContain('layout: cover');
  });

  it('should use center layout for qna type', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Questions', type: 'qna' }],
    });

    const result = generateMultiFile(config);
    const qnaPage = result.pages[1];
    expect(qnaPage.content).toContain('layout: center');
  });

  it('should use two-cols layout for two-cols type', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      sections: [{ name: 'Comparison', type: 'two-cols' }],
    });

    const result = generateMultiFile(config);
    const page = result.pages[1];
    expect(page.content).toContain('layout: two-cols');
  });

  it('should work with EN language', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      language: 'en',
      sections: [{ name: 'Intro', type: 'default' }],
    });

    const result = generateMultiFile(config);
    const tocPage = result.pages[0];
    expect(tocPage.content).toContain('Table of Contents');
  });

  it('should include frontmatter options in main file', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Me',
      slide_numbers: true,
      line_numbers: true,
      sections: [{ name: 'Intro', type: 'default' }],
    });

    const result = generateMultiFile(config);
    expect(result.slidesMain).toContain('slideNumber: true');
    expect(result.slidesMain).toContain('lineNumbers: true');
  });
});
