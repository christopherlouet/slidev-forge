import type { ResolvedConfig, Section } from '../types.js';
import { t } from '../i18n.js';
import { getTheme } from '../themes.js';
import { getPluginGenerator } from '../plugins.js';

interface MultiFileOutput {
  slidesMain: string;
  pages: { path: string; content: string }[];
}

function padIndex(index: number): string {
  return String(index).padStart(2, '0');
}

function slugifySection(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
  srcLines.push('');
  srcLines.push(generateTitleContent(config, theme));

  // TOC slide as page
  const tocPath = `pages/${padIndex(1)}-toc.md`;
  const tocContent = generateTocPage(config);
  pages.push({ path: tocPath, content: tocContent });
  srcLines.push('---');
  srcLines.push(`src: ./${tocPath}`);

  // Section slides as pages
  config.sections.forEach((section, i) => {
    const pageIndex = i + 2;
    const slug = slugifySection(section.name);
    const pagePath = `pages/${padIndex(pageIndex)}-${slug}.md`;
    const pageContent = generateSectionPage(section, config);
    pages.push({ path: pagePath, content: pageContent });
    srcLines.push('---');
    srcLines.push(`src: ./${pagePath}`);
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
    `title: ${config.title}`,
    `author: ${config.author}`,
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
    lines.push(`favicon: ${config.favicon}`);
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
      lines.push(`  ${key}: ${value}`);
    }
  }
  if (Array.isArray(config.addons) && config.addons.length > 0) {
    lines.push('addons:');
    for (const addon of config.addons) {
      lines.push(`  - ${addon}`);
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
    `transition: ${config.transition}`,
    'hideInToc: true',
    '---',
    '',
    `# ${t('toc_title', lang)}`,
    '',
    '<Toc minDepth="1" maxDepth="2"></Toc>',
    '',
  ];
  return lines.join('\n');
}

function generateSectionPage(section: Section, config: ResolvedConfig): string {
  // Check for plugin
  const pluginGen = getPluginGenerator(section.type);
  if (pluginGen) {
    return pluginGen(section, config);
  }

  const lang = config.language;
  const lines: string[] = [`transition: ${config.transition}`];

  if (section.type === 'cover') {
    const image = section.image || 'https://cover.sli.dev';
    lines.push('layout: cover');
    lines.push(`background: ${image}`);
  } else if (section.type === 'two-cols') {
    lines.push('layout: two-cols');
  } else if (section.type === 'image-right') {
    lines.push('layout: image-right');
    lines.push('image: https://cover.sli.dev');
  } else if (section.type === 'qna' || section.type === 'thanks' || section.type === 'fact') {
    lines.push('layout: center');
  }

  lines.push('---');
  lines.push('');
  lines.push(`# ${section.name}`);
  lines.push('');
  lines.push(`<!-- ${t('comment_section_content', lang)} "${section.name}" -->`);
  lines.push('');

  return lines.join('\n');
}
