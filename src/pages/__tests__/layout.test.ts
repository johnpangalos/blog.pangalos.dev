import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import LayoutWrapper from "./LayoutWrapper.astro";

describe("Layout", () => {
  it("renders light theme", async () => {
    const screen = await render(LayoutWrapper, {
      props: { theme: "light" },
    });
    const layout = screen.getByTestId("layout");
    await expect(layout).toMatchScreenshot("layout-light");
  });

  it("renders dark theme", async () => {
    const screen = await render(LayoutWrapper, {
      props: { theme: "dark" },
    });
    const layout = screen.getByTestId("layout");
    await expect(layout).toMatchScreenshot("layout-dark");
  });
});
