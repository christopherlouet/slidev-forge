---
sidebar_position: 1
---

# Configuration Reference

Complete reference for all YAML configuration options in slidev-forge.

## Core Options

Essential fields required for every presentation.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `title` | Yes | - | Presentation title |
| `author` | Yes | - | Author name |
| `subtitle` | No | - | Subtitle shown on title slide |
| `event_name` | No | - | Event name displayed above the title |
| `conference` | No | - | Conference from built-in registry (auto-sets event_name, logo) |
| `language` | No | `fr` | Presentation language (`fr`, `en`) |

### Example

```yaml
title: "Introduction to Web Development"
subtitle: "From HTML to modern frameworks"
author: "Jane Doe"
event_name: "Tech Meetup"
language: en

# Or use the conference registry (auto-fills event_name and logo)
conference: breizhcamp
```

### Conference Registry

Instead of manually setting `event_name` and `logo`, use the `conference` field to select from 10 built-in French tech conferences:

```yaml
conference: breizhcamp   # Auto-sets event_name: "BreizhCamp", logo: breizhcamp.svg
```

Available conferences: `breizhcamp`, `devoxx-fr`, `bdx-io`, `alpescraft`, `mixit`, `volcamp`, `sunny-tech`, `devfest-nantes`, `riviera-dev`, `snowcamp`.

The conference logo SVG is automatically copied to `public/` during generation and displayed on slides. Use `slidev-forge conference list` to see all options.

## Theming Options

Configure visual appearance and Slidev theme.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `slidev_theme` | No | `seriph` | Slidev theme from npm |
| `visual_theme` | No | `cyberpunk` | Color palette (see [Visual Themes](./visual-themes.md)) |
| `colors.primary` | No | - | Primary color for custom theme |
| `colors.secondary` | No | - | Secondary color for custom theme |
| `color_schema` | No | - | Color schema (`light`, `dark`, `auto`) |
| `fonts` | No | - | Font configuration (`sans`, `mono`, etc.) |

### Example

```yaml
slidev_theme: seriph
visual_theme: dracula

# Or use a custom theme
visual_theme: custom
colors:
  primary: "#FF5733"
  secondary: "#33C1FF"

# Font configuration
fonts:
  sans: "Roboto"
  mono: "Fira Code"
```

## Structure Options

Control presentation structure and content.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `project_name` | No | slugified title | Folder name and package name |
| `preset` | No | - | Preset template (`conference`, `workshop`, `lightning`, `pitch`) |
| `sections` | No | `[Introduction, Références]` | List of sections (strings or objects) |
| `multi_file` | No | `true` | Generate pages/ multi-file structure |
| `transition` | No | `slide-left` | Slide transition (see [Transitions](./transitions.md)) |

### Example

```yaml
project_name: my-awesome-talk
preset: conference
multi_file: true
transition: fade

# Or define sections manually
sections:
  - name: Introduction
  - name: Demo
    type: code
    lang: python
  - name: Q&A
    type: qna
```

## Deployment Options

Configure deployment targets and export settings.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `deploy` | No | `[github-pages]` | Deploy targets: `github-pages`, `vercel`, `netlify` |
| `export.format` | No | `pdf` | Export format |
| `export.dark` | No | `false` | Dark mode export |
| `export.with_clicks` | No | `false` | Include click animations |

### Example

```yaml
deploy:
  - github-pages
  - vercel

export:
  format: pdf
  dark: false
  with_clicks: false
```

## Display Options

Configure slide appearance and UI elements.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `line_numbers` | No | `false` | Show line numbers in code blocks |
| `slide_numbers` | No | `false` | Show slide numbers |
| `aspect_ratio` | No | - | Slide aspect ratio (e.g. `16/9`, `4/3`) |
| `footer` | No | - | Footer text on all slides |
| `logo` | No | - | Logo image path |
| `favicon` | No | - | Favicon path |
| `download` | No | `false` | Enable PDF download button |

### Example

```yaml
line_numbers: true
slide_numbers: true
aspect_ratio: "16/9"
footer: "My Company © 2026"
logo: "/logo.png"
favicon: "/favicon.ico"
download: true
```

## Social & Contact

Configure author links and social profiles.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `github` | No | - | GitHub username (adds link on title slide) |
| `social` | No | - | Social links (twitter, github, linkedin, etc.) |

### Example

```yaml
github: janedoe

social:
  twitter: janedoe
  linkedin: janedoe
  github: janedoe
  website: https://janedoe.dev
  youtube: janedoe
  mastodon: "@janedoe@mastodon.social"
  bluesky: janedoe.bsky.social
  instagram: janedoe
  email: jane@example.com
```

## Advanced Options

Additional configuration options.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `addons` | No | - | Slidev addons to install |
| `options.snippets` | No | `true` | Include snippets/ directory |
| `options.components` | No | `true` | Include reusable Vue components and layouts |

### Example

```yaml
addons:
  - slidev-addon-excalidraw
  - slidev-addon-qrcode

options:
  snippets: true
  components: true
```

## Complete Example

```yaml
# Core
title: "Introduction to Web Development"
subtitle: "From HTML to modern frameworks"
author: "Jane Doe"
conference: devoxx-fr
language: en

# Theming
slidev_theme: seriph
visual_theme: dracula
transition: fade

# Structure
preset: conference
multi_file: true

# Display
line_numbers: true
slide_numbers: true
aspect_ratio: "16/9"
footer: "Tech Meetup © 2026"

# Social
github: janedoe
social:
  twitter: janedoe
  website: https://janedoe.dev

# Deployment
deploy:
  - github-pages

# Export
export:
  format: pdf
  dark: false
  with_clicks: false

# Options
options:
  snippets: true
  components: true
```

## Global Configuration

You can set default preferences for all projects in `~/.slidev-forge.yaml`:

```yaml
author: Jane Doe
visual_theme: tokyo-night
language: en
github: janedoe
```

Project-level values always override global defaults.
