import { describe, it, expect } from "vitest";
import { parseMdxContent } from "./blog";

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

const SINGLE_QUOTED_DESC = `---
author: "John Pangalos"
title: "the.winds.of.2025"
date: "January 19, 2025"
description: 'Writing pace be damned! Sometimes it''s better to not write anything. Like a Donald Trump once said, "If you don''t have something nice to say, don''t say anything at all"'
tags: ["Game of Thrones", "writing", "jokes"]
categories: ["books"]
---

Some content here.
`;

const WITH_IMPORTS = `---
author: "John Pangalos"
title: "looking.svelte"
date: "May 2, 2021"
description: "A post about Svelte."
tags: ["web-dev", "svelte"]
categories: ["game-development"]
---

import Tooltip from "../../components/Tooltip.astro";
import Link from "../../components/Link.tsx";

Some MDX content with <Tooltip main="hi" hover="there" />.
`;

const PUBLISHED = `---
author: "John Pangalos"
title: "published.post"
date: "March 1, 2025"
description: "A published post."
tags: ["test"]
categories: ["misc"]
draft: false
---

Published content.
`;

describe("parseMdxContent", () => {
  it("parses double-quoted frontmatter fields", () => {
    const result = parseMdxContent(DOUBLE_QUOTED, "obligatory-ai-post", "abc123");

    expect(result).not.toBeNull();
    expect(result!.slug).toBe("obligatory-ai-post");
    expect(result!.sha).toBe("abc123");
    expect(result!.author).toBe("John Pangalos");
    expect(result!.title).toBe("obligatory.ai.post");
    expect(result!.date).toBe("April 2, 2026");
    expect(result!.description).toBe(
      "You are absolutely right, I have updated my blog again.",
    );
    expect(result!.draft).toBe(true);
  });

  it("parses tags and categories arrays", () => {
    const result = parseMdxContent(DOUBLE_QUOTED, "test", "sha1");

    expect(result!.tags).toEqual(["bloging", "astro", "ai"]);
    expect(result!.categories).toEqual(["web", "ai"]);
  });

  it("parses single-quoted description with escaped quotes", () => {
    const result = parseMdxContent(SINGLE_QUOTED_DESC, "the-winds-of-2025", "sha2");

    expect(result).not.toBeNull();
    expect(result!.title).toBe("the.winds.of.2025");
    expect(result!.description).toBe(
      `Writing pace be damned! Sometimes it's better to not write anything. Like a Donald Trump once said, "If you don't have something nice to say, don't say anything at all"`,
    );
    expect(result!.tags).toEqual(["Game of Thrones", "writing", "jokes"]);
  });

  it("separates content from frontmatter", () => {
    const result = parseMdxContent(DOUBLE_QUOTED, "test", "sha1");

    expect(result!.content).toBe(
      "## getting.sloppy\n\nHello my name is John and I have a problem.",
    );
  });

  it("preserves import statements in content", () => {
    const result = parseMdxContent(WITH_IMPORTS, "looking-svelte", "sha3");

    expect(result).not.toBeNull();
    expect(result!.content).toContain('import Tooltip from');
    expect(result!.content).toContain('<Tooltip main=');
  });

  it("parses draft: false as not draft", () => {
    const result = parseMdxContent(PUBLISHED, "published-post", "sha4");

    expect(result!.draft).toBe(false);
  });

  it("defaults draft to false when not specified", () => {
    const result = parseMdxContent(SINGLE_QUOTED_DESC, "test", "sha5");

    expect(result!.draft).toBe(false);
  });

  it("returns null for invalid frontmatter", () => {
    const result = parseMdxContent("no frontmatter here", "test", "sha6");

    expect(result).toBeNull();
  });
});
