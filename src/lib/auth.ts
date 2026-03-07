import type { AstroGlobal } from "astro";

export async function checkAuth(Astro: AstroGlobal): Promise<Response | null> {
  const env = Astro.locals.runtime.env;
  const token = Astro.cookies.get("write_token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = await env.DRAFTS.get(`session:${token}`);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}
