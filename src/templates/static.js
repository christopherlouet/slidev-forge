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

  const deploy = config.deploy || [];
  if (deploy.includes('netlify')) {
    files.push({ src: resolve(STATIC_DIR, 'netlify.toml'), dest: 'netlify.toml' });
  }
  if (deploy.includes('vercel')) {
    files.push({ src: resolve(STATIC_DIR, 'vercel.json'), dest: 'vercel.json' });
  }

  return files;
}
