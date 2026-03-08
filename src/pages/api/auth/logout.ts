import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
  context.session?.destroy();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
