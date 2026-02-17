---
sidebar_position: 4
---

# Transitions

Control how slides transition from one to another in your presentation.

## Available Transitions

slidev-forge supports 5 slide transition effects:

### slide-left (default)

Slides move from right to left when advancing.

```yaml
transition: slide-left
```

This is the default transition used when no transition is specified.

---

### slide-up

Slides move from bottom to top when advancing.

```yaml
transition: slide-up
```

Great for vertical content flow or step-by-step processes.

---

### fade

Slides fade in and out smoothly.

```yaml
transition: fade
```

Provides a gentle, professional transition between slides.

---

### zoom

Slides zoom in and out when transitioning.

```yaml
transition: zoom
```

Adds dynamic energy to your presentation.

---

### none

No transition effect - instant slide changes.

```yaml
transition: none
```

Best for presentations where you want immediate content changes.

## Usage

Set the transition in your `presentation.yaml` configuration:

```yaml
title: My Presentation
author: Jane Doe
transition: fade
```

## Per-Slide Transitions

While the global `transition` setting applies to all slides, you can override transitions for individual slides using Slidev's frontmatter syntax in your markdown files:

```markdown
---
transition: slide-up
---

# This slide uses slide-up transition

---
transition: zoom
---

# This slide uses zoom transition
```

## Example Configurations

### Professional Presentation

```yaml
title: Quarterly Business Review
author: Jane Doe
transition: fade
visual_theme: github-light
```

### Tech Talk

```yaml
title: Introduction to Rust
author: John Smith
transition: slide-left
visual_theme: dracula
```

### Creative Showcase

```yaml
title: Design Portfolio
author: Alice Designer
transition: zoom
visual_theme: rose-pine
```

## Best Practices

- **fade**: Best for professional/business presentations
- **slide-left**: Standard choice for most presentations
- **slide-up**: Good for step-by-step tutorials or processes
- **zoom**: Use sparingly for high-energy presentations
- **none**: Use when transitions might be distracting

## Changing Transitions

You can update the transition of an existing project using the `config` command:

```bash
# Check current transition
slidev-forge config get transition

# Change transition
slidev-forge config set transition fade
```
