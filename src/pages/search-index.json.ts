import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { brand, projects, site } from '../data';

type IndexEntry = {
  title: string;
  description: string;
  url: string;
  category: string;
  lang: 'zh' | 'en';
};

/**
 * Build-time search index (static JSON emitted at /search-index.json).
 * Used by the navbar search overlay in BaseLayout.
 */
export const GET: APIRoute = async () => {
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const entries: IndexEntry[] = [
    {
      title: site.name,
      description: brand.tagline,
      url: '/',
      category: 'Home',
      lang: 'zh',
    },
    {
      title: site.name,
      description: brand.taglineEn,
      url: '/en/',
      category: 'Home',
      lang: 'en',
    },
    {
      title: '项目与证据',
      description: 'Dithob 的精选项目与工程能力证据。',
      url: '/projects/',
      category: 'Projects',
      lang: 'zh',
    },
    {
      title: 'Projects and evidence',
      description: 'Dithob’s selected projects and engineering evidence.',
      url: '/en/projects/',
      category: 'Projects',
      lang: 'en',
    },
    {
      title: '文章索引',
      description: '把项目背后的判断、验证和边界留下来。',
      url: '/notes/',
      category: 'Notes',
      lang: 'zh',
    },
    {
      title: 'Article index',
      description: 'Keeping the reasoning, validation, and boundaries behind the projects.',
      url: '/en/notes/',
      category: 'Notes',
      lang: 'en',
    },
    {
      title: '关于我',
      description: '关注方向、工程原则、简历下载与联系方式。',
      url: '/about/',
      category: 'About',
      lang: 'zh',
    },
    {
      title: 'About',
      description: 'Focus areas, engineering principles, resume download, and contact.',
      url: '/en/about/',
      category: 'About',
      lang: 'en',
    },
    ...projects.map((project) => ({
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}/`,
      category: project.category,
      lang: 'zh' as const,
    })),
    ...projects.map((project) => ({
      title: project.titleEn,
      description: project.summaryEn,
      url: `/en/projects/${project.slug}/`,
      category: project.categoryEn,
      lang: 'en' as const,
    })),
    ...notes.map((note) => ({
      title: note.data.title,
      description: note.data.summary,
      url: `/notes/${note.id}/`,
      category: note.data.category,
      lang: 'zh' as const,
    })),
    ...notes.map((note) => ({
      title: note.data.titleEn,
      description: note.data.summaryEn,
      url: `/notes/${note.id}/`,
      category: note.data.categoryEn,
      lang: 'en' as const,
    })),
  ];

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
