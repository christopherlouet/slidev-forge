import type { ResolvedConfig } from '../types.js';

export function generatePackageJson(config: ResolvedConfig): string {
  const dependencies: Record<string, string> = {
    '@slidev/cli': '^52.0.0',
    '@slidev/theme-default': 'latest',
    vue: '^3.5.27',
  };
  if (config.slidev_theme !== 'default') {
    dependencies[`@slidev/theme-${config.slidev_theme}`] = 'latest';
  }
  if (Array.isArray(config.addons)) {
    for (const addon of config.addons) {
      dependencies[addon] = 'latest';
    }
  }

  const pkg = {
    name: config.project_name,
    type: 'module',
    private: true,
    scripts: {
      dev: 'slidev --open',
      build: 'slidev build',
      export: 'slidev export',
    },
    dependencies,
    devDependencies: {
      'playwright-chromium': '^1.58.0',
      prettier: '^3.3.3',
      'prettier-plugin-slidev': '^1.0.5',
    },
    overrides: {
      'lodash-es': '>=4.17.23',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
