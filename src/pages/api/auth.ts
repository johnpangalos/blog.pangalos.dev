import type { APIRoute } from "astro";

const TOKEN_TTL = 60 * 60 * 24 * 30; // 30 days

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = locals.runtime.env;
  const { password } = await request.json();

  if (password === env.WRITE_PASSWORD) {
    const token = crypto.randomUUID();

    // Store token in KV with a 30-day expiration
    await env.DRAFTS.put(`session:${token}`, "valid", {
      expirationTtl: TOKEN_TTL,
    });

    cookies.set("write_token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: TOKEN_TTL,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Wrong password" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
};
