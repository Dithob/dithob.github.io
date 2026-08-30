import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    type: z.enum(['note', 'guide', 'manual']),
    typeLabel: z.string(),
    category: z.string(),
    categoryEn: z.string(),
    summary: z.string(),
    summaryEn: z.string(),
    source: z.string(),
    sourceTitle: z.string().nullable(),
    sourceUrl: z.string().url(),
    author: z.string().nullable(),
    duration: z.string().nullable(),
    sourceId: z.string().nullable(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
