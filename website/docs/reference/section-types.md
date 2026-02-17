---
sidebar_position: 2
---

# Section Types

slidev-forge supports 13 section types, each generating specific layouts and content structures.

## Overview

Sections can be defined as simple strings (defaulting to `type: default`) or as objects with specific types:

```yaml
sections:
  # Simple string (defaults to type: default)
  - Introduction

  # Object with type
  - name: Demo
    type: code
    lang: python
```

## Section Types Reference

### default

Standard content slide with title and placeholder for your content.

**Generated content:**
- Title heading
- Placeholder comment for content

**Example:**

```yaml
sections:
  - name: Introduction
    type: default
```

---

### two-cols

Two-column layout for side-by-side content.

**Generated content:**
- Left column area
- Right column area separated by `::right::`

**Example:**

```yaml
sections:
  - name: Comparison
    type: two-cols
```

---

### image-right

Content on the left, image placeholder on the right (60/40 split).

**Generated content:**
- Content area
- Image placeholder on the right side

**Example:**

```yaml
sections:
  - name: Product Demo
    type: image-right
```

---

### quote

Centered blockquote with author attribution.

**Generated content:**
- Blockquote element
- Author attribution

**Example:**

```yaml
sections:
  - name: Inspiration
    type: quote
```

---

### qna

Centered Q&A slide for questions and answers.

**Generated content:**
- Centered layout
- Q&A title

**Example:**

```yaml
sections:
  - name: Q&A
    type: qna
```

---

### thanks

Thank you slide with author name and GitHub link.

**Generated content:**
- Thank you heading
- Author name
- GitHub link (if configured)

**Example:**

```yaml
sections:
  - name: Thanks
    type: thanks
```

---

### about

About the author slide with bio placeholder.

**Generated content:**
- Author name
- Bio placeholder

**Example:**

```yaml
sections:
  - name: About Me
    type: about
```

---

### code

Code block slide with syntax highlighting.

**Options:**
- `lang`: Language for syntax highlighting (default: `javascript`)

**Generated content:**
- Code block with specified language highlighting

**Example:**

```yaml
sections:
  - name: Code Demo
    type: code
    lang: python
```

---

### diagram

Mermaid diagram slide.

**Options:**
- `diagram`: Mermaid diagram type (default: `flowchart TD`)

**Generated content:**
- Mermaid diagram template

**Example:**

```yaml
sections:
  - name: Architecture
    type: diagram
    diagram: sequenceDiagram
```

---

### cover

Full-bleed cover slide with background image.

**Options:**
- `image`: Background image URL

**Generated content:**
- Cover layout with background image

**Example:**

```yaml
sections:
  - name: Cover
    type: cover
    image: https://example.com/background.jpg
```

---

### iframe

Embedded web content in a responsive iframe.

**Options:**
- `url`: URL to embed

**Generated content:**
- Responsive iframe element

**Example:**

```yaml
sections:
  - name: Demo
    type: iframe
    url: https://codepen.io/example
```

---

### steps

Animated list with items revealed one by one using `<v-clicks>`.

**Options:**
- `items`: Array of list items

**Generated content:**
- List with click-based animation

**Example:**

```yaml
sections:
  - name: Best Practices
    type: steps
    items:
      - DRY (Don't Repeat Yourself)
      - KISS (Keep It Simple, Stupid)
      - YAGNI (You Aren't Gonna Need It)
```

---

### fact

Key figure highlight with large number and description.

**Options:**
- `value`: Key figure to display
- `description`: Description below the figure

**Generated content:**
- Large emphasized value
- Description text

**Example:**

```yaml
sections:
  - name: Uptime
    type: fact
    value: "99.9%"
    description: uptime guarantee
```

## Complete Example

```yaml
title: Complete Presentation
author: Jane Doe

sections:
  # Simple strings (default type)
  - Introduction
  - Overview

  # Structured content
  - name: Comparison
    type: two-cols

  # Code examples
  - name: Python Basics
    type: code
    lang: python

  - name: JavaScript Example
    type: code
    lang: javascript

  # Diagrams
  - name: System Architecture
    type: diagram
    diagram: flowchart TD

  - name: User Flow
    type: diagram
    diagram: sequenceDiagram

  # Interactive content
  - name: Live Demo
    type: iframe
    url: https://codepen.io/example

  # Animated lists
  - name: Key Benefits
    type: steps
    items: [Fast, Reliable, Simple]

  # Statistics
  - name: Performance
    type: fact
    value: "99.9%"
    description: uptime

  # Standard slides
  - name: Q&A
    type: qna

  - name: Thanks
    type: thanks
```
