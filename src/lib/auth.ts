import type { AstroGlobal } from "astro";

export function checkAuth(Astro: AstroGlobal): Response | null {
  const env = Astro.locals.runtime.env;
  const password = env.WRITE_PASSWORD;

  if (!password) {
    return new Response(JSON.stringify({ error: "WRITE_PASSWORD not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const auth = Astro.cookies.get("write_token")?.value;
  if (auth !== password) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}
