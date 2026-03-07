import type { APIRoute } from "astro";
import { checkAuth } from "../../../../lib/auth";

export const POST: APIRoute = async (ctx) => {
  const authError = checkAuth(ctx as any);
  if (authError) return authError;

  const kv = ctx.locals.runtime.env.DRAFTS;
  const env = ctx.locals.runtime.env;
  const id = ctx.params.id;

  const raw = await kv.get(`draft:${id}`);
  if (!raw) {
    return new Response(JSON.stringify({ error: "Draft not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const draft = JSON.parse(raw);
  const { frontmatter, content } = draft;

  // Build the MDX file content
  const mdxContent = `---
author: "${frontmatter.author}"
title: "${frontmatter.title}"
date: "${frontmatter.date}"
description: "${frontmatter.description}"
tags: ${JSON.stringify(frontmatter.tags)}
categories: ${JSON.stringify(frontmatter.categories)}
---

${content}
`;

  // Derive filename from title (slug)
  const slug = frontmatter.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const path = `src/content/blog/${slug}.mdx`;
  const repo = env.GITHUB_REPO; // e.g. "johnpangalos/blog.pangalos.dev"
  const token = env.GITHUB_TOKEN;

  if (!token || !repo) {
    return new Response(
      JSON.stringify({ error: "GITHUB_TOKEN or GITHUB_REPO not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Create file via GitHub API
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const encoded = btoa(unescape(encodeURIComponent(mdxContent)));

  const ghResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      message: `Add blog post: ${frontmatter.title}`,
      content: encoded,
    }),
  });

  if (!ghResponse.ok) {
    const error = await ghResponse.text();
    return new Response(JSON.stringify({ error: `GitHub API error: ${error}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Delete draft after successful publish
  await kv.delete(`draft:${id}`);

  return new Response(JSON.stringify({ ok: true, slug }), {
    headers: { "Content-Type": "application/json" },
  });
};
