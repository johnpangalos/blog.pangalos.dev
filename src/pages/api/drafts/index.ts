import type { APIRoute } from "astro";
import { isAuthed, unauthorized } from "../../../lib/auth";
import { json } from "../../../lib/response";

interface DraftMeta {
  id: string;
  title: string;
  updatedAt: string;
}

export const GET: APIRoute = async (ctx) => {
  if (!(await isAuthed(ctx))) return unauthorized();

  const kv = ctx.locals.runtime.env.DRAFTS;
  const list = await kv.list<DraftMeta>({ prefix: "draft:" });

  const drafts = list.keys.map((key) => ({
    id: key.name.replace("draft:", ""),
    title: key.metadata?.title ?? "Untitled",
    updatedAt: key.metadata?.updatedAt ?? "",
  }));

  return json(drafts);
};

export const POST: APIRoute = async (ctx) => {
  if (!(await isAuthed(ctx))) return unauthorized();

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

  return json({ id: draftId });
};
