import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { slugify, sanitizeProjectName, validateGitHubUsername, validateUrl, sanitizeYamlScalar, sanitizeCssUrlPath } from './utils.js';
import { THEMES, DEFAULT_THEME, TRANSITIONS, DEFAULT_TRANSITION, buildCustomTheme } from './themes.js';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, t } from './i18n.js';
import type { Section, UserConfig, ResolvedConfig, ExportConfig, OptionsConfig } from './types.js';
import { getPresetContent } from './preset-content.js';

const VALID_COLOR_SCHEMAS = ['light', 'dark', 'auto'] as const;
const ASPECT_RATIO_REGEX = /^\d+\/\d+$/;
const SAFE_ADDON_REGEX = /^[a-z0-9@\/._-]+$/i;
const SAFE_FONT_KEY_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/;
const HIGHLIGHTS_REGEX = /^((\d+(-\d+)?)(,\d+(-\d+)?)*(\|(\d+(-\d+)?)(,\d+(-\d+)?)*)*)$|^all$/;
const SAFE_FILE_PATH_REGEX = /^[a-zA-Z0-9._\/-]+$/;
const VALID_MERMAID_TYPES = [
  'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
  'erDiagram', 'gantt', 'pie', 'gitgraph', 'mindmap', 'timeline',
  'quadrantChart', 'sankey', 'xychart', 'block',
];

export const SECTION_TYPES: string[] = ['default', 'two-cols', 'image-right', 'quote', 'qna', 'thanks', 'about', 'code', 'diagram', 'cover', 'iframe', 'steps', 'fact', 'section-divider', 'statement', 'image-left', 'image'];

function enrichSection(preset: string, key: string, section: Section, lang: string): Section {
  const pc = getPresetContent(preset, key, lang);
  if (!pc) return section;
  return {
    ...section,
    ...(pc.content ? { content: pc.content } : {}),
    ...(pc.items ? { items: pc.items } : {}),
    ...(pc.value ? { value: pc.value } : {}),
    ...(pc.description ? { description: pc.description } : {}),
    ...(pc.code ? { code: pc.code } : {}),
    ...(pc.diagram ? { diagram: pc.diagram } : {}),
  };
}

