---
sidebar_position: 3
---

# Multi-File Mode

By default, slidev-forge generates a **multi-file structure** where each section lives in its own Markdown file inside the `pages/` directory. This makes editing large presentations easier and more organized.

## Default Multi-File Structure

When you generate a project, you get:

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
├── pages/
│   ├── 01-toc.md                  # Table of contents
│   ├── 02-introduction.md         # Section pages
│   ├── 03-demo.md
│   ├── 04-qna.md
│   └── 05-thanks.md
├── dist/.gitkeep
├── docs/.gitkeep
├── public/
├── snippets/external.ts
├── styles/index.css               # CSS with visual theme colors
├── .gitignore
├── .npmrc
├── .prettierrc.json
├── package.json
├── presentation.yaml              # Source configuration
├── README.md
└── slides.md                      # Main entry point
```

## How It Works

### Entry Point: slides.md

The `slides.md` file serves as the **main entry point** for Slidev. It contains:

1. **Frontmatter**: Global configuration (theme, transition, etc.)
2. **Title slide**: Presentation title, author, event info
3. **References to pages**: `src: ./pages/01-toc.md` directives

Example `slides.md`:

```markdown
---
theme: seriph
transition: slide-left
---

# My Awesome Talk

Jane Doe

<div class="abs-bottom m-6 flex gap-2">
  <a href="https://github.com/janedoe" target="_blank">@janedoe</a>
</div>

---
src: ./pages/01-toc.md
---

---
src: ./pages/02-introduction.md
---

---
src: ./pages/03-demo.md
---
```

### Section Files: pages/

Each file in `pages/` contains **one or more slides** for a section. File naming convention: `NN-section-name.md` (where NN is a number for ordering).

Example `pages/02-introduction.md`:

```markdown
---
layout: default
---

# Introduction

<!-- section:id=introduction -->

Add your content here...
```

The `<!-- section:id=xxx -->` marker is used by the `regenerate` command to identify sections when syncing with `presentation.yaml`.

### Table of Contents

The first page file (`01-toc.md`) typically contains a table of contents:

```markdown
---
layout: default
---

# Table of Contents

<!-- section:id=__toc__ -->

<Toc />
```

The `<Toc />` component auto-generates a clickable list of slides.

## Benefits of Multi-File Mode

### 1. Easier Navigation

Instead of scrolling through a single 500-line `slides.md`, you navigate to the specific section file you want to edit.

### 2. Parallel Editing

Multiple people can work on different sections simultaneously without merge conflicts (each section is a separate file).

### 3. Cleaner Git History

Git diffs show exactly which section changed, not just "slides.md was modified".

### 4. Logical Organization

Section files mirror your presentation structure. Looking for the "Demo" section? Open `pages/03-demo.md`.

### 5. Regeneration Support

The `slidev-forge regenerate` command uses section markers in multi-file mode to intelligently merge YAML config changes with your manual edits.

## Disabling Multi-File Mode

If you prefer a single `slides.md` file, set `multi_file: false` in your YAML:

```yaml
title: My Talk
author: Jane Doe
multi_file: false
```

This generates:

```
my-talk/
├── components/
├── layouts/
├── styles/
├── package.json
└── slides.md  # Everything in one file
```

All sections are concatenated into `slides.md` with `---` separators:

```markdown
---
theme: seriph
transition: slide-left
---

# My Talk

Jane Doe

---

# Introduction

Content here...

---

# Demo

Content here...
```

**Note**: The `regenerate` command still works with single-file mode, using section markers embedded in `slides.md`.

## Adding Sections to Multi-File Projects

After generation, use the `add` command to create new section files:

```bash
npx slidev-forge add section "New Topic" --type code
```

This creates `pages/NN-new-topic.md` and updates `slides.md` to reference it.

## Editing Workflow

1. **Edit section content**: Modify files in `pages/`
2. **Preview live**: Run `npm run dev` and see changes in real-time
3. **Add new sections**: Use `slidev-forge add section` or manually create files
4. **Update config**: Edit `presentation.yaml` and run `slidev-forge regenerate` to sync

## When to Use Multi-File Mode

| Use multi-file (`true`) | Use single-file (`false`) |
|-------------------------|---------------------------|
| Large presentations (10+ slides) | Small presentations (< 10 slides) |
| Team collaboration | Solo presentations |
| Long-term maintenance | One-time talks |
| Complex presentations with many sections | Simple slide decks |

## Next Steps

- **[Section Types Reference](/docs/reference/section-types)**: Learn how to customize individual section files
- **[YAML Configuration](/docs/guides/yaml-configuration)**: Configure multi-file behavior
- **[Regenerate Command](/docs/cli/regenerate)**: Sync YAML changes with existing slides
