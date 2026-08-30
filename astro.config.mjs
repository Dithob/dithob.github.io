import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dithob.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => !page.includes('/404/'),
  })],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'css-variables', wrap: true },
  },
});
