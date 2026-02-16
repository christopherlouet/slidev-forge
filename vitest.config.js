import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/static/**',
        'bin/**',
        'tests/**',
        'vitest.config.js',
      ],
    },
  },
});
