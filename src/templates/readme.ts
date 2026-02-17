import { t } from '../i18n.js';
import type { ResolvedConfig } from '../types.js';

export function generateReadme(config: ResolvedConfig): string {
  const lang = config.language;
  const lines: string[] = [];

  if (config.event_name) {
    lines.push(`# ${config.event_name}`);
    lines.push('');
    lines.push(`## ${config.title}`);
  } else {
    lines.push(`# ${config.title}`);
  }

  if (config.subtitle) {
    lines.push('');
    lines.push(config.subtitle);
  }

  lines.push('');
  lines.push(`${t('readme_by', lang)} **${config.author}**`);

  lines.push('');
  lines.push(`## ${t('readme_setup', lang)}`);
  lines.push('');
  lines.push('```bash');
  lines.push('npm install');
  lines.push('npm run dev');
  lines.push('```');

  lines.push('');
  lines.push(`## ${t('readme_export', lang)}`);
  lines.push('');
  lines.push('```bash');
  lines.push('npm run export');
  lines.push('```');

  lines.push('');

  return lines.join('\n');
}
