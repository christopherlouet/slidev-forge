#!/usr/bin/env node

import { run } from '../dist/cli.js';

run(process.argv.slice(2)).catch((err) => {
  console.error(`\n  Erreur: ${err.message}\n`);
  process.exit(1);
});
