import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import BlogPostWrapper from "./BlogPostWrapper.astro";

describe("Blog Post Page", () => {
  it("renders correctly", async () => {
    const screen = await render(BlogPostWrapper, {
      props: { title: "the.winds.of.2025", date: "January 19, 2025" },
    });
    const post = screen.getByTestId("blog-post");
    await expect(post).toMatchScreenshot("blogpost-default");
  });
});
