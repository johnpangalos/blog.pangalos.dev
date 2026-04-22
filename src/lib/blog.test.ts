import { describe, it, expect } from "vitest";
import { extractTitle, setDraftFlag } from "./blog";

const DOUBLE_QUOTED = `---
author: "John Pangalos"
title: "obligatory.ai.post"
date: "April 2, 2026"
description: "You are absolutely right, I have updated my blog again."
tags: ["bloging", "astro", "ai"]
categories: ["web", "ai"]
draft: true
---

## getting.sloppy

Hello my name is John and I have a problem.
`;

const SINGLE_QUOTED = `---
title: 'the.winds.of.2025'
author: "John Pangalos"
---

Some content here.
`;

const NO_DRAFT = `---
author: "John Pangalos"
title: "no-draft-field"
---

Content.
`;

describe("extractTitle", () => {
  it("extracts double-quoted title", () => {
    expect(extractTitle(DOUBLE_QUOTED)).toBe("obligatory.ai.post");
  });

  it("extracts single-quoted title", () => {
    expect(extractTitle(SINGLE_QUOTED)).toBe("the.winds.of.2025");
  });

  it("returns empty string when no title", () => {
    expect(extractTitle("no frontmatter")).toBe("");
  });
});

describe("setDraftFlag", () => {
  it("replaces existing draft: true with draft: false", () => {
    const result = setDraftFlag(DOUBLE_QUOTED, false);
    expect(result).toContain("draft: false");
    expect(result).not.toContain("draft: true");
  });

  it("replaces existing draft: false with draft: true", () => {
    const content = DOUBLE_QUOTED.replace("draft: true", "draft: false");
    const result = setDraftFlag(content, true);
    expect(result).toContain("draft: true");
    expect(result).not.toContain("draft: false");
  });

  it("adds draft field when not present", () => {
    const result = setDraftFlag(NO_DRAFT, true);
    expect(result).toContain("draft: true");
  });

  it("does not duplicate draft field when value is unchanged", () => {
    const result = setDraftFlag(DOUBLE_QUOTED, true);
    expect(result.match(/^draft:/gm)?.length).toBe(1);
  });

  it("preserves other frontmatter fields", () => {
    const result = setDraftFlag(DOUBLE_QUOTED, false);
    expect(result).toContain('title: "obligatory.ai.post"');
    expect(result).toContain('author: "John Pangalos"');
  });
});
