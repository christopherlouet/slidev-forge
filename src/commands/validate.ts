import { resolve } from 'node:path';
import pc from 'picocolors';
import { loadConfig, mergeDefaults, validateConfig } from '../config.js';

export async function runValidate(args: string[]): Promise<void> {
  const yamlPath = args[0];
  if (!yamlPath) {
    console.error(pc.red('Usage: slidev-forge validate <config.yaml>'));
    process.exit(1);
  }

  try {
    const rawConfig = await loadConfig(resolve(yamlPath));
    validateConfig(rawConfig);
    const config = mergeDefaults(rawConfig);

    console.log(pc.green('Configuration is valid.'));
    console.log(`  ${pc.bold('Title:')}      ${config.title}`);
    console.log(`  ${pc.bold('Author:')}     ${config.author}`);
    console.log(`  ${pc.bold('Theme:')}      ${config.visual_theme}`);
    console.log(`  ${pc.bold('Sections:')}   ${config.sections.length}`);
    console.log(`  ${pc.bold('Language:')}   ${config.language}`);
    console.log(`  ${pc.bold('Transition:')} ${config.transition}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(pc.red(`Validation error: ${message}`));
    process.exit(1);
  }
}
