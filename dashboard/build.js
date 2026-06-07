/**
 * R.O.S.E Dashboard Build Script
 * Creates optimized production build
 */

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

async function buildDashboard() {
  console.log('🌹 Building R.O.S.E Dashboard...\n');

  try {
    // Bundle JavaScript
    await build({
      entryPoints: ['src/app.js'],
      bundle: true,
      minify: true,
      sourcemap: true,
      outfile: 'dist/app.js',
      format: 'esm',
      target: ['es2020'],
    });
    console.log('✓ JavaScript bundled');

    // Bundle CSS
    await build({
      entryPoints: ['src/styles/main.css'],
      bundle: true,
      minify: true,
      outfile: 'dist/styles.css',
    });
    console.log('✓ CSS bundled');

    // Copy and optimize HTML
    let html = fs.readFileSync('index.html', 'utf-8');
    html = html
      .replace('src/styles/main.css', 'styles.css')
      .replace('src/app.js', 'app.js')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><');
    fs.writeFileSync(path.join(distDir, 'index.html'), html);
    console.log('✓ HTML optimized');

    // Copy favicon
    fs.copyFileSync('favicon.svg', path.join(distDir, 'favicon.svg'));
    console.log('✓ Assets copied');

    console.log('\n✅ Build complete! Output in ./dist/');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildDashboard();
