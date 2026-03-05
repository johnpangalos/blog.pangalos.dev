import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import FootnoteAnchor from "../FootnoteAnchor.astro";

describe("FootnoteAnchor", () => {
  it("renders correctly", async () => {
    const screen = await render(FootnoteAnchor, {
      props: { number: 3 },
    });
    const anchor = screen.getByTestId("footnote-anchor");
    await expect(anchor).toMatchScreenshot("footnoteanchor-default");
  });
});
