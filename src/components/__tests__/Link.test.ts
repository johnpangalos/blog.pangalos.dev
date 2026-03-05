import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import Link from "../Link.astro";

describe("Link", () => {
  it("renders default state", async () => {
    const screen = await render(Link, {
      props: { to: "https://example.com" },
      slots: { default: "Example Link" },
    });
    const link = screen.getByRole("link");
    await expect(link).toMatchScreenshot("link-default");
  });

  it("renders hover state", async () => {
    const screen = await render(Link, {
      props: { to: "https://example.com" },
      slots: { default: "Example Link" },
    });
    const link = screen.getByRole("link");
    await link.hover();
    await expect(link).toMatchScreenshot("link-hover");
  });

  it("renders with custom class", async () => {
    const screen = await render(Link, {
      props: { to: "https://example.com", class: "no-underline" },
      slots: { default: "Example Link" },
    });
    const link = screen.getByRole("link");
    await expect(link).toMatchScreenshot("link-custom-class");
  });
});
