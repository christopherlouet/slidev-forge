---
sidebar_position: 3
---

# add

Add a section to an existing slidev-forge project.

## Usage

```bash
slidev-forge add section "Name" [--type <type>]
```

## Description

The `add` command appends a new section to an existing project by:

1. Adding the section to `presentation.yaml`
2. Creating a new page file in `pages/` (if multi-file mode)
3. Appending a `src` reference to `slides.md` (if multi-file mode)

This command must be run from within a slidev-forge project directory (or use `--path` to target a specific project).

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--type <type>` | Section layout type | `default` |
| `--path <dir>` | Project directory to modify | Current directory |

### Available Section Types

- `default` - Standard content slide
- `two-cols` - Two-column layout
- `image-right` - Content left, image right
- `quote` - Blockquote with author
- `qna` - Q&A slide
- `thanks` - Thank you slide
- `about` - About the author
- `code` - Code block slide
- `diagram` - Mermaid diagram
- `cover` - Cover with background image
- `iframe` - Embedded web content
- `steps` - Animated list
- `fact` - Key figure highlight

## Examples

```bash
# Add a default section
slidev-forge add section "Demo"

# Add a code section
slidev-forge add section "Live Coding" --type code

# Add a diagram section
slidev-forge add section "Architecture" --type diagram

# Add a section to a project in another directory
slidev-forge add section "API Overview" --type two-cols --path ~/Presentations/tech-talk

# Add a thank you slide
slidev-forge add section "Thank You" --type thanks
```

## Behavior

### Multi-file mode

If the project has a `pages/` directory:

1. **Update YAML**: Appends the section to `presentation.yaml`
2. **Create page**: Generates a new markdown file in `pages/` (e.g., `03-demo.md`)
3. **Update slides.md**: Adds a `src` reference to include the new page

Example output:

```
✔ Section "Demo" (type: code) added to presentation.yaml
✔ Page created: pages/03-demo.md
✔ Reference added to slides.md
```

### Single-file mode

If there's no `pages/` directory:

1. **Update YAML**: Appends the section to `presentation.yaml`

You'll need to manually add the section content to `slides.md` or run `slidev-forge regenerate` to sync.

## File Naming

Page files are numbered sequentially:

- `01-toc.md` (table of contents)
- `02-introduction.md`
- `03-demo.md` (new section)

The filename uses a slugified version of the section name.

## Exit Codes

- **0**: Section added successfully
- **1**: Error (missing `presentation.yaml`, invalid type, etc.)

## See Also

- [regenerate](./regenerate.md) - Sync slides.md with presentation.yaml
- [config](./config.md) - Modify other configuration values
