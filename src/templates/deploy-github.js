export function generateDeployYml(config) {
  return `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Install slidev
        run: npm i -g @slidev/cli@latest

      - name: Build
        run: slidev build --base /${config.project_name}/

      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v4.1.0
        with:
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
}
