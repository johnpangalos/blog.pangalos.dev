import type { APIRoute } from "astro";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import {
  getKV,
  getUser,
  saveUser,
  getRpId,
  getOrigin,
} from "../../../lib/auth";
import type { UserRecord } from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  try {
    const { credential } = (await context.request.json()) as {
      credential: any;
    };

    const challenge = await context.session?.get("challenge");
    const email = await context.session?.get("challengeEmail");

    if (!challenge || !email) {
      return new Response(
        JSON.stringify({ error: "Challenge expired or invalid" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const kv = getKV(context);
    const rpID = getRpId(context);
    const origin = getOrigin(context);

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
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
      email,
      credentials: [],
    };

    user.credentials.push({
      credentialId: cred.id,
      publicKey: Array.from(cred.publicKey),
      counter: cred.counter,
      transports: credential.response?.transports,
    });

    await saveUser(kv, user);

    context.session?.set("challenge", null);
    context.session?.set("challengeEmail", null);
    context.session?.set("email", email);

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
