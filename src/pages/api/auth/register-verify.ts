import type { APIRoute } from "astro";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import {
  getKV,
  getChallenge,
  getUser,
  saveUser,
  createSession,
  setSessionCookie,
  getRpId,
  getOrigin,
} from "../../../lib/auth";
import type { UserRecord } from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  try {
    const { credential, challengeId } = await context.request.json();

    const kv = getKV(context as any);
    const challengeData = (await getChallenge(kv, challengeId)) as {
      challenge: string;
      email: string;
    } | null;

    if (!challengeData) {
      return new Response(
        JSON.stringify({ error: "Challenge expired or invalid" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const rpID = getRpId(context as any);
    const origin = getOrigin(context as any);

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return new Response(
        JSON.stringify({ error: "Verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { credential: cred } = verification.registrationInfo;

    const existingUser = await getUser(kv);
    const user: UserRecord = existingUser ?? {
      email: challengeData.email,
      credentials: [],
    };

    user.credentials.push({
      credentialId: cred.id,
      publicKey: Array.from(cred.publicKey),
      counter: cred.counter,
      transports: credential.response?.transports,
    });

    await saveUser(kv, user);

    const sessionToken = await createSession(kv);
    setSessionCookie(context as any, sessionToken);

    return new Response(JSON.stringify({ verified: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("register-verify error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
