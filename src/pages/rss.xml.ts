import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { brand, site } from '../data';

export async function GET(context: APIContext) {
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${site.name} — 文章`,
    description: brand.tagline,
    site: context.site ?? site.website,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.summary,
      link: `/notes/${note.id}/`,
      pubDate: note.data.date,
      categories: [note.data.category],
    })),
    customData: '<language>zh-cn</language>',
  });
}
