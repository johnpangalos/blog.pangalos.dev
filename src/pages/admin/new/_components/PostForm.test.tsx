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

const sampleData: PostFormData = {
  slug: "test-post",
  sha: "abc123",
  content: '---\nauthor: "John Pangalos"\ntitle: "Test Post Title"\n---\n\n## Hello\n\nSome content here.',
};

describe("PostForm", () => {
  describe("edit mode (with initialData)", () => {
    it("passes full content to MDX editor", () => {
      render(<PostForm initialData={sampleData} />);

      const editor = screen.getByTestId("mdx-editor");
      expect(editor).toHaveValue(sampleData.content);
    });

    it("shows Update button instead of Publish", () => {
      render(<PostForm initialData={sampleData} />);

      const buttons = screen.getAllByRole("button");
      const buttonTexts = buttons.map((b) => b.textContent);
      expect(buttonTexts).toContain("Update");
      expect(buttonTexts).not.toContain("Publish");
    });

    it("does not show Save as Draft button", () => {
      render(<PostForm initialData={sampleData} />);

      const buttons = screen.getAllByRole("button");
      const buttonTexts = buttons.map((b) => b.textContent);
      expect(buttonTexts).not.toContain("Save as Draft");
    });
  });

  describe("create mode (no initialData)", () => {
    it("renders editor with default frontmatter template", () => {
      render(<PostForm />);

      const editor = screen.getByTestId("mdx-editor") as HTMLTextAreaElement;
      expect(editor.value).toContain("---");
      expect(editor.value).toContain('author: "John Pangalos"');
    });

    it("shows Publish button", () => {
      render(<PostForm />);

      const buttons = screen.getAllByRole("button");
      const buttonTexts = buttons.map((b) => b.textContent);
      expect(buttonTexts).toContain("Publish");
      expect(buttonTexts).not.toContain("Update");
    });

    it("shows Save as Draft button", () => {
      render(<PostForm />);

      const buttons = screen.getAllByRole("button");
      const buttonTexts = buttons.map((b) => b.textContent);
      expect(buttonTexts).toContain("Save as Draft");
    });
  });
});
