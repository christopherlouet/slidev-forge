import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { writeFile, copyStaticFile } from './writer.js';
import { escapeHtml } from './utils.js';
import { getConference, CONFERENCE_ASSETS_DIR } from './conferences.js';
import { generateSlides } from './templates/slides.js';
import { generateMultiFile } from './templates/multi-file.js';
import { generatePackageJson } from './templates/package-json.js';
import { generateReadme } from './templates/readme.js';
import { generateStyles } from './templates/styles.js';
import { generateDeployYml } from './templates/deploy-github.js';
import { getStaticFiles } from './templates/static.js';
import type { ResolvedConfig, GenerateResult, GenerateOptions } from './types.js';

export async function generate(config: ResolvedConfig, destDir: string, options: GenerateOptions = {}): Promise<GenerateResult> {
  const files: string[] = [];

  // Generate slides (single file or multi-file)
  if (config.multi_file) {
    const multiOutput = generateMultiFile(config);
    files.push(await writeFile(destDir, 'slides.md', multiOutput.slidesMain));
    for (const page of multiOutput.pages) {
      files.push(await writeFile(destDir, page.path, page.content));
    }
  } else {
    files.push(await writeFile(destDir, 'slides.md', generateSlides(config)));
  }

  files.push(await writeFile(destDir, 'package.json', generatePackageJson(config)));
  files.push(await writeFile(destDir, 'README.md', generateReadme(config)));
  files.push(await writeFile(destDir, 'styles/index.css', generateStyles(config)));

  // Deploy configs
  const deploy = config.deploy || [];
  if (deploy.includes('github-pages')) {
    files.push(
      await writeFile(destDir, '.github/workflows/deploy.yml', generateDeployYml(config)),
    );
  }

  // Static files
  const staticFiles = getStaticFiles(config);
  for (const { src, dest } of staticFiles) {
    files.push(await copyStaticFile(src, destDir, dest));
  }

  // Footer component
  if (config.footer) {
    const escapedFooter = escapeHtml(config.footer);
    const footerVue = `<template>
  <div class="absolute bottom-1 left-0 right-0 text-center text-xs opacity-40 pointer-events-none">
    ${escapedFooter}
  </div>
</template>
`;
    files.push(await writeFile(destDir, 'global-bottom.vue', footerVue));
  }

  // Conference logo: copy SVG to public/ for local serving
  if (config.conference) {
    const conf = getConference(config.conference);
    if (conf) {
      const logoSrc = resolve(CONFERENCE_ASSETS_DIR, conf.logo);
      files.push(await copyStaticFile(logoSrc, destDir, `public/${conf.logo}`));
    }
  }

  // Empty directories
  files.push(await writeFile(destDir, 'docs/.gitkeep', ''));
  files.push(await writeFile(destDir, 'dist/.gitkeep', ''));
  files.push(await writeFile(destDir, 'public/.gitkeep', ''));

  // Init git repository
  if (!options.noGit) {
    try {
      spawnSync('git', ['init'], { cwd: destDir, stdio: 'ignore' });
    } catch {
      // git not available, skip silently
    }
  }

  return { files, destDir };
}
