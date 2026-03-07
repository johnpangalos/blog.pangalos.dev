import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  output: "server",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
  adapter: cloudflare(),
  markdown: {
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
