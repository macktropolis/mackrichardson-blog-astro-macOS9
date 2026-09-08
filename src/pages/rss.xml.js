import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

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
      // Compute RSS link from post `id` (glob loader ids have no file extension)
      link: `/blog/${post.id}/`,
    })),
  });
}