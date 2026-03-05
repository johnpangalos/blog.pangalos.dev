import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import NerdAlert from "../NerdAlert.astro";

describe("NerdAlert", () => {
  it("renders correctly", async () => {
    const screen = await render(NerdAlert);
    const alert = screen.getByTestId("nerd-alert");
    await expect(alert).toMatchScreenshot("nerdalert-default");
  });
});
