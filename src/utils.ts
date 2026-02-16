import { resolve } from 'node:path';
import { homedir } from 'node:os';

export function expandHome(filepath: string): string {
  if (filepath === '~') return homedir();
  if (filepath.startsWith('~/')) return resolve(homedir(), filepath.slice(2));
  return filepath;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateHexColor(color: unknown): boolean {
  if (!color || typeof color !== 'string') return false;
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeProjectName(name: string): string {
  const cleaned = name.replace(/\.\.\//g, '').replace(/\.\//g, '').replace(/^\.+/, '');
  const result = slugify(cleaned);
  if (!result) {
    throw new Error('Project name cannot be empty after sanitization');
  }
  return result;
}
