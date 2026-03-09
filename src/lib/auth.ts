import type { AstroGlobal } from "astro";
import type { APIContext } from "astro";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/server";

const USER_KEY = "user:admin";

export interface StoredCredential {
  credentialId: string;
  publicKey: number[];
  counter: number;
  transports?: AuthenticatorTransportFuture[];
}

export interface UserRecord {
  credentials: StoredCredential[];
}

type Context = AstroGlobal | APIContext;

export function getKV(context: Context): KVNamespace {
  const kv = context.locals.runtime.env.BLOG_PANGALOS_AUTH_KV;
  if (!kv) {
    throw new Error("BLOG_PANGALOS_AUTH_KV binding is not configured");
  }
  return kv;
}

export async function getUser(kv: KVNamespace): Promise<UserRecord | null> {
  const data = await kv.get(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveUser(
  kv: KVNamespace,
  user: UserRecord,
): Promise<void> {
  await kv.put(USER_KEY, JSON.stringify(user));
}

export async function isAuthenticated(context: Context): Promise<boolean> {
  const authed = await context.session?.get("authenticated");
  return authed === true;
}

export function getHostname(context: Context): string {
  return new URL(context.request.url).hostname;
}

export function getOrigin(context: Context): string {
  return new URL(context.request.url).origin;
}
