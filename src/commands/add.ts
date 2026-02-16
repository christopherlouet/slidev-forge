import { resolve } from 'node:path';
import { readFile, writeFile as fsWriteFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import pc from 'picocolors';
import { SECTION_TYPES } from '../config.js';
import type { UserConfig, Section } from '../types.js';

export async function runAdd(args: string[]): Promise<void> {
  const subType = args[0]; // 'section'
  if (subType !== 'section') {
    console.error(pc.red('Usage: slidev-forge add section "Name" [--type code]'));
    process.exit(1);
  }

  const name = args[1];
  if (!name) {
    console.error(pc.red('Section name is required.'));
    process.exit(1);
  }

  // Parse --type flag
  const typeIdx = args.indexOf('--type');
  const sectionType = typeIdx !== -1 && args[typeIdx + 1] ? args[typeIdx + 1] : 'default';

  if (!SECTION_TYPES.includes(sectionType)) {
    console.warn(pc.yellow(`Unknown section type "${sectionType}", using "default"`));
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

  // Add section
  const newSection: Section = { name, type: SECTION_TYPES.includes(sectionType) ? sectionType : 'default' };
  if (!config.sections) {
    config.sections = [];
  }
  (config.sections as Section[]).push(newSection);

  // Write back
  await fsWriteFile(yamlPath, stringify(config), 'utf-8');
  console.log(pc.green(`Section "${name}" (type: ${newSection.type}) added to ${yamlPath}`));
}
