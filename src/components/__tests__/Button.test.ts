import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import Button from "../Button.astro";

describe("Button", () => {
  it("renders default state", async () => {
    const screen = await render(Button, {
      props: { to: "/blog/test-post" },
      slots: { default: "Go to article" },
    });
    const button = screen.getByRole("button");
    await expect(button).toMatchScreenshot("button-default");
  });

  it("renders hover state", async () => {
    const screen = await render(Button, {
      props: { to: "/blog/test-post" },
      slots: { default: "Go to article" },
    });
    const button = screen.getByRole("button");
    await button.hover();
    await expect(button).toMatchScreenshot("button-hover");
  });
});
