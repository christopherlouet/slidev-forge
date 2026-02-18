# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-02-18

### Added

- **Contextual speaker notes** per section type with FR/EN i18n support
- **v-click animations** intelligently applied per layout type (`<v-clicks>` wrapper, `<v-click>` on specific elements)
- **Progressive code highlighting** with `{1-3|5-8}` syntax for step-by-step reveal
- **External code file import** via Slidev `<<< @/path` syntax with optional highlights
- **Per-section transition override** allowing different transitions within a single presentation
- **4 new layouts**: `section-divider`, `statement`, `image-left`, `image`
- **Enriched preset content** via `preset-content.ts` registry providing rich example content per preset/section/language
- **Keynote preset** with 17 sections (cover, statement, about, facts, image, steps, code, diagram, two-cols, qna, thanks)
- New Section interface fields: `content`, `clicks`, `highlights`, `file`, `transition`
- 12 new i18n translation keys for preset sections and layouts
- 160+ new tests (869 total)

### Changed

- **conference** preset: 7 → 13 sections (added section-dividers, steps, diagram, fact)
- **workshop** preset: 7 → 13 sections (added section-dividers, checkpoints, diagram)
- **lightning** preset: 4 → 6 sections (added statement hook, thanks)
- **pitch** preset: 7 → 11 sections (added statement hook, section-divider, fact)
- Refactored shared `section-content.ts` extracted from `slides.ts` and `multi-file.ts` to eliminate duplication

## [2.1.0] - 2026-02-18

### Added

- **YAML scalar sanitization** (`sanitizeYamlScalar`): strips `\r`/`\n` from user-controlled values to prevent YAML injection via newlines in title, author, favicon, fonts, and addons
- **CSS URL path validation** (`sanitizeCssUrlPath`): validates logo paths against a safe character regex to prevent CSS injection via `url()`
- **Config input validation**: validates github username, favicon URL/path, logo path, addon names, font keys/values, section image URLs, and diagram types at config merge time
- **Mermaid diagram type whitelist**: only allows known mermaid diagram types (flowchart, sequenceDiagram, classDiagram, etc.)
- **Config key whitelist**: `config set` command now rejects unknown configuration keys
- **20 new security tests**: covering YAML injection, CSS injection, GitHub username validation, favicon/logo/image validation, diagram type validation, addon/font sanitization

### Changed

- YAML frontmatter values (title, author, favicon, fonts, addons) are now single-quoted for defense-in-depth
- GitHub link in title slide now uses `escapeHtmlAttribute()` for href values
- Logo CSS block is skipped silently if path validation fails (defense-in-depth)

### Security

- **YAML injection via newlines**: title/author/favicon/fonts/addons values with `\n`/`\r` are sanitized before template output
- **CSS injection via logo**: logo path validated against `/^[a-zA-Z0-9._\/-]+$/`
- **HTML injection via GitHub link**: username and project_name escaped with `escapeHtmlAttribute()`
- **Invalid favicon URLs rejected**: `javascript:` and other non-http(s) schemes blocked
- **Invalid section images rejected**: only valid http(s) URLs accepted
- **Mermaid directive injection blocked**: diagram types validated against whitelist
- **Arbitrary config keys blocked**: `config set` only accepts known UserConfig fields

## [2.0.0] - 2026-02-17

### Added

