import { resolve } from 'node:path';
import { readFile, writeFile as fsWriteFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import pc from 'picocolors';
import { THEMES } from '../themes.js';
import type { UserConfig } from '../types.js';

export async function runTheme(args: string[]): Promise<void> {
  const themeName = args[0];

  if (!themeName) {
    console.log(pc.bold('Available themes:'));
    for (const [key, theme] of Object.entries(THEMES)) {
      console.log(`  ${pc.cyan(key.padEnd(15))} ${theme.description}`);
    }
    return;
  }

  if (!THEMES[themeName]) {
    console.error(pc.red(`Unknown theme "${themeName}". Use "slidev-forge theme" to list available themes.`));
    process.exit(1);
  }

  // Find presentation.yaml
  const yamlPath = resolve('presentation.yaml');
  let config: UserConfig;
  try {
    const content = await readFile(yamlPath, 'utf-8');
    config = parse(content) as UserConfig;
  } catch {
    console.error(pc.red(`Cannot read ${yamlPath}. Run this command from a slidev-forge project directory.`));
    process.exit(1);
  }

  config.visual_theme = themeName;
  await fsWriteFile(yamlPath, stringify(config), 'utf-8');
  console.log(pc.green(`Theme changed to "${themeName}" in ${yamlPath}`));
}
