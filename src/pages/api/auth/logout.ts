import type { APIRoute } from "astro";
import {
  getKV,
  getSessionToken,
  deleteSession,
  clearSessionCookie,
} from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  const kv = getKV(context as any);
  const token = getSessionToken(context as any);

  if (token) {
    await deleteSession(kv, token);
  }

  clearSessionCookie(context as any);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
