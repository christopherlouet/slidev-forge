import { resolve } from 'node:path';

const STATIC_DIR = resolve(import.meta.dirname, '../static');

export function getStaticFiles(config) {
  const files = [
    { src: resolve(STATIC_DIR, '.npmrc'), dest: '.npmrc' },
    { src: resolve(STATIC_DIR, '.prettierrc.json'), dest: '.prettierrc.json' },
    { src: resolve(STATIC_DIR, 'gitignore-template'), dest: '.gitignore' },
  ];

  if (config.options?.snippets) {
    files.push({
      src: resolve(STATIC_DIR, 'snippets/external.ts'),
      dest: 'snippets/external.ts',
    });
  }

  if (config.options?.components !== false) {
    files.push(
      { src: resolve(STATIC_DIR, 'components/Counter.vue'), dest: 'components/Counter.vue' },
      { src: resolve(STATIC_DIR, 'components/CodeComparison.vue'), dest: 'components/CodeComparison.vue' },
      { src: resolve(STATIC_DIR, 'layouts/two-cols-header.vue'), dest: 'layouts/two-cols-header.vue' },
      { src: resolve(STATIC_DIR, 'layouts/image-right.vue'), dest: 'layouts/image-right.vue' },
      { src: resolve(STATIC_DIR, 'layouts/quote.vue'), dest: 'layouts/quote.vue' },
    );
  }

  const deploy = config.deploy || [];
  if (deploy.includes('netlify')) {
    files.push({ src: resolve(STATIC_DIR, 'netlify.toml'), dest: 'netlify.toml' });
  }
  if (deploy.includes('vercel')) {
    files.push({ src: resolve(STATIC_DIR, 'vercel.json'), dest: 'vercel.json' });
  }

  return files;
}
