import type { APIRoute } from "astro";
import { checkAuth } from "../../../lib/auth";

// Get a single draft
export const GET: APIRoute = async (ctx) => {
  const authError = checkAuth(ctx as any);
  if (authError) return authError;

  const kv = ctx.locals.runtime.env.DRAFTS;
  const id = ctx.params.id;
  const data = await kv.get(`draft:${id}`);

  if (!data) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Delete a draft
export const DELETE: APIRoute = async (ctx) => {
  const authError = checkAuth(ctx as any);
  if (authError) return authError;

  const kv = ctx.locals.runtime.env.DRAFTS;
  const id = ctx.params.id;
  await kv.delete(`draft:${id}`);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
