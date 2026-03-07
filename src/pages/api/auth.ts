import type { APIRoute } from "astro";
import { json } from "../../lib/response";

const TOKEN_TTL = 60 * 60 * 24 * 30; // 30 days

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = locals.runtime.env;
  const { password } = await request.json();

  if (password !== env.WRITE_PASSWORD) return json({ error: "Wrong password" }, 401);

  const token = crypto.randomUUID();
  await env.DRAFTS.put(`session:${token}`, "valid", { expirationTtl: TOKEN_TTL });

  cookies.set("write_token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: TOKEN_TTL,
  });

  return json({ ok: true });
};
