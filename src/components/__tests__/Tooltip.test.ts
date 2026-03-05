import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import TooltipWrapper from "./TooltipWrapper.astro";

describe("Tooltip", () => {
  it("renders default state (tooltip hidden)", async () => {
    const screen = await render(TooltipWrapper, {
      props: {},
      slots: {
        main: "Main Content",
        hover: "Hover Content",
      },
    });
    const wrapper = screen.getByTestId("tooltip-wrapper");
    await expect(wrapper).toMatchScreenshot("tooltip-default");
  });

  it("renders hover state (tooltip visible)", async () => {
    const screen = await render(TooltipWrapper, {
      props: {},
      slots: {
        main: "Main Content",
        hover: "Hover Content",
      },
    });
    const trigger = screen.getByText("Main Content");
    await trigger.hover();
    const wrapper = screen.getByTestId("tooltip-wrapper");
    await expect(wrapper).toMatchScreenshot("tooltip-hover");
  });

  it("renders with link variant", async () => {
    const screen = await render(TooltipWrapper, {
      props: { to: "https://example.com" },
      slots: {
        main: "Link Text",
        hover: "Tooltip Info",
      },
    });
    const wrapper = screen.getByTestId("tooltip-wrapper");
    await expect(wrapper).toMatchScreenshot("tooltip-with-link-default");
  });

  it("renders link variant hover state", async () => {
    const screen = await render(TooltipWrapper, {
      props: { to: "https://example.com" },
      slots: {
        main: "Link Text",
        hover: "Tooltip Info",
      },
    });
    const link = screen.getByText("Link Text").first();
    await link.hover();
    const wrapper = screen.getByTestId("tooltip-wrapper");
    await expect(wrapper).toMatchScreenshot("tooltip-with-link-hover");
  });
});
