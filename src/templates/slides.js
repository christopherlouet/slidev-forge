import { getTheme } from '../themes.js';

export function generateSlides(config) {
  const theme = getTheme(config.visual_theme);
  const parts = [];

  parts.push(generateFrontmatter(config));
  parts.push(generateTitleSlide(config, theme));
  parts.push(generateTocSlide());

  for (const section of config.sections) {
    parts.push(generateSectionSlide(section));
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

function generateTocSlide() {
  const lines = [
    'transition: slide-left',
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

function generateSectionSlide(sectionTitle) {
  const lines = [
    'transition: slide-left',
    '---',
    '',
    `# ${sectionTitle}`,
    '',
    `<!-- Contenu de la section "${sectionTitle}" -->`,
    '',
  ];
  return lines.join('\n');
}
