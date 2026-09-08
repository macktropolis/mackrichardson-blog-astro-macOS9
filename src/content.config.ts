import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      author: z.enum(["Mack Richardson"]),
      image: z.object({
        src: image(),
        alt: z.string(),
        class: z.string().optional(),
      }),
      description: z
        .string()
        .max(
          160,
          "For best SEO results, please keep the description under 160 characters."
        ),
      draft: z.boolean().default(false),
      mackdaddy: z.boolean().default(false),
      category: z.enum([
        "Coding",
        "Comics",
        "FileMaker",
        "MackDaddy Fun & Games",
        "Retro Gaming",
        "Sci-Fi",
        "Random Fun",
        "Tech",
        "Toys",
      ]),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { blog };
