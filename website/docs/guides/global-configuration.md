---
sidebar_position: 5
---

# Global Configuration

Set default preferences for all your slidev-forge projects using a global configuration file. This eliminates repetitive fields in your YAML configs and ensures consistency across presentations.

## Location

Global configuration lives in:

```
~/.slidev-forge.yaml
```

On Linux/macOS: `/home/username/.slidev-forge.yaml`
On Windows: `C:\Users\username\.slidev-forge.yaml`

## Creating Global Config

Create the file manually or use the `config` command:

```bash
# Set individual values
slidev-forge config set author "Jane Doe" --global
slidev-forge config set visual_theme "tokyo-night" --global
slidev-forge config set language "en" --global

# Or create ~/.slidev-forge.yaml manually:
```

Example `~/.slidev-forge.yaml`:

```yaml
author: Jane Doe
visual_theme: tokyo-night
language: en
github: janedoe
```

## How It Works

When you generate a project, slidev-forge:

1. Reads `~/.slidev-forge.yaml` (if it exists)
2. Reads your project-level YAML config (if provided)
3. **Merges them**: project-level values **always override** global values
4. Applies built-in defaults for any missing fields

### Example

**Global config** (`~/.slidev-forge.yaml`):
```yaml
author: Jane Doe
visual_theme: tokyo-night
language: en
github: janedoe
```

**Project config** (`presentation.yaml`):
```yaml
title: My Talk
visual_theme: dracula  # Overrides global tokyo-night
```

**Result**: The generated project uses:
- `author: Jane Doe` (from global)
- `visual_theme: dracula` (from project, overrides global)
- `language: en` (from global)
- `github: janedoe` (from global)
- `title: My Talk` (from project)

## Recommended Global Fields

Not all fields make sense globally. Here are the best candidates:

### Personal Info

These rarely change across presentations:

```yaml
author: Jane Doe
github: janedoe
```

### Visual Preferences

Your preferred theme and language:

```yaml
visual_theme: tokyo-night
language: en
```

### Default Structure

If you always use the same layout:

```yaml
multi_file: true
preset: conference
```

### Social Links

Consistent across all talks:

```yaml
social:
  twitter: janedoe
  github: janedoe
  linkedin: janedoe
```

### Export Defaults

If you always export the same way:

```yaml
export:
  format: pdf
  dark: false
  with_clicks: false
```

## Fields to Avoid Globally

These should typically be project-specific:

- `title` (always unique to each presentation)
- `subtitle` (presentation-specific)
- `event_name` (varies per talk)
- `sections` (content is unique)
- `deploy` (varies by project)
- `slidev_theme` (may vary by presentation type)

## Interactive Mode with Global Config

When you run `npx slidev-forge` (interactive mode), global config values are used as **defaults in prompts**:

```bash
$ npx slidev-forge

? Title: [my new talk]
? Author: [Jane Doe]  # Pre-filled from global config
? Visual theme: [tokyo-night]  # Pre-filled from global config
? Language: [en]  # Pre-filled from global config
? GitHub username: [janedoe]  # Pre-filled from global config
```

You can accept the defaults (press Enter) or override them.

## Managing Global Config

### View current settings

```bash
slidev-forge config get author --global
# Output: Jane Doe
```

### Update a value

```bash
slidev-forge config set visual_theme dracula --global
```

### Remove a value

Edit `~/.slidev-forge.yaml` and delete the line, or:

```bash
slidev-forge config set visual_theme "" --global
```

### List all global settings

```bash
cat ~/.slidev-forge.yaml
```

Or on Windows:

```powershell
type %USERPROFILE%\.slidev-forge.yaml
```

## Example Workflow

### 1. Set up global config once

```bash
slidev-forge config set author "Jane Doe" --global
slidev-forge config set github "janedoe" --global
slidev-forge config set visual_theme "tokyo-night" --global
slidev-forge config set language "en" --global
```

### 2. Create projects with minimal YAML

Now your project configs can be tiny:

**presentation.yaml**:
```yaml
title: My Tech Talk
subtitle: Deep dive into Rust
preset: conference
```

All other fields (author, theme, language, github) come from global config.

### 3. Override when needed

For a specific presentation, just override in the project YAML:

**pitch-deck.yaml**:
```yaml
title: Startup Pitch
author: Jane Doe  # From global, but explicit here for clarity
visual_theme: github-light  # Override for this presentation
preset: pitch
```

## Disabling Global Config

To ignore `~/.slidev-forge.yaml` for a specific project, pass all values explicitly in your YAML or delete the global file temporarily.

There's no `--no-global` flag (yet), but project values always win, so you can override anything.

## Best Practices

1. **Keep it minimal**: Only set truly global defaults (author, github, preferred theme)
2. **Document it**: Add a comment at the top of `~/.slidev-forge.yaml`:
   ```yaml
   # Global defaults for slidev-forge projects
   # Project-level values always override these
   author: Jane Doe
   github: janedoe
   ```
3. **Use project configs for content**: Title, sections, and content should live in project YAML
4. **Test it**: Run `npx slidev-forge presentation.yaml --dry-run` to see the merged config without generating files

## Example Global Configs

### Minimal (recommended)

```yaml
author: Jane Doe
github: janedoe
visual_theme: tokyo-night
language: en
```

### Comprehensive

```yaml
author: Jane Doe
github: janedoe
visual_theme: dracula
language: en
multi_file: true
preset: conference

export:
  format: pdf
  dark: false
  with_clicks: false

social:
  twitter: janedoe
  github: janedoe
  linkedin: janedoe

options:
  snippets: true
  components: true

slide_numbers: true
line_numbers: true
```

### Team-wide Defaults

For a company or team, distribute a shared global config:

```yaml
author: Acme Corp
visual_theme: custom
colors:
  primary: "#FF5733"
  secondary: "#33C1FF"
footer: "© 2026 Acme Corp"
logo: /acme-logo.png
deploy:
  - github-pages
```

## Next Steps

- **[YAML Configuration](/docs/guides/yaml-configuration)**: Complete guide to all config fields
- **[CLI Commands](/docs/cli/config)**: Use `config` command to manage settings
- **[Presets](/docs/guides/presets)**: Use global `preset` to standardize presentation structure
