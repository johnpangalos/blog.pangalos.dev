import type { AstroGlobal } from "astro";

const ALLOWED_EMAIL = "john@pangalos.dev";
const SESSION_COOKIE = "admin_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export interface StoredCredential {
  credentialId: string;
  publicKey: number[];
  counter: number;
  transports?: string[];
}

export interface UserRecord {
  email: string;
  credentials: StoredCredential[];
}

export function isAllowedEmail(email: string): boolean {
  return email.toLowerCase() === ALLOWED_EMAIL;
}

export function getKV(astro: AstroGlobal): KVNamespace {
  return (astro.locals as any).runtime.env.BLOG_PANGALOS_AUTH_KV;
}

export async function getUser(kv: KVNamespace): Promise<UserRecord | null> {
  const data = await kv.get(`user:${ALLOWED_EMAIL}`);
  return data ? JSON.parse(data) : null;
}

export async function saveUser(
  kv: KVNamespace,
  user: UserRecord,
): Promise<void> {
  await kv.put(`user:${ALLOWED_EMAIL}`, JSON.stringify(user));
}

export async function saveChallenge(
  kv: KVNamespace,
  challengeId: string,
  data: unknown,
): Promise<void> {
  await kv.put(`challenge:${challengeId}`, JSON.stringify(data), {
    expirationTtl: 300, // 5 minutes
  });
}

export async function getChallenge(
  kv: KVNamespace,
  challengeId: string,
): Promise<unknown | null> {
  const data = await kv.get(`challenge:${challengeId}`);
  if (data) {
    await kv.delete(`challenge:${challengeId}`);
    return JSON.parse(data);
  }
  return null;
}

export async function createSession(kv: KVNamespace): Promise<string> {
  const token = crypto.randomUUID();
  await kv.put(
    `session:${token}`,
    JSON.stringify({ email: ALLOWED_EMAIL, createdAt: Date.now() }),
    { expirationTtl: SESSION_TTL },
  );
  return token;
}

export async function verifySession(
  kv: KVNamespace,
  token: string,
): Promise<boolean> {
  const data = await kv.get(`session:${token}`);
  return data !== null;
}

export async function deleteSession(
  kv: KVNamespace,
  token: string,
): Promise<void> {
  await kv.delete(`session:${token}`);
}

export function getSessionToken(astro: AstroGlobal): string | undefined {
  return astro.cookies.get(SESSION_COOKIE)?.value;
}

export function setSessionCookie(astro: AstroGlobal, token: string): void {
  astro.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export function clearSessionCookie(astro: AstroGlobal): void {
  astro.cookies.delete(SESSION_COOKIE, { path: "/" });
}

export function getRpId(astro: AstroGlobal): string {
  return new URL(astro.request.url).hostname;
}

export function getOrigin(astro: AstroGlobal): string {
  return new URL(astro.request.url).origin;
}
