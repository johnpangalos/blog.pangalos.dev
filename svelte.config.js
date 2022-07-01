import path from "path";
import adapter from "@sveltejs/adapter-cloudflare";
import preprocess from "svelte-preprocess";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  extensions: [".svelte", ".md"],

  preprocess: [
    preprocess(),
    mdsvex({
      extensions: [".md"],
    }),
  ],
  experimental: {
    useVitePreprocess: true,
  },

  kit: {
    adapter: adapter(),
    vite: {
      resolve: {
        alias: {
          "@": path.resolve("./src"),
        },
      },
    },
  },
};

export default config;
