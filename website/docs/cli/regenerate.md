---
sidebar_position: 6
---

# regenerate

Synchronize `slides.md` with `presentation.yaml` after manual edits to the YAML configuration.

## Usage

```bash
slidev-forge regenerate [--dry-run]
```

## Description

The `regenerate` command keeps your slides in sync with your YAML configuration when you manually edit `presentation.yaml`. It:

1. **Parses** the current `slides.md` using section markers
2. **Compares** sections in YAML vs. slides
3. **Merges** changes while preserving user-edited content
4. **Regenerates** `styles/index.css` with updated theme colors
5. **Creates** an automatic backup (`slides.md.bak`)

This is the v2.0 regeneration feature that enables non-destructive updates to presentations.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--dry-run` | Preview changes without writing files | `false` |
| `--path <dir>` | Project directory to regenerate | Current directory |

## Section Markers

The tool injects HTML comments into generated slides to track sections:

```markdown
<!-- section:id=introduction -->
# Introduction
...

<!-- section:id=demo -->
# Demo
...
```

Special markers for auto-generated slides:
- `<!-- section:id=__title__ -->` - Title slide
- `<!-- section:id=__toc__ -->` - Table of contents

These markers enable the tool to:
- **Identify** which sections exist in `slides.md`
- **Preserve** user-edited content when regenerating
- **Add/remove** sections based on YAML changes
- **Reorder** sections to match YAML order

## Diff Actions

The tool computes a diff between YAML and slides:

| Action | Symbol | Description |
|--------|--------|-------------|
| `add` | `+` (green) | Section in YAML but not in slides - will be added |
| `remove` | `-` (red) | Section in slides but not in YAML - will be removed |
| `keep` | `=` (gray) | Section exists in both - content preserved |
| `update` | `~` (cyan) | Section metadata changed (rare) |

## Examples

```bash
# Preview what would change
slidev-forge regenerate --dry-run

# Apply changes
slidev-forge regenerate

# Regenerate a project in another directory
slidev-forge regenerate --path ~/Presentations/conference-talk

# Dry run for another project
slidev-forge regenerate --dry-run --path ~/Presentations/workshop
```

## Output

### Dry run

```
  Dry run - changes that would be applied:

  + Demo (add)
  = Introduction (keep)
  = Conclusion (keep)
  - Old Section (remove)
```

### Actual regeneration

```
  Regeneration successful!

  Backup: /path/to/project/slides.md.bak

  + Demo (add)
  = Introduction (keep)
  = Conclusion (keep)
  - Old Section (remove)

  2 files updated:
    slides.md
    styles/index.css
```

## Backup Behavior

Every regeneration creates a backup:

- **Location**: `slides.md.bak` in the project directory
- **Content**: Complete copy of `slides.md` before changes
- **Overwrite**: Each run overwrites the previous backup

If something goes wrong, restore from backup:

```bash
cp slides.md.bak slides.md
```

## Use Cases

### Adding sections

Edit `presentation.yaml`:

```yaml
sections:
  - Introduction
  - Demo        # New section
  - Conclusion
```

Run:

```bash
slidev-forge regenerate
```

Result: A new "Demo" section slide is added between Introduction and Conclusion.

### Removing sections

Remove a section from `presentation.yaml`:

```yaml
sections:
  - Introduction
  # - Old Section  # Removed
  - Conclusion
```

Run:

```bash
slidev-forge regenerate
```

Result: The "Old Section" slide is removed from `slides.md`.

### Reordering sections

Change section order in `presentation.yaml`:

```yaml
sections:
  - Conclusion     # Moved up
  - Introduction   # Moved down
```

Run:

```bash
slidev-forge regenerate
```

Result: Slides are reordered to match YAML order. Content is preserved.

### Changing theme

Edit `presentation.yaml`:

```yaml
visual_theme: tokyo-night  # Changed from cyberpunk
```

Run:

```bash
slidev-forge regenerate
```

Result: `styles/index.css` is updated with Tokyo Night colors.

## Content Preservation

The tool **preserves user edits** to slide content:

- If you customize a section slide in `slides.md`, those changes are kept
- Only section structure (add/remove/reorder) is updated based on YAML
- The frontmatter and title slide are always regenerated

**Example**:

Original generated section:
```markdown
<!-- section:id=demo -->
# Demo
<!-- Add your content here -->
```

User edits:
```markdown
<!-- section:id=demo -->
# Live Coding Demo

Here's how to use the API:

```javascript
const result = await api.call();
```
```

After regeneration, the user content is preserved.

## Exit Codes

- **0**: Success
- **1**: Error (missing `presentation.yaml`, missing `slides.md`, parse error, etc.)

## See Also

- [add](./add.md) - Add a single section (alternative to editing YAML)
- [config](./config.md) - Modify configuration values
- [theme](./theme.md) - Change visual theme
