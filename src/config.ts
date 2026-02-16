import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { slugify, sanitizeProjectName } from './utils.js';
import { THEMES, DEFAULT_THEME, TRANSITIONS, DEFAULT_TRANSITION, buildCustomTheme } from './themes.js';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, t } from './i18n.js';
import { getPluginGenerator } from './plugins.js';
import type { Section, UserConfig, ResolvedConfig, ExportConfig, OptionsConfig } from './types.js';

const VALID_COLOR_SCHEMAS = ['light', 'dark', 'auto'] as const;
const ASPECT_RATIO_REGEX = /^\d+\/\d+$/;

export const SECTION_TYPES: string[] = ['default', 'two-cols', 'image-right', 'quote', 'qna', 'thanks', 'about', 'code', 'diagram', 'cover', 'iframe', 'steps', 'fact'];

export const PRESETS: Record<string, (lang: string) => Section[]> = {
  conference: (lang: string) => [
    { name: t('preset_intro', lang), type: 'default' },
    { name: t('preset_about', lang), type: 'about' },
    { name: t('preset_topic', lang) + ' 1', type: 'default' },
    { name: t('preset_topic', lang) + ' 2', type: 'default' },
    { name: t('preset_demo', lang), type: 'code' },
    { name: t('preset_qna', lang), type: 'qna' },
    { name: t('preset_thanks', lang), type: 'thanks' },
  ],
  workshop: (lang: string) => [
    { name: t('preset_intro', lang), type: 'default' },
    { name: t('preset_prereq', lang), type: 'steps' },
    { name: t('preset_module', lang) + ' 1', type: 'default' },
    { name: t('preset_module', lang) + ' 2', type: 'default' },
    { name: t('preset_exercise', lang), type: 'code' },
    { name: t('preset_recap', lang), type: 'steps' },
    { name: t('preset_resources', lang), type: 'default' },
  ],
  lightning: (lang: string) => [
    { name: t('preset_problem', lang), type: 'default' },
    { name: t('preset_solution', lang), type: 'default' },
    { name: t('preset_demo', lang), type: 'code' },
    { name: t('preset_cta', lang), type: 'fact' },
  ],
  pitch: (lang: string) => [
    { name: t('preset_problem', lang), type: 'default' },
    { name: t('preset_solution', lang), type: 'default' },
    { name: t('preset_market', lang), type: 'fact' },
    { name: t('preset_product', lang), type: 'default' },
    { name: t('preset_business', lang), type: 'default' },
    { name: t('preset_team', lang), type: 'about' },
    { name: t('preset_ask', lang), type: 'fact' },
  ],
};

export function normalizeSections(sections: (string | Section)[]): Section[] {
  return sections.map((section) => {
    if (typeof section === 'string') {
      return { name: section, type: 'default' };
    }
    if (!section.type) {
      return { ...section, type: 'default' };
    }
    if (!SECTION_TYPES.includes(section.type) && !getPluginGenerator(section.type)) {
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
  language: DEFAULT_LANGUAGE,
  sections: ['Introduction', 'Références'] as (string | Section)[],
  deploy: ['github-pages'],
  export: {
    format: 'pdf',
    dark: false,
    with_clicks: false,
  } as ExportConfig,
  options: {
    snippets: true,
    components: true,
  } as OptionsConfig,
};

export async function loadConfig(yamlPath: string): Promise<UserConfig> {
  const content = await readFile(yamlPath, 'utf-8');
  const config = parse(content);
  if (!config || typeof config !== 'object') {
    throw new Error(`Invalid YAML: expected an object in ${yamlPath}`);
  }
  return config as UserConfig;
}

export function mergeDefaults(userConfig: UserConfig): ResolvedConfig {
  let visualTheme = userConfig.visual_theme || DEFAULTS.visual_theme;
  if (visualTheme === 'custom') {
    THEMES.custom = buildCustomTheme(userConfig.colors);
  } else if (!THEMES[visualTheme]) {
    console.warn(`Unknown visual theme "${visualTheme}", falling back to "${DEFAULT_THEME}"`);
    visualTheme = DEFAULT_THEME;
  }

  let transition = userConfig.transition || DEFAULTS.transition;
  if (!TRANSITIONS.includes(transition)) {
    console.warn(`Unknown transition "${transition}", falling back to "${DEFAULT_TRANSITION}"`);
    transition = DEFAULT_TRANSITION;
  }

  // Validate language
  let language = userConfig.language || DEFAULTS.language;
  if (!SUPPORTED_LANGUAGES.includes(language as typeof SUPPORTED_LANGUAGES[number])) {
    console.warn(`Unsupported language "${language}", falling back to "${DEFAULT_LANGUAGE}"`);
    language = DEFAULT_LANGUAGE;
  }

  // Validate aspect_ratio (must match "N/N" pattern)
  const config = { ...userConfig };
  if (config.aspect_ratio !== undefined) {
    if (typeof config.aspect_ratio !== 'string' || !ASPECT_RATIO_REGEX.test(config.aspect_ratio)) {
      console.warn(`Invalid aspect_ratio "${config.aspect_ratio}", ignoring`);
      delete config.aspect_ratio;
    }
  }

  // Validate color_schema
  if (config.color_schema !== undefined) {
    if (!(VALID_COLOR_SCHEMAS as readonly string[]).includes(config.color_schema)) {
      console.warn(`Invalid color_schema "${config.color_schema}", ignoring`);
      delete config.color_schema;
    }
  }

  // Validate addons (must be an array)
  if (config.addons !== undefined) {
    if (!Array.isArray(config.addons)) {
      console.warn(`Invalid addons: expected an array, ignoring`);
      delete config.addons;
    }
  }

  // Resolve sections: explicit > preset > defaults
  let rawSections: (string | Section)[];
  if (config.sections) {
    rawSections = config.sections;
  } else if (config.preset && PRESETS[config.preset]) {
    rawSections = PRESETS[config.preset](language);
  } else {
    if (config.preset && !PRESETS[config.preset]) {
      console.warn(`Unknown preset "${config.preset}", ignoring`);
    }
    rawSections = DEFAULTS.sections;
  }
  const sections = normalizeSections(rawSections);

  return {
    ...DEFAULTS,
    ...config,
    visual_theme: visualTheme,
    transition,
    language,
    sections,
    project_name: sanitizeProjectName(config.project_name || slugify(config.title)),
    export: {
      ...DEFAULTS.export,
      ...(config.export || {}),
    },
    options: {
      ...DEFAULTS.options,
      ...(config.options || {}),
    },
  } as ResolvedConfig;
}

export function validateConfig(config: UserConfig): void {
  if (!config.title || typeof config.title !== 'string' || config.title.trim() === '') {
    throw new Error('Configuration error: "title" is required and must be a non-empty string');
  }
  if (!config.author || typeof config.author !== 'string' || config.author.trim() === '') {
    throw new Error('Configuration error: "author" is required and must be a non-empty string');
  }
}
