import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      "cloudflare:workers": new URL(
        "./src/test/__mocks__/cloudflare-workers.ts",
        import.meta.url,
      ).pathname,
    },
  },
});
