import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { mdsvex } from "mdsvex";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],

  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ["md"],
      rehypePlugins: [
        rehypeExternalLinks, // Adds 'target' and 'rel' to external links
        rehypeSlug, // Adds 'id' attributes to Headings (h1,h2,etc)
        [
          rehypeAutolinkHeadings,
          {
            // Adds hyperlinks to the headings, requires rehypeSlug
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
    }),
  ],
  kit: {
    adapter: adapter(),
  },
};

export default config;
