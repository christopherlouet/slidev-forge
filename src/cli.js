import { resolve, dirname, basename } from 'node:path';
import { stat, readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import pc from 'picocolors';
import { loadConfig, mergeDefaults, validateConfig } from './config.js';
import { generate } from './generator.js';
import { writeFile } from './writer.ts';
import { THEMES, DEFAULT_THEME } from './themes.ts';
import { slugify, expandHome } from './utils.js';

export const ALLOWED_PM = ['npm', 'pnpm', 'yarn', 'bun'];

export function resolveDestDir(rawPath) {
  return resolve(expandHome(rawPath));
}

export function parseArgs(args) {
  if (args.includes('--help') || args.includes('-h')) {
    return { mode: 'help' };
  }

  if (args.includes('--version') || args.includes('-v')) {
    return { mode: 'version' };
  }

  const flags = {};
  if (args.includes('--dry-run')) flags.dryRun = true;
  if (args.includes('--no-git')) flags.noGit = true;

  const positional = args.filter((a) => !a.startsWith('--'));

  const yamlArg = positional.find((a) => a.endsWith('.yaml') || a.endsWith('.yml'));
  if (yamlArg) {
    const remaining = positional.filter((a) => a !== yamlArg);
    return {
      mode: 'yaml',
      yamlPath: yamlArg,
      destDir: remaining[0] || undefined,
      ...flags,
    };
  }

  return { mode: 'interactive', destDir: positional[0], ...flags };
}

export function buildConfigFromArgs(answers) {
  const config = {
    title: answers.title,
    author: answers.author,
    visual_theme: answers.visual_theme,
    project_name: basename(resolveDestDir(answers.dest_dir)),
  };

  // If a preset is selected (not 'none'), use it instead of sections
  if (answers.preset && answers.preset !== 'none') {
    config.preset = answers.preset;
  } else {
    config.sections =
      answers.sections && answers.sections.trim()
        ? answers.sections.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Introduction', 'Références'];
  }

  if (answers.subtitle && answers.subtitle.trim()) {
    config.subtitle = answers.subtitle.trim();
  }
  if (answers.event_name && answers.event_name.trim()) {
    config.event_name = answers.event_name.trim();
  }
  if (answers.github && answers.github.trim()) {
    config.github = answers.github.trim();
  }

  return config;
}

export function showVersion() {
  const pkgPath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  console.log(pkg.version);
}

export function showHelp() {
  console.log(`
  ${pc.bold('slidev-forge')} - Generateur de projets Slidev

  ${pc.bold('Usage:')}
    slidev-forge                         Mode interactif
    slidev-forge <config.yaml> [dest]    Depuis un fichier YAML
    slidev-forge --help                  Afficher l'aide

  ${pc.bold('Themes visuels disponibles:')}`);
  for (const [key, theme] of Object.entries(THEMES)) {
    const marker = key === DEFAULT_THEME ? pc.dim(' (defaut)') : '';
    console.log(`    ${pc.cyan(key.padEnd(15))} ${theme.description}${marker}`);
  }
  console.log(`
  ${pc.bold('Exemple de YAML minimal:')}
    title: My Awesome Talk
    author: Jane Doe
`);
}

export async function promptInteractive() {
  const { input, select } = await import('@inquirer/prompts');

  const title = await input({ message: 'Titre de la presentation:' });
  const author = await input({ message: 'Auteur:' });
  const visual_theme = await select({
    message: 'Theme visuel:',
    choices: Object.entries(THEMES).map(([key, theme]) => ({
      name: `${pc.bold(theme.name)} - ${theme.description}`,
      value: key,
    })),
    default: DEFAULT_THEME,
  });

  const preset = await select({
    message: 'Preset de presentation:',
    choices: [
      { name: 'Aucun (sections manuelles)', value: 'none' },
      { name: 'Conference (30-45 min)', value: 'conference' },
      { name: 'Workshop (atelier pratique)', value: 'workshop' },
      { name: 'Lightning talk (5 min)', value: 'lightning' },
      { name: 'Pitch deck', value: 'pitch' },
    ],
    default: 'none',
  });

  const dest_dir = await input({
    message: 'Dossier de destination:',
    default: `./${slugify(title)}`,
  });
  const subtitle = await input({
    message: 'Sous-titre (optionnel, Entree pour passer):',
    default: '',
  });
  const event_name = await input({
    message: 'Evenement (optionnel, Entree pour passer):',
    default: '',
  });
  const github = await input({
    message: 'Identifiant GitHub (optionnel, Entree pour passer):',
    default: '',
  });

  let sections = '';
  if (preset === 'none') {
    sections = await input({
      message: 'Sections (separees par des virgules):',
      default: 'Introduction, Références',
    });
  }

  return { title, author, visual_theme, preset, dest_dir, subtitle, event_name, github, sections };
}

export async function run(args) {
  const parsed = parseArgs(args);

  if (parsed.mode === 'help') {
    showHelp();
    return;
  }

  if (parsed.mode === 'version') {
    showVersion();
    return;
  }

  let userConfig;
  let destDir;

  if (parsed.mode === 'yaml') {
    userConfig = await loadConfig(resolve(parsed.yamlPath));
    validateConfig(userConfig);
    userConfig = mergeDefaults(userConfig);
    destDir = parsed.destDir
      ? resolveDestDir(parsed.destDir)
      : resolve(userConfig.project_name);
  } else {
    const answers = await promptInteractive();
    userConfig = mergeDefaults(buildConfigFromArgs(answers));
    destDir = resolveDestDir(answers.dest_dir);
  }

  // Dry run: show what would be generated and exit
  if (parsed.dryRun) {
    console.log(`\n  ${pc.bold('Dry run - fichiers qui seraient generes:')}\n`);
    console.log(`  ${pc.bold('Dossier:')}   ${pc.cyan(destDir)}`);
    console.log(`  ${pc.bold('Theme:')}     ${userConfig.visual_theme}`);
    console.log(`  ${pc.bold('Sections:')}  ${userConfig.sections.length}`);
    return;
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
        console.log(pc.yellow('Generation annulee.'));
        return;
      }
    }
  } catch {
    // Directory doesn't exist, proceed
  }

  const result = await generate(userConfig, destDir, { noGit: parsed.noGit });

  // Save presentation.yaml in the generated project
  if (parsed.mode === 'interactive') {
    const yamlContent = stringify(userConfig);
    await writeFile(destDir, 'presentation.yaml', yamlContent);
    result.files.push('presentation.yaml');
  }

  // Summary
  console.log(`\n  ${pc.green(pc.bold('Projet genere avec succes!'))}\n`);
  console.log(`  ${pc.bold('Dossier:')}   ${pc.cyan(destDir)}`);
  console.log(`  ${pc.bold('Theme:')}     ${userConfig.visual_theme}`);
  console.log(`  ${pc.bold('Sections:')}  ${userConfig.sections.length}`);

  const deploy = userConfig.deploy || [];
  if (deploy.length > 0) {
    console.log(`  ${pc.bold('Deploy:')}    ${deploy.join(', ')}`);
  }

  console.log(`\n  ${pc.bold(`${result.files.length} fichiers crees:`)}`);
  for (const f of result.files.sort()) {
    console.log(`    ${pc.dim(f)}`);
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

    if (pm !== 'skip' && ALLOWED_PM.includes(pm)) {
      const { execSync } = await import('node:child_process');
      console.log(`\n  ${pc.cyan(`Installation avec ${pm}...`)}`);
      execSync(`${pm} install`, { cwd: destDir, stdio: 'inherit' });
    }
  } catch {
    // Non-interactive environment, skip
  }

  console.log(`\n  ${pc.bold('Prochaines etapes:')}`);
  console.log(`    ${pc.cyan(`cd ${destDir}`)}`);
  console.log(`    ${pc.cyan('npm run dev')}\n`);
}
