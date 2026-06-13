import { describe, it, expect } from "vitest";
import { shouldImportPasteAsMarkdown } from "./pasteMarkdownPlugin";

describe("shouldImportPasteAsMarkdown", () => {
  it("imports plain text containing a markdown link", () => {
    const text =
      "named after [the dog](https://thejetsons.fandom.com/wiki/Astro) from the Jetsons";
    expect(shouldImportPasteAsMarkdown(text, "")).toBe(true);
  });

  it("imports a markdown link with a title", () => {
    const text = 'see [React](https://react.dev/learn "React docs")';
    expect(shouldImportPasteAsMarkdown(text, "")).toBe(true);
  });

  it("imports multi-line drafts that contain links", () => {
    const text =
      "## heading\n\nsome text with [a link](https://example.com) in it";
    expect(shouldImportPasteAsMarkdown(text, "")).toBe(true);
  });

  it("ignores plain text without markdown links", () => {
    expect(shouldImportPasteAsMarkdown("just some words", "")).toBe(false);
  });

  it("ignores bracketed text that is not a link", () => {
    expect(shouldImportPasteAsMarkdown("array[0] (zero indexed)", "")).toBe(
      false,
    );
  });

  it("defers to the rich paste when the clipboard has real anchors", () => {
    const text = "[a link](https://example.com)";
    const html = '<a href="https://example.com">a link</a>';
    expect(shouldImportPasteAsMarkdown(text, html)).toBe(false);
  });

  it("imports when clipboard html is styled text without anchors", () => {
    const text = "[a link](https://example.com)";
    const html = "<span>[a link](https://example.com)</span>";
    expect(shouldImportPasteAsMarkdown(text, html)).toBe(true);
  });
});
