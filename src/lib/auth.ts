import type { APIContext } from "astro";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/server";

const ALLOWED_EMAIL = "john@pangalos.dev";

export interface StoredCredential {
  credentialId: string;
  publicKey: number[];
  counter: number;
  transports?: AuthenticatorTransportFuture[];
}

export interface UserRecord {
  email: string;
  credentials: StoredCredential[];
}

type Context = {
  locals: App.Locals;
  session: APIContext["session"];
  request: Request;
};

export function isAllowedEmail(email: string): boolean {
  return email.toLowerCase() === ALLOWED_EMAIL;
}

export async function getUser(kv: KVNamespace): Promise<UserRecord | null> {
  const data = await kv.get(`user:${ALLOWED_EMAIL}`);
  return data ? JSON.parse(data) : null;
}

export async function saveUser(
  kv: KVNamespace,
  user: UserRecord
): Promise<void> {
  await kv.put(`user:${ALLOWED_EMAIL}`, JSON.stringify(user));
}

export async function isAuthenticated(context: Context): Promise<boolean> {
  const email = await context.session?.get("email");
  return email === ALLOWED_EMAIL;
}

export function getHostname(context: Context): string {
  return new URL(context.request.url).hostname;
}

export function getOrigin(context: Context): string {
  return new URL(context.request.url).origin;
}
