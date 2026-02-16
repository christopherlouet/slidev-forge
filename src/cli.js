import { resolve } from 'node:path';
import { stat } from 'node:fs/promises';
import { stringify } from 'yaml';
import { loadConfig, mergeDefaults, validateConfig } from './config.js';
import { generate } from './generator.js';
import { writeFile } from './writer.js';
import { THEMES, DEFAULT_THEME } from './themes.js';

export function parseArgs(args) {
  if (args.includes('--help') || args.includes('-h')) {
    return { mode: 'help' };
  }

  const yamlArg = args.find((a) => a.endsWith('.yaml') || a.endsWith('.yml'));
  if (yamlArg) {
    const remaining = args.filter((a) => a !== yamlArg);
    return {
      mode: 'yaml',
      yamlPath: yamlArg,
      destDir: remaining[0] || undefined,
    };
  }

  return { mode: 'interactive', destDir: args[0] };
}

export function buildConfigFromArgs(answers) {
  const sections =
    answers.sections && answers.sections.trim()
      ? answers.sections.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Introduction', 'Références'];

  return {
    title: answers.title,
    author: answers.author,
    visual_theme: answers.visual_theme,
    project_name: answers.project_name,
    sections,
  };
}

export function showHelp() {
  console.log(`
  slidev-forge - Generateur de projets Slidev

  Usage:
    slidev-forge                         Mode interactif
    slidev-forge <config.yaml> [dest]    Depuis un fichier YAML
    slidev-forge --help                  Afficher l'aide

  Themes visuels disponibles:`);
  for (const [key, theme] of Object.entries(THEMES)) {
    const marker = key === DEFAULT_THEME ? ' (defaut)' : '';
    console.log(`    ${key.padEnd(15)} ${theme.description}${marker}`);
  }
  console.log(`
  Exemple de YAML minimal:
    title: Mon Super Talk
    author: Christopher Louet
`);
}

export async function promptInteractive() {
  const { input, select } = await import('@inquirer/prompts');

  const title = await input({ message: 'Titre de la presentation:' });
  const author = await input({
    message: 'Auteur:',
    default: 'Christopher Louet',
  });
  const visual_theme = await select({
    message: 'Theme visuel:',
    choices: Object.entries(THEMES).map(([key, theme]) => ({
      name: `${theme.name} - ${theme.description}`,
      value: key,
    })),
    default: DEFAULT_THEME,
  });

  const slugify = (text) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const project_name = await input({
    message: 'Nom du projet (dossier):',
    default: slugify(title),
  });
  const sections = await input({
    message: 'Sections (separees par des virgules):',
    default: 'Introduction, Références',
  });

  return { title, author, visual_theme, project_name, sections };
}

export async function run(args) {
  const parsed = parseArgs(args);

  if (parsed.mode === 'help') {
    showHelp();
    return;
  }

  let userConfig;
  let destDir;

  if (parsed.mode === 'yaml') {
    userConfig = await loadConfig(resolve(parsed.yamlPath));
    validateConfig(userConfig);
    userConfig = mergeDefaults(userConfig);
    destDir = parsed.destDir
      ? resolve(parsed.destDir)
      : resolve(userConfig.project_name);
  } else {
    const answers = await promptInteractive();
    userConfig = mergeDefaults(buildConfigFromArgs(answers));
    destDir = resolve(userConfig.project_name);
  }

  // Check if destination exists and is non-empty
  try {
    const dirStat = await stat(destDir);
    if (dirStat.isDirectory()) {
      const { confirm } = await import('@inquirer/prompts');
      const overwrite = await confirm({
        message: `Le dossier "${destDir}" existe deja. Ecraser ?`,
        default: false,
      });
      if (!overwrite) {
        console.log('Generation annulee.');
        return;
      }
    }
  } catch {
    // Directory doesn't exist, proceed
  }

  const result = await generate(userConfig, destDir);

  // Save presentation.yaml in the generated project
  if (parsed.mode === 'interactive') {
    const yamlContent = stringify(userConfig);
    await writeFile(destDir, 'presentation.yaml', yamlContent);
    result.files.push('presentation.yaml');
  }

  // Summary
  console.log(`\n  Projet genere dans ${destDir}\n`);
  console.log(`  ${result.files.length} fichiers crees:`);
  for (const f of result.files.sort()) {
    console.log(`    ${f}`);
  }

  // Propose install
  try {
    const { select } = await import('@inquirer/prompts');
    const pm = await select({
      message: 'Installer les dependances ?',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'bun', value: 'bun' },
        { name: 'Non, plus tard', value: 'skip' },
      ],
    });

    if (pm !== 'skip') {
      const { execSync } = await import('node:child_process');
      console.log(`\n  Installation avec ${pm}...`);
      execSync(`${pm} install`, { cwd: destDir, stdio: 'inherit' });
    }
  } catch {
    // Non-interactive environment, skip
  }

  console.log(`\n  Prochaines etapes:`);
  console.log(`    cd ${userConfig.project_name}`);
  console.log(`    npm run dev\n`);
}
