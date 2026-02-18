---
sidebar_position: 3
---

# Visual Themes

slidev-forge includes 10 carefully designed visual themes, each with its own color palette and personality.

## Available Themes

### cyberpunk (default)

Neon magenta and cyan on dark slides - ideal for tech and futuristic talks.

- **Primary:** `#FF00FF` (Magenta)
- **Secondary:** `#00FFFF` (Cyan)

```yaml
visual_theme: cyberpunk
```

---

### matrix

Terminal green on black with glow effects, scanline aesthetics, and monospace typography - perfect for developer and hacking-themed presentations. Enhanced CSS includes text glow on headings, code block borders with accent colors, and a retro terminal feel.

- **Primary:** `#00FF41` (Matrix Green)
- **Secondary:** `#00D9FF` (Cyan)

```yaml
visual_theme: matrix
```

---

### dracula

Purple and pink accents on dark background - elegant slides with high contrast.

- **Primary:** `#BD93F9` (Purple)
- **Secondary:** `#FF79C6` (Pink)

```yaml
visual_theme: dracula
```

---

### catppuccin

Soft pastel tones on dark slides - comfortable for long workshops and tutorials.

- **Primary:** `#CBA6F7` (Lavender)
- **Secondary:** `#89B4FA` (Blue)

```yaml
visual_theme: catppuccin
```

---

### nord

Cool arctic blues and muted tones - clean and professional slides.

- **Primary:** `#88C0D0` (Frost Blue)
- **Secondary:** `#5E81AC` (Deep Blue)

```yaml
visual_theme: nord
```

---

### gruvbox

Warm amber and orange on dark background - retro and readable slides.

- **Primary:** `#FABD2F` (Yellow)
- **Secondary:** `#FE8019` (Orange)

```yaml
visual_theme: gruvbox
```

---

### tokyo-night

Soft blue and purple highlights on dark slides - modern and polished.

- **Primary:** `#7AA2F7` (Blue)
- **Secondary:** `#BB9AF7` (Purple)

```yaml
visual_theme: tokyo-night
```

---

### github-light

Blue accents on white background - minimal and clear for daytime presentations.

- **Primary:** `#0969DA` (Blue)
- **Secondary:** `#1F6FEB` (Light Blue)

```yaml
visual_theme: github-light
```

---

### rose-pine

Rose and teal on muted dark slides - warm and inviting for creative talks.

- **Primary:** `#EA9A97` (Rose)
- **Secondary:** `#C4A7E7` (Purple)

```yaml
visual_theme: rose-pine
```

---

### one-dark-pro

Blue and purple on balanced dark slides - familiar and versatile for any talk.

- **Primary:** `#61AFEF` (Blue)
- **Secondary:** `#C678DD` (Purple)

```yaml
visual_theme: one-dark-pro
```

## Custom Theme

Define your own colors by setting `visual_theme: custom` and providing custom color values:

```yaml
visual_theme: custom
colors:
  primary: "#FF5733"
  secondary: "#33C1FF"
```

### Custom Theme Example

```yaml
title: My Presentation
author: Jane Doe
visual_theme: custom
colors:
  primary: "#E63946"    # Red
  secondary: "#06FFA5"  # Green
```

## Theme Comparison

| Theme | Best For | Mood |
|-------|----------|------|
| cyberpunk | Tech talks, futuristic topics | Bold, energetic |
| matrix | Developer talks, coding workshops | Retro, terminal, glow effects |
| dracula | Evening presentations, creative talks | Elegant, high contrast |
| catppuccin | Long workshops, tutorials | Comfortable, easy on eyes |
| nord | Professional presentations, business talks | Clean, minimalist |
| gruvbox | Retro-style talks, warm presentations | Vintage, readable |
| tokyo-night | Modern tech talks, polished presentations | Modern, sophisticated |
| github-light | Daytime presentations, light rooms | Bright, minimal |
| rose-pine | Creative talks, design presentations | Warm, inviting |
| one-dark-pro | General purpose, versatile topics | Balanced, familiar |

## Changing Themes

You can change the visual theme of an existing project using the `theme` command:

```bash
# List available themes
slidev-forge theme

# Change to a specific theme
slidev-forge theme tokyo-night

# Change theme in a specific directory
slidev-forge theme dracula --path ~/my-talk
```

## Global Default

Set a default theme for all new projects in `~/.slidev-forge.yaml`:

```yaml
visual_theme: tokyo-night
```
