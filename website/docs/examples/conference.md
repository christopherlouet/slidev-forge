---
sidebar_position: 1
---

# Conference Talk

A complete example of a 30-45 minute conference talk about building scalable APIs. This configuration showcases varied section types, professional styling, and deployment setup.

## Use Case

Perfect for:
- Technical conference presentations
- User group meetups
- Internal tech talks
- Developer workshops with demo components

## Configuration

```yaml
title: "Building Scalable APIs"
subtitle: "From monolith to microservices"
author: "Alex Chen"
github: "alexchen"
event_name: "DevConf 2026"

slidev_theme: seriph
visual_theme: dracula
transition: fade
language: en

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

footer: "DevConf 2026 | Building Scalable APIs"
```

## What You Get

After running `npx slidev-forge presentation.yaml`, you'll have:

- **14 slides** organized in `pages/` directory (one file per section)
- **Professional dark theme** (Dracula) with purple/pink accents
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
├── styles/index.css              # Dracula color scheme
├── package.json
├── presentation.yaml
└── slides.md
```

## Customize It

**Change the topic**: Replace section names and code examples with your own content.

**Different theme**: Try `tokyo-night` or `nord` for a different look:
```yaml
visual_theme: tokyo-night
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
