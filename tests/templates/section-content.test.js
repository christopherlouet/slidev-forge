import { describe, it, expect } from 'vitest';
import { generateSectionContent, generateSectionNotes, SOCIAL_PLATFORMS, generateSocialLinks } from '../../src/templates/section-content.js';
import { mergeDefaults } from '../../src/config.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

describe('generateSectionContent', () => {
  describe('return structure', () => {
    it('should return an object with frontmatter and body arrays', () => {
      const config = makeConfig();
      const section = { name: 'Intro', type: 'default' };
      const result = generateSectionContent(section, config, 'intro');
      expect(result).toHaveProperty('frontmatter');
      expect(result).toHaveProperty('body');
      expect(Array.isArray(result.frontmatter)).toBe(true);
      expect(Array.isArray(result.body)).toBe(true);
    });
  });

  describe('frontmatter generation', () => {
    it('should include transition in frontmatter for all types', () => {
      const config = makeConfig({ transition: 'fade' });
      const section = { name: 'Intro', type: 'default' };
      const result = generateSectionContent(section, config, 'intro');
      expect(result.frontmatter).toContain('transition: fade');
    });

    it('should include layout: two-cols for two-cols type', () => {
      const config = makeConfig();
      const section = { name: 'Compare', type: 'two-cols' };
      const result = generateSectionContent(section, config, 'compare');
      expect(result.frontmatter).toContain('layout: two-cols');
    });

    it('should include layout: image-right for image-right type', () => {
      const config = makeConfig();
      const section = { name: 'Visual', type: 'image-right' };
      const result = generateSectionContent(section, config, 'visual');
      expect(result.frontmatter).toContain('layout: image-right');
      expect(result.frontmatter.some(l => l.startsWith('image:'))).toBe(true);
    });

    it('should include layout: center for qna type', () => {
      const config = makeConfig();
      const section = { name: 'Q&A', type: 'qna' };
      const result = generateSectionContent(section, config, 'qna');
      expect(result.frontmatter).toContain('layout: center');
    });

    it('should include layout: center for thanks type', () => {
      const config = makeConfig();
      const section = { name: 'Thanks', type: 'thanks' };
      const result = generateSectionContent(section, config, 'thanks');
      expect(result.frontmatter).toContain('layout: center');
    });

    it('should include layout: cover and background for cover type', () => {
      const config = makeConfig();
      const section = { name: 'Chapter', type: 'cover', image: 'https://example.com/bg.jpg' };
      const result = generateSectionContent(section, config, 'chapter');
      expect(result.frontmatter).toContain('layout: cover');
      expect(result.frontmatter).toContain('background: https://example.com/bg.jpg');
    });

    it('should include layout: center for fact type', () => {
      const config = makeConfig();
      const section = { name: 'Stats', type: 'fact', value: '99%', description: 'uptime' };
      const result = generateSectionContent(section, config, 'stats');
      expect(result.frontmatter).toContain('layout: center');
    });

    it('should have no layout for default type', () => {
      const config = makeConfig();
      const section = { name: 'Intro', type: 'default' };
      const result = generateSectionContent(section, config, 'intro');
      expect(result.frontmatter.some(l => l.startsWith('layout:'))).toBe(false);
    });
  });

  describe('body generation - default type', () => {
    it('should include section marker', () => {
      const config = makeConfig();
      const section = { name: 'Intro', type: 'default' };
      const result = generateSectionContent(section, config, 'intro');
      expect(result.body).toContain('<!-- section:id=intro -->');
    });

    it('should include section title as heading', () => {
      const config = makeConfig();
      const section = { name: 'Introduction', type: 'default' };
      const result = generateSectionContent(section, config, 'introduction');
      expect(result.body).toContain('# Introduction');
    });

    it('should include placeholder comment in FR', () => {
      const config = makeConfig({ language: 'fr' });
      const section = { name: 'Intro', type: 'default' };
      const result = generateSectionContent(section, config, 'intro');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('Contenu de la section');
    });

    it('should include placeholder comment in EN', () => {
      const config = makeConfig({ language: 'en' });
      const section = { name: 'Intro', type: 'default' };
      const result = generateSectionContent(section, config, 'intro');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('Section content');
    });
  });

  describe('body generation - two-cols type', () => {
    it('should include ::right:: separator', () => {
      const config = makeConfig();
      const section = { name: 'Compare', type: 'two-cols' };
      const result = generateSectionContent(section, config, 'compare');
      expect(result.body).toContain('::right::');
    });

    it('should include left and right column comments', () => {
      const config = makeConfig({ language: 'fr' });
      const section = { name: 'Compare', type: 'two-cols' };
      const result = generateSectionContent(section, config, 'compare');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('Colonne gauche');
      expect(bodyStr).toContain('Colonne droite');
    });
  });

  describe('body generation - image-right type', () => {
    it('should include image content comment', () => {
      const config = makeConfig({ language: 'fr' });
      const section = { name: 'Visual', type: 'image-right' };
      const result = generateSectionContent(section, config, 'visual');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain("Contenu a gauche de l'image");
    });
  });

  describe('body generation - quote type', () => {
    it('should include blockquote and author', () => {
      const config = makeConfig({ language: 'fr' });
      const section = { name: 'Citation', type: 'quote' };
      const result = generateSectionContent(section, config, 'citation');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('> ');
      expect(bodyStr).toContain('-- ');
    });
  });

  describe('body generation - code type', () => {
    it('should generate code block with default javascript', () => {
      const config = makeConfig();
      const section = { name: 'Demo', type: 'code' };
      const result = generateSectionContent(section, config, 'demo');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('```javascript {lines:true}');
      expect(bodyStr).toContain('```');
    });

    it('should use custom language', () => {
      const config = makeConfig();
      const section = { name: 'Demo', type: 'code', lang: 'typescript' };
      const result = generateSectionContent(section, config, 'demo');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('```typescript {lines:true}');
    });
  });

  describe('body generation - diagram type', () => {
    it('should generate mermaid block with default flowchart', () => {
      const config = makeConfig();
      const section = { name: 'Arch', type: 'diagram' };
      const result = generateSectionContent(section, config, 'arch');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('```mermaid');
      expect(bodyStr).toContain('flowchart TD');
    });

    it('should use custom diagram type', () => {
      const config = makeConfig();
      const section = { name: 'Arch', type: 'diagram', diagram: 'sequenceDiagram' };
      const result = generateSectionContent(section, config, 'arch');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('sequenceDiagram');
    });
  });

  describe('body generation - cover type', () => {
    it('should include title only', () => {
      const config = makeConfig();
      const section = { name: 'Chapter 2', type: 'cover' };
      const result = generateSectionContent(section, config, 'chapter-2');
      expect(result.body).toContain('# Chapter 2');
    });
  });

  describe('body generation - iframe type', () => {
    it('should include iframe tag with valid URL', () => {
      const config = makeConfig();
      const section = { name: 'Demo', type: 'iframe', url: 'https://example.com' };
      const result = generateSectionContent(section, config, 'demo');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('<iframe src="https://example.com"');
    });

    it('should include comment when URL is missing', () => {
      const config = makeConfig({ language: 'fr' });
      const section = { name: 'Demo', type: 'iframe' };
      const result = generateSectionContent(section, config, 'demo');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('<!--');
    });
  });

  describe('body generation - steps type', () => {
    it('should include v-clicks wrapper', () => {
      const config = makeConfig();
      const section = { name: 'Steps', type: 'steps', items: ['A', 'B', 'C'] };
      const result = generateSectionContent(section, config, 'steps');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('<v-clicks>');
      expect(bodyStr).toContain('</v-clicks>');
      expect(bodyStr).toContain('- A');
      expect(bodyStr).toContain('- B');
      expect(bodyStr).toContain('- C');
    });

    it('should use default items when none provided', () => {
      const config = makeConfig({ language: 'fr' });
      const section = { name: 'Steps', type: 'steps' };
      const result = generateSectionContent(section, config, 'steps');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('Étape');
    });
  });

  describe('body generation - fact type', () => {
    it('should include value and description', () => {
      const config = makeConfig();
      const section = { name: 'Stats', type: 'fact', value: '99%', description: 'uptime' };
      const result = generateSectionContent(section, config, 'stats');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('99%');
      expect(bodyStr).toContain('uptime');
    });

    it('should escape HTML in value and description', () => {
      const config = makeConfig();
      const section = { name: 'Stats', type: 'fact', value: '<b>99%</b>', description: '<script>' };
      const result = generateSectionContent(section, config, 'stats');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).not.toContain('<b>');
      expect(bodyStr).not.toContain('<script>');
      expect(bodyStr).toContain('&lt;b&gt;');
    });
  });

  describe('body generation - thanks type', () => {
    it('should include author name', () => {
      const config = makeConfig({ author: 'Jane Doe' });
      const section = { name: 'Merci', type: 'thanks' };
      const result = generateSectionContent(section, config, 'merci');
      expect(result.body).toContain('Jane Doe');
    });

    it('should include github link when provided', () => {
      const config = makeConfig({ github: 'janedoe' });
      const section = { name: 'Merci', type: 'thanks' };
      const result = generateSectionContent(section, config, 'merci');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('github.com/janedoe');
    });

    it('should include social links when provided', () => {
      const config = makeConfig({ social: { twitter: 'janedoe', linkedin: 'janedoe' } });
      const section = { name: 'Merci', type: 'thanks' };
      const result = generateSectionContent(section, config, 'merci');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('twitter.com/janedoe');
      expect(bodyStr).toContain('linkedin.com/in/janedoe');
    });
  });

  describe('body generation - about type', () => {
    it('should include author name in bold', () => {
      const config = makeConfig({ author: 'Jane Doe' });
      const section = { name: 'About', type: 'about' };
      const result = generateSectionContent(section, config, 'about');
      expect(result.body).toContain('**Jane Doe**');
    });
  });

  describe('body generation - qna type', () => {
    it('should include Q&A text', () => {
      const config = makeConfig({ language: 'fr' });
      const section = { name: 'Q&A', type: 'qna' };
      const result = generateSectionContent(section, config, 'qna');
      const bodyStr = result.body.join('\n');
      expect(bodyStr).toContain('Questions & réponses');
    });
  });
});

