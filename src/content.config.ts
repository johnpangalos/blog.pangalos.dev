import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    author: z.string(),
    title: z.string(),
    date: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    categories: z.array(z.string()),
  }),
});

export const collections = { blog };
