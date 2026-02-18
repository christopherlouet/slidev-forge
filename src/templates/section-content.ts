import { t } from '../i18n.js';
import { escapeHtml, escapeHtmlAttribute, validateUrl } from '../utils.js';
import type { ResolvedConfig, Section, SocialConfig } from '../types.js';

interface SocialPlatformDef {
  url: string;
  icon: string;
}

export const SOCIAL_PLATFORMS: Record<string, SocialPlatformDef> = {
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

export function generateSocialLinks(social: SocialConfig | undefined): string {
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

export interface SectionContentOutput {
  frontmatter: string[];
  body: string[];
}

export function generateSectionContent(
  section: Section,
  config: ResolvedConfig,
  id: string,
): SectionContentOutput {
  const lang = config.language;
  const sectionTitle = section.name;
  const sectionType = section.type;
  const marker = `<!-- section:id=${id} -->`;
  const transition = section.transition || config.transition;
  const frontmatter: string[] = [`transition: ${transition}`];
  const body: string[] = [];

  if (sectionType === 'two-cols') {
    frontmatter.push('layout: two-cols');
    body.push(marker, '', `# ${sectionTitle}`, '');
    if (section.content) {
      for (const line of section.content) body.push(line);
    } else {
      body.push(`<!-- ${t('comment_left_column', lang)} -->`);
    }
    body.push('', '::right::', '');
    if (section.clicks) {
      body.push('<v-click>');
      body.push('');
      body.push(`<!-- ${t('comment_right_column', lang)} -->`);
      body.push('');
      body.push('</v-click>');
    } else {
      body.push(`<!-- ${t('comment_right_column', lang)} -->`);
    }
  } else if (sectionType === 'image-right') {
    frontmatter.push('layout: image-right');
    frontmatter.push('image: https://cover.sli.dev');
    body.push(marker, '', `# ${sectionTitle}`, '');
    if (section.content) {
      for (const line of section.content) body.push(line);
    } else {
      body.push(`<!-- ${t('comment_image_content', lang)} -->`);
    }
  } else if (sectionType === 'quote') {
    body.push(marker, '', `# ${sectionTitle}`, '');
    body.push(`> ${t('comment_replace_quote', lang)}`);
    body.push('');
    if (section.clicks) {
      body.push('<v-click>');
      body.push('');
      body.push(`-- ${t('comment_quote_author', lang)}`);
      body.push('');
      body.push('</v-click>');
    } else {
      body.push(`-- ${t('comment_quote_author', lang)}`);
    }
  } else if (sectionType === 'qna') {
    frontmatter.push('layout: center');
    body.push(marker, '', `# ${sectionTitle}`, '');
    body.push(t('comment_qna', lang));
  } else if (sectionType === 'thanks') {
    frontmatter.push('layout: center');
    body.push(marker, '', `# ${sectionTitle}`, '');
    body.push(`${config.author}`);
    const thanksSocial = generateSocialLinks(config.social);
    if (thanksSocial) {
      body.push(thanksSocial);
    } else if (config.github) {
      body.push('');
      body.push(`[github.com/${config.github}](https://github.com/${config.github})`);
    }
  } else if (sectionType === 'about') {
    body.push(marker, '', `# ${sectionTitle}`, '');
    body.push(`**${config.author}**`);
    body.push('');
    body.push(`<!-- ${t('comment_add_bio', lang)} -->`);
  } else if (sectionType === 'code') {
    const codeLang = section.lang || 'javascript';
    body.push(marker, '', `# ${sectionTitle}`, '');
    if (section.file) {
      const highlightSpec = section.highlights && section.highlights !== 'all'
        ? ` {${section.highlights}}{lines:true}`
        : '';
      body.push(`<<< @/${section.file}${highlightSpec}`);
    } else {
      const highlightSpec = section.highlights && section.highlights !== 'all'
        ? `{${section.highlights}}`
        : '{lines:true}';
      body.push(`\`\`\`${codeLang} ${highlightSpec}`);
      body.push(`// ${t('comment_code_placeholder', lang)}`);
      body.push('```');
    }
  } else if (sectionType === 'diagram') {
    const diagramType = section.diagram || 'flowchart TD';
    body.push(marker, '', `# ${sectionTitle}`, '');
    if (section.clicks) {
      body.push('<v-click>');
      body.push('');
    }
    body.push('```mermaid');
    body.push(diagramType);
    body.push('  A[Start] --> B[End]');
    body.push('```');
    if (section.clicks) {
      body.push('');
      body.push('</v-click>');
    }
  } else if (sectionType === 'cover') {
    const image = section.image || 'https://cover.sli.dev';
    frontmatter.push('layout: cover');
    frontmatter.push(`background: ${image}`);
    body.push(marker, '', `# ${sectionTitle}`);
  } else if (sectionType === 'iframe') {
    body.push(marker, '', `# ${sectionTitle}`, '');
    if (section.url && validateUrl(section.url)) {
      body.push(`<iframe src="${escapeHtmlAttribute(section.url)}" class="w-full h-full rounded" />`);
    } else {
      body.push(`<!-- ${t('comment_iframe_no_url', lang)} -->`);
    }
  } else if (sectionType === 'steps') {
    const items = section.items || [
      `${t('comment_steps_item', lang)} 1`,
      `${t('comment_steps_item', lang)} 2`,
      `${t('comment_steps_item', lang)} 3`,
    ];
    body.push(marker, '', `# ${sectionTitle}`, '');
    body.push('<v-clicks>');
    body.push('');
    for (const item of items) {
      body.push(`- ${item}`);
    }
    body.push('');
    body.push('</v-clicks>');
  } else if (sectionType === 'fact') {
    const value = section.value || t('comment_fact_default_value', lang);
    const description = section.description || t('comment_fact_default_desc', lang);
    frontmatter.push('layout: center');
    body.push(marker, '', `# ${sectionTitle}`, '');
    body.push(`<div class="text-8xl font-bold">${escapeHtml(value)}</div>`);
    if (section.clicks) {
      body.push('<v-click>');
      body.push('');
      body.push(`<p class="text-2xl mt-4 opacity-70">${escapeHtml(description)}</p>`);
      body.push('');
      body.push('</v-click>');
    } else {
      body.push(`<p class="text-2xl mt-4 opacity-70">${escapeHtml(description)}</p>`);
    }
  } else if (sectionType === 'section-divider') {
    frontmatter.push('layout: section');
    body.push(marker, '', `# ${sectionTitle}`);
  } else if (sectionType === 'statement') {
    frontmatter.push('layout: statement');
    body.push(marker, '', `# ${sectionTitle}`);
  } else if (sectionType === 'image-left') {
    const image = section.image || 'https://cover.sli.dev';
    frontmatter.push('layout: image-left');
    frontmatter.push(`image: ${image}`);
    body.push(marker, '', `# ${sectionTitle}`, '');
    if (section.content) {
      for (const line of section.content) body.push(line);
    } else {
      body.push(`<!-- ${t('comment_image_right_content', lang)} -->`);
    }
  } else if (sectionType === 'image') {
    const image = section.image || 'https://cover.sli.dev';
    frontmatter.push('layout: image');
    frontmatter.push(`image: ${image}`);
    body.push(marker, '', `# ${sectionTitle}`);
  } else {
    body.push(marker, '', `# ${sectionTitle}`, '');
    if (section.content) {
      if (section.clicks) {
        body.push('<v-clicks>');
        body.push('');
        for (const line of section.content) body.push(line);
        body.push('');
        body.push('</v-clicks>');
      } else {
        for (const line of section.content) body.push(line);
      }
    } else if (section.clicks) {
      body.push('<v-clicks>');
      body.push('');
      body.push(`<!-- ${t('comment_section_content', lang)} "${sectionTitle}" -->`);
      body.push('');
      body.push('</v-clicks>');
    } else {
      body.push(`<!-- ${t('comment_section_content', lang)} "${sectionTitle}" -->`);
    }
  }

  return { frontmatter, body };
}

const NOTE_KEY_MAP: Record<string, string> = {
  'default': 'note_default',
  'two-cols': 'note_two_cols',
  'image-right': 'note_image_right',
  'quote': 'note_quote',
  'qna': 'note_qna',
  'thanks': 'note_thanks',
  'about': 'note_about',
  'code': 'note_code',
  'diagram': 'note_diagram',
  'cover': 'note_cover',
  'iframe': 'note_iframe',
  'steps': 'note_steps',
  'fact': 'note_fact',
  'section-divider': 'note_section_divider',
  'statement': 'note_statement',
  'image-left': 'note_image_left',
  'image': 'note_image',
};

export function generateSectionNotes(section: Section, config: ResolvedConfig): string[] {
  const lang = config.language;
  let noteText: string;
  if (section.notes) {
    noteText = section.notes;
  } else {
    const noteKey = NOTE_KEY_MAP[section.type] || 'note_default';
    noteText = t(noteKey, lang);
  }
  return ['', '<!--', noteText, '-->'];
}
