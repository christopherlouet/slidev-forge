import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/static/**',
        'bin/**',
        'dist/**',
        'tests/**',
        'vitest.config.js',
        'website/**',
      ],
    },
  },
});
