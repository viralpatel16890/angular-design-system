// Post-build script: adds sub-path exports to dist/angular-ds/package.json.
// Run after `ng build angular-ds`. Workaround for ng-packagr 22 + TypeScript 6
// secondary-entry compilation bug (referencedFiles[index] undefined).
// The primary bundle is already ESM + sideEffects:false, so bundlers tree-shake
// unused symbols regardless of which sub-path the consumer imports from.

const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '../dist/angular-ds/package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const components = [
  'accordion', 'avatar', 'badge', 'button', 'card', 'checkbox',
  'form-error', 'input', 'modal', 'navbar', 'progress', 'select',
  'sidebar', 'tabs', 'toast', 'toggle', 'tooltip', 'theme',
];

for (const c of components) {
  pkg.exports['./' + c] = {
    types: './types/angular-ds.d.ts',
    default: './fesm2022/angular-ds.mjs',
  };
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✔ Patched ${components.length} sub-path exports into dist/angular-ds/package.json`);
