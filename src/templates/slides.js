import { getTheme } from '../themes.js';

export function generateSlides(config) {
  const theme = getTheme(config.visual_theme);
  const parts = [];

  parts.push(generateFrontmatter(config));
  parts.push(generateTitleSlide(config, theme));
  parts.push(generateTocSlide(config));

  for (const section of config.sections) {
    const sectionName = typeof section === 'string' ? section : section.name;
    const sectionType = typeof section === 'string' ? 'default' : (section.type || 'default');
    parts.push(generateSectionSlide(sectionName, sectionType, config));
  }

  return parts.join('\n---\n');
}

function generateFrontmatter(config) {
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
    'export:',
    `  format: ${config.export.format}`,
    `  timeout: 30000`,
    `  dark: ${config.export.dark}`,
    `  withClicks: ${config.export.with_clicks}`,
    '  withToc: false',
  ];
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
  const lines = [
    `transition: ${config.transition}`,
    'hideInToc: true',
    '---',
    '',
    '# Sommaire',
    '',
    '<Toc minDepth="1" maxDepth="2"></Toc>',
    '',
  ];
  return lines.join('\n');
}

function generateSectionSlide(sectionTitle, sectionType, config) {
  const lines = [`transition: ${config.transition}`];

  if (sectionType === 'two-cols') {
    lines.push('layout: two-cols');
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`<!-- Colonne gauche -->`);
    lines.push('');
    lines.push('::right::');
    lines.push('');
    lines.push(`<!-- Colonne droite -->`);
  } else if (sectionType === 'image-right') {
    lines.push('layout: image-right');
    lines.push('image: https://cover.sli.dev');
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`<!-- Contenu a gauche de l'image -->`);
  } else if (sectionType === 'quote') {
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push('> Citation a remplacer');
    lines.push('');
    lines.push('-- Auteur');
  } else if (sectionType === 'qna') {
    lines.push('layout: center');
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`Questions & réponses`);
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
    lines.push(`<!-- Ajoutez votre bio ici -->`);
  } else {
    lines.push('---');
    lines.push('');
    lines.push(`# ${sectionTitle}`);
    lines.push('');
    lines.push(`<!-- Contenu de la section "${sectionTitle}" -->`);
  }

  lines.push('');
  lines.push('<!--');
  lines.push(`Notes pour la section "${sectionTitle}"`);
  lines.push('-->');
  lines.push('');
  return lines.join('\n');
}
