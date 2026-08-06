// Post-build script: copies the built consumer-demo app into the showcase
// app's output directory, so a single Vercel deployment can serve both
// (showcase at "/", consumer-demo at "/consumer") from one static root.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'dist/consumer-demo/browser');
const dest = path.join(__dirname, '..', 'dist/showcase/browser/consumer');

fs.cpSync(src, dest, { recursive: true });
