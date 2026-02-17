---
sidebar_position: 4
---

# Deployment

slidev-forge can auto-generate deployment configuration files for popular hosting platforms. Specify your deployment targets in the YAML config, and the necessary files are created for you.

## Supported Platforms

Three platforms are supported:

- **GitHub Pages**: Free static hosting via GitHub Actions
- **Vercel**: Zero-config deployments with preview URLs
- **Netlify**: Continuous deployment with form handling and functions

## Configuring Deployment

Use the `deploy` field in your YAML config:

```yaml
title: My Talk
author: Jane Doe
deploy:
  - github-pages
```

Multiple platforms:

```yaml
deploy:
  - github-pages
  - vercel
  - netlify
```

**Default**: If you omit the `deploy` field, it defaults to `[github-pages]`.

## GitHub Pages

### Generated File

`.github/workflows/deploy.yml`

### What It Does

A GitHub Actions workflow that:
1. Triggers on pushes to `main` branch
2. Installs dependencies
3. Runs `npm run build` to generate the static site
4. Deploys the `dist/` folder to GitHub Pages

### Setup Steps

1. Generate your project with `deploy: [github-pages]`
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin git@github.com:username/repo.git
   git push -u origin main
   ```
3. Enable GitHub Pages in your repository settings:
   - Go to **Settings > Pages**
   - Source: **GitHub Actions**
4. The workflow runs automatically on the next push
5. Your presentation is live at `https://username.github.io/repo`

### Workflow File

Example `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

## Vercel

### Generated File

`vercel.json`

### What It Does

Configures Vercel to:
- Build using `npm run build`
- Serve the `dist/` directory
- Set up redirects for SPA routing

### Setup Steps

1. Generate your project with `deploy: [vercel]`
2. Install Vercel CLI (optional): `npm i -g vercel`
3. Deploy:
   ```bash
   vercel
   ```
   Or push to GitHub and connect the repo in the Vercel dashboard
4. Your presentation is live at `https://your-project.vercel.app`

### Configuration File

Example `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null
}
```

### Continuous Deployment

Connect your GitHub repository to Vercel for automatic deployments:
- Every push to `main` triggers a production deployment
- Pull requests get preview URLs
- Zero configuration needed

## Netlify

### Generated File

`netlify.toml`

### What It Does

Configures Netlify to:
- Build using `npm run build`
- Publish the `dist/` directory
- Handle SPA redirects
- Set recommended headers

### Setup Steps

1. Generate your project with `deploy: [netlify]`
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```
3. Connect the repository in the Netlify dashboard:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **Add new site > Import an existing project**
   - Select your repository
   - Netlify auto-detects the build settings from `netlify.toml`
4. Your presentation is live at `https://random-name.netlify.app`

### Configuration File

Example `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Continuous Deployment

Netlify automatically deploys:
- Every push to your default branch (production)
- Every pull request (preview deployments with unique URLs)

## Building for Production

All platforms expect a `dist/` folder with the built static site. After generation, run:

```bash
npm install
npm run build
```

This:
1. Installs Slidev and dependencies
2. Builds your presentation to `dist/`
3. Optimizes assets for production

The `dist/` folder contains everything needed to serve your presentation.

## Post-Generation Workflow

### GitHub Pages

```bash
# 1. Generate project
npx slidev-forge presentation.yaml

# 2. Build locally (optional, to verify)
cd my-talk
npm install
npm run build

# 3. Push to GitHub
git add .
git commit -m "Initial commit"
git push -u origin main

# 4. Enable GitHub Pages in repo settings
# 5. Wait for workflow to complete
```

### Vercel

```bash
# 1. Generate project
npx slidev-forge presentation.yaml

# 2. Deploy
cd my-talk
npm install
npx vercel

# Or: Push to GitHub and connect repo in Vercel dashboard
```

### Netlify

```bash
# 1. Generate project
npx slidev-forge presentation.yaml

# 2. Push to GitHub
cd my-talk
git init
git add .
git commit -m "Initial commit"
git push

# 3. Connect repo in Netlify dashboard
```

## Custom Domains

All three platforms support custom domains:

- **GitHub Pages**: Configure in **Settings > Pages > Custom domain**
- **Vercel**: Add domain in **Project Settings > Domains**
- **Netlify**: Add domain in **Site settings > Domain management**

## Choosing a Platform

| Platform | Best for | Pros | Cons |
|----------|----------|------|------|
| **GitHub Pages** | Open source projects, free hosting | Free, simple, built-in CI/CD | Slower builds, limited to public repos (unless Pro) |
| **Vercel** | Fast deployments, preview URLs | Instant, great DX, automatic previews | Free tier limits |
| **Netlify** | Advanced features (forms, functions) | Feature-rich, generous free tier | Slightly slower than Vercel |

## No Deployment

If you want to build and host manually, omit the `deploy` field or set it to an empty array:

```yaml
deploy: []
```

This skips generating any deployment config files.

## Next Steps

- **[YAML Configuration](/docs/guides/yaml-configuration)**: Configure deployment options
- **[Exporting](/docs/cli/generate)**: Export presentations to PDF
- **[Multi-File Mode](/docs/guides/multi-file-mode)**: Understand the generated project structure
