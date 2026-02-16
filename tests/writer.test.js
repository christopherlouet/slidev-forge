import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFile, copyStaticFile } from '../src/writer.ts';

describe('writer', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'slidev-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('writeFile', () => {
    it('should write content to a file', async () => {
      await writeFile(tempDir, 'test.txt', 'hello world');
      const content = await readFile(join(tempDir, 'test.txt'), 'utf-8');
      expect(content).toBe('hello world');
    });

    it('should create parent directories', async () => {
      await writeFile(tempDir, 'deep/nested/dir/file.txt', 'content');
      const content = await readFile(join(tempDir, 'deep/nested/dir/file.txt'), 'utf-8');
      expect(content).toBe('content');
    });

    it('should return the written file path', async () => {
      const result = await writeFile(tempDir, 'test.txt', 'hello');
      expect(result).toBe('test.txt');
    });
  });

  describe('copyStaticFile', () => {
    it('should copy a file to destination', async () => {
      const srcFile = join(tempDir, 'source.txt');
      await writeFile(tempDir, 'source.txt', 'original content');

      const destDir = join(tempDir, 'dest');
      await copyStaticFile(srcFile, destDir, 'copied.txt');

      const content = await readFile(join(destDir, 'copied.txt'), 'utf-8');
      expect(content).toBe('original content');
    });

    it('should create parent directories for destination', async () => {
      const srcFile = join(tempDir, 'source.txt');
      await writeFile(tempDir, 'source.txt', 'content');

      const destDir = join(tempDir, 'dest');
      await copyStaticFile(srcFile, destDir, 'deep/nested/file.txt');

      const info = await stat(join(destDir, 'deep/nested/file.txt'));
      expect(info.isFile()).toBe(true);
    });
  });
});
