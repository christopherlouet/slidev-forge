export function generatePackageJson(config) {
  const dependencies = {
    '@slidev/cli': '^0.50.0',
    '@slidev/theme-default': 'latest',
    vue: '^3.5.10',
  };
  if (config.slidev_theme !== 'default') {
    dependencies[`@slidev/theme-${config.slidev_theme}`] = 'latest';
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
      'playwright-chromium': '^1.47.2',
      prettier: '^3.3.3',
      'prettier-plugin-slidev': '^1.0.5',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