- **Slide parser** (`src/parser.ts`): splits slides.md by `---` separators, extracts section markers and sub-frontmatter while handling code blocks correctly
- **Slide merger** (`src/merger.ts`): diffs YAML config against parsed slides, preserves user content modifications with add/remove/keep/update-meta actions
- **Regenerate command** (`slidev-forge regenerate`): non-destructive slide regeneration with `--dry-run` preview and automatic backup
- **Section markers** (`<!-- section:id=xxx -->`): injected in generated slides for stable identification across regenerations
- **Section ID generation**: slugify + dedup algorithm in utils for deterministic section identifiers
- **6 new section types**: code, diagram, cover, iframe, steps, fact
- **4 presets**: conference, workshop, pitch, lightning with localized section structures
- **Internationalization** (i18n): fr/en translations for generated content, README, and section names
- **Global configuration** (`~/.slidev-forge.yaml`): user-wide default preferences
- **Multi-file pages/ mode**: alternative generation with individual page files
- **CLI subcommands**: validate, add, theme, config for project management
- **Frontmatter options**: fonts, lineNumbers, aspectRatio, colorSchema, favicon, download, htmlAttrs, addons
- **Addons support**: configurable Slidev addons in generated package.json
- **Branding**: social links on title/thanks slides, logo positioning in CSS, global-bottom.vue footer
- **CLI flags**: `--version`, `--dry-run`, `--no-git`, preset selection in interactive prompt
- **Security tests**: path traversal prevention, YAML injection protection, input sanitization (9 tests)
- **Docusaurus documentation website** with guides, CLI reference, and examples
- **GitHub Actions workflow** for documentation deployment to GitHub Pages

### Changed

- **Full TypeScript migration**: all source files migrated from JavaScript to TypeScript with strict types
- **Build output**: switched from src/ to dist/ distribution, build copies static assets
- **Binary entry point**: renamed to `slidev-forge`
- **Dependencies**: bumped @inquirer/prompts (^7.10.1), yaml (^2.8.2)
- **README**: simplified to point to documentation website

### Removed

- **Plugin system** (`src/plugins.ts`): removed in favor of built-in section types
- Project-specific examples replaced with generic ones

### Fixed

- Custom theme registration and hex color validation
- TypeScript strict mode compliance across CLI commands

## [1.1.0] - 2026-02-16

### Added

- 3 new visual themes: github-light, rose-pine, one-dark-pro
- Enriched theme model with accentColor, linkColor, codeBlockBg, backgroundColor, textColor
- Complete CSS generation: links, hover, code blocks, list markers
- Custom theme support via `visual_theme: custom` with `colors: { primary, secondary }`
- 7 section types: default, two-cols, image-right, quote, qna, thanks, about
- Special slides: Q&A (centered), thanks (with GitHub link), about (with author bio)
- Presenter notes placeholders in all section slides
- Reusable Vue components: Counter, CodeComparison
- Custom Slidev layouts: two-cols-header, image-right, quote
- Conditional components/layouts inclusion via `options.components`
- Optional CLI prompts: subtitle, event_name, github
- Colored CLI output with picocolors
- Enriched generation summary (theme, sections count, deploy platforms)
- Input validation for visual_theme, transition, and package manager
- `sanitizeProjectName()` to prevent path traversal
- `normalizeSections()` for string-to-object conversion
- Shared `src/utils.js` module (slugify, sanitizeProjectName)
- Test coverage measurement with @vitest/coverage-v8
- GPL-3.0 license
- CI workflow with security jobs (npm audit, CodeQL)

### Changed

- Default deploy reduced to github-pages only (was github-pages + vercel + netlify)
- GitHub Actions deploy workflow rewritten with official actions (deploy-pages, upload-pages-artifact, configure-pages)
- Build uses `npx slidev build` instead of global install
- Matrix theme improved with cyan accents and richer palette
- Sections format changed from string arrays to objects `{ name, type }`

### Fixed

- Duplicate @slidev/theme-default in generated package.json when slidev_theme is "default"
- Hardcoded `transition: slide-left` in TOC and section slides now uses config value
- Removed duplicated slugify functions from config.js and cli.js

## [1.0.0] - 2026-02-16

### Added

- CLI scaffolding from YAML config or interactive prompts
- 7 visual themes: cyberpunk, matrix, dracula, catppuccin, nord, gruvbox, tokyo-night
- Slidev project generation: slides.md, package.json, README.md, styles, static files
- GitHub Pages deploy workflow generation
- Export configuration (PDF, dark mode, with clicks)
- Code snippets support
- Git repository initialization in generated project
- Dependency installation prompt (npm, pnpm, yarn, bun)
