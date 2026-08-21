import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const required = [
  'package.json', 'astro.config.mjs', 'src/data.ts', 'src/layouts/BaseLayout.astro',
  'src/pages/index.astro', 'src/pages/en/index.astro', 'src/pages/projects/index.astro',
  'src/pages/en/projects/index.astro', 'src/pages/resume.astro', 'src/pages/en/resume.astro',
  'src/pages/notes.astro', 'src/pages/en/notes.astro', 'src/pages/about.astro',
  'src/pages/en/about.astro', '.github/workflows/deploy.yml', 'profile/README.md', 'profile/README.en.md',
];
const missing = required.filter((file) => !existsSync(resolve(file)));
if (missing.length) { console.error(`Missing files:\n${missing.join('\n')}`); process.exit(1); }
const zh = readFileSync(resolve('profile/README.md'), 'utf8');
const en = readFileSync(resolve('profile/README.en.md'), 'utf8');
for (const [name, text] of [['README.md', zh], ['README.en.md', en]]) {
  if (!text.includes('DeepResume') || !text.includes('PaperQAAgent') || !text.includes('Youcansee')) {
    console.error(`${name} is missing selected projects`); process.exit(1);
  }
}
console.log('VERIFY_SITE_OK');
