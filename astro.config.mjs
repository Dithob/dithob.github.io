import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dithob.github.io',
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/resume/': '/about/',
    '/en/resume/': '/en/about/',
  },
  integrations: [sitemap({
    filter: (page) => !page.includes('/404/') && !page.includes('search-index') && !page.includes('rss.xml'),
  })],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'css-variables', wrap: true },
  },
});
