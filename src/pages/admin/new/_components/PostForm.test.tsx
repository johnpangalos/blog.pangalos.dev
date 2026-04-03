import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import PostForm, { type PostFormData } from "./PostForm";

// Mock astro:actions
vi.mock("astro:actions", () => ({
  actions: {
    blog: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock MDXEditor since it requires browser APIs not available in jsdom
vi.mock("./MdxEditorField", () => ({
  default: ({ name, defaultValue }: { name: string; defaultValue?: string }) => (
    <textarea data-testid="mdx-editor" name={name} defaultValue={defaultValue} />
  ),
}));

afterEach(cleanup);

function getInput(name: string): HTMLInputElement | HTMLTextAreaElement {
  return document.querySelector(`[name="${name}"]`)!;
}

const sampleData: PostFormData = {
  slug: "test-post",
  sha: "abc123",
  title: "Test Post Title",
  author: "John Pangalos",
  date: "April 2, 2026",
  description: "A test description for the post.",
  tags: "web, javascript",
  categories: "web",
  content: "## Hello\n\nSome content here.",
  draft: true,
};

describe("PostForm", () => {
  describe("edit mode (with initialData)", () => {
    it("populates all fields with initial data", () => {
      render(<PostForm initialData={sampleData} />);

      expect(getInput("title")).toHaveValue("Test Post Title");
      expect(getInput("author")).toHaveValue("John Pangalos");
      expect(getInput("date")).toHaveValue("April 2, 2026");
      expect(getInput("description")).toHaveValue("A test description for the post.");
      expect(getInput("tags")).toHaveValue("web, javascript");
      expect(getInput("categories")).toHaveValue("web");
    });

    it("makes title read-only in edit mode", () => {
      render(<PostForm initialData={sampleData} />);

      expect(getInput("title")).toHaveAttribute("readonly");
    });

    it("passes content to MDX editor", () => {
      render(<PostForm initialData={sampleData} />);

      expect(getInput("content")).toHaveValue("## Hello\n\nSome content here.");
    });

    it("shows Update button instead of Publish", () => {
      render(<PostForm initialData={sampleData} />);

      const buttons = screen.getAllByRole("button");
      const buttonTexts = buttons.map((b) => b.textContent);
      expect(buttonTexts).toContain("Update");
      expect(buttonTexts).not.toContain("Publish");
    });
  });

  describe("create mode (no initialData)", () => {
    it("renders empty fields with author default", () => {
      render(<PostForm />);

      expect(getInput("title")).toHaveValue("");
      expect(getInput("title")).not.toHaveAttribute("readonly");
      expect(getInput("author")).toHaveValue("John Pangalos");
      expect(getInput("date")).toHaveValue("");
      expect(getInput("description")).toHaveValue("");
    });

    it("shows Publish button", () => {
      render(<PostForm />);

      const buttons = screen.getAllByRole("button");
      const buttonTexts = buttons.map((b) => b.textContent);
      expect(buttonTexts).toContain("Publish");
      expect(buttonTexts).not.toContain("Update");
    });
  });
});
