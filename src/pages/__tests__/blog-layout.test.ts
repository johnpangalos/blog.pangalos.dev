import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import BlogLayoutWrapper from "./BlogLayoutWrapper.astro";

describe("Blog Layout", () => {
  it("renders correctly", async () => {
    const screen = await render(BlogLayoutWrapper, {
      props: { title: "the.winds.of.2025" },
    });
    const layout = screen.getByTestId("blog-layout");
    await expect(layout).toMatchScreenshot("bloglayout-default");
  });
});
