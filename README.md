# slidev-forge

Scaffold complete [Slidev](https://sli.dev) presentation projects from a YAML config file or interactive prompts.

## Quick Start

### Interactive mode

```bash
npx slidev-forge
```

You'll be guided through a few questions (title, author, visual theme, sections, subtitle, event, GitHub) and get a ready-to-use project.

### From a YAML file

```bash
npx slidev-forge presentation.yaml
```

**Minimal YAML** (2 lines):

```yaml
title: My Awesome Talk
author: Jane Doe
```

**Full YAML**:

```yaml
title: "Introduction to Web Development"
subtitle: "From HTML to modern frameworks"
author: "Jane Doe"
github: "janedoe"
event_name: "Tech Meetup"

slidev_theme: seriph
visual_theme: dracula
transition: fade

sections:
  - name: Getting Started
  - name: HTML & CSS
    type: two-cols
  - name: JavaScript
    type: image-right
  - name: Best Practices
    type: quote
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
```

## Visual Themes

| Theme | Description | Colors |
|-------|-------------|--------|
| **cyberpunk** (default) | Neon lights in the rain - Night City aesthetic | `#FF00FF` / `#00FFFF` |
| **matrix** | Digital rain - Enhanced terminal green with cyan accents | `#00FF41` / `#00D9FF` |
| **dracula** | Dark theme with vibrant colors | `#BD93F9` / `#FF79C6` |
| **catppuccin** | Soothing pastel theme | `#CBA6F7` / `#89B4FA` |
| **nord** | Arctic, north-bluish color palette | `#88C0D0` / `#5E81AC` |
| **gruvbox** | Retro groove color scheme | `#FABD2F` / `#FE8019` |
| **tokyo-night** | Clean dark theme inspired by Tokyo at night | `#7AA2F7` / `#BB9AF7` |
| **github-light** | Clean light theme based on GitHub palette | `#0969DA` / `#1F6FEB` |
| **rose-pine** | Warm dark theme with rose and pine tones | `#EA9A97` / `#C4A7E7` |
| **one-dark-pro** | Classic VS Code dark theme | `#61AFEF` / `#C678DD` |
| **custom** | User-defined colors | Your choice |

### Custom Theme

Define your own colors:

```yaml
visual_theme: custom
colors:
  primary: "#FF5733"
  secondary: "#33C1FF"
```

## Section Types

Each section can specify a layout type:

| Type | Description | Layout |
|------|-------------|--------|
| `default` | Standard content slide | Default |
| `two-cols` | Two-column layout | `layout: two-cols` |
| `image-right` | Content left, image right | `layout: image-right` |
| `quote` | Blockquote with author | Default |
| `qna` | Centered Q&A slide | `layout: center` |
| `thanks` | Thank you slide with author & GitHub link | `layout: center` |
| `about` | About the author slide | Default |

Sections can also be simple strings (they default to `type: default`):

```yaml
sections:
  - Introduction
  - Demo
```

All section slides include presenter notes placeholders.

## Transitions

Available transitions: `slide-left` (default), `slide-up`, `fade`, `zoom`, `none`

## Generated Project

```
my-talk/
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── components/
│   ├── Counter.vue                # Interactive counter component
│   └── CodeComparison.vue         # Side-by-side code comparison
├── layouts/
│   ├── two-cols-header.vue        # Two columns with header
│   ├── image-right.vue            # Content/image 60/40 split
│   └── quote.vue                  # Centered blockquote
├── dist/.gitkeep
├── docs/.gitkeep
├── public/
├── snippets/external.ts
├── styles/index.css                # CSS with visual theme colors
├── .gitignore
├── .npmrc
├── .prettierrc.json
├── package.json
├── README.md
└── slides.md                       # Presentation content
```

Deploy config files (`netlify.toml`, `vercel.json`) are added only when the corresponding platform is in `deploy`.

After generation:

```bash
cd my-talk
npm install
npm run dev     # Start dev server
npm run build   # Build for production
npm run export  # Export to PDF
```

## YAML Configuration Reference

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `title` | Yes | - | Presentation title |
| `author` | Yes | - | Author name |
| `subtitle` | No | - | Subtitle shown on title slide |
| `github` | No | - | GitHub username (adds link on title slide) |
| `event_name` | No | - | Event name displayed above the title |
| `project_name` | No | slugified title | Folder name and package name |
| `slidev_theme` | No | `seriph` | Slidev theme from npm |
| `visual_theme` | No | `cyberpunk` | Color palette (see table above) |
| `transition` | No | `slide-left` | Slide transition (`slide-left`, `slide-up`, `fade`, `zoom`, `none`) |
| `sections` | No | `[Introduction, References]` | List of sections (strings or `{name, type}` objects) |
| `deploy` | No | `[github-pages]` | Deploy targets: `github-pages`, `vercel`, `netlify` |
| `export.format` | No | `pdf` | Export format |
| `export.dark` | No | `false` | Dark mode export |
| `export.with_clicks` | No | `false` | Include click animations |
| `options.snippets` | No | `true` | Include snippets/ directory |
| `options.components` | No | `true` | Include reusable Vue components and layouts |
| `colors.primary` | No | - | Primary color for custom theme |
| `colors.secondary` | No | - | Secondary color for custom theme |

## Development

```bash
git clone git@github.com:your-username/slidev-forge.git
cd slidev-forge
npm install
npm test              # Run tests
npm run coverage      # Run tests with coverage
```

## Requirements

- Node.js >= 20

## License

GPL-3.0
