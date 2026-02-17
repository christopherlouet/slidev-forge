import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFile, copyStaticFile } from '../src/writer.js';
import { ALLOWED_PM } from '../src/cli.js';

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
