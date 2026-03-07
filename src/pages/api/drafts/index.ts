import type { APIRoute } from "astro";
import { checkAuth } from "../../../lib/auth";

interface DraftMeta {
  id: string;
  title: string;
  updatedAt: string;
}

// List all drafts
export const GET: APIRoute = async (ctx) => {
  const authError = await checkAuth(ctx as any);
  if (authError) return authError;

  const kv = ctx.locals.runtime.env.DRAFTS;
  const list = await kv.list<DraftMeta>({ prefix: "draft:" });

  const drafts = list.keys.map((key) => ({
    id: key.name.replace("draft:", ""),
    title: key.metadata?.title ?? "Untitled",
    updatedAt: key.metadata?.updatedAt ?? "",
  }));

  return new Response(JSON.stringify(drafts), {
    headers: { "Content-Type": "application/json" },
  });
};

// Create or update a draft
export const POST: APIRoute = async (ctx) => {
  const authError = await checkAuth(ctx as any);
  if (authError) return authError;

  const kv = ctx.locals.runtime.env.DRAFTS;
  const body = await ctx.request.json();
  const { id, title, content, frontmatter } = body;

  const draftId = id || crypto.randomUUID();
  const now = new Date().toISOString();

  await kv.put(
    `draft:${draftId}`,
    JSON.stringify({ title, content, frontmatter, updatedAt: now }),
    {
      metadata: { id: draftId, title: title || "Untitled", updatedAt: now },
    },
  );

  return new Response(JSON.stringify({ id: draftId }), {
    headers: { "Content-Type": "application/json" },
  });
};
