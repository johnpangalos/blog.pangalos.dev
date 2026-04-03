import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Tooltip, { parseInlineMarkdown } from "./TooltipReact";

afterEach(cleanup);

describe("parseInlineMarkdown", () => {
  it("returns plain text unchanged", () => {
    expect(parseInlineMarkdown("hello world")).toBe("hello world");
  });

  it("returns empty string unchanged", () => {
    expect(parseInlineMarkdown("")).toBe("");
  });

  it("wraps *text* in <i> tags", () => {
    const { container } = render(<>{parseInlineMarkdown("*italic*")}</>);
    const italic = container.querySelector("i");
    expect(italic).not.toBeNull();
    expect(italic!.textContent).toBe("italic");
  });

  it("wraps **text** in <b> tags", () => {
    const { container } = render(<>{parseInlineMarkdown("**bold**")}</>);
    const bold = container.querySelector("b");
    expect(bold).not.toBeNull();
    expect(bold!.textContent).toBe("bold");
  });

  it("handles mixed bold and italic", () => {
    const { container } = render(
      <>{parseInlineMarkdown("**bold** and *italic*")}</>,
    );
    const bold = container.querySelector("b");
    const italic = container.querySelector("i");
    expect(bold!.textContent).toBe("bold");
    expect(italic!.textContent).toBe("italic");
    expect(container.textContent).toBe("bold and italic");
  });

  it("preserves surrounding text", () => {
    const { container } = render(
      <>{parseInlineMarkdown("yet *another* acronym.")}</>,
    );
    expect(container.textContent).toBe("yet another acronym.");
    const italic = container.querySelector("i");
    expect(italic!.textContent).toBe("another");
  });

  it("handles bold inside italic context like ***The** New York Times*", () => {
    const { container } = render(
      <>{parseInlineMarkdown("***The** The New York Times*")}</>,
    );
    expect(container.textContent).toContain("The");
    expect(container.textContent).toContain("New York Times");
  });

  it("handles text with no markdown markers", () => {
    const result = parseInlineMarkdown("just plain text");
    expect(result).toBe("just plain text");
  });

  it("handles text with quotes", () => {
    const result = parseInlineMarkdown('"the internet"?');
    expect(result).toBe('"the internet"?');
  });
});

describe("Tooltip component", () => {
  it("renders main text content", () => {
    render(<Tooltip main="click me" hover="tooltip text" />);
    expect(screen.getByText("click me")).toBeInTheDocument();
  });

  it("applies italic formatting from markdown in main", () => {
    const { container } = render(
      <Tooltip main="*The New York Times*" hover="tooltip text" />,
    );
    const italic = container.querySelector("i");
    expect(italic).not.toBeNull();
    expect(italic!.textContent).toBe("The New York Times");
  });

  it("renders trigger with dotted border styling", () => {
    render(<Tooltip main="trigger" hover="content" />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveClass("border-b-2", "border-dotted");
  });
});