export const PRESETS: Record<string, (lang: string) => Section[]> = {
  conference: (lang: string) => [
    enrichSection('conference', 'intro', { name: t('preset_intro', lang), type: 'default' }, lang),
    enrichSection('conference', 'about', { name: t('preset_about', lang), type: 'about' }, lang),
    { name: t('preset_topic', lang) + ' 1', type: 'section-divider' },
    enrichSection('conference', 'topic', { name: t('preset_topic', lang) + ' 1', type: 'default' }, lang),
    enrichSection('conference', 'topic', { name: t('preset_topic', lang) + ' 2', type: 'default' }, lang),
    { name: t('preset_topic', lang) + ' 2', type: 'section-divider' },
    enrichSection('conference', 'topic', { name: t('preset_topic', lang) + ' 3', type: 'default' }, lang),
    enrichSection('conference', 'demo', { name: t('preset_demo', lang), type: 'code' }, lang),
    enrichSection('conference', 'takeaways', { name: t('preset_takeaways', lang), type: 'steps', clicks: true }, lang),
    enrichSection('conference', 'diagram', { name: t('preset_architecture', lang), type: 'diagram' }, lang),
    enrichSection('conference', 'impact', { name: t('preset_impact', lang), type: 'fact' }, lang),
    enrichSection('conference', 'qna', { name: t('preset_qna', lang), type: 'qna' }, lang),
    enrichSection('conference', 'thanks', { name: t('preset_thanks', lang), type: 'thanks' }, lang),
  ],
  workshop: (lang: string) => [
    enrichSection('workshop', 'intro', { name: t('preset_intro', lang), type: 'default' }, lang),
    enrichSection('workshop', 'prerequis', { name: t('preset_prereq', lang), type: 'steps' }, lang),
    { name: t('preset_module', lang) + ' 1', type: 'section-divider' },
    enrichSection('workshop', 'module', { name: t('preset_module', lang) + ' 1', type: 'default' }, lang),
    enrichSection('workshop', 'exercise', { name: t('preset_exercise', lang) + ' 1', type: 'code' }, lang),
    enrichSection('workshop', 'checkpoint', { name: t('preset_checkpoint', lang) + ' 1', type: 'steps' }, lang),
    { name: t('preset_module', lang) + ' 2', type: 'section-divider' },
    enrichSection('workshop', 'module', { name: t('preset_module', lang) + ' 2', type: 'default' }, lang),
    enrichSection('workshop', 'exercise', { name: t('preset_exercise', lang) + ' 2', type: 'code' }, lang),
    enrichSection('workshop', 'checkpoint', { name: t('preset_checkpoint', lang) + ' 2', type: 'steps' }, lang),
    enrichSection('workshop', 'diagram', { name: t('preset_architecture', lang), type: 'diagram' }, lang),
    enrichSection('workshop', 'recap', { name: t('preset_recap', lang), type: 'steps' }, lang),
    enrichSection('workshop', 'resources', { name: t('preset_resources', lang), type: 'default' }, lang),
  ],
  lightning: (lang: string) => [
    enrichSection('lightning', 'hook', { name: t('preset_hook', lang), type: 'statement' }, lang),
    enrichSection('lightning', 'problem', { name: t('preset_problem', lang), type: 'default' }, lang),
    enrichSection('lightning', 'solution', { name: t('preset_solution', lang), type: 'default' }, lang),
    enrichSection('lightning', 'demo', { name: t('preset_demo', lang), type: 'code' }, lang),
    enrichSection('lightning', 'cta', { name: t('preset_cta', lang), type: 'fact' }, lang),
    enrichSection('lightning', 'thanks', { name: t('preset_thanks', lang), type: 'thanks' }, lang),
  ],
  pitch: (lang: string) => [
    enrichSection('pitch', 'hook', { name: t('preset_hook', lang), type: 'statement' }, lang),
    enrichSection('pitch', 'problem', { name: t('preset_problem', lang), type: 'default' }, lang),
    { name: t('preset_solution', lang), type: 'section-divider' },
    enrichSection('pitch', 'solution', { name: t('preset_solution', lang), type: 'default' }, lang),
    enrichSection('pitch', 'product', { name: t('preset_product', lang), type: 'default' }, lang),
    enrichSection('pitch', 'market', { name: t('preset_market', lang), type: 'fact' }, lang),
    enrichSection('pitch', 'business', { name: t('preset_business', lang), type: 'default' }, lang),
    enrichSection('pitch', 'impact', { name: t('preset_impact', lang), type: 'fact' }, lang),
    enrichSection('pitch', 'team', { name: t('preset_team', lang), type: 'about' }, lang),
    enrichSection('pitch', 'ask', { name: t('preset_ask', lang), type: 'fact' }, lang),
    enrichSection('pitch', 'thanks', { name: t('preset_thanks', lang), type: 'thanks' }, lang),
  ],
  keynote: (lang: string) => [
    { name: t('preset_intro', lang), type: 'cover' },
    enrichSection('keynote', 'hook', { name: t('preset_hook', lang), type: 'statement' }, lang),
    enrichSection('keynote', 'about', { name: t('preset_about', lang), type: 'about' }, lang),
    { name: t('preset_problem', lang), type: 'section-divider' },
    enrichSection('keynote', 'context', { name: t('preset_context', lang), type: 'default' }, lang),
    enrichSection('keynote', 'impact', { name: t('preset_impact', lang), type: 'fact' }, lang),
    enrichSection('keynote', 'illustration', { name: t('preset_illustration', lang), type: 'image' }, lang),
    { name: t('preset_journey', lang), type: 'section-divider' },
    enrichSection('keynote', 'steps', { name: t('preset_steps', lang), type: 'steps', clicks: true }, lang),
    enrichSection('keynote', 'demo', { name: t('preset_demo', lang), type: 'code' }, lang),
    enrichSection('keynote', 'architecture', { name: t('preset_architecture', lang), type: 'diagram' }, lang),
    { name: t('preset_vision', lang), type: 'section-divider' },
    enrichSection('keynote', 'comparison', { name: t('preset_comparison', lang), type: 'two-cols' }, lang),
    enrichSection('keynote', 'result', { name: t('preset_result', lang), type: 'fact' }, lang),
    enrichSection('keynote', 'cta', { name: t('preset_cta', lang), type: 'statement' }, lang),
    enrichSection('keynote', 'qna', { name: t('preset_qna', lang), type: 'qna' }, lang),
    enrichSection('keynote', 'thanks', { name: t('preset_thanks', lang), type: 'thanks' }, lang),
  ],
};

