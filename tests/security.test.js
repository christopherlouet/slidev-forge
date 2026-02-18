import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFile, copyStaticFile } from '../src/writer.js';
import { ALLOWED_PM } from '../src/cli.js';
import { sanitizeYamlScalar, sanitizeCssUrlPath, validateGitHubUsername } from '../src/utils.js';
import { mergeDefaults, normalizeSections } from '../src/config.js';
import { generateSlides } from '../src/templates/slides.js';
import { generateStyles } from '../src/templates/styles.js';

describe('Security - Path Traversal Protection', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'slidev-sec-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('writeFile', () => {
    it('should block path traversal with ../', async () => {
      await expect(
        writeFile(tempDir, '../outside.txt', 'malicious'),
      ).rejects.toThrow(/path traversal/i);
    });

    it('should block deeply nested path traversal', async () => {
      await expect(
        writeFile(tempDir, 'a/b/../../../../etc/passwd', 'malicious'),
      ).rejects.toThrow(/path traversal/i);
    });

    it('should block absolute paths', async () => {
      await expect(
        writeFile(tempDir, '/etc/passwd', 'malicious'),
      ).rejects.toThrow(/path traversal/i);
    });

    it('should allow valid relative paths', async () => {
      await writeFile(tempDir, 'slides.md', 'content');
      const content = await readFile(join(tempDir, 'slides.md'), 'utf-8');
      expect(content).toBe('content');
    });

    it('should allow nested relative paths', async () => {
      await writeFile(tempDir, 'pages/01-intro.md', 'content');
      const content = await readFile(join(tempDir, 'pages/01-intro.md'), 'utf-8');
      expect(content).toBe('content');
    });
  });

  describe('copyStaticFile', () => {
    it('should block path traversal with ../', async () => {
      const srcFile = join(tempDir, 'source.txt');
      await writeFile(tempDir, 'source.txt', 'content');

      await expect(
        copyStaticFile(srcFile, tempDir, '../outside.txt'),
      ).rejects.toThrow(/path traversal/i);
    });

    it('should block absolute destination paths', async () => {
      const srcFile = join(tempDir, 'source.txt');
      await writeFile(tempDir, 'source.txt', 'content');

      await expect(
        copyStaticFile(srcFile, tempDir, '/tmp/outside.txt'),
      ).rejects.toThrow(/path traversal/i);
    });
  });
});

describe('Security - Command Injection Protection', () => {
  it('should only allow known package managers', () => {
    expect(ALLOWED_PM).toEqual(['npm', 'pnpm', 'yarn', 'bun']);
  });

  it('should not include values with shell metacharacters', () => {
    for (const pm of ALLOWED_PM) {
      expect(pm).toMatch(/^[a-z]+$/);
    }
  });
});

describe('Security - YAML Injection Protection', () => {
  it('sanitizeYamlScalar should strip newlines', () => {
    expect(sanitizeYamlScalar('title\ninjected: true')).toBe('titleinjected: true');
    expect(sanitizeYamlScalar('title\r\ninjected: true')).toBe('titleinjected: true');
  });

  it('sanitizeYamlScalar should return clean strings unchanged', () => {
    expect(sanitizeYamlScalar('My Presentation')).toBe('My Presentation');
  });

  it('title/author with newlines should be sanitized in YAML frontmatter', () => {
    const config = mergeDefaults({
      title: 'My Talk\ninjected_key: malicious',
      author: 'Author\r\nevil: true',
    });
    const slides = generateSlides(config);
    // Extract frontmatter (between first --- and second ---)
    const frontmatter = slides.split('---')[1];
    // Newlines stripped and properly quoted in frontmatter
    expect(frontmatter).toContain("title: 'My Talkinjected_key: malicious'");
    expect(frontmatter).toContain("author: 'Authorevil: true'");
    // No separate YAML key injection in frontmatter
    expect(frontmatter).not.toMatch(/^injected_key:/m);
    expect(frontmatter).not.toMatch(/^evil:/m);
  });
});

describe('Security - GitHub Username Validation', () => {
  it('should reject invalid GitHub usernames in config', () => {
    const warnSpy = [];
    const origWarn = console.warn;
    console.warn = (msg) => warnSpy.push(msg);
    try {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Author',
        github: '<script>alert(1)</script>',
      });
      expect(config.github).toBeUndefined();
      expect(warnSpy.some((m) => m.includes('Invalid GitHub username'))).toBe(true);
    } finally {
      console.warn = origWarn;
    }
  });

  it('should accept valid GitHub usernames', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Author',
      github: 'valid-user',
    });
    expect(config.github).toBe('valid-user');
  });
});

