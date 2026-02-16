import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { slugify, sanitizeProjectName } from './utils.js';
import { THEMES, DEFAULT_THEME, TRANSITIONS, DEFAULT_TRANSITION, buildCustomTheme } from './themes.js';

export const SECTION_TYPES = ['default', 'two-cols', 'image-right', 'quote', 'qna', 'thanks', 'about'];

export function normalizeSections(sections) {
  return sections.map((section) => {
    if (typeof section === 'string') {
      return { name: section, type: 'default' };
    }
    if (!section.type) {
      return { ...section, type: 'default' };
    }
    if (!SECTION_TYPES.includes(section.type)) {
      console.warn(`Unknown section type "${section.type}", falling back to "default"`);
      return { ...section, type: 'default' };
    }
    return section;
  });
}

const DEFAULTS = {
  slidev_theme: 'seriph',
  visual_theme: 'cyberpunk',
  transition: 'slide-left',
  sections: ['Introduction', 'Références'],
  deploy: ['github-pages'],
  export: {
    format: 'pdf',
    dark: false,
    with_clicks: false,
  },
  options: {
    snippets: true,
    components: true,
  },
};

export async function loadConfig(yamlPath) {
  const content = await readFile(yamlPath, 'utf-8');
  const config = parse(content);
  if (!config || typeof config !== 'object') {
    throw new Error(`Invalid YAML: expected an object in ${yamlPath}`);
  }
  return config;
}

export function mergeDefaults(userConfig) {
  let visualTheme = userConfig.visual_theme || DEFAULTS.visual_theme;
  if (visualTheme === 'custom') {
    buildCustomTheme(userConfig.colors);
  } else if (!THEMES[visualTheme]) {
    console.warn(`Unknown visual theme "${visualTheme}", falling back to "${DEFAULT_THEME}"`);
    visualTheme = DEFAULT_THEME;
  }

  let transition = userConfig.transition || DEFAULTS.transition;
  if (!TRANSITIONS.includes(transition)) {
    console.warn(`Unknown transition "${transition}", falling back to "${DEFAULT_TRANSITION}"`);
    transition = DEFAULT_TRANSITION;
  }

  const rawSections = userConfig.sections || DEFAULTS.sections;
  const sections = normalizeSections(rawSections);

  return {
    ...DEFAULTS,
    ...userConfig,
    visual_theme: visualTheme,
    transition,
    sections,
    project_name: sanitizeProjectName(userConfig.project_name || slugify(userConfig.title)),
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
