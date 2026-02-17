import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { parse } from 'yaml';
import type { UserConfig } from './types.js';

const GLOBAL_CONFIG_PATH = resolve(homedir(), '.slidev-forge.yaml');

export function getGlobalConfigPath(): string {
  return GLOBAL_CONFIG_PATH;
}

export async function loadGlobalConfig(): Promise<Partial<UserConfig>> {
  try {
    const content = await readFile(GLOBAL_CONFIG_PATH, 'utf-8');
    const config = parse(content);
    if (!config || typeof config !== 'object') {
      return {};
    }
    return config as Partial<UserConfig>;
  } catch {
    // File doesn't exist or is unreadable - that's fine
    return {};
  }
}

export function mergeGlobalConfig(globalConfig: Partial<UserConfig>, userConfig: UserConfig): UserConfig {
  // User config values override global config
  return { ...globalConfig, ...userConfig } as UserConfig;
}
