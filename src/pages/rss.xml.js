import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { slugify, formatBlogPosts } from '../js/utils';

export async function GET(context) {
  // formatBlogPosts drops drafts + future-dated posts and sorts newest-first,
  // matching what actually gets built under /blog/[slug].
  const blog = formatBlogPosts(await getCollection('blog'));
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