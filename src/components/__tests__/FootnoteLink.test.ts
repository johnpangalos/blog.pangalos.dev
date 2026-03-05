import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import FootnoteLink from "../FootnoteLink.astro";

describe("FootnoteLink", () => {
  it("renders correctly", async () => {
    const screen = await render(FootnoteLink, {
      props: { number: 3 },
    });
    const link = screen.getByRole("link");
    await expect(link).toMatchScreenshot("footnotelink-default");
  });
});
