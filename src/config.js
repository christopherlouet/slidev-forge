import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

const DEFAULTS = {
  slidev_theme: 'seriph',
  visual_theme: 'cyberpunk',
  transition: 'slide-left',
  sections: ['Introduction', 'Références'],
  deploy: ['github-pages', 'vercel', 'netlify'],
  export: {
    format: 'pdf',
    dark: false,
    with_clicks: false,
  },
  options: {
    snippets: true,
  },
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function loadConfig(yamlPath) {
  const content = await readFile(yamlPath, 'utf-8');
  const config = parse(content);
  if (!config || typeof config !== 'object') {
    throw new Error(`Invalid YAML: expected an object in ${yamlPath}`);
  }
  return config;
}

export function mergeDefaults(userConfig) {
  return {
    ...DEFAULTS,
    ...userConfig,
    project_name: userConfig.project_name || slugify(userConfig.title),
    export: {
      ...DEFAULTS.export,
      ...(userConfig.export || {}),
    },
    options: {
      ...DEFAULTS.options,
      ...(userConfig.options || {}),
    },
  };
}

export function validateConfig(config) {
  if (!config.title || typeof config.title !== 'string' || config.title.trim() === '') {
    throw new Error('Configuration error: "title" is required and must be a non-empty string');
  }
  if (!config.author || typeof config.author !== 'string' || config.author.trim() === '') {
    throw new Error('Configuration error: "author" is required and must be a non-empty string');
  }
}
