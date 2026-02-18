---
sidebar_position: 7
---

# conference

Manage conference associations for slidev-forge projects.

## Usage

```bash
slidev-forge conference list              # List available conferences
slidev-forge conference show <id>         # Show details for a conference
slidev-forge conference <id> [--path dir] # Set conference in a project
```

## Subcommands

### list

Display all available conferences with their emoji, ID, name, and website:

```bash
slidev-forge conference list
```

```
Available conferences:
  🌊  breizhcamp         BreizhCamp           https://www.breizhcamp.org
  🗼  devoxx-fr          Devoxx France        https://www.devoxx.fr
  🏰  bdx-io             BDX I/O              https://www.bdxio.fr
  ⛰️  alpescraft         AlpesCraft           https://www.alpescraft.fr
  🎨  mixit              MiXiT                https://mixitconf.org
  🌋  volcamp            Volcamp              https://www.volcamp.io
  ☀️  sunny-tech         Sunny Tech           https://sunny-tech.io
  🎯  devfest-nantes     DevFest Nantes       https://devfest.gdgnantes.com
  🌴  riviera-dev        Riviera DEV          https://rivieradev.fr
  ❄️  snowcamp           SnowCamp             https://snowcamp.io
```

### show

Display detailed information for a specific conference:

```bash
slidev-forge conference show breizhcamp
```

```
🌊  BreizhCamp
  Logo:    breizhcamp.svg
  Website: https://www.breizhcamp.org
  Info:    Conference tech a Rennes - Juin
```

### set (default)

Apply a conference to an existing project by updating its `presentation.yaml`:

```bash
# Set conference in current directory
slidev-forge conference breizhcamp

# Set conference in a specific project
slidev-forge conference devoxx-fr --path ~/my-talk
```

## Options

| Flag | Description |
|------|-------------|
| `--path <dir>` | Path to the project directory (default: current directory) |

## What Happens

When you set a conference (either via YAML `conference:` field or this command):

1. **Event name**: Automatically set to the conference's official name
2. **Logo**: The conference SVG logo is copied to `public/` during generation
3. **Logo display**: CSS is generated to show the logo on every slide via `.slidev-layout::after`

## Examples

```bash
# Generate a new project with conference
cat > talk.yaml << 'EOF'
title: "Clean Architecture"
author: "Jane Doe"
conference: breizhcamp
preset: conference
EOF
npx slidev-forge talk.yaml

# Apply a conference to an existing project
cd my-existing-talk
slidev-forge conference devoxx-fr
```

## See Also

- [generate](./generate.md) - Generate a presentation project
- [theme](./theme.md) - Change visual theme
- [Configuration Reference](/docs/reference/configuration) - All YAML options
