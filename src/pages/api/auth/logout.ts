import type { APIRoute } from "astro";
import {
  getKV,
  getSessionToken,
  deleteSession,
  clearSessionCookie,
} from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  const kv = getKV(context);
  const token = getSessionToken(context);

  if (token) {
    await deleteSession(kv, token);
  }

  clearSessionCookie(context);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
