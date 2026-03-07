import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = locals.runtime.env;
  const { password } = await request.json();

  if (password === env.WRITE_PASSWORD) {
    cookies.set("write_token", password, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
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
