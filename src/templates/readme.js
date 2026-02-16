export function generateReadme(config) {
  const lines = [];

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
  lines.push(`Par **${config.author}**`);

  lines.push('');
  lines.push('## Setup');
  lines.push('');
  lines.push('```bash');
  lines.push('npm install');
  lines.push('npm run dev');
  lines.push('```');

  lines.push('');
  lines.push('## Export');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run export');
  lines.push('```');

  lines.push('');

  return lines.join('\n');
}