export function normalizeSections(sections: (string | Section)[]): Section[] {
  return sections.map((section) => {
    if (typeof section === 'string') {
      return { name: section, type: 'default' };
    }
    const result = { ...section };
    if (!result.type) {
      result.type = 'default';
    } else if (!SECTION_TYPES.includes(result.type)) {
      console.warn(`Unknown section type "${result.type}", falling back to "default"`);
      result.type = 'default';
    }

    // Validate section.image
    if (result.image !== undefined) {
      if (typeof result.image !== 'string' || !validateUrl(result.image)) {
        console.warn(`Invalid section image URL "${result.image}", using default`);
        result.image = 'https://cover.sli.dev';
      }
    }

    // Validate section.diagram against mermaid whitelist
    if (result.diagram !== undefined) {
      if (typeof result.diagram !== 'string') {
        console.warn(`Invalid diagram type, falling back to "flowchart TD"`);
        result.diagram = 'flowchart TD';
      } else {
        const firstWord = result.diagram.trim().split(/\s+/)[0];
        if (!VALID_MERMAID_TYPES.includes(firstWord)) {
          console.warn(`Invalid diagram type "${firstWord}", falling back to "flowchart TD"`);
          result.diagram = 'flowchart TD';
        }
      }
    }

    // v3.0: Validate section.highlights
    if (result.highlights !== undefined) {
      if (typeof result.highlights !== 'string' || !HIGHLIGHTS_REGEX.test(result.highlights)) {
        console.warn(`Invalid highlights format "${result.highlights}", ignoring`);
        delete result.highlights;
      }
    }

    // v3.0: Validate section.file
    if (result.file !== undefined) {
      if (typeof result.file !== 'string' || !SAFE_FILE_PATH_REGEX.test(result.file) || result.file.includes('..')) {
        console.warn(`Invalid file path "${result.file}", ignoring`);
        delete result.file;
      }
    }

    // v3.0: Validate section.transition
    if (result.transition !== undefined) {
      if (typeof result.transition !== 'string' || !TRANSITIONS.includes(result.transition)) {
        console.warn(`Invalid section transition "${result.transition}", ignoring`);
        delete result.transition;
      }
    }

    // v3.0: Sanitize section.notes
    if (result.notes !== undefined) {
      if (typeof result.notes !== 'string') {
        delete result.notes;
      } else {
        result.notes = result.notes.replace(/<[^>]*>/g, '');
      }
    }

    return result;
  });
}

const DEFAULTS = {
  slidev_theme: 'seriph',
  visual_theme: 'cyberpunk',
  transition: 'slide-left',
  language: DEFAULT_LANGUAGE,
  multi_file: true,
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
    } else {
      const original = config.addons;
      config.addons = original.filter((addon) => {
        if (typeof addon !== 'string' || !SAFE_ADDON_REGEX.test(addon)) {
          console.warn(`Invalid addon name "${addon}", ignoring`);
          return false;
        }
        return true;
      });
    }
  }

  // Validate github username
  if (config.github !== undefined) {
    if (typeof config.github !== 'string' || !validateGitHubUsername(config.github)) {
      console.warn(`Invalid GitHub username "${config.github}", ignoring`);
      delete config.github;
    }
  }

  // Validate favicon
  if (config.favicon !== undefined) {
    if (typeof config.favicon !== 'string') {
      console.warn(`Invalid favicon, ignoring`);
      delete config.favicon;
    } else {
      config.favicon = sanitizeYamlScalar(config.favicon);
      if (!validateUrl(config.favicon) && !/^[a-zA-Z0-9._\/-]+$/.test(config.favicon)) {
        console.warn(`Invalid favicon "${config.favicon}", ignoring`);
        delete config.favicon;
      }
    }
  }

  // Validate logo
  if (config.logo !== undefined) {
    if (typeof config.logo !== 'string') {
      console.warn(`Invalid logo, ignoring`);
      delete config.logo;
    } else {
      try {
        sanitizeCssUrlPath(config.logo);
      } catch {
        console.warn(`Invalid logo path "${config.logo}", ignoring`);
        delete config.logo;
      }
    }
  }

  // Validate fonts
  if (config.fonts !== undefined && typeof config.fonts === 'object') {
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(config.fonts)) {
      if (!SAFE_FONT_KEY_REGEX.test(key)) {
        console.warn(`Invalid font key "${key}", ignoring`);
        continue;
      }
      if (typeof value !== 'string') {
        console.warn(`Invalid font value for "${key}", ignoring`);
        continue;
      }
      sanitized[key] = sanitizeYamlScalar(value);
    }
    config.fonts = sanitized;
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
