---
sidebar_position: 4
---

# Pitch Deck

A startup pitch deck for investors. This configuration follows the classic pitch structure with professional styling and compelling data visualization.

## Use Case

Perfect for:
- Startup investor pitches
- Product demos for stakeholders
- Business proposals
- Funding presentations
- Demo days

## Configuration

```yaml
title: "CloudMetrics"
subtitle: "Real-time analytics for modern apps"
author: "Taylor Morgan"
event_name: "Startup Demo Day 2026"

slidev_theme: seriph
visual_theme: nord
transition: slide-left
language: en

sections:
  - name: Cover
    type: cover
    image: https://images.unsplash.com/photo-1551288049-bebda4e38f71
  - name: The Problem
    type: two-cols
  - name: Market Size
    type: fact
    value: "$12B"
    description: global analytics market by 2027
  - name: The Solution
    type: default
  - name: How It Works
    type: diagram
    diagram: flowchart TD
  - name: Product Demo
    type: default
  - name: Key Features
    type: steps
    items:
      - Real-time dashboards
      - Custom metrics
      - AI-powered insights
      - 99.9% uptime SLA
  - name: Technology
    type: code
    lang: typescript
  - name: Business Model
    type: two-cols
  - name: Revenue Streams
    type: steps
    items:
      - SaaS subscriptions ($49-$499/mo)
      - Enterprise licenses ($5k-$50k/yr)
      - Professional services
      - API usage fees
  - name: Market Traction
    type: fact
    value: "2,500"
    description: active users in 6 months
  - name: Competition
    type: two-cols
  - name: Go-to-Market
    type: steps
    items:
      - Developer community (Q1)
      - Content marketing (Q2)
      - Sales team (Q3)
      - Partnerships (Q4)
  - name: Roadmap
    type: diagram
    diagram: gantt
  - name: The Team
    type: about
  - name: Team Expertise
    type: two-cols
  - name: The Ask
    type: fact
    value: "$2M"
    description: seed round to scale to 50k users
  - name: Use of Funds
    type: steps
    items:
      - 40% - Engineering team
      - 30% - Sales & marketing
      - 20% - Infrastructure
      - 10% - Operations
  - name: Thank You
    type: thanks

deploy:
  - vercel
  - github-pages

export:
  format: pdf
  dark: false
  with_clicks: false

options:
  snippets: true
  components: true

line_numbers: false
slide_numbers: true
download: true
color_schema: light

social:
  website: https://cloudmetrics.example.com
  github: cloudmetrics
  twitter: cloudmetrics
  linkedin: cloudmetrics

footer: "CloudMetrics | Confidential"

logo: /logo.svg
```

## What You Get

After running `npx slidev-forge pitch.yaml`, you'll have:

- **20 slides** following classic pitch deck structure
- **Professional Nord theme** with cool arctic blues (light mode)
- **Market data visualization** with fact slides
- **Product diagrams** using Mermaid (flowchart and Gantt)
- **Team and expertise** sections
- **Clear financial ask** with fund allocation
- **Dual deployment** to Vercel and GitHub Pages
- **PDF export** for sending to investors
- **Confidential footer** on all slides
- **Logo support** (add your logo to public/logo.svg)

### Key Files

```
cloudmetrics/
├── .github/workflows/deploy.yml
├── vercel.json
├── pages/
│   ├── 01-toc.md
│   ├── 02-cover.md              # Hero image
│   ├── 03-the-problem.md        # Two-column layout
│   ├── 04-market-size.md        # $12B fact
│   ├── 05-the-solution.md
│   ├── 06-how-it-works.md       # Architecture diagram
│   ├── 07-product-demo.md
│   ├── 08-key-features.md       # Animated list
│   ├── 09-technology.md         # Code example
│   ├── 10-business-model.md
│   ├── 11-revenue-streams.md    # Revenue breakdown
│   ├── 12-market-traction.md    # 2,500 users
│   ├── 13-competition.md
│   ├── 14-go-to-market.md       # GTM strategy
│   ├── 15-roadmap.md            # Gantt chart
│   ├── 16-the-team.md
│   ├── 17-team-expertise.md
│   ├── 18-the-ask.md            # $2M seed
│   ├── 19-use-of-funds.md       # Fund allocation
│   └── 20-thank-you.md
├── public/
│   └── logo.svg                 # Add your logo here
├── components/
├── layouts/
├── styles/index.css             # Nord professional colors
├── package.json
├── presentation.yaml
└── slides.md
```

## Customize It

**Different industry**: Replace CloudMetrics with your product:
```yaml
title: "HealthTrack"
subtitle: "AI-powered fitness coaching"
```

**Add more traction**: Include additional metrics:
```yaml
  - name: Revenue
    type: fact
    value: "$50k"
    description: MRR, growing 30% month-over-month
```

**Different theme**: Try `github-light` for a clean, minimal look:
```yaml
visual_theme: github-light
```

**Add competitive advantage**: Use a comparison table in two-cols:
```yaml
  - name: Competition
    type: two-cols
```

**Embed product demo**: Use iframe for live product:
```yaml
  - name: Product Demo
    type: iframe
    url: https://demo.cloudmetrics.example.com
```

**Adjust the ask**: Change funding amount and allocation:
```yaml
  - name: The Ask
    type: fact
    value: "$5M"
    description: Series A to expand globally
  - name: Use of Funds
    type: steps
    items:
      - 50% - International expansion
      - 25% - Product development
      - 15% - Marketing
      - 10% - Operations
```

**Add investor-friendly features**: Include contact info:
```yaml
social:
  email: investors@cloudmetrics.example.com
  linkedin: cloudmetrics
  website: https://cloudmetrics.example.com/pitch
```

**Custom colors**: Override Nord theme for brand colors:
```yaml
visual_theme: custom
colors:
  primary: "#0066CC"
  secondary: "#00CC66"
```
