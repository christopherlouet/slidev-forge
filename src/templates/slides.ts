import { getTheme } from '../themes.js';
import { t } from '../i18n.js';
import { generateSectionIds, escapeHtml, escapeHtmlAttribute, validateUrl, sanitizeYamlScalar } from '../utils.js';
import type { ResolvedConfig, Section, ThemeDefinition, SocialConfig } from '../types.js';

interface SocialPlatformDef {
  url: string;
  icon: string;
}

const SOCIAL_PLATFORMS: Record<string, SocialPlatformDef> = {
  twitter: { url: 'https://twitter.com/', icon: 'carbon-logo-twitter' },
  linkedin: { url: 'https://linkedin.com/in/', icon: 'carbon-logo-linkedin' },
  github: { url: 'https://github.com/', icon: 'carbon-logo-github' },
  website: { url: '', icon: 'carbon-link' },
  youtube: { url: 'https://youtube.com/@', icon: 'carbon-logo-youtube' },
  mastodon: { url: '', icon: 'carbon-user-favorite' },
  bluesky: { url: 'https://bsky.app/profile/', icon: 'carbon-cloud' },
  instagram: { url: 'https://instagram.com/', icon: 'carbon-logo-instagram' },
  email: { url: 'mailto:', icon: 'carbon-email' },
};

function generateSocialLinks(social: SocialConfig | undefined): string {
  if (!social || typeof social !== 'object') return '';
  const links: string[] = [];
  for (const [platform, handle] of Object.entries(social)) {
    const def = SOCIAL_PLATFORMS[platform];
    if (!def) continue;
    const href = `${def.url}${escapeHtmlAttribute(String(handle))}`;
    links.push(
      `  <a href="${href}" target="_blank" class="text-xl slidev-icon-btn opacity-50 !border-none">\n    <${def.icon} />\n  </a>`,
    );
  }
  if (links.length === 0) return '';
  return `\n<div class="abs-br m-6 flex gap-2">\n${links.join('\n')}\n</div>`;
}

export function generateSlides(config: ResolvedConfig): string {
  const theme = getTheme(config.visual_theme);
  const sectionIds = generateSectionIds(config.sections);
  const parts: string[] = [];

  parts.push(generateFrontmatter(config));
  parts.push(generateTitleSlide(config, theme));
  parts.push(generateTocSlide(config));

  for (const section of config.sections) {
    const id = sectionIds.get(section) || 'unknown';
    parts.push(generateSectionSlide(section, config, id));
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

function generateSectionSlide(section: Section, config: ResolvedConfig, id: string): string {
  const lang = config.language;
  const sectionTitle = section.name;
  const sectionType = section.type;
  const marker = `<!-- section:id=${id} -->`;
  const lines: string[] = [`transition: ${config.transition}`];

  if (sectionType === 'two-cols') {
    lines.push('layout: two-cols');
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`<!-- ${t('comment_left_column', lang)} -->`);
    lines.push('');
    lines.push('::right::');
    lines.push('');
    lines.push(`<!-- ${t('comment_right_column', lang)} -->`);
  } else if (sectionType === 'image-right') {
    lines.push('layout: image-right');
    lines.push('image: https://cover.sli.dev');
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`<!-- ${t('comment_image_content', lang)} -->`);
  } else if (sectionType === 'quote') {
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`> ${t('comment_replace_quote', lang)}`);
    lines.push('');
    lines.push(`-- ${t('comment_quote_author', lang)}`);
  } else if (sectionType === 'qna') {
    lines.push('layout: center');
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(t('comment_qna', lang));
  } else if (sectionType === 'thanks') {
    lines.push('layout: center');
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`${config.author}`);
    const thanksSocial = generateSocialLinks(config.social);
    if (thanksSocial) {
      lines.push(thanksSocial);
    } else if (config.github) {
      lines.push('');
      lines.push(`[github.com/${config.github}](https://github.com/${config.github})`);
    }
  } else if (sectionType === 'about') {
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`**${config.author}**`);
    lines.push('');
    lines.push(`<!-- ${t('comment_add_bio', lang)} -->`);
  } else if (sectionType === 'code') {
    const codeLang = section.lang || 'javascript';
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`\`\`\`${codeLang} {lines:true}`);
    lines.push(`// ${t('comment_code_placeholder', lang)}`);
    lines.push('```');
  } else if (sectionType === 'diagram') {
    const diagramType = section.diagram || 'flowchart TD';
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push('```mermaid');
    lines.push(diagramType);
    lines.push('  A[Start] --> B[End]');
    lines.push('```');
  } else if (sectionType === 'cover') {
    const image = section.image || 'https://cover.sli.dev';
    lines.push('layout: cover');
    lines.push(`background: ${image}`);
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
  } else if (sectionType === 'iframe') {
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    if (section.url && validateUrl(section.url)) {
      lines.push(`<iframe src="${escapeHtmlAttribute(section.url)}" class="w-full h-full rounded" />`);
    } else {
      lines.push(`<!-- ${t('comment_iframe_no_url', lang)} -->`);
    }
  } else if (sectionType === 'steps') {
    const items = section.items || [
      `${t('comment_steps_item', lang)} 1`,
      `${t('comment_steps_item', lang)} 2`,
      `${t('comment_steps_item', lang)} 3`,
    ];
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push('<v-clicks>');
    lines.push('');
    for (const item of items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
    lines.push('</v-clicks>');
  } else if (sectionType === 'fact') {
    const value = section.value || t('comment_fact_default_value', lang);
    const description = section.description || t('comment_fact_default_desc', lang);
    lines.push('layout: center');
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`<div class="text-8xl font-bold">${escapeHtml(value)}</div>`);
    lines.push(`<p class="text-2xl mt-4 opacity-70">${escapeHtml(description)}</p>`);
  } else {
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`<!-- ${t('comment_section_content', lang)} "${sectionTitle}" -->`);
  }

  lines.push('');
  lines.push('<!--');
  lines.push(`${t('section_notes', lang)} "${sectionTitle}"`);
  lines.push('-->');
  lines.push('');
  return lines.join('\n');
}
