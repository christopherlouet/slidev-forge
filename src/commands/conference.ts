import { resolve } from 'node:path';
import { readFile, writeFile as fsWriteFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import pc from 'picocolors';
import { getConference, listConferences } from '../conferences.js';
import type { UserConfig } from '../types.js';

export async function runConference(args: string[]): Promise<void> {
  const subcommand = args[0];

  if (!subcommand || subcommand === 'list') {
    console.log(pc.bold('Available conferences:'));
    for (const conf of listConferences()) {
      console.log(`  ${conf.emoji}  ${pc.cyan(conf.id.padEnd(18))} ${conf.name.padEnd(20)} ${pc.dim(conf.website)}`);
    }
    return;
  }

  if (subcommand === 'show') {
    const id = args[1];
    if (!id) {
      console.error(pc.red('Usage: slidev-forge conference show <id>'));
      process.exit(1);
    }
    const conf = getConference(id);
    if (!conf) {
      console.error(pc.red(`Unknown conference "${id}". Use "slidev-forge conference list" to see available conferences.`));
      process.exit(1);
    }
    console.log(`${conf.emoji}  ${pc.bold(conf.name)}`);
    console.log(`  ${pc.dim('Logo:')}    ${conf.logo}`);
    console.log(`  ${pc.dim('Website:')} ${conf.website}`);
    console.log(`  ${pc.dim('Info:')}    ${conf.description}`);
    return;
  }

  // Default: set conference in presentation.yaml
  const conferenceName = subcommand;
  const conf = getConference(conferenceName);
  if (!conf) {
    console.error(pc.red(`Unknown conference "${conferenceName}". Use "slidev-forge conference list" to see available conferences.`));
    process.exit(1);
  }

  const pathIdx = args.indexOf('--path');
  const projectDir = pathIdx !== -1 && args[pathIdx + 1] ? resolve(args[pathIdx + 1]) : process.cwd();
  const yamlPath = resolve(projectDir, 'presentation.yaml');
  let config: UserConfig;
  try {
    const content = await readFile(yamlPath, 'utf-8');
    config = parse(content) as UserConfig;
  } catch {
    console.error(pc.red(`Cannot read ${yamlPath}. Run this command from a slidev-forge project directory.`));
    process.exit(1);
  }

  config.conference = conferenceName;
  await fsWriteFile(yamlPath, stringify(config), 'utf-8');
  console.log(pc.green(`Conference set to "${conf.name}" in ${yamlPath}`));
}
