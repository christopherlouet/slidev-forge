# slidev-forge

Scaffold complete [Slidev](https://sli.dev) presentation projects from a YAML config file or interactive prompts.

## Quick Start

### Interactive mode

```bash
npx slidev-forge
```

You'll be guided through a few questions (title, author, visual theme, sections) and get a ready-to-use project.

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
title: "Boost your Linux environment"
subtitle: "Customize your terminal and boost productivity"
author: "Jane Doe"
github: "janedoe"
event_name: "Tech Meetup"

slidev_theme: seriph
visual_theme: dracula
transition: slide-left

sections:
  - Introduction
  - Oh My Zsh
  - tmux
  - fzf
  - References

deploy:
  - github-pages
  - vercel
  - netlify

export:
  format: pdf
  dark: false
  with_clicks: false
```

## Visual Themes

| Theme | Description | Colors |
|-------|-------------|--------|
| **cyberpunk** | Neon lights in the rain - Night City aesthetic | `#FF00FF` / `#00FFFF` |
| **matrix** | Digital rain - Classic green terminal | `#00FF41` / `#008F11` |
| **dracula** | Dark theme with vibrant colors | `#BD93F9` / `#FF79C6` |
| **catppuccin** | Soothing pastel theme | `#CBA6F7` / `#89B4FA` |
| **nord** | Arctic, north-bluish color palette | `#88C0D0` / `#5E81AC` |
| **gruvbox** | Retro groove color scheme | `#FABD2F` / `#FE8019` |
| **tokyo-night** | Clean dark theme inspired by Tokyo at night | `#7AA2F7` / `#BB9AF7` |

Default: **cyberpunk**

## Generated Project

```
my-talk/
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── dist/.gitkeep
├── docs/.gitkeep
├── public/
├── snippets/external.ts
├── styles/index.css                # CSS with visual theme colors
├── .gitignore
├── .npmrc
├── .prettierrc.json
├── netlify.toml                    # Netlify config
├── vercel.json                     # Vercel config
├── package.json
├── README.md
└── slides.md                       # Presentation content
```

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
| `transition` | No | `slide-left` | Slide transition effect |
| `sections` | No | `[Introduction, References]` | List of slide sections |
| `deploy` | No | all three | `github-pages`, `vercel`, `netlify` |
| `export.format` | No | `pdf` | Export format |
| `export.dark` | No | `false` | Dark mode export |
| `export.with_clicks` | No | `false` | Include click animations |
| `options.snippets` | No | `true` | Include snippets/ directory |

## Development

```bash
git clone git@github.com:christopherlouet/slidev-forge.git
cd slidev-forge
npm install
npm test
```

## Requirements

- Node.js >= 20

## License

MIT