describe('Security - CSS Injection via Logo', () => {
  it('sanitizeCssUrlPath should reject unsafe characters', () => {
    expect(() => sanitizeCssUrlPath("logo'); background: url('evil")).toThrow(/unsafe characters/);
    expect(() => sanitizeCssUrlPath('logo.png')).not.toThrow();
  });

  it('should reject invalid logo in config', () => {
    const warnSpy = [];
    const origWarn = console.warn;
    console.warn = (msg) => warnSpy.push(msg);
    try {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Author',
        logo: "logo'); background: url('evil",
      });
      expect(config.logo).toBeUndefined();
    } finally {
      console.warn = origWarn;
    }
  });

  it('should accept valid logo paths', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Author',
      logo: 'images/logo.png',
    });
    expect(config.logo).toBe('images/logo.png');
  });

  it('styles should not output unsafe logo', () => {
    const css = generateStyles({
      title: 'Test',
      author: 'Author',
      project_name: 'test',
      slidev_theme: 'seriph',
      visual_theme: 'cyberpunk',
      transition: 'slide-left',
      language: 'en',
      sections: [],
      deploy: [],
      export: { format: 'pdf', dark: false, with_clicks: false },
      options: { snippets: true, components: true },
      logo: "x'); background: url('evil",
    });
    expect(css).not.toContain('evil');
  });
});

describe('Security - Favicon Validation', () => {
  it('should reject invalid favicon URL', () => {
    const warnSpy = [];
    const origWarn = console.warn;
    console.warn = (msg) => warnSpy.push(msg);
    try {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Author',
        favicon: 'javascript:alert(1)',
      });
      expect(config.favicon).toBeUndefined();
    } finally {
      console.warn = origWarn;
    }
  });

  it('should accept valid favicon URL', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Author',
      favicon: 'https://example.com/favicon.ico',
    });
    expect(config.favicon).toBe('https://example.com/favicon.ico');
  });

  it('should accept valid favicon path', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Author',
      favicon: 'favicon.ico',
    });
    expect(config.favicon).toBe('favicon.ico');
  });
});

describe('Security - Section Image Validation', () => {
  it('should reject invalid section image URL', () => {
    const warnSpy = [];
    const origWarn = console.warn;
    console.warn = (msg) => warnSpy.push(msg);
    try {
      const sections = normalizeSections([
        { name: 'Cover', type: 'cover', image: 'javascript:alert(1)' },
      ]);
      expect(sections[0].image).toBe('https://cover.sli.dev');
    } finally {
      console.warn = origWarn;
    }
  });

  it('should accept valid section image URL', () => {
    const sections = normalizeSections([
      { name: 'Cover', type: 'cover', image: 'https://example.com/bg.jpg' },
    ]);
    expect(sections[0].image).toBe('https://example.com/bg.jpg');
  });
});

describe('Security - Diagram Type Validation', () => {
  it('should reject invalid diagram type', () => {
    const warnSpy = [];
    const origWarn = console.warn;
    console.warn = (msg) => warnSpy.push(msg);
    try {
      const sections = normalizeSections([
        { name: 'Diagram', type: 'diagram', diagram: '%%{init: {"theme": "dark"}}%%\ngraph TD' },
      ]);
      expect(sections[0].diagram).toBe('flowchart TD');
    } finally {
      console.warn = origWarn;
    }
  });

  it('should accept valid diagram types', () => {
    for (const type of ['flowchart TD', 'sequenceDiagram', 'classDiagram', 'pie', 'gantt']) {
      const sections = normalizeSections([
        { name: 'D', type: 'diagram', diagram: type },
      ]);
      expect(sections[0].diagram).toBe(type);
    }
  });
});

describe('Security - Addon Name Validation', () => {
  it('should reject addons with newlines', () => {
    const warnSpy = [];
    const origWarn = console.warn;
    console.warn = (msg) => warnSpy.push(msg);
    try {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Author',
        addons: ['valid-addon', "evil\ninjected: true"],
      });
      expect(config.addons).toEqual(['valid-addon']);
    } finally {
      console.warn = origWarn;
    }
  });

  it('should accept valid addon names', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Author',
      addons: ['@slidev/plugin-name', 'slidev-addon-foo'],
    });
    expect(config.addons).toEqual(['@slidev/plugin-name', 'slidev-addon-foo']);
  });
});

describe('Security - Font Key/Value Sanitization', () => {
  it('should reject font keys with special characters', () => {
    const warnSpy = [];
    const origWarn = console.warn;
    console.warn = (msg) => warnSpy.push(msg);
    try {
      const config = mergeDefaults({
        title: 'Test',
        author: 'Author',
        fonts: { sans: 'Roboto', 'key\ninjected': 'evil' },
      });
      expect(config.fonts).toEqual({ sans: 'Roboto' });
    } finally {
      console.warn = origWarn;
    }
  });

  it('should sanitize font values with newlines', () => {
    const config = mergeDefaults({
      title: 'Test',
      author: 'Author',
      fonts: { sans: "Roboto\ninjected: true" },
    });
    expect(config.fonts.sans).toBe('Robotoinjected: true');
    expect(config.fonts.sans).not.toContain('\n');
  });
});
