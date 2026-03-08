import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionMatch = cookieHeader.match(/session=([^;]+)/);
  const sessionId = sessionMatch?.[1];

  if (sessionId) {
    await env.AUTH_STORE.delete(`session:${sessionId}`);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin/login",
      "Set-Cookie":
        "session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
};
