import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
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

  it("renders **The** *The New York Times* as bold then italic", () => {
    const { container } = render(
      <>{parseInlineMarkdown("**The** *The New York Times*")}</>,
    );
    const bold = container.querySelector("b");
    const italic = container.querySelector("i");
    expect(bold).not.toBeNull();
    expect(bold!.textContent).toBe("The");
    expect(italic).not.toBeNull();
    expect(italic!.textContent).toBe("The New York Times");
    expect(container.textContent).toBe("The The New York Times");
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

  it("renders a Link when to prop is provided", () => {
    const { container } = render(
      <Tooltip main="click" hover="info" to="https://example.com" />,
    );
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link!.getAttribute("href")).toBe("https://example.com");
    expect(link!.textContent).toBe("click");
  });

  it("renders plain text trigger when no to prop", () => {
    const { container } = render(<Tooltip main="plain" hover="info" />);
    const link = container.querySelector("a");
    expect(link).toBeNull();
    expect(container.textContent).toBe("plain");
  });

  describe("mobile path", () => {
    beforeEach(() => {
      Object.defineProperty(navigator, "userAgent", {
        value: "iPhone",
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(navigator, "userAgent", {
        value: "",
        configurable: true,
      });
    });

    it("renders orange styled text with to prop on mobile", () => {
      const { container } = render(
        <Tooltip main="tap me" hover="info" to="https://example.com" />,
      );
      const span = container.querySelector(
        ".text-orange-600",
      );
      expect(span).not.toBeNull();
      expect(span!.textContent).toBe("tap me");
    });

    it("renders DialogTrigger with Pressable on mobile", () => {
      render(<Tooltip main="tap" hover="mobile tooltip" />);
      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass("border-b-2", "border-dotted");
    });
  });
});
