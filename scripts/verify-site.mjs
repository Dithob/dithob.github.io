import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const required = [
  'package.json', 'astro.config.mjs', 'src/data.ts', 'src/layouts/BaseLayout.astro',
  'src/pages/index.astro', 'src/pages/en/index.astro', 'src/pages/projects/index.astro',
  'src/pages/en/projects/index.astro', 'src/pages/notes/index.astro', 'src/pages/notes/[...slug].astro',
  'src/pages/en/notes/index.astro', 'src/pages/about.astro', 'src/pages/en/about.astro',
  'src/content.config.ts', '.github/workflows/deploy.yml', 'profile/README.md', 'profile/README.en.md',
];
const missing = required.filter((file) => !existsSync(resolve(file)));
if (missing.length) { console.error(`Missing files:\n${missing.join('\n')}`); process.exit(1); }

// Notes collection must produce at least one real note page.
const notesDir = resolve('src/content/notes');
const notes = existsSync(notesDir)
  ? readdirSync(notesDir).filter((f) => f.endsWith('.md'))
  : [];
if (!notes.length) { console.error('src/content/notes has no notes; run node ../mediareport/scripts/publish-notes.mjs --write'); process.exit(1); }

// Social share image must be a raster format (SVG is not rendered by social platforms).
if (!existsSync(resolve('public/images/og.png'))) {
  console.error('public/images/og.png is required (SVG is not rendered by social platforms)'); process.exit(1);
}

const zh = readFileSync(resolve('profile/README.md'), 'utf8');
const en = readFileSync(resolve('profile/README.en.md'), 'utf8');
for (const [name, text] of [['README.md', zh], ['README.en.md', en]]) {
  if (!text.includes('DeepResume') || !text.includes('PaperQAAgent') || !text.includes('Youcansee')) {
    console.error(`${name} is missing selected projects`); process.exit(1);
  }
}

// Contact mail must be wired on the about page (resume merged into about).
const about = readFileSync(resolve('src/pages/about.astro'), 'utf8');
if (!about.includes('mailto:')) {
  console.error('src/pages/about.astro must expose the mailto: contact'); process.exit(1);
}

// The resume download entry must point at the public PDF.
if (!about.includes('/resume.pdf')) {
  console.error('src/pages/about.astro must link the resume PDF download'); process.exit(1);
}

console.log('VERIFY_SITE_OK');
