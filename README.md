# slidev-forge

[![CI](https://github.com/christopherlouet/slidev-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/christopherlouet/slidev-forge/actions/workflows/ci.yml)
[![version](https://img.shields.io/badge/version-3.2.0-blue)](https://github.com/christopherlouet/slidev-forge/releases/tag/v3.2.0)
[![license](https://img.shields.io/github/license/christopherlouet/slidev-forge)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](package.json)

Scaffold complete [Slidev](https://sli.dev) presentation projects from a YAML config file or interactive prompts.

**Why?** Setting up a Slidev project with custom themes, layouts, deploy configs, and consistent structure takes time. `slidev-forge` does it in seconds — answer a few questions or point it at a YAML file and get a ready-to-present project.

## Quick Start

```bash
npx slidev-forge
```

Or from a YAML file:

```bash
npx slidev-forge presentation.yaml
```

```yaml
title: My Awesome Talk
author: Jane Doe
```

### Conference mode

Target a specific French tech conference with automatic branding:

```yaml
title: Clean Architecture in Practice
author: Jane Doe
conference: breizhcamp
preset: conference
```

The `conference` field auto-sets the event name, logo (SVG), and visual identity. 10 conferences supported:

🌊 BreizhCamp · 🗼 Devoxx France · 🏰 BDX I/O · ⛰️ AlpesCraft · 🎨 MiXiT · 🌋 Volcamp · ☀️ Sunny Tech · 🎯 DevFest Nantes · 🌴 Riviera DEV · ❄️ SnowCamp

```bash
npx slidev-forge conference list  # List all available conferences
```

## Documentation

Full documentation available at **[christopherlouet.github.io/slidev-forge](https://christopherlouet.github.io/slidev-forge/)**.

- [Getting Started](https://christopherlouet.github.io/slidev-forge/docs/getting-started/installation)
- [YAML Configuration Guide](https://christopherlouet.github.io/slidev-forge/docs/guides/yaml-configuration)
- [Configuration Reference](https://christopherlouet.github.io/slidev-forge/docs/reference/configuration)
- [Visual Themes](https://christopherlouet.github.io/slidev-forge/docs/reference/visual-themes)
- [CLI Reference](https://christopherlouet.github.io/slidev-forge/docs/cli/generate)
- [Examples](https://christopherlouet.github.io/slidev-forge/docs/examples/conference)

## Requirements

- Node.js >= 20

## License

[GPL-3.0](LICENSE)
