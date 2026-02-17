import { resolve, join } from 'node:path';
import { readFile, writeFile as fsWriteFile, mkdir, readdir } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import pc from 'picocolors';
import { SECTION_TYPES, mergeDefaults } from '../config.js';
import { loadGlobalConfig, mergeGlobalConfig } from '../global-config.js';
import { generateSectionIds, slugify } from '../utils.js';
import { padIndex, generateSectionPage } from '../templates/multi-file.js';
import type { UserConfig, Section } from '../types.js';

export async function runAdd(args: string[]): Promise<void> {
  const subType = args[0]; // 'section'
  if (subType !== 'section') {
    console.error(pc.red('Usage: slidev-forge add section "Name" [--type code]'));
    process.exit(1);
  }

  const name = args[1];
  if (!name) {
    console.error(pc.red('Section name is required.'));
    process.exit(1);
  }

  // Parse --type flag (trim trailing punctuation from copy-paste errors)
  const typeIdx = args.indexOf('--type');
  const rawType = typeIdx !== -1 && args[typeIdx + 1] ? args[typeIdx + 1] : 'default';
  const sectionType = rawType.replace(/[,;]+$/, '').trim();

  if (!SECTION_TYPES.includes(sectionType)) {
    console.warn(pc.yellow(`Unknown section type "${sectionType}", using "default"`));
  }

  // Parse --path flag
  const pathIdx = args.indexOf('--path');
  const projectDir = pathIdx !== -1 && args[pathIdx + 1] ? resolve(args[pathIdx + 1]) : process.cwd();
  const yamlPath = resolve(projectDir, 'presentation.yaml');
  let config: UserConfig;
  try {
    const content = await readFile(yamlPath, 'utf-8');
    config = parse(content) as UserConfig;
  } catch {
    console.error(pc.red(`Cannot read ${yamlPath}. Run this command from a slidev-forge project directory.`));
    process.exit(1);
  }

  // Add section
  const newSection: Section = { name, type: SECTION_TYPES.includes(sectionType) ? sectionType : 'default' };
  if (!config.sections) {
    config.sections = [];
  }
  (config.sections as Section[]).push(newSection);

  // Write back presentation.yaml
  await fsWriteFile(yamlPath, stringify(config), 'utf-8');
  console.log(pc.green(`Section "${name}" (type: ${newSection.type}) added to ${yamlPath}`));

  // If multi-file mode: create page file and update slides.md
  const pagesDir = resolve(projectDir, 'pages');
  const slidesPath = resolve(projectDir, 'slides.md');
  let hasPages = false;
  try {
    await readdir(pagesDir);
    hasPages = true;
  } catch {
    // No pages/ directory = single-file mode
  }

  if (hasPages) {
    // Resolve config to get transition, language, etc.
    const globalConfig = await loadGlobalConfig();
    const resolvedConfig = mergeDefaults(mergeGlobalConfig(globalConfig, config));

    // Determine page index from existing pages
    const existingPages = await readdir(pagesDir);
    const pageFiles = existingPages.filter((f) => f.endsWith('.md')).sort();
    const nextIndex = pageFiles.length + 1;

    // Generate section ID
    const sectionIds = generateSectionIds(resolvedConfig.sections);
    const id = sectionIds.get(newSection) || slugify(name);

    // Generate page file
    const slug = slugify(name);
    const pagePath = `pages/${padIndex(nextIndex)}-${slug}.md`;
    const pageContent = generateSectionPage(newSection, resolvedConfig, id);
    await mkdir(pagesDir, { recursive: true });
    await fsWriteFile(resolve(projectDir, pagePath), pageContent, 'utf-8');
    console.log(pc.green(`Page created: ${pagePath}`));

    // Append src reference to slides.md
    try {
      let slidesContent = await readFile(slidesPath, 'utf-8');
      // Remove trailing whitespace/newlines, then append the new src block
      slidesContent = slidesContent.trimEnd();
      slidesContent += `\n\n---\nsrc: ./${pagePath}\n---\n`;
      await fsWriteFile(slidesPath, slidesContent, 'utf-8');
      console.log(pc.green(`Reference added to slides.md`));
    } catch {
      console.warn(pc.yellow(`Could not update slides.md. Add manually: src: ./${pagePath}`));
    }
  }
}
