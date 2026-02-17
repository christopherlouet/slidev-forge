---
sidebar_position: 4
---

# theme

List available visual themes or change the visual theme of an existing project.

## Usage

```bash
slidev-forge theme              # List available themes
slidev-forge theme <name>       # Set visual theme
```

## Description

Visual themes define the color palette for your presentation slides. Each theme provides a primary and secondary color applied to headings, links, code blocks, and other UI elements.

Running `theme` without arguments lists all available themes with descriptions. Running with a theme name updates `presentation.yaml` and changes the project's visual theme.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--path <dir>` | Project directory to modify | Current directory |

## Available Themes

| Theme | Description |
|-------|-------------|
| **cyberpunk** | Neon magenta and cyan on dark slides - ideal for tech and futuristic talks |
| **matrix** | Terminal green on black - perfect for developer and hacking-themed presentations |
| **dracula** | Purple and pink accents on dark background - elegant slides with high contrast |
| **catppuccin** | Soft pastel tones on dark slides - comfortable for long workshops and tutorials |
| **nord** | Cool arctic blues and muted tones - clean and professional slides |
| **gruvbox** | Warm amber and orange on dark background - retro and readable slides |
| **tokyo-night** | Soft blue and purple highlights on dark slides - modern and polished |
| **github-light** | Blue accents on white background - minimal and clear for daytime presentations |
| **rose-pine** | Rose and teal on muted dark slides - warm and inviting for creative talks |
| **one-dark-pro** | Blue and purple on balanced dark slides - familiar and versatile for any talk |
| **custom** | User-defined colors (requires `colors.primary` and `colors.secondary` in YAML) |

## Examples

```bash
# List all available themes
slidev-forge theme

# Change to Tokyo Night theme
slidev-forge theme tokyo-night

# Change theme for a project in another directory
slidev-forge theme dracula --path ~/Presentations/conference-talk

# Change to Nord theme
slidev-forge theme nord
```

## Output

### List mode

```
Available themes:
  cyberpunk       Neon magenta and cyan on dark slides - ideal for tech and futuristic talks
  matrix          Terminal green on black - perfect for developer and hacking-themed presentations
  dracula         Purple and pink accents on dark background - elegant slides with high contrast
  ...
```

### Set mode

```
✔ Theme changed to "tokyo-night" in presentation.yaml
```

## Behavior

When changing a theme:

1. **Read config**: Loads `presentation.yaml` from the project directory
2. **Update field**: Sets `visual_theme: <name>`
3. **Write config**: Saves the updated YAML file

**Note**: After changing the theme, you may want to run `slidev-forge regenerate` to update `styles/index.css` with the new color palette.

## Custom Themes

To use a custom theme, set `visual_theme: custom` in your YAML and define your own colors:

```yaml
visual_theme: custom
colors:
  primary: "#FF5733"
  secondary: "#33C1FF"
```

## Exit Codes

- **0**: Theme listed or changed successfully
- **1**: Error (unknown theme, missing `presentation.yaml`, etc.)

## See Also

- [config](./config.md) - Modify other configuration values
- [regenerate](./regenerate.md) - Regenerate styles with new theme colors
