---
sidebar_position: 2
---

# Workshop

A hands-on workshop example for teaching web development. This configuration includes prerequisites, structured modules, code exercises, and resources for a 2-3 hour learning session.

## Use Case

Perfect for:
- Hands-on coding workshops
- Training sessions with exercises
- Educational tutorials
- Bootcamp curriculum

## Configuration

```yaml
title: "Full-Stack Web Development"
subtitle: "Build your first web application"
author: "Jordan Kim"
github: "jordankim"
event_name: "Code Academy Workshop"

slidev_theme: default
visual_theme: catppuccin
transition: slide-left
language: en

sections:
  - name: Welcome
    type: default
  - name: Prerequisites
    type: steps
    items:
      - Node.js 20+ installed
      - Text editor (VS Code recommended)
      - Git basics
      - Terminal familiarity
  - name: Workshop Overview
    type: two-cols
  - name: Module 1 - HTML & CSS
    type: default
  - name: HTML Structure
    type: code
    lang: html
  - name: CSS Styling
    type: code
    lang: css
  - name: Exercise 1
    type: steps
    items:
      - Create an index.html file
      - Add semantic HTML structure
      - Style with CSS
      - Open in browser
  - name: Module 2 - JavaScript
    type: default
  - name: JavaScript Basics
    type: code
    lang: javascript
  - name: DOM Manipulation
    type: code
    lang: javascript
  - name: Exercise 2
    type: steps
    items:
      - Add click event listeners
      - Update DOM elements
      - Handle user input
      - Debug with console.log
  - name: Module 3 - React
    type: default
  - name: Components
    type: code
    lang: jsx
  - name: State Management
    type: code
    lang: jsx
  - name: Exercise 3
    type: steps
    items:
      - Create a React component
      - Add state with useState
      - Handle events
      - Render dynamic content
  - name: Module 4 - Backend
    type: default
  - name: Node.js Server
    type: code
    lang: javascript
  - name: API Endpoints
    type: code
    lang: javascript
  - name: Exercise 4
    type: steps
    items:
      - Set up Express server
      - Create REST endpoints
      - Test with Postman
      - Connect frontend to backend
  - name: Architecture Overview
    type: diagram
    diagram: flowchart TD
  - name: Final Project
    type: two-cols
  - name: Recap
    type: steps
    items:
      - HTML/CSS fundamentals
      - JavaScript and DOM
      - React components
      - Backend APIs
  - name: Resources
    type: default
  - name: Q&A
    type: qna
  - name: Thanks
    type: thanks

deploy:
  - netlify

export:
  format: pdf
  dark: true
  with_clicks: true

options:
  snippets: true
  components: true

line_numbers: true
slide_numbers: false
download: true

social:
  github: jordankim
  twitter: jordankim
  website: https://codeacademy.example.com

footer: "Code Academy | Full-Stack Workshop"

addons:
  - slidev-addon-qrcode
```

## What You Get

After running `npx slidev-forge workshop.yaml`, you'll have:

- **27 slides** with structured learning modules
- **Soft pastel theme** (Catppuccin) easy on the eyes for long sessions
- **Code examples** in HTML, CSS, JavaScript, and JSX with syntax highlighting
- **Step-by-step exercises** with animated reveals
- **Architecture diagram** showing frontend/backend connection
- **Netlify deployment** configured with `netlify.toml`
- **PDF export with animations** for student handouts
- **QR code addon** for sharing resources

### Key Files

```
full-stack-web-development/
├── netlify.toml
├── pages/
│   ├── 01-toc.md
│   ├── 02-welcome.md
│   ├── 03-prerequisites.md
│   ├── 04-workshop-overview.md
│   ├── 05-module-1-html-css.md
│   ├── 06-html-structure.md      # HTML code example
│   ├── 07-css-styling.md         # CSS code example
│   ├── 08-exercise-1.md          # Step-by-step instructions
│   ├── 09-module-2-javascript.md
│   ├── 10-javascript-basics.md   # JavaScript code
│   ├── 11-dom-manipulation.md    # JavaScript code
│   ├── 12-exercise-2.md
│   └── ...
├── components/
├── layouts/
├── snippets/external.ts
├── styles/index.css              # Catppuccin colors
├── package.json
├── presentation.yaml
└── slides.md
```

## Customize It

**Different tech stack**: Replace React with Vue or Svelte:
```yaml
  - name: Module 3 - Vue.js
    type: default
  - name: Vue Components
    type: code
    lang: vue
```

**Add more languages**: Include TypeScript, Python, or Go examples:
```yaml
  - name: TypeScript Intro
    type: code
    lang: typescript
```

**Shorten the workshop**: Remove modules to fit a 1-hour session:
```yaml
sections:
  - name: Welcome
  - name: Prerequisites
    type: steps
  - name: HTML & CSS
    type: code
    lang: html
  - name: Exercise
    type: steps
  - name: Q&A
    type: qna
```

**Change theme**: Try `nord` for a cool, professional look:
```yaml
visual_theme: nord
```

**Add live coding**: Use the `iframe` section to embed CodePen or CodeSandbox:
```yaml
  - name: Live Demo
    type: iframe
    url: https://codesandbox.io/s/your-demo
```
