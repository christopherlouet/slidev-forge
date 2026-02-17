---
sidebar_position: 3
---

# Lightning Talk

A 5-minute lightning talk about adopting TypeScript. This minimal configuration showcases rapid presentation flow with high-impact visuals.

## Use Case

Perfect for:
- 5-minute lightning talks
- Quick product demos
- Elevator pitches
- Flash tutorials
- Conference lightning rounds

## Configuration

```yaml
title: "Why TypeScript?"
subtitle: "Type safety without the pain"
author: "Sam Rivera"
github: "samrivera"
event_name: "Lightning Talks"

slidev_theme: default
visual_theme: cyberpunk
transition: fade
language: en

sections:
  - name: Cover
    type: cover
    image: https://images.unsplash.com/photo-1555066931-4365d14bab8c
  - name: The Problem
    type: fact
    value: "38%"
    description: of bugs are preventable with types
  - name: The Solution
    type: code
    lang: typescript
  - name: Live Demo
    type: default
  - name: Get Started
    type: steps
    items:
      - npm install typescript
      - Rename .js to .ts
      - Add type annotations
      - Run tsc
  - name: Thanks
    type: thanks

deploy:
  - github-pages

export:
  format: pdf
  dark: true
  with_clicks: false

options:
  snippets: false
  components: false

line_numbers: false
slide_numbers: false

transition: fade

social:
  github: samrivera
  twitter: samrivera

multi_file: false
```

## What You Get

After running `npx slidev-forge lightning.yaml`, you'll have:

- **6 slides** in a single `slides.md` file (multi_file: false)
- **High-impact cyberpunk theme** with neon magenta/cyan accents
- **Fast fade transitions** for smooth, quick flow
- **Cover image** from Unsplash
- **Fact slide** with large statistic
- **TypeScript code** with syntax highlighting
- **Quick start steps** with animated reveal
- **Minimal setup** (no components or snippets)
- **GitHub Pages deployment**

### Single File Structure

```
why-typescript/
├── .github/workflows/deploy.yml
├── dist/.gitkeep
├── docs/.gitkeep
├── public/
├── styles/index.css              # Cyberpunk neon colors
├── .gitignore
├── .npmrc
├── .prettierrc.json
├── package.json
├── presentation.yaml
├── README.md
└── slides.md                     # All 6 slides in one file
```

### Example slides.md

```markdown
---
theme: default
title: Why TypeScript?
---

# Why TypeScript?

Type safety without the pain

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: center
---

# The Problem

<div class="text-6xl font-bold text-primary">38%</div>
<div class="text-xl mt-4">of bugs are preventable with types</div>

---

# The Solution

\`\`\`typescript
// JavaScript
function add(a, b) {
  return a + b;
}

add(5, "10"); // "510" - runtime error!

// TypeScript
function add(a: number, b: number): number {
  return a + b;
}

add(5, "10"); // Compile-time error!
\`\`\`

---

# Live Demo

<!-- Your demo content here -->

---

# Get Started

<v-clicks>

- npm install typescript
- Rename .js to .ts
- Add type annotations
- Run tsc

</v-clicks>

---
layout: center
---

# Thanks

Sam Rivera
[@samrivera](https://github.com/samrivera)
```

## Customize It

**Even shorter**: Remove slides for a 3-minute talk:
```yaml
sections:
  - name: Problem
    type: fact
  - name: Solution
    type: code
    lang: typescript
  - name: Thanks
    type: thanks
```

**Different theme**: Try `matrix` for a terminal hacker vibe:
```yaml
visual_theme: matrix
```

**Add impact**: Use a different fact or quote:
```yaml
  - name: Why It Matters
    type: quote
```

**Embed a live demo**: Use iframe for CodeSandbox:
```yaml
  - name: Live Demo
    type: iframe
    url: https://codesandbox.io/s/typescript-demo
```

**Faster transitions**: Use zoom for dramatic effect:
```yaml
transition: zoom
```

**Multi-file version**: Remove `multi_file: false` to generate pages/ structure:
```yaml
# Remove or set to true
multi_file: true
```
