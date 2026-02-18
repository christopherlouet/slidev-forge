import { getTheme } from '../themes.js';
import { t } from '../i18n.js';
import { generateSectionIds, escapeHtmlAttribute, sanitizeYamlScalar } from '../utils.js';
import { generateSectionContent, generateSectionNotes, generateSocialLinks } from './section-content.js';
import type { ResolvedConfig, ThemeDefinition } from '../types.js';

export function generateSlides(config: ResolvedConfig): string {
  const theme = getTheme(config.visual_theme);
  const sectionIds = generateSectionIds(config.sections);
  const parts: string[] = [];

  parts.push(generateFrontmatter(config));
  parts.push(generateTitleSlide(config, theme));
  parts.push(generateTocSlide(config));

  for (const section of config.sections) {
    const id = sectionIds.get(section) || 'unknown';
    const { frontmatter, body } = generateSectionContent(section, config, id);
    const notes = generateSectionNotes(section, config);
    parts.push([...frontmatter, '---', ...body, ...notes, ''].join('\n'));
  }

  return parts.join('\n---\n');
}

function generateFrontmatter(config: ResolvedConfig): string {
  const lang = config.language;
  const lines: string[] = [
    '---',
    `theme: ${config.slidev_theme}`,
    `title: '${sanitizeYamlScalar(config.title)}'`,
    `author: '${sanitizeYamlScalar(config.author)}'`,
    'hideInToc: true',
    'info: false',
    `class: text-center`,
    'drawings:',
    '  persist: false',
    `transition: ${config.transition}`,
    'mdc: true',
  ];

  // v1.6 slideNumber
  if (config.slide_numbers === true) {
    lines.push('slideNumber: true');
  }

  // v1.3 conditional fields
  if (config.line_numbers === true) {
    lines.push('lineNumbers: true');
  }
  if (config.aspect_ratio) {
    lines.push(`aspectRatio: '${config.aspect_ratio}'`);
  }
  if (config.color_schema) {
    lines.push(`colorSchema: ${config.color_schema}`);
  }
  if (config.favicon) {
    lines.push(`favicon: '${sanitizeYamlScalar(config.favicon)}'`);
  }
  if (config.download === true) {
    lines.push('download: true');
  }

  // htmlAttrs with language
  if (lang) {
    lines.push('htmlAttrs:');
    lines.push(`  lang: ${lang}`);
  }

  // fonts block
  if (config.fonts && typeof config.fonts === 'object') {
    lines.push('fonts:');
    for (const [key, value] of Object.entries(config.fonts)) {
      lines.push(`  ${key}: '${sanitizeYamlScalar(String(value))}'`);
    }
  }

  // addons block
  if (Array.isArray(config.addons) && config.addons.length > 0) {
    lines.push('addons:');
    for (const addon of config.addons) {
      lines.push(`  - '${sanitizeYamlScalar(String(addon))}'`);
    }
  }

  // export config
  lines.push('export:');
  lines.push(`  format: ${config.export.format}`);
  lines.push(`  timeout: 30000`);
  lines.push(`  dark: ${config.export.dark}`);
  lines.push(`  withClicks: ${config.export.with_clicks}`);
  lines.push('  withToc: false');

  return lines.join('\n');
}

function generateTitleSlide(config: ResolvedConfig, theme: ThemeDefinition): string {
  const lines: string[] = ['<!-- section:id=__title__ -->', ''];

  if (config.event_name) {
    lines.push(`# ${config.event_name}`);
    lines.push('');
    lines.push(config.title);
  } else {
    lines.push(`# ${config.title}`);
  }

  if (config.subtitle) {
    lines.push('');
    lines.push(config.subtitle);
  }

  const socialHtml = generateSocialLinks(config.social);
  if (socialHtml) {
    lines.push(socialHtml);
  } else if (config.github) {
    lines.push('');
    lines.push('<div class="abs-br m-6 flex gap-2">');
    lines.push(
      `  <a href="https://github.com/${escapeHtmlAttribute(config.github)}/${escapeHtmlAttribute(config.project_name)}" target="_blank" alt="GitHub" title="Open in GitHub"`,
    );
    lines.push(
      '    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">',
    );
    lines.push('    <carbon-logo-github />');
    lines.push('  </a>');
    lines.push('</div>');
  }

  lines.push('');
  lines.push('<style>');
  lines.push('h1 {');
  lines.push(`  background-color: ${theme.titleStyle.h1Color};`);
  lines.push('  background-image: none;');
  lines.push('}');
  lines.push('p {');
  lines.push(`  color: ${theme.titleStyle.textColor};`);
  lines.push('  font-weight: bold;');
  lines.push('  opacity: 0.7;');
  lines.push('}');
  lines.push('.slidev-layout h1 + p {');
  lines.push('  opacity: 0.8;');
  lines.push('}');
  lines.push('</style>');
  lines.push('');

  return lines.join('\n');
}

function generateTocSlide(config: ResolvedConfig): string {
  const lang = config.language;
  const lines: string[] = [
    `transition: ${config.transition}`,
    'hideInToc: true',
    '---',
    '<!-- section:id=__toc__ -->',
    '',
    `# ${t('toc_title', lang)}`,
    '',
    '<Toc minDepth="1" maxDepth="2"></Toc>',
    '',
  ];
  return lines.join('\n');
}
