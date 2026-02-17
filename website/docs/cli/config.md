---
sidebar_position: 5
---

# config

Read or modify configuration values in `presentation.yaml`.

## Usage

```bash
slidev-forge config get <key>              # Read a value
slidev-forge config set <key> <value>      # Modify a value
```

## Description

The `config` command provides a simple interface to read and modify fields in `presentation.yaml` without manually editing the YAML file.

This command must be run from within a slidev-forge project directory (or use `--path` to target a specific project).

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--path <dir>` | Project directory to modify | Current directory |

## Available Keys

Any field in the YAML configuration can be accessed:

### Common Fields

- `title` - Presentation title
- `author` - Author name
- `subtitle` - Subtitle
- `github` - GitHub username
- `event_name` - Event name
- `visual_theme` - Visual theme (cyberpunk, dracula, tokyo-night, etc.)
- `slidev_theme` - Slidev theme from npm (default: `seriph`)
- `language` - Presentation language (`en`, `fr`, etc.)
- `transition` - Slide transition (slide-left, fade, zoom, etc.)
- `multi_file` - Multi-file structure (`true` or `false`)
- `preset` - Preset template (conference, workshop, lightning, pitch)
- `line_numbers` - Show line numbers in code blocks (`true` or `false`)
- `slide_numbers` - Show slide numbers (`true` or `false`)
- `download` - Enable PDF download button (`true` or `false`)
- `footer` - Footer text
- `logo` - Logo image path
- `aspect_ratio` - Slide aspect ratio (e.g., `16/9`, `4/3`)
- `color_schema` - Color schema (`light`, `dark`, `auto`)
- `favicon` - Favicon path

### Nested Fields

For nested objects like `export` or `options`, use dot notation:

- `export.format` - Export format (pdf, png, etc.)
- `export.dark` - Dark mode export
- `export.with_clicks` - Include click animations
- `options.snippets` - Include snippets directory
- `options.components` - Include components and layouts

## Examples

### Get Values

```bash
# Get language setting
slidev-forge config get language

# Get visual theme
slidev-forge config get visual_theme

# Get author
slidev-forge config get author

# Get config from another project
slidev-forge config get title --path ~/Presentations/tech-talk
```

### Set Values

```bash
# Set language to English
slidev-forge config set language en

# Enable slide numbers
slidev-forge config set slide_numbers true

# Disable line numbers
slidev-forge config set line_numbers false

# Change author
slidev-forge config set author "Jane Doe"

# Set subtitle
slidev-forge config set subtitle "A deep dive into TypeScript"

# Set transition to fade
slidev-forge config set transition fade

# Set config in another project
slidev-forge config set language fr --path ~/Presentations/workshop
```

## Output

### Get command

If the key exists:
```
language: en
```

If the key is not set:
```
⚠ Key "unknown_field" is not set.
```

For object values, output is JSON:
```
export: {"format":"pdf","dark":false,"with_clicks":false}
```

### Set command

```
✔ Set language = en
```

## Type Coercion

The `set` command automatically converts strings to appropriate types:

- `"true"` → `true` (boolean)
- `"false"` → `false` (boolean)
- `"42"` → `42` (number)
- `"3.14"` → `3.14` (number)
- Other values remain strings

## Exit Codes

- **0**: Success
- **1**: Error (missing `presentation.yaml`, invalid arguments, etc.)

## See Also

- [theme](./theme.md) - Specialized command for changing themes
- [add](./add.md) - Add sections to the project
- [regenerate](./regenerate.md) - Sync slides with updated config
