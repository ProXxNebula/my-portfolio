import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseFrontmatter, getSlugFromFilename } from '$lib/utils/frontmatter';

export const GET: RequestHandler = async () => {
  try {
    // In production, we need to use import.meta.glob to get static files
    const modules = import.meta.glob('/static/homelab-content/*.md', { as: 'raw', eager: true });

    const homelabs = Object.entries(modules).map(([filepath, content]) => {
      const filename = filepath.split('/').pop() || '';
      const slug = getSlugFromFilename(filename);

      const parsed = parseFrontmatter(content as string);

      if (!parsed) {
        console.warn(`No frontmatter found in ${filename}`);
        return null;
      }

      return {
        slug,
        ...parsed.frontmatter
      };
    }).filter(Boolean); // Remove nulls

    return json(homelabs);
  } catch (error) {
    console.error('Error loading homelabs:', error);
    return json([], { status: 500 });
  }
};
