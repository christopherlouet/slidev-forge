import { resolve } from 'node:path';
import { readFile, writeFile as fsWriteFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import pc from 'picocolors';
import type { UserConfig } from '../types.js';

export async function runConfig(args: string[]): Promise<void> {
  const action = args[0]; // 'get' or 'set'

  if (action !== 'get' && action !== 'set') {
    console.error(pc.red('Usage: slidev-forge config get <key> | slidev-forge config set <key> <value>'));
    process.exit(1);
  }

  const key = args[1];
  if (!key) {
    console.error(pc.red('Key is required.'));
    process.exit(1);
  }

  // Parse --path flag
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

  if (action === 'get') {
    const value = (config as unknown as Record<string, unknown>)[key];
    if (value === undefined) {
      console.log(pc.yellow(`Key "${key}" is not set.`));
    } else {
      console.log(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
    }
  } else {
    // set
    const value = args[2];
    if (value === undefined) {
      console.error(pc.red('Value is required for set.'));
      process.exit(1);
    }

    // Parse booleans and numbers
    let parsedValue: unknown = value;
    if (value === 'true') parsedValue = true;
    else if (value === 'false') parsedValue = false;
    else if (!isNaN(Number(value)) && value !== '') parsedValue = Number(value);

    (config as unknown as Record<string, unknown>)[key] = parsedValue;
    await fsWriteFile(yamlPath, stringify(config), 'utf-8');
    console.log(pc.green(`Set ${key} = ${parsedValue}`));
  }
}
