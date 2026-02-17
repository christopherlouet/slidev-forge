---
sidebar_position: 2
---

# Presets

Presets are pre-configured section templates for common presentation types. Instead of manually defining sections in your YAML, choose a preset that matches your use case.

## Using Presets

Simply set the `preset` field in your YAML:

```yaml
title: My Talk
author: Jane Doe
preset: conference
```

That's it! The preset automatically creates appropriate sections for a conference talk.

**Important**: If you explicitly define `sections` in your YAML, they will **always override** the preset. This lets you customize a preset by copying its sections and modifying them.

## Available Presets

### Conference

**Use case**: Standard conference talks (30-45 minutes)

**Sections**:
- Introduction
- About
- Topic 1
- Topic 2
- Demo
- Q&A
- Thanks

**Recommended for**:
- Technical conference presentations
- Community meetup talks
- Academic presentations
- Product announcements

**Example**:

```yaml
title: "Building Scalable APIs with GraphQL"
author: "Jane Doe"
preset: conference
visual_theme: tokyo-night
```

This generates a well-structured conference talk with space for introducing yourself, covering 2 main topics, showing a demo, and handling questions.

### Workshop

**Use case**: Hands-on workshops and training sessions

**Sections**:
- Introduction
- Prerequisites
- Module 1
- Module 2
- Exercise
- Recap
- Resources

**Recommended for**:
- Training workshops
- Coding bootcamps
- Educational tutorials
- Multi-part lessons

**Example**:

```yaml
title: "React Hooks Workshop"
author: "Jane Doe"
preset: workshop
language: en
sections:  # Optional: override to customize
  - Introduction
  - Prerequisites
  - Module 1: useState & useEffect
  - Module 2: Custom Hooks
  - Exercise: Build a Todo App
  - Recap
  - Resources
```

The workshop preset emphasizes learning progression with prerequisites, multiple modules, hands-on exercises, and follow-up resources.

### Lightning

**Use case**: Lightning talks (5-10 minutes)

**Sections**:
- Problem
- Solution
- Demo
- CTA (Call to Action)

**Recommended for**:
- Quick demos at meetups
- Open source project pitches
- Brief tool introductions
- Time-constrained presentations

**Example**:

```yaml
title: "slidev-forge: Scaffold Slidev Projects in Seconds"
author: "Jane Doe"
preset: lightning
transition: fade
```

The lightning preset follows the classic "problem-solution-demo-CTA" structure, perfect for grabbing attention quickly and delivering a focused message.

### Pitch

**Use case**: Startup pitch decks and investor presentations

**Sections**:
- Problem
- Solution
- Market
- Product
- Business
- Team
- Ask

**Recommended for**:
- Investor pitches
- Accelerator applications
- Startup demos
- Business proposals

**Example**:

```yaml
title: "RevTech: AI-Powered Revenue Analytics"
subtitle: "Seed Round Pitch"
author: "Jane Doe"
preset: pitch
visual_theme: github-light  # Light theme for professional setting
slide_numbers: true
```

The pitch preset covers all essential elements investors expect: the problem you're solving, your solution, market opportunity, product details, business model, team credentials, and funding ask.

## Customizing Presets

Presets are starting points. You can:

### 1. Override with explicit sections

```yaml
preset: conference
sections:  # This completely replaces the preset sections
  - Welcome
  - Part 1: Theory
  - Part 2: Practice
  - Conclusion
```

### 2. Use preset sections as a reference

Generate a project with a preset, then edit the resulting `presentation.yaml` (in interactive mode) or your config file to see and modify the sections.

### 3. Enhance sections with types

After choosing a preset, customize individual sections:

```yaml
preset: conference
sections:
  - name: Introduction
  - name: About
    type: about
  - name: Topic 1
    type: two-cols
  - name: Topic 2
    type: code
    lang: typescript
  - name: Demo
    type: iframe
    url: https://example.com/demo
  - name: Q&A
    type: qna
  - name: Thanks
    type: thanks
```

## Choosing the Right Preset

| If you're giving... | Use preset | Duration |
|---------------------|------------|----------|
| A conference talk | `conference` | 30-45 min |
| A hands-on workshop | `workshop` | 1-3 hours |
| A 5-minute lightning talk | `lightning` | 5-10 min |
| A pitch to investors | `pitch` | 10-15 min |
| Something else | Omit `preset`, define custom `sections` | Any |

## No Preset

If none of the presets fit, simply omit the `preset` field and define sections manually:

```yaml
title: My Custom Talk
author: Jane Doe
sections:
  - Welcome
  - Background
  - My Unique Flow
  - Interactive Poll
  - Summary
```

Or use the default sections (`Introduction` and `Références`) by omitting both `preset` and `sections`.

## Next Steps

- **[Section Types Reference](/docs/reference/section-types)**: Customize each section with specialized layouts
- **[YAML Configuration](/docs/guides/yaml-configuration)**: Complete guide to config options
- **[Multi-File Mode](/docs/guides/multi-file-mode)**: Understand how sections map to files
