import type { SectionPlugin, Section, ResolvedConfig } from './types.js';

const registry = new Map<string, SectionPlugin>();

export function registerPlugin(plugin: SectionPlugin): void {
  if (!plugin.type || typeof plugin.type !== 'string') {
    throw new Error('Plugin must have a valid "type" string');
  }
  if (typeof plugin.generate !== 'function') {
    throw new Error(`Plugin "${plugin.type}" must have a "generate" function`);
  }
  registry.set(plugin.type, plugin);
}

export function getPluginGenerator(type: string): ((section: Section, config: ResolvedConfig) => string) | undefined {
  const plugin = registry.get(type);
  return plugin?.generate;
}

export async function loadPlugins(paths: string[]): Promise<void> {
  for (const pluginPath of paths) {
    const mod = await import(pluginPath);
    if (mod.default && typeof mod.default === 'object' && mod.default.type) {
      registerPlugin(mod.default as SectionPlugin);
    } else if (mod.plugin && typeof mod.plugin === 'object' && mod.plugin.type) {
      registerPlugin(mod.plugin as SectionPlugin);
    } else {
      throw new Error(`Plugin at "${pluginPath}" must export a default or named "plugin" object with { type, generate }`);
    }
  }
}

export function clearPlugins(): void {
  registry.clear();
}

export function getRegisteredPlugins(): string[] {
  return Array.from(registry.keys());
}
