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

  describe('section types coverage', () => {
    it('should generate steps section with default items', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Steps', type: 'steps' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('<v-clicks>');
      expect(page.content).toContain('</v-clicks>');
    });

    it('should generate steps section with custom items', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Steps', type: 'steps', items: ['A', 'B', 'C'] }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('- A');
      expect(page.content).toContain('- B');
      expect(page.content).toContain('- C');
    });

    it('should generate fact section with defaults', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Stats', type: 'fact' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('layout: center');
      expect(page.content).toContain('text-8xl');
    });

    it('should generate fact section with custom value and description', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Results', type: 'fact', value: '99%', description: 'uptime' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('99%');
      expect(page.content).toContain('uptime');
    });

    it('should generate image-right section', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Visual', type: 'image-right' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('layout: image-right');
      expect(page.content).toContain('image: https://cover.sli.dev');
    });

    it('should generate quote section', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Citation', type: 'quote' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('> ');
    });

    it('should generate thanks section with author', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Chris',
        sections: [{ name: 'Thanks', type: 'thanks' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('Chris');
      expect(page.content).toContain('layout: center');
    });

    it('should generate thanks section with github link', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Chris',
        github: 'chrisuser',
        sections: [{ name: 'Thanks', type: 'thanks' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('github.com/chrisuser');
    });

    it('should generate about section', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Chris',
        sections: [{ name: 'About', type: 'about' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('**Chris**');
    });

    it('should generate code section with custom lang', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Code', type: 'code', lang: 'python' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('```python');
    });

    it('should generate diagram section with custom type', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Arch', type: 'diagram', diagram: 'sequenceDiagram' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('```mermaid');
      expect(page.content).toContain('sequenceDiagram');
    });

    it('should generate iframe section with valid URL', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Demo', type: 'iframe', url: 'https://codepen.io/test' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('<iframe');
      expect(page.content).toContain('https://codepen.io/test');
    });

    it('should reject javascript: URL in iframe section', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Demo', type: 'iframe', url: 'javascript:alert(1)' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).not.toContain('javascript:');
    });

    it('should generate cover section with custom image', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [{ name: 'Chapter', type: 'cover', image: 'https://example.com/bg.jpg' }],
      });
      const result = generateMultiFile(config);
      const page = result.pages[1];
      expect(page.content).toContain('layout: cover');
      expect(page.content).toContain('background: https://example.com/bg.jpg');
    });
  });

  describe('frontmatter options', () => {
    it('should include aspect_ratio when configured', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        aspect_ratio: '4/3',
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain("aspectRatio: '4/3'");
    });

    it('should include colorSchema when configured', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        color_schema: 'dark',
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain('colorSchema: dark');
    });

    it('should include favicon when configured', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        favicon: 'logo.png',
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain('favicon: logo.png');
    });

    it('should include download when configured', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        download: true,
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain('download: true');
    });

    it('should include htmlAttrs with language', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        language: 'en',
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain('htmlAttrs:');
      expect(result.slidesMain).toContain('  lang: en');
    });

    it('should include fonts when configured', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        fonts: { sans: 'Inter' },
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain('fonts:');
      expect(result.slidesMain).toContain('  sans: Inter');
    });

    it('should include addons when configured', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        addons: ['slidev-addon-qrcode'],
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain('addons:');
      expect(result.slidesMain).toContain('  - slidev-addon-qrcode');
    });

    it('should include subtitle in title slide', () => {
      const config = mergeDefaults({
        title: 'My Talk',
        author: 'Me',
        subtitle: 'A great topic',
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain('A great topic');
    });

    it('should include event_name in title slide', () => {
      const config = mergeDefaults({
        title: 'My Talk',
        author: 'Me',
        event_name: 'DevFest 2026',
        sections: [{ name: 'Intro', type: 'default' }],
      });
      const result = generateMultiFile(config);
      expect(result.slidesMain).toContain('# DevFest 2026');
    });
  });
});
