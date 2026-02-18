---
sidebar_position: 1
---

# Conference Talk

A complete example of a 30-45 minute conference talk about building scalable APIs. This configuration showcases the conference registry, varied section types, professional styling, and deployment setup.

## Use Case

Perfect for:
- Technical conference presentations at French tech events
- User group meetups
- Internal tech talks
- Developer workshops with demo components

## Configuration

### With Conference Registry

Use the `conference` field to automatically set event name, logo, and branding:

```yaml
title: "Building Scalable APIs"
subtitle: "From monolith to microservices"
author: "Alex Chen"
github: "alexchen"
conference: devoxx-fr

slidev_theme: seriph
visual_theme: dracula
transition: fade
language: en
preset: conference

deploy:
  - github-pages

export:
  format: pdf
  dark: false
  with_clicks: false

options:
  snippets: true
  components: true

line_numbers: true
slide_numbers: true
download: true

social:
  twitter: alexchen
  github: alexchen
  website: https://alexchen.dev
```

Setting `conference: devoxx-fr` automatically:
- Sets `event_name` to "Devoxx France"
- Copies the official Devoxx France SVG logo to `public/`
- Displays the logo on every slide

### With Custom Sections

For full control over sections, add explicit section definitions:

```yaml
title: "Building Scalable APIs"
author: "Alex Chen"
conference: breizhcamp
visual_theme: matrix

sections:
  - name: Introduction
    type: default
  - name: About Me
    type: about
  - name: The Problem
    type: two-cols
  - name: System Architecture
    type: diagram
    diagram: flowchart TD
  - name: API Design Principles
    type: steps
    items:
      - RESTful conventions
      - Versioning strategy
      - Rate limiting
      - Authentication
  - name: Code Example
    type: code
    lang: python
  - name: Performance Metrics
    type: fact
    value: "10,000"
    description: requests per second
  - name: Microservices Transition
    type: diagram
    diagram: sequenceDiagram
  - name: Deployment Pipeline
    type: steps
    items:
      - CI/CD with GitHub Actions
      - Blue-green deployment
      - Monitoring and alerts
  - name: Live Demo
    type: default
  - name: Q&A
    type: qna
  - name: Thanks
    type: thanks
```

## Available Conferences

| ID | Conference | Emoji | City | Month |
|----|-----------|-------|------|-------|
| `breizhcamp` | BreizhCamp | 🌊 | Rennes | June |
| `devoxx-fr` | Devoxx France | 🗼 | Paris | April |
| `bdx-io` | BDX I/O | 🏰 | Bordeaux | November |
| `alpescraft` | AlpesCraft | ⛰️ | Grenoble | June |
| `mixit` | MiXiT | 🎨 | Lyon | April |
| `volcamp` | Volcamp | 🌋 | Clermont-Ferrand | October |
| `sunny-tech` | Sunny Tech | ☀️ | Montpellier | June |
| `devfest-nantes` | DevFest Nantes | 🎯 | Nantes | October |
| `riviera-dev` | Riviera DEV | 🌴 | Sophia-Antipolis | July |
| `snowcamp` | SnowCamp | ❄️ | Grenoble | January |

```bash
# List all conferences
slidev-forge conference list

# Show details for a specific conference
slidev-forge conference show breizhcamp
```

## What You Get

After running `npx slidev-forge presentation.yaml`, you'll have:

- **14 slides** organized in `pages/` directory (one file per section)
- **Professional dark theme** (Dracula) with purple/pink accents
- **Conference logo** automatically embedded from the registry
- **Custom layouts** for two-column content, diagrams, and code examples
- **GitHub Pages deployment** configured with `.github/workflows/deploy.yml`
- **PDF export** setup with `npm run export`
- **Reusable components** including Counter and CodeComparison
- **Line numbers** and **slide numbers** enabled
- **Download button** for PDF export
- **Social links** on title slide

### Key Files

```
building-scalable-apis/
├── .github/workflows/deploy.yml
├── pages/
│   ├── 01-toc.md
│   ├── 02-introduction.md
│   ├── 03-about-me.md
│   ├── 04-the-problem.md         # Two-column layout
│   ├── 05-system-architecture.md # Mermaid flowchart
│   ├── 06-api-design-principles.md # Animated steps
│   ├── 07-code-example.md        # Python syntax highlighting
│   ├── 08-performance-metrics.md # Large number display
│   └── ...
├── components/
│   ├── Counter.vue
│   └── CodeComparison.vue
├── layouts/
│   ├── two-cols-header.vue
│   ├── image-right.vue
│   └── quote.vue
├── public/
│   └── devoxx-fr.svg             # Conference logo (auto-copied)
├── styles/index.css              # Dracula color scheme + logo display
├── package.json
├── presentation.yaml
└── slides.md
```

## Customize It

**Change the conference**: Switch to any supported conference:
```yaml
conference: snowcamp       # ❄️ SnowCamp - Grenoble
conference: sunny-tech     # ☀️ Sunny Tech - Montpellier
conference: breizhcamp     # 🌊 BreizhCamp - Rennes
```

**Different theme**: Try `matrix` for a hacker vibe or `nord` for a clean look:
```yaml
visual_theme: matrix       # Terminal green with glow effects
visual_theme: nord         # Arctic blues, professional
```

**Add more diagrams**: Use Mermaid types like `classDiagram`, `gantt`, or `erDiagram`:
```yaml
  - name: Database Schema
    type: diagram
    diagram: erDiagram
```

**Deploy to Vercel**: Add to the deploy list:
```yaml
deploy:
  - github-pages
  - vercel
```

**Shorter talk**: Remove sections to adapt to a 20-minute slot.
