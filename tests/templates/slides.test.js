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

  describe('v1.3 frontmatter fields', () => {
    it('should include fonts block when fonts is configured', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        fonts: { sans: 'Inter', mono: 'Fira Code' },
      });
      const slides = generateSlides(config);
      expect(slides).toContain('fonts:');
      expect(slides).toContain('  sans: Inter');
      expect(slides).toContain('  mono: Fira Code');
    });

    it('should include partial fonts when only mono is specified', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        fonts: { mono: 'JetBrains Mono' },
      });
      const slides = generateSlides(config);
      expect(slides).toContain('fonts:');
      expect(slides).toContain('  mono: JetBrains Mono');
      expect(slides).not.toContain('  sans:');
    });

    it('should not include fonts block when fonts is not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const slides = generateSlides(config);
      expect(slides).not.toContain('fonts:');
    });

    it('should include lineNumbers when line_numbers is true', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', line_numbers: true });
      const slides = generateSlides(config);
      expect(slides).toContain('lineNumbers: true');
    });

    it('should not include lineNumbers when line_numbers is not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const slides = generateSlides(config);
      expect(slides).not.toContain('lineNumbers');
    });

    it('should include aspectRatio when aspect_ratio is configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', aspect_ratio: '4/3' });
      const slides = generateSlides(config);
      expect(slides).toContain("aspectRatio: '4/3'");
    });

    it('should not include aspectRatio when aspect_ratio is not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const slides = generateSlides(config);
      expect(slides).not.toContain('aspectRatio');
    });

    it('should include colorSchema when color_schema is configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', color_schema: 'dark' });
      const slides = generateSlides(config);
      expect(slides).toContain('colorSchema: dark');
    });

    it('should not include colorSchema when color_schema is not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const slides = generateSlides(config);
      expect(slides).not.toContain('colorSchema');
    });

    it('should include favicon when configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', favicon: 'logo.png' });
      const slides = generateSlides(config);
      expect(slides).toContain('favicon: logo.png');
    });

    it('should not include favicon when not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const slides = generateSlides(config);
      expect(slides).not.toContain('favicon');
    });

    it('should include download when configured as true', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', download: true });
      const slides = generateSlides(config);
      expect(slides).toContain('download: true');
    });

    it('should not include download when not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const slides = generateSlides(config);
      expect(slides).not.toContain('download');
    });

    it('should include addons block when addons is a non-empty array', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        addons: ['slidev-addon-qrcode', 'slidev-addon-excalidraw'],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('addons:');
      expect(slides).toContain('  - slidev-addon-qrcode');
      expect(slides).toContain('  - slidev-addon-excalidraw');
    });

    it('should not include addons block when addons is empty', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', addons: [] });
      const slides = generateSlides(config);
      expect(slides).not.toContain('addons:');
    });

    it('should not include addons block when not configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const slides = generateSlides(config);
      expect(slides).not.toContain('addons:');
    });

    it('should include htmlAttrs with lang when language is configured', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', language: 'en' });
      const slides = generateSlides(config);
      expect(slides).toContain('htmlAttrs:');
      expect(slides).toContain('  lang: en');
    });

    it('should include htmlAttrs with lang fr by default', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me' });
      const slides = generateSlides(config);
      expect(slides).toContain('htmlAttrs:');
      expect(slides).toContain('  lang: fr');
    });

    it('should include all v1.3 fields in correct order when all specified', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        fonts: { sans: 'Inter' },
        line_numbers: true,
        aspect_ratio: '4/3',
        color_schema: 'dark',
        favicon: 'logo.png',
        download: true,
        addons: ['slidev-addon-qrcode'],
        language: 'en',
      });
      const slides = generateSlides(config);
      // All fields should be present
      expect(slides).toContain('lineNumbers: true');
      expect(slides).toContain("aspectRatio: '4/3'");
      expect(slides).toContain('colorSchema: dark');
      expect(slides).toContain('favicon: logo.png');
      expect(slides).toContain('download: true');
      expect(slides).toContain('htmlAttrs:');
      expect(slides).toContain('fonts:');
      expect(slides).toContain('addons:');
    });
  });

  describe('v1.3 i18n in slides', () => {
    it('should show "Sommaire" in TOC slide when language is fr', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', language: 'fr' });
      const slides = generateSlides(config);
      expect(slides).toContain('# Sommaire');
    });

    it('should show "Table of Contents" in TOC slide when language is en', () => {
      const config = mergeDefaults({ title: 'Test', author: 'Me', language: 'en' });
      const slides = generateSlides(config);
      expect(slides).toContain('# Table of Contents');
    });

    it('should use English comments in section slides when language is en', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        language: 'en',
        sections: [{ name: 'Intro', type: 'two-cols' }],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('Left column');
      expect(slides).toContain('Right column');
    });

    it('should use French comments in section slides when language is fr', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        language: 'fr',
        sections: [{ name: 'Intro', type: 'two-cols' }],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('Colonne gauche');
      expect(slides).toContain('Colonne droite');
    });

    it('should translate image-right comments', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        language: 'en',
        sections: [{ name: 'Visual', type: 'image-right' }],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('Content to the left of the image');
    });

    it('should translate quote section comments', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        language: 'en',
        sections: [{ name: 'Citation', type: 'quote' }],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('Replace this quote');
      expect(slides).toContain('Author');
    });

    it('should translate about section comments', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        language: 'en',
        sections: [{ name: 'About', type: 'about' }],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('Add your bio here');
    });

    it('should translate section notes', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        language: 'en',
        sections: ['Intro'],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('Notes for section');
    });
  });

  describe('v1.4 section types', () => {
    describe('code section', () => {
      it('should generate a code block with default language javascript', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Demo', type: 'code' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('# Demo');
        expect(slides).toContain('```javascript');
      });

      it('should use specified lang attribute', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'API', type: 'code', lang: 'typescript' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('```typescript');
      });

      it('should include line numbers marker', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Code', type: 'code' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('{lines:true}');
      });

      it('should include placeholder comment', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Code', type: 'code' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('// Votre code ici');
      });

      it('should use English placeholder when language is en', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          language: 'en',
          sections: [{ name: 'Code', type: 'code' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('// Your code here');
      });
    });

    describe('diagram section', () => {
      it('should generate a mermaid block with default flowchart', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Architecture', type: 'diagram' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('# Architecture');
        expect(slides).toContain('```mermaid');
        expect(slides).toContain('flowchart TD');
      });

      it('should use specified diagram type', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Flux', type: 'diagram', diagram: 'sequenceDiagram' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('sequenceDiagram');
      });

      it('should include default diagram content', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Arch', type: 'diagram' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('A[Start]');
        expect(slides).toContain('B[End]');
      });
    });

    describe('cover section', () => {
      it('should generate a cover layout with default image', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Chapter 2', type: 'cover' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('layout: cover');
        expect(slides).toContain('background: https://cover.sli.dev');
        expect(slides).toContain('# Chapter 2');
      });

      it('should use specified image', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Chapter', type: 'cover', image: 'https://example.com/bg.jpg' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('background: https://example.com/bg.jpg');
      });
    });

    describe('iframe section', () => {
      it('should generate an iframe with specified URL', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Demo', type: 'iframe', url: 'https://codepen.io/example' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('# Demo');
        expect(slides).toContain('<iframe');
        expect(slides).toContain('https://codepen.io/example');
      });

      it('should generate placeholder comment when no URL', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Demo', type: 'iframe' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('# Demo');
        expect(slides).toContain('<!--');
      });

      it('should use English placeholder when language is en and no URL', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          language: 'en',
          sections: [{ name: 'Demo', type: 'iframe' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('Add your embedded content URL here');
      });
    });

    describe('steps section', () => {
      it('should generate v-clicks list with default items', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Avantages', type: 'steps' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('# Avantages');
        expect(slides).toContain('<v-clicks>');
        expect(slides).toContain('</v-clicks>');
      });

      it('should use specified items', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Steps', type: 'steps', items: ['Point A', 'Point B', 'Point C'] }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('- Point A');
        expect(slides).toContain('- Point B');
        expect(slides).toContain('- Point C');
      });

      it('should generate default items with translated step label', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          language: 'fr',
          sections: [{ name: 'Steps', type: 'steps' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('Étape 1');
        expect(slides).toContain('Étape 2');
        expect(slides).toContain('Étape 3');
      });

      it('should use English default items when language is en', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          language: 'en',
          sections: [{ name: 'Steps', type: 'steps' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('Step 1');
        expect(slides).toContain('Step 2');
        expect(slides).toContain('Step 3');
      });
    });

    describe('fact section', () => {
      it('should generate centered layout with default values', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Performance', type: 'fact' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('layout: center');
        expect(slides).toContain('# Performance');
        expect(slides).toContain('text-8xl');
        expect(slides).toContain('10x');
      });

      it('should use specified value and description', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Results', type: 'fact', value: '99.9%', description: 'uptime' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('99.9%');
        expect(slides).toContain('uptime');
      });

      it('should use default description translated', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          language: 'en',
          sections: [{ name: 'Stats', type: 'fact' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('faster');
      });
    });

    describe('v1.6 social links', () => {
      it('should include social links on title slide when social is configured', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          social: { twitter: 'myuser', linkedin: 'myprofile' },
        });
        const slides = generateSlides(config);
        expect(slides).toContain('carbon-logo-twitter');
        expect(slides).toContain('twitter.com/myuser');
        expect(slides).toContain('carbon-logo-linkedin');
        expect(slides).toContain('linkedin.com/in/myprofile');
      });

      it('should not include social links when social is not configured', () => {
        const config = mergeDefaults({ title: 'Test', author: 'Me' });
        const slides = generateSlides(config);
        expect(slides).not.toContain('carbon-logo-twitter');
      });

      it('should include social links on thanks slide', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          social: { github: 'myuser' },
          sections: [{ name: 'Merci', type: 'thanks' }],
        });
        const slides = generateSlides(config);
        const parts = slides.split('\n---\n');
        const thanksSlide = parts.find((p) => p.includes('# Merci'));
        expect(thanksSlide).toContain('carbon-logo-github');
      });

      it('should support website with full URL', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          social: { website: 'https://example.com' },
        });
        const slides = generateSlides(config);
        expect(slides).toContain('https://example.com');
        expect(slides).toContain('carbon-link');
      });

      it('should support email', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          social: { email: 'user@example.com' },
        });
        const slides = generateSlides(config);
        expect(slides).toContain('mailto:user@example.com');
        expect(slides).toContain('carbon-email');
      });
    });

    describe('v1.6 slideNumber', () => {
      it('should include slideNumber in frontmatter when configured', () => {
        const config = mergeDefaults({ title: 'Test', author: 'Me', slide_numbers: true });
        const slides = generateSlides(config);
        expect(slides).toContain('slideNumber: true');
      });

      it('should not include slideNumber when not configured', () => {
        const config = mergeDefaults({ title: 'Test', author: 'Me' });
        const slides = generateSlides(config);
        expect(slides).not.toContain('slideNumber');
      });
    });

    describe('v1.4 mixed with existing types', () => {
      it('should generate all v1.4 types alongside existing types', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [
            { name: 'Intro', type: 'default' },
            { name: 'Code', type: 'code', lang: 'python' },
            { name: 'Arch', type: 'diagram' },
            { name: 'Cover', type: 'cover' },
            { name: 'Live', type: 'iframe', url: 'https://example.com' },
            { name: 'Steps', type: 'steps', items: ['A', 'B'] },
            { name: 'Fact', type: 'fact', value: '42', description: 'the answer' },
            { name: 'Q&A', type: 'qna' },
          ],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('# Intro');
        expect(slides).toContain('```python');
        expect(slides).toContain('```mermaid');
        expect(slides).toContain('layout: cover');
        expect(slides).toContain('<iframe');
        expect(slides).toContain('<v-clicks>');
        expect(slides).toContain('text-8xl');
        expect(slides).toContain('Q&A');
      });
    });
  });

  describe('section markers', () => {
    it('should include __title__ marker in title slide', () => {
      const slides = generateSlides(minimalConfig);
      expect(slides).toContain('<!-- section:id=__title__ -->');
    });

    it('should include __toc__ marker in toc slide', () => {
      const slides = generateSlides(minimalConfig);
      expect(slides).toContain('<!-- section:id=__toc__ -->');
    });

    it('should include slugified markers for each section', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: ['Introduction', 'Demo', 'Références'],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('<!-- section:id=introduction -->');
      expect(slides).toContain('<!-- section:id=demo -->');
      expect(slides).toContain('<!-- section:id=references -->');
    });

    it('should deduplicate markers for sections with same name', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: ['Topic', 'Topic', 'Topic'],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('<!-- section:id=topic -->');
      expect(slides).toContain('<!-- section:id=topic-2 -->');
      expect(slides).toContain('<!-- section:id=topic-3 -->');
    });

    it('should include markers for all section types', () => {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Me',
        sections: [
          { name: 'Default', type: 'default' },
          { name: 'Two Cols', type: 'two-cols' },
          { name: 'Code', type: 'code' },
          { name: 'Quote', type: 'quote' },
          { name: 'Thanks', type: 'thanks' },
        ],
      });
      const slides = generateSlides(config);
      expect(slides).toContain('<!-- section:id=default -->');
      expect(slides).toContain('<!-- section:id=two-cols -->');
      expect(slides).toContain('<!-- section:id=code -->');
      expect(slides).toContain('<!-- section:id=quote -->');
      expect(slides).toContain('<!-- section:id=thanks -->');
    });
  });

  describe('input validation security', () => {
    describe('social links', () => {
      it('should escape special characters in social handles', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          social: { twitter: '" onmouseover="alert(1)' },
        });
        const slides = generateSlides(config);
        expect(slides).not.toContain('" onmouseover=');
        expect(slides).toContain('&quot;');
      });

      it('should escape angle brackets in social handles', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          social: { twitter: '<script>alert(1)</script>' },
        });
        const slides = generateSlides(config);
        expect(slides).not.toContain('<script>alert(1)</script>');
      });
    });

    describe('iframe section', () => {
      it('should reject javascript: URLs in iframe', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Demo', type: 'iframe', url: 'javascript:alert(1)' }],
        });
        const slides = generateSlides(config);
        expect(slides).not.toContain('javascript:alert(1)');
      });

      it('should reject data: URLs in iframe', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Demo', type: 'iframe', url: 'data:text/html,<h1>hi</h1>' }],
        });
        const slides = generateSlides(config);
        expect(slides).not.toContain('data:text/html');
      });

      it('should accept valid https URL in iframe', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Demo', type: 'iframe', url: 'https://codepen.io/example' }],
        });
        const slides = generateSlides(config);
        expect(slides).toContain('https://codepen.io/example');
      });
    });

    describe('fact section', () => {
      it('should escape HTML in fact value', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Stat', type: 'fact', value: '<script>alert(1)</script>' }],
        });
        const slides = generateSlides(config);
        expect(slides).not.toContain('<script>alert(1)</script>');
        expect(slides).toContain('&lt;script&gt;');
      });

      it('should escape HTML in fact description', () => {
        const config = mergeDefaults({
          title: 'Test',
          author: 'Me',
          sections: [{ name: 'Stat', type: 'fact', description: '<img onerror="alert(1)">' }],
        });
        const slides = generateSlides(config);
        expect(slides).not.toContain('<img onerror=');
      });
    });
  });
});
