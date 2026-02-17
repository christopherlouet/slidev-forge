---
sidebar_position: 1
---

# generate

The default command generates a complete Slidev presentation project from a YAML configuration file or interactive prompts.

## Usage

```bash
slidev-forge                        # Interactive mode
slidev-forge <config.yaml> [dest]   # Generate from YAML file
```

## Modes

### Interactive Mode

When run without arguments, `slidev-forge` launches an interactive prompt that guides you through creating a presentation:

```bash
npx slidev-forge
```

You'll be asked for:
- **Title**: Presentation title
- **Author**: Author name
- **Visual theme**: Color palette (cyberpunk, matrix, dracula, etc.)
- **Preset**: Template type (conference, workshop, lightning, pitch, or none)
- **Destination**: Target directory (defaults to slugified title)
- **Subtitle** (optional): Subtitle for the title slide
- **Event name** (optional): Event displayed above the title
- **GitHub** (optional): GitHub username for links
- **Sections** (if preset is "none"): Comma-separated section names

The tool will create a `presentation.yaml` file in the generated project to preserve your configuration.

### YAML Mode

Generate a project from an existing YAML configuration file:

```bash
slidev-forge presentation.yaml
slidev-forge presentation.yaml ./my-talk
```

If no destination is provided, the project is created in a directory named after the `project_name` field (or slugified `title`).

**Minimal YAML** (2 lines):

```yaml
title: My Awesome Talk
author: Jane Doe
```

## Options

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview what would be generated without writing any files |
| `--no-git` | Skip `git init` in the generated project |
| `--help`, `-h` | Show help with available themes and commands |
| `--version`, `-v` | Print the current version |

## Examples

```bash
# Interactive mode
npx slidev-forge

# Generate from YAML in current directory
npx slidev-forge presentation.yaml

# Generate from YAML to specific directory
npx slidev-forge config.yaml ./my-awesome-talk

# Preview without creating files
npx slidev-forge presentation.yaml --dry-run

# Generate without initializing git
npx slidev-forge presentation.yaml --no-git
```

## Behavior

When generating a project:

1. **Configuration resolution**: Merges YAML config with global preferences (`~/.slidev-forge.yaml`) and defaults
2. **Validation**: Checks required fields (`title`, `author`) and validates section types
3. **Directory check**: If the destination exists, prompts for confirmation to overwrite
4. **File generation**: Creates all project files (slides, styles, components, package.json, etc.)
5. **Git initialization**: Runs `git init` unless `--no-git` is specified
6. **Dependency installation**: Optionally prompts to install dependencies with npm/pnpm/yarn/bun

## Generated Structure

Projects use a **multi-file structure** by default (set `multi_file: false` for single-file mode):

```
my-talk/
├── pages/
│   ├── 01-toc.md
│   ├── 02-introduction.md
│   └── ...
├── components/
│   ├── Counter.vue
│   └── CodeComparison.vue
├── layouts/
│   ├── two-cols-header.vue
│   ├── image-right.vue
│   └── quote.vue
├── styles/
│   └── index.css
├── .github/workflows/deploy.yml
├── package.json
├── presentation.yaml
├── slides.md
└── README.md
```

## Exit Codes

- **0**: Success
- **1**: Error (missing required fields, invalid YAML, user cancelled overwrite, etc.)

## See Also

- [validate](./validate.md) - Validate a YAML configuration
- [regenerate](./regenerate.md) - Sync slides with updated YAML
