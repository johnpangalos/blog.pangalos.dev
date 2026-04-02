import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    alias: {
      "cloudflare:workers": new URL(
        "./src/test/__mocks__/cloudflare-workers.ts",
        import.meta.url,
      ).pathname,
      "astro:actions": new URL(
        "./src/test/__mocks__/astro-actions.ts",
        import.meta.url,
      ).pathname,
    },
  },
});
