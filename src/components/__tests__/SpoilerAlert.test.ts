import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import SpoilerAlert from "../SpoilerAlert.astro";

describe("SpoilerAlert", () => {
  it("renders correctly", async () => {
    const screen = await render(SpoilerAlert);
    const alert = screen.getByTestId("spoiler-alert");
    await expect(alert).toMatchScreenshot("spoileralert-default");
  });
});
