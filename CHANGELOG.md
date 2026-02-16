# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
