---
sidebar_position: 2
---

# Quick Start

## Interactive Mode

Run without arguments to be guided through a few questions:

```bash
npx slidev-forge
```

You'll be prompted for title, author, visual theme, preset, and destination. A ready-to-use project with multi-file structure is generated.

## From a YAML File

Point slidev-forge at a YAML configuration file:

```bash
npx slidev-forge presentation.yaml
```

### Minimal YAML (2 lines)

```yaml
title: My Awesome Talk
author: Jane Doe
```

### Full YAML Example

```yaml
title: "Introduction to Web Development"
subtitle: "From HTML to modern frameworks"
author: "Jane Doe"
github: "janedoe"
event_name: "Tech Meetup"

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
```

## Run Your Presentation

After generation:

```bash
cd my-talk
npm install
npm run dev     # Start dev server
npm run build   # Build for production
npm run export  # Export to PDF
```
