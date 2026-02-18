---
sidebar_position: 1
---

# YAML Configuration

This guide walks you through building a YAML configuration file for slidev-forge, from the simplest possible config to advanced customization.

## Minimal Configuration

The absolute minimum YAML file requires just two lines:

```yaml
title: My Awesome Talk
author: Jane Doe
```

That's it! This creates a working Slidev project with sensible defaults (cyberpunk theme, French language, multi-file structure, default sections).

## Adding Metadata

Let's enhance the presentation with additional metadata:

```yaml
title: "Introduction to Web Development"
subtitle: "From HTML to modern frameworks"
author: "Jane Doe"
github: "janedoe"
event_name: "Tech Meetup"
```

- **`subtitle`**: Appears below the title on the title slide
- **`github`**: Your GitHub username, adds a clickable link on the title slide
- **`event_name`**: Displays above the title (e.g., conference name). Or use `conference:` to auto-populate from the built-in registry.

The `project_name` field (defaults to slugified title) controls the generated folder name and npm package name:

```yaml
title: "Introduction to Web Development"
project_name: "web-dev-intro"  # Optional: overrides auto-generated name
```

## Theming

### Visual Theme

Choose from 10+ built-in color palettes:

```yaml
visual_theme: dracula
```

Available themes:
- **`cyberpunk`** (default): Neon magenta/cyan on dark
- **`matrix`**: Terminal green on black
- **`dracula`**: Purple/pink on dark
- **`catppuccin`**: Soft pastels on dark
- **`nord`**: Arctic blues and muted tones
- **`gruvbox`**: Warm amber/orange on dark
- **`tokyo-night`**: Soft blue/purple on dark
- **`github-light`**: Blue on white (light theme)
- **`rose-pine`**: Rose/teal on muted dark
- **`one-dark-pro`**: Blue/purple on balanced dark

Or define custom colors:

```yaml
visual_theme: custom
colors:
  primary: "#FF5733"
  secondary: "#33C1FF"
```

### Slidev Theme

The `slidev_theme` field specifies the Slidev npm theme package:

```yaml
slidev_theme: seriph  # Default
# Or try: default, apple-basic, bricks, etc.
```

### Transitions

Choose how slides animate:

```yaml
transition: fade
# Options: slide-left (default), slide-up, fade, zoom, none
```

### Other Visual Options

```yaml
language: en              # fr (default) or en
slide_numbers: true       # Show slide numbers
line_numbers: true        # Show line numbers in code blocks
aspect_ratio: "16/9"      # Slide dimensions
color_schema: dark        # light, dark, auto
footer: "My Company"      # Footer text on all slides
logo: /logo.png           # Logo image path
favicon: /favicon.ico     # Browser favicon
```

## Conference Registry

Target a specific conference to auto-populate event name, logo, and branding:

```yaml
conference: breizhcamp
```

This automatically sets `event_name` to "BreizhCamp" and copies the official SVG logo to your project's `public/` directory.

Available conferences:

| ID | Conference | City |
|----|-----------|------|
| `breizhcamp` | 🌊 BreizhCamp | Rennes |
| `devoxx-fr` | 🗼 Devoxx France | Paris |
| `bdx-io` | 🏰 BDX I/O | Bordeaux |
| `alpescraft` | ⛰️ AlpesCraft | Grenoble |
| `mixit` | 🎨 MiXiT | Lyon |
| `volcamp` | 🌋 Volcamp | Clermont-Ferrand |
| `sunny-tech` | ☀️ Sunny Tech | Montpellier |
| `devfest-nantes` | 🎯 DevFest Nantes | Nantes |
| `riviera-dev` | 🌴 Riviera DEV | Sophia-Antipolis |
| `snowcamp` | ❄️ SnowCamp | Grenoble |

Combine with a preset for a complete conference setup:

```yaml
title: "Clean Architecture in Practice"
author: "Jane Doe"
conference: devoxx-fr
preset: conference
visual_theme: matrix
```

