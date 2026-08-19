// Post-build script: copies the built Storybook static site into the
// showcase app's output directory, so the same Vercel deployment also
// serves Storybook at "/storybook" alongside showcase ("/") and
// consumer-demo ("/consumer").
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'storybook-static');
const dest = path.join(__dirname, '..', 'dist/showcase/browser/storybook');

fs.cpSync(src, dest, { recursive: true });
