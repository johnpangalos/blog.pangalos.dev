import type { APIRoute } from "astro";
import { isAuthed, unauthorized } from "../../../../lib/auth";
import { json } from "../../../../lib/response";

async function ghFetch(
  url: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      ...(options.headers as Record<string, string>),
    },
  });
}

export const POST: APIRoute = async (ctx) => {
  if (!(await isAuthed(ctx))) return unauthorized();

  const kv = ctx.locals.runtime.env.DRAFTS;
  const env = ctx.locals.runtime.env;
  const id = ctx.params.id;

  const raw = await kv.get(`draft:${id}`);
  if (!raw) return json({ error: "Draft not found" }, 404);

  const token = env.GITHUB_TOKEN;
  const repo = env.GITHUB_REPO;
  if (!token || !repo) return json({ error: "GITHUB_TOKEN or GITHUB_REPO not configured" }, 500);

  const draft = JSON.parse(raw);
  const { frontmatter, content } = draft;

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

  const slug = frontmatter.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const path = `src/content/blog/${slug}.mdx`;
  const apiBase = `https://api.github.com/repos/${repo}`;
  const branchName = `blog/${slug}`;

  try {
    // 1. Get the SHA of the main branch HEAD
    const mainRef = await ghFetch(`${apiBase}/git/ref/heads/main`, token);
    if (!mainRef.ok) throw new Error(`Failed to get main branch: ${await mainRef.text()}`);

    const mainData = await mainRef.json();
    const baseSha = mainData.object.sha;

    // 2. Create a new branch from main
    const createRef = await ghFetch(`${apiBase}/git/refs`, token, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
    });
    if (!createRef.ok) {
      const err = await createRef.text();
      if (!err.includes("Reference already exists")) {
        throw new Error(`Failed to create branch: ${err}`);
      }
    }

    // 3. Create the file on the new branch
    const encoded = btoa(unescape(encodeURIComponent(mdxContent)));
    const createFile = await ghFetch(`${apiBase}/contents/${path}`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `Add blog post: ${frontmatter.title}`,
        content: encoded,
        branch: branchName,
      }),
    });
    if (!createFile.ok) throw new Error(`Failed to create file: ${await createFile.text()}`);

    // 4. Create a pull request
    const createPr = await ghFetch(`${apiBase}/pulls`, token, {
      method: "POST",
      body: JSON.stringify({
        title: `New post: ${frontmatter.title}`,
        head: branchName,
        base: "main",
        body: `## New blog post\n\n**${frontmatter.title}**\n\n${frontmatter.description}\n\n---\n_Published from mobile editor_`,
      }),
    });
    if (!createPr.ok) throw new Error(`Failed to create PR: ${await createPr.text()}`);

    const prData = await createPr.json();
    await kv.delete(`draft:${id}`);

    return json({ ok: true, slug, pr_url: prData.html_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ error: message }, 500);
  }
};