Use `slidev-forge conference list` to see all available conferences.

## Structure

### Sections

Define the slides in your presentation:

```yaml
sections:
  - name: Getting Started
  - name: HTML & CSS
    type: two-cols
  - name: JavaScript
    type: code
    lang: javascript
  - name: Architecture
    type: diagram
  - name: Best Practices
    type: steps
    items: [DRY, KISS, YAGNI]
  - name: Q&A
    type: qna
  - name: Thanks
    type: thanks
```

Simple sections (just a string) default to `type: default`:

```yaml
sections:
  - Introduction
  - Demo
  - Conclusion
```

See the [Section Types documentation](/docs/reference/section-types) for all available types and their options.

### Presets

Instead of manually listing sections, use a preset:

```yaml
preset: conference
# Generates: Introduction, About, Topic 1, Topic 2, Demo, Q&A, Thanks
```

Explicit `sections` always override `preset`. See the [Presets guide](/docs/guides/presets) for details.

### Multi-File Mode

By default, slidev-forge generates a multi-file structure with each section in `pages/`:

```yaml
multi_file: true  # Default
```

Set to `false` to generate a single `slides.md` file:

```yaml
multi_file: false
```

See the [Multi-File Mode guide](/docs/guides/multi-file-mode) for more.

## Deployment

Specify deployment targets to auto-generate CI/CD config files:

```yaml
deploy:
  - github-pages
  - vercel
  - netlify
```

This creates:
- `github-pages`: `.github/workflows/deploy.yml`
- `vercel`: `vercel.json`
- `netlify`: `netlify.toml`

See the [Deployment guide](/docs/guides/deployment) for details.

## Export Settings

Configure PDF export behavior:

```yaml
export:
  format: pdf
  dark: false
  with_clicks: false
```

- **`format`**: Export format (default: `pdf`)
- **`dark`**: Use dark mode in export (default: `false`)
- **`with_clicks`**: Include click animations as separate pages (default: `false`)

After generation, run `npm run export` to create the PDF.

## Advanced Options

### Fonts

Customize fonts:

```yaml
fonts:
  sans: "Roboto"
  mono: "Fira Code"
  serif: "Merriweather"
```

### Social Links

Add social media icons:

```yaml
social:
  twitter: janedoe
  github: janedoe
  linkedin: janedoe
```

### Components and Snippets

Control whether to include helper files:

```yaml
options:
  snippets: true    # Include snippets/ directory
  components: true  # Include Vue components and layouts
```

### Slidev Addons

Install additional Slidev addons:

```yaml
addons:
  - slidev-addon-qrcode
  - slidev-addon-citations
```

### Download Button

Enable a PDF download button in the presentation:

```yaml
download: true
```

## Complete Example

Here's a full-featured configuration:

```yaml
title: "Introduction to Web Development"
subtitle: "From HTML to modern frameworks"
author: "Jane Doe"
github: "janedoe"
event_name: "Tech Meetup 2026"

slidev_theme: seriph
visual_theme: dracula
transition: fade
language: en
preset: conference

sections:
  - name: Getting Started
  - name: HTML & CSS
    type: two-cols
  - name: JavaScript
    type: code
    lang: javascript
  - name: Architecture
    type: diagram
  - name: Best Practices
    type: steps
    items: [DRY, KISS, YAGNI]
  - name: Q&A
    type: qna
  - name: Thanks
    type: thanks

deploy:
  - github-pages

export:
  format: pdf
  dark: false
  with_clicks: false

options:
  snippets: true
  components: true

slide_numbers: true
line_numbers: true
footer: "Tech Meetup 2026"
```

## Next Steps

- **[Presets](/docs/guides/presets)**: Learn about pre-configured section templates
- **[Multi-File Mode](/docs/guides/multi-file-mode)**: Understand the pages/ directory structure
- **[Global Configuration](/docs/guides/global-configuration)**: Set defaults for all projects
- **[Section Types Reference](/docs/reference/section-types)**: Complete list of section types and options
