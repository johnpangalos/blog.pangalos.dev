import { getViteConfig } from "astro/config";
import { astroRenderer } from "vitest-browser-astro/plugin";
import { playwright } from "@vitest/browser-playwright";

export default getViteConfig({
  plugins: [astroRenderer()],
  test: {
    setupFiles: ["./src/test-setup.ts"],
    include: [
      "src/components/__tests__/**/*.test.ts",
      "src/pages/__tests__/**/*.test.ts",
    ],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
      screenshotFailures: false,
    },
  },
});
