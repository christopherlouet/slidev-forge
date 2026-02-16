import { mkdir, writeFile as fsWriteFile, copyFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

export async function writeFile(destDir, relativePath, content) {
  const fullPath = join(destDir, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await fsWriteFile(fullPath, content, 'utf-8');
  return relativePath;
}

export async function copyStaticFile(srcPath, destDir, relativePath) {
  const fullPath = join(destDir, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await copyFile(srcPath, fullPath);
  return relativePath;
}
