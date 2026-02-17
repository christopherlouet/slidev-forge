import { resolve, dirname, basename } from 'node:path';
import { stat, readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import pc from 'picocolors';
import { loadConfig, mergeDefaults, validateConfig } from './config.js';
import { generate } from './generator.js';
import { writeFile } from './writer.js';
import { THEMES, DEFAULT_THEME } from './themes.js';
import { slugify, expandHome } from './utils.js';
import { loadGlobalConfig, mergeGlobalConfig } from './global-config.js';
import type { ParsedArgs, UserConfig, ResolvedConfig } from './types.js';

export const ALLOWED_PM = ['npm', 'pnpm', 'yarn', 'bun'] as const;

export function resolveDestDir(rawPath: string): string {
  return resolve(expandHome(rawPath));
}

const SUBCOMMANDS = ['validate', 'add', 'theme', 'config', 'regenerate'] as const;

export function parseArgs(args: string[]): ParsedArgs {
  if (args.includes('--help') || args.includes('-h')) {
    return { mode: 'help' };
  }

  if (args.includes('--version') || args.includes('-v')) {
    return { mode: 'version' };
  }

  // Check for subcommands
  const firstArg = args[0];
  if (firstArg && (SUBCOMMANDS as readonly string[]).includes(firstArg)) {
    return {
      mode: 'subcommand',
      subcommand: firstArg,
      subcommandArgs: args.slice(1),
    };
  }

  const flags: { dryRun?: boolean; noGit?: boolean } = {};
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

interface InteractiveAnswers {
  title: string;
  author: string;
  visual_theme: string;
  preset: string;
  dest_dir: string;
  subtitle: string;
  event_name: string;
  github: string;
  sections: string;
}

export function buildConfigFromArgs(answers: InteractiveAnswers): UserConfig {
  const config: UserConfig = {
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

export function showVersion(): void {
  const pkgPath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  console.log(pkg.version);
}

export function showHelp(): void {
  console.log(`
  ${pc.bold('slidev-forge')} - Generateur de projets Slidev

  ${pc.bold('Usage:')}
    slidev-forge                              Mode interactif
    slidev-forge <config.yaml> [dest]         Depuis un fichier YAML
    slidev-forge --help                       Afficher l'aide
    slidev-forge --version                    Afficher la version

  ${pc.bold('Options:')}
    --dry-run                                 Previsualiser sans generer
    --no-git                                  Ne pas initialiser de depot git

  ${pc.bold('Commandes:')}
    validate <config.yaml>                    Valider un fichier de configuration
    add section "Nom" [--type <type>]         Ajouter une section au projet
    theme [<nom>]                             Lister ou changer le theme visuel
    config get <cle>                          Lire une valeur de configuration
    config set <cle> <valeur>                 Modifier une valeur de configuration
    regenerate [--dry-run]                    Synchroniser slides.md avec presentation.yaml

  ${pc.bold('Options des commandes:')}
    --path <dir>                              Dossier du projet (defaut: repertoire courant)

  ${pc.bold('Types de sections:')}
    default, two-cols, image-right, quote, qna, thanks, about, code, diagram,
    cover, iframe, steps, fact

  ${pc.bold('Themes visuels disponibles:')}`);
  for (const [key, theme] of Object.entries(THEMES)) {
    const marker = key === DEFAULT_THEME ? pc.dim(' (defaut)') : '';
    console.log(`    ${pc.cyan(key.padEnd(15))} ${theme.description}${marker}`);
  }
  console.log(`
  ${pc.bold('Exemple de YAML minimal:')}
    title: My Awesome Talk
    author: Jane Doe

  ${pc.bold('Exemples:')}
    slidev-forge                              Creer un projet interactivement
    slidev-forge presentation.yaml ./dest     Generer depuis un fichier YAML
    slidev-forge add section "Demo" --type code
    slidev-forge add section "API" --path ~/Presentations/talk
    slidev-forge theme tokyo-night
    slidev-forge regenerate --dry-run
`);
}

export async function promptInteractive(): Promise<InteractiveAnswers> {
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
    loop: false,
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

export async function run(args: string[]): Promise<void> {
  const parsed = parseArgs(args);

  if (parsed.mode === 'help') {
    showHelp();
    return;
  }

  if (parsed.mode === 'version') {
    showVersion();
    return;
  }

  if (parsed.mode === 'subcommand') {
    const subArgs = parsed.subcommandArgs || [];
    switch (parsed.subcommand) {
      case 'validate': {
        const { runValidate } = await import('./commands/validate.js');
        await runValidate(subArgs);
        return;
      }
      case 'add': {
        const { runAdd } = await import('./commands/add.js');
        await runAdd(subArgs);
        return;
      }
      case 'theme': {
        const { runTheme } = await import('./commands/theme.js');
        await runTheme(subArgs);
        return;
      }
      case 'config': {
        const { runConfig } = await import('./commands/config.js');
        await runConfig(subArgs);
        return;
      }
      case 'regenerate': {
        const { runRegenerate } = await import('./commands/regenerate.js');
        const result = await runRegenerate(subArgs);
        if (!result.success) {
          console.error(pc.red(result.error || 'Regeneration failed'));
          process.exit(1);
        }
        if (result.dryRun) {
          console.log(`\n  ${pc.bold('Dry run - changes that would be applied:')}\n`);
        } else {
          console.log(`\n  ${pc.green(pc.bold('Regeneration successful!'))}\n`);
          if (result.backupPath) {
            console.log(`  ${pc.bold('Backup:')} ${pc.dim(result.backupPath)}`);
          }
        }
        for (const action of result.actions) {
          const icon =
            action.type === 'add' ? pc.green('+') :
            action.type === 'remove' ? pc.red('-') :
            action.type === 'keep' ? pc.dim('=') :
            pc.cyan('~');
          console.log(`  ${icon} ${action.sectionName} (${action.type})`);
        }
        if (!result.dryRun && result.filesUpdated.length > 0) {
          console.log(`\n  ${pc.bold(`${result.filesUpdated.length} files updated:`)}`);
          for (const f of result.filesUpdated) {
            console.log(`    ${pc.dim(f)}`);
          }
        }
        console.log('');
        return;
      }
      default:
        console.error(`Unknown subcommand: ${parsed.subcommand}`);
        return;
    }
  }

  let userConfig: ResolvedConfig;
  let destDir: string;

  // Load global preferences
  const globalConfig = await loadGlobalConfig();

  if (parsed.mode === 'yaml') {
    const rawConfig = await loadConfig(resolve(parsed.yamlPath!));
    validateConfig(rawConfig);
    userConfig = mergeDefaults(mergeGlobalConfig(globalConfig, rawConfig));
    destDir = parsed.destDir
      ? resolveDestDir(parsed.destDir)
      : resolve(userConfig.project_name);
  } else {
    const answers = await promptInteractive();
    userConfig = mergeDefaults(mergeGlobalConfig(globalConfig, buildConfigFromArgs(answers)));
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

    const PM_COMMANDS: Record<string, [string, string]> = {
      npm: ['npm', 'install'],
      pnpm: ['pnpm', 'install'],
      yarn: ['yarn', 'install'],
      bun: ['bun', 'install'],
    };
    const cmd = PM_COMMANDS[pm];
    if (cmd) {
      const { execFileSync } = await import('node:child_process');
      console.log(`\n  ${pc.cyan(`Installation avec ${pm}...`)}`);
      execFileSync(cmd[0], [cmd[1]], { cwd: destDir, stdio: 'inherit' });
    }
  } catch {
    // Non-interactive environment, skip
  }

  console.log(`\n  ${pc.bold('Prochaines etapes:')}`);
  console.log(`    ${pc.cyan(`cd ${destDir}`)}`);
  console.log(`    ${pc.cyan('npm run dev')}\n`);
}
