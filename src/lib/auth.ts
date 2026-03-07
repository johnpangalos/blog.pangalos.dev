import type { APIContext } from "astro";

const UNAUTHORIZED = new Response(JSON.stringify({ error: "Unauthorized" }), {
  status: 401,
  headers: { "Content-Type": "application/json" },
});

export async function isAuthed(ctx: APIContext): Promise<boolean> {
  const token = ctx.cookies.get("write_token")?.value;
  if (!token) return false;

  const session = await ctx.locals.runtime.env.DRAFTS.get(`session:${token}`);
  return session !== null;
}

export function unauthorized(): Response {
  return UNAUTHORIZED.clone();
}
