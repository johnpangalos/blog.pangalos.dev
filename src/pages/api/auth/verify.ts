import type { APIRoute } from "astro";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const GET: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/login?error=invalid-token" },
    });
  }

  const email = await env.AUTH_STORE.get(`magic:${token}`);
  if (!email) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/login?error=expired" },
    });
  }

  // Delete the magic token so it can't be reused
  await env.AUTH_STORE.delete(`magic:${token}`);

  // Create a session
  const sessionId = crypto.randomUUID();
  await env.AUTH_STORE.put(`session:${sessionId}`, email, {
    expirationTtl: SESSION_TTL_SECONDS,
  });

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin",
      "Set-Cookie": `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`,
    },
  });
};
