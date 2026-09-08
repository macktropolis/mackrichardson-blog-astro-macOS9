import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { slugify } from '../js/utils';

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'Mack Richardson’s Blog',
    description: 'Mack Richardson writes about filemaker, web development, comics, toys and more...',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      // Match Astro's lowercased /blog/[slug] route (glob loader ids keep filename case)
      link: `/blog/${slugify(post.id)}/`,
    })),
  });
}