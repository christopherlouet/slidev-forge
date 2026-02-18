import { resolve } from 'node:path';
import { homedir } from 'node:os';
import type { Section } from './types.js';

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

export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateGitHubUsername(username: string): boolean {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username);
}

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateSectionIds(sections: Section[]): Map<Section, string> {
  const ids = new Map<Section, string>();
  const counts = new Map<string, number>();

  for (const section of sections) {
    const base = slugify(section.name);
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);
    ids.set(section, count === 1 ? base : `${base}-${count}`);
  }

  return ids;
}

export function sanitizeYamlScalar(value: string): string {
  return value.replace(/[\r\n]/g, '');
}

const SAFE_CSS_URL_PATH = /^[a-zA-Z0-9._\/-]+$/;

export function sanitizeCssUrlPath(value: string): string {
  if (!SAFE_CSS_URL_PATH.test(value)) {
    throw new Error(`Invalid CSS url path: "${value}" contains unsafe characters`);
  }
  return value;
}

export function sanitizeProjectName(name: string): string {
  let cleaned = name;
  let prev = '';
  while (cleaned !== prev) {
    prev = cleaned;
    cleaned = cleaned.replace(/\.\.\//g, '').replace(/\.\//g, '');
  }
  cleaned = cleaned.replace(/^\.+/, '');
  const result = slugify(cleaned);
  if (!result) {
    throw new Error('Project name cannot be empty after sanitization');
  }
  return result;
}