describe('generateSectionNotes', () => {
  it('should return notes lines with contextual content for FR', () => {
    const config = makeConfig({ language: 'fr' });
    const section = { name: 'Intro', type: 'default' };
    const notes = generateSectionNotes(section, config);
    expect(Array.isArray(notes)).toBe(true);
    const notesStr = notes.join('\n');
    expect(notesStr).toContain('<!--');
    expect(notesStr).toContain('-->');
    expect(notesStr).toContain('Presentez les points cles');
  });

  it('should return notes lines with contextual content for EN', () => {
    const config = makeConfig({ language: 'en' });
    const section = { name: 'My Section', type: 'default' };
    const notes = generateSectionNotes(section, config);
    const notesStr = notes.join('\n');
    expect(notesStr).toContain('Present the key points');
  });

  it('should use custom notes when section.notes is provided', () => {
    const config = makeConfig();
    const section = { name: 'Intro', type: 'default', notes: 'Custom speaker note' };
    const notes = generateSectionNotes(section, config);
    const notesStr = notes.join('\n');
    expect(notesStr).toContain('Custom speaker note');
  });
});

describe('SOCIAL_PLATFORMS', () => {
  it('should be exported and contain platform definitions', () => {
    expect(SOCIAL_PLATFORMS).toBeDefined();
    expect(SOCIAL_PLATFORMS.twitter).toBeDefined();
    expect(SOCIAL_PLATFORMS.github).toBeDefined();
    expect(SOCIAL_PLATFORMS.linkedin).toBeDefined();
  });

  it('should have url and icon for each platform', () => {
    for (const [, def] of Object.entries(SOCIAL_PLATFORMS)) {
      expect(def).toHaveProperty('url');
      expect(def).toHaveProperty('icon');
    }
  });
});

describe('generateSocialLinks', () => {
  it('should return empty string for undefined social', () => {
    expect(generateSocialLinks(undefined)).toBe('');
  });

  it('should generate HTML for social links', () => {
    const social = { twitter: 'janedoe', github: 'janedoe' };
    const result = generateSocialLinks(social);
    expect(result).toContain('twitter.com/janedoe');
    expect(result).toContain('github.com/janedoe');
    expect(result).toContain('carbon-logo-twitter');
    expect(result).toContain('carbon-logo-github');
  });

  it('should escape HTML in handles', () => {
    const social = { twitter: '"><script>alert(1)</script>' };
    const result = generateSocialLinks(social);
    expect(result).not.toContain('<script>');
  });
});
