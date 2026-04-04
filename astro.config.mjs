import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkMergeBlockquotes from "./src/plugins/remark-merge-blockquotes.js";

export default defineConfig({
  output: "server",
  integrations: [react(), mdx()],
  adapter: cloudflare({
    sessionKVBindingName: "BLOG_PANGALOS_SESSION",
  }),
  markdown: {
    remarkPlugins: [remarkMergeBlockquotes],
    rehypePlugins: [
      rehypeExternalLinks,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          content: {
            type: "element",
            tagName: "span",
            properties: { className: ["heading-link"] },
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
    ],
  },
});
