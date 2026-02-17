import { resolve, join } from 'node:path';
import { readFile, writeFile as fsWriteFile, copyFile, access } from 'node:fs/promises';
import { parse } from 'yaml';
import { loadConfig, mergeDefaults, validateConfig } from '../config.js';
import { loadGlobalConfig, mergeGlobalConfig } from '../global-config.js';
import { parseSlides } from '../parser.js';
import { computeDiff, mergeSlides } from '../merger.js';
import { generateStyles } from '../templates/styles.js';
import type { DiffAction } from '../types.js';

interface RegenerateCommandResult {
  success: boolean;
  error?: string;
  actions: DiffAction[];
  backupPath?: string;
  filesUpdated: string[];
  dryRun?: boolean;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function runRegenerate(
  args: string[],
  cwd?: string,
): Promise<RegenerateCommandResult> {
  const pathIdx = args.indexOf('--path');
  const pathArg = pathIdx !== -1 && args[pathIdx + 1] ? resolve(args[pathIdx + 1]) : undefined;
  const projectDir = pathArg || cwd || process.cwd();
  const dryRun = args.includes('--dry-run');
  const yamlPath = resolve(projectDir, 'presentation.yaml');
  const slidesPath = resolve(projectDir, 'slides.md');
  const stylesPath = resolve(projectDir, 'styles', 'index.css');

  // Check prerequisites
  if (!(await fileExists(yamlPath))) {
    return {
      success: false,
      error: `Cannot find presentation.yaml in ${projectDir}`,
      actions: [],
      filesUpdated: [],
    };
  }

  if (!(await fileExists(slidesPath))) {
    return {
      success: false,
      error: `Cannot find slides.md in ${projectDir}`,
      actions: [],
      filesUpdated: [],
    };
  }

  // Load and resolve config
  const rawConfig = await loadConfig(yamlPath);
  validateConfig(rawConfig);
  const globalConfig = await loadGlobalConfig();
  const config = mergeDefaults(mergeGlobalConfig(globalConfig, rawConfig));

  // Parse existing slides
  const existingContent = await readFile(slidesPath, 'utf-8');
  const parsedSlides = parseSlides(existingContent);

  // Compute diff
  const actions = computeDiff(config.sections, parsedSlides);

  if (dryRun) {
    return {
      success: true,
      dryRun: true,
      actions,
      filesUpdated: [],
    };
  }

  // Create backup
  const backupPath = resolve(projectDir, 'slides.md.bak');
  await copyFile(slidesPath, backupPath);

  // Merge and write
  const mergedContent = mergeSlides(config, parsedSlides);
  await fsWriteFile(slidesPath, mergedContent, 'utf-8');
  const filesUpdated = ['slides.md'];

  // Regenerate styles
  if (await fileExists(stylesPath)) {
    const newStyles = generateStyles(config);
    await fsWriteFile(stylesPath, newStyles, 'utf-8');
    filesUpdated.push('styles/index.css');
  }

  return {
    success: true,
    actions,
    backupPath,
    filesUpdated,
  };
}
