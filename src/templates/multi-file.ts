import type { ResolvedConfig, Section } from '../types.js';
import { t } from '../i18n.js';
import { getTheme } from '../themes.js';
import { generateSectionIds, escapeHtml, escapeHtmlAttribute, validateUrl, slugify, sanitizeYamlScalar } from '../utils.js';

interface MultiFileOutput {
  slidesMain: string;
  pages: { path: string; content: string }[];
}

export function padIndex(index: number): string {
  return String(index).padStart(2, '0');
}

export function generateMultiFile(config: ResolvedConfig): MultiFileOutput {
  const theme = getTheme(config.visual_theme);
  const pages: { path: string; content: string }[] = [];
  const srcLines: string[] = [];

  // Frontmatter in slides.md
  const frontmatter = generateMainFrontmatter(config);
  srcLines.push(frontmatter);

  // Title slide (inline in slides.md)
  srcLines.push('---');
  srcLines.push('<!-- section:id=__title__ -->');
  srcLines.push('');
  srcLines.push(generateTitleContent(config, theme));

  // TOC slide as page
  const tocPath = `pages/${padIndex(1)}-toc.md`;
  const tocContent = generateTocPage(config);
  pages.push({ path: tocPath, content: tocContent });
  srcLines.push('---');
  srcLines.push(`src: ./${tocPath}`);
  srcLines.push('---');

  // Section slides as pages
  const sectionIds = generateSectionIds(config.sections);
  config.sections.forEach((section, i) => {
    const pageIndex = i + 2;
    const slug = slugify(section.name);
    const pagePath = `pages/${padIndex(pageIndex)}-${slug}.md`;
    const id = sectionIds.get(section) || 'unknown';
    const pageContent = generateSectionPage(section, config, id);
    pages.push({ path: pagePath, content: pageContent });
    srcLines.push('');
    srcLines.push('---');
    srcLines.push(`src: ./${pagePath}`);
    srcLines.push('---');
  });

  srcLines.push('');

  return {
    slidesMain: srcLines.join('\n'),
    pages,
  };
}

function generateMainFrontmatter(config: ResolvedConfig): string {
  const lines: string[] = [
    '---',
    `theme: ${config.slidev_theme}`,
    `title: '${sanitizeYamlScalar(config.title)}'`,
    `author: '${sanitizeYamlScalar(config.author)}'`,
    'hideInToc: true',
    'info: false',
    'class: text-center',
    'drawings:',
    '  persist: false',
    `transition: ${config.transition}`,
    'mdc: true',
  ];

  if (config.slide_numbers === true) {
    lines.push('slideNumber: true');
  }
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
  if (config.language) {
    lines.push('htmlAttrs:');
    lines.push(`  lang: ${config.language}`);
  }
  if (config.fonts && typeof config.fonts === 'object') {
    lines.push('fonts:');
    for (const [key, value] of Object.entries(config.fonts)) {
      lines.push(`  ${key}: '${sanitizeYamlScalar(String(value))}'`);
    }
  }
  if (Array.isArray(config.addons) && config.addons.length > 0) {
    lines.push('addons:');
    for (const addon of config.addons) {
      lines.push(`  - '${sanitizeYamlScalar(String(addon))}'`);
    }
  }

  lines.push('export:');
  lines.push(`  format: ${config.export.format}`);
  lines.push('  timeout: 30000');
  lines.push(`  dark: ${config.export.dark}`);
  lines.push(`  withClicks: ${config.export.with_clicks}`);
  lines.push('  withToc: false');

  return lines.join('\n');
}

function generateTitleContent(config: ResolvedConfig, theme: ReturnType<typeof getTheme>): string {
  const lines: string[] = [];
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
  lines.push('</style>');
  lines.push('');
  return lines.join('\n');
}

function generateTocPage(config: ResolvedConfig): string {
  const lang = config.language;
  const lines: string[] = [
    '---',
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

export function generateSectionPage(section: Section, config: ResolvedConfig, id: string): string {
  const lang = config.language;
  const sectionType = section.type;
  const marker = `<!-- section:id=${id} -->`;
  const lines: string[] = ['---', `transition: ${config.transition}`];

  if (sectionType === 'two-cols') {
    lines.push('layout: two-cols');
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
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
    lines.push(`# ${section.name}`);
    lines.push('');
    lines.push(`<!-- ${t('comment_image_content', lang)} -->`);
  } else if (sectionType === 'quote') {
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
    lines.push('');
    lines.push(`> ${t('comment_replace_quote', lang)}`);
    lines.push('');
    lines.push(`-- ${t('comment_quote_author', lang)}`);
  } else if (sectionType === 'qna') {
    lines.push('layout: center');
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
    lines.push('');
    lines.push(t('comment_qna', lang));
  } else if (sectionType === 'thanks') {
    lines.push('layout: center');
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
    lines.push('');
    lines.push(`${config.author}`);
    if (config.github) {
      lines.push('');
      lines.push(`[github.com/${config.github}](https://github.com/${config.github})`);
    }
  } else if (sectionType === 'about') {
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
    lines.push('');
    lines.push(`**${config.author}**`);
    lines.push('');
    lines.push(`<!-- ${t('comment_add_bio', lang)} -->`);
  } else if (sectionType === 'code') {
    const codeLang = section.lang || 'javascript';
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
    lines.push('');
    lines.push(`\`\`\`${codeLang} {lines:true}`);
    lines.push(`// ${t('comment_code_placeholder', lang)}`);
    lines.push('```');
  } else if (sectionType === 'diagram') {
    const diagramType = section.diagram || 'flowchart TD';
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
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
    lines.push(`# ${section.name}`);
  } else if (sectionType === 'iframe') {
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
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
    lines.push(`# ${section.name}`);
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
    lines.push(`# ${section.name}`);
    lines.push('');
    lines.push(`<div class="text-8xl font-bold">${escapeHtml(value)}</div>`);
    lines.push(`<p class="text-2xl mt-4 opacity-70">${escapeHtml(description)}</p>`);
  } else {
    lines.push('---');
    lines.push(marker);
    lines.push('');
    lines.push(`# ${section.name}`);
    lines.push('');
    lines.push(`<!-- ${t('comment_section_content', lang)} "${section.name}" -->`);
  }

  lines.push('');
  return lines.join('\n');
}
