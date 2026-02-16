export function generatePackageJson(config) {
  const pkg = {
    name: config.project_name,
    type: 'module',
    private: true,
    scripts: {
      dev: 'slidev --open',
      build: 'slidev build',
      export: 'slidev export',
    },
    dependencies: {
      '@slidev/cli': '^0.50.0',
      '@slidev/theme-default': 'latest',
      [`@slidev/theme-${config.slidev_theme}`]: 'latest',
      vue: '^3.5.10',
    },
    devDependencies: {
      'playwright-chromium': '^1.47.2',
      prettier: '^3.3.3',
      'prettier-plugin-slidev': '^1.0.5',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
