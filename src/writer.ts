import { mkdir, writeFile as fsWriteFile, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

/**
 * Writes content to a file, creating parent directories if needed.
 * @param destDir - Destination directory
 * @param relativePath - Relative path within the destination directory
 * @param content - Content to write to the file
 * @returns The relative path of the written file
 */
export async function writeFile(destDir: string, relativePath: string, content: string): Promise<string> {
  const fullPath = join(destDir, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await fsWriteFile(fullPath, content, 'utf-8');
  return relativePath;
}

/**
 * Copies a static file to a destination, creating parent directories if needed.
 * @param srcPath - Source file path
 * @param destDir - Destination directory
 * @param relativePath - Relative path within the destination directory
 * @returns The relative path of the copied file
 */
export async function copyStaticFile(srcPath: string, destDir: string, relativePath: string): Promise<string> {
  const fullPath = join(destDir, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await copyFile(srcPath, fullPath);
  return relativePath;
}
