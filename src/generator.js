import { spawnSync } from 'node:child_process';
import { writeFile, copyStaticFile } from './writer.js';
import { generateSlides } from './templates/slides.js';
import { generatePackageJson } from './templates/package-json.js';
import { generateReadme } from './templates/readme.js';
import { generateStyles } from './templates/styles.js';
import { generateDeployYml } from './templates/deploy-github.js';
import { getStaticFiles } from './templates/static.js';

export async function generate(config, destDir, options = {}) {
  const files = [];

  files.push(await writeFile(destDir, 'slides.md', generateSlides(config)));
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
