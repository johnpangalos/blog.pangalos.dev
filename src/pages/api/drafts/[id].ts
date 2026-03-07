import type { APIRoute } from "astro";
import { isAuthed, unauthorized } from "../../../lib/auth";
import { json } from "../../../lib/response";

export const GET: APIRoute = async (ctx) => {
  if (!(await isAuthed(ctx))) return unauthorized();

  const kv = ctx.locals.runtime.env.DRAFTS;
  const data = await kv.get(`draft:${ctx.params.id}`);
  if (!data) return json({ error: "Not found" }, 404);

  return new Response(data, {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async (ctx) => {
  if (!(await isAuthed(ctx))) return unauthorized();

  await ctx.locals.runtime.env.DRAFTS.delete(`draft:${ctx.params.id}`);
  return json({ ok: true });
};
