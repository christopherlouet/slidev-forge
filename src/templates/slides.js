import { getTheme } from '../themes.js';
import { t } from '../i18n.js';

export function generateSlides(config) {
  const theme = getTheme(config.visual_theme);
  const parts = [];

  parts.push(generateFrontmatter(config));
  parts.push(generateTitleSlide(config, theme));
  parts.push(generateTocSlide(config));

  for (const section of config.sections) {
    parts.push(generateSectionSlide(section.name, section.type, config));
  }

  return parts.join('\n---\n');
}

function generateFrontmatter(config) {
  const lang = config.language;
  const lines = [
    '---',
    `theme: ${config.slidev_theme}`,
    `title: ${config.title}`,
    `author: ${config.author}`,
    'hideInToc: true',
    'info: false',
    `class: text-center`,
    'drawings:',
    '  persist: false',
    `transition: ${config.transition}`,
    'mdc: true',
  ];

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
    lines.push(`favicon: ${config.favicon}`);
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
      lines.push(`  ${key}: ${value}`);
    }
  }

  // addons block
  if (Array.isArray(config.addons) && config.addons.length > 0) {
    lines.push('addons:');
    for (const addon of config.addons) {
      lines.push(`  - ${addon}`);
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

function generateTitleSlide(config, theme) {
  const lines = [''];

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

  if (config.github) {
    lines.push('');
    lines.push('<div class="abs-br m-6 flex gap-2">');
    lines.push(
      `  <a href="https://github.com/${config.github}/${config.project_name}" target="_blank" alt="GitHub" title="Open in GitHub"`,
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

function generateTocSlide(config) {
  const lang = config.language;
  const lines = [
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

function generateSectionSlide(sectionTitle, sectionType, config) {
  const lang = config.language;
  const lines = [`transition: ${config.transition}`];

  if (sectionType === 'two-cols') {
    lines.push('layout: two-cols');
    lines.push('---');
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
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`<!-- ${t('comment_image_content', lang)} -->`);
  } else if (sectionType === 'quote') {
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`> ${t('comment_replace_quote', lang)}`);
    lines.push('');
    lines.push(`-- ${t('comment_quote_author', lang)}`);
  } else if (sectionType === 'qna') {
    lines.push('layout: center');
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(t('comment_qna', lang));
  } else if (sectionType === 'thanks') {
    lines.push('layout: center');
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`${config.author}`);
    if (config.github) {
      lines.push('');
      lines.push(`[github.com/${config.github}](https://github.com/${config.github})`);
    }
  } else if (sectionType === 'about') {
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`**${config.author}**`);
    lines.push('');
    lines.push(`<!-- ${t('comment_add_bio', lang)} -->`);
  } else {
    lines.push('---');
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
