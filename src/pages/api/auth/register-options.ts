import type { APIRoute } from "astro";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import {
  isAllowedEmail,
  getKV,
  getUser,
  saveChallenge,
  getRpId,
} from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  try {
    const { email } = await context.request.json();

    if (!email || !isAllowedEmail(email)) {
      return new Response(JSON.stringify({ error: "Unauthorized email" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const kv = getKV(context as any);
    const existingUser = await getUser(kv);
    const rpID = getRpId(context as any);

    const options = await generateRegistrationOptions({
      rpName: "blog.pangalos.dev",
      rpID,
      userName: email,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
      excludeCredentials: (existingUser?.credentials ?? []).map((cred) => ({
        id: cred.credentialId,
        transports: cred.transports as any,
      })),
    });

    const challengeId = crypto.randomUUID();
    await saveChallenge(kv, challengeId, {
      challenge: options.challenge,
      email,
    });

    return new Response(JSON.stringify({ options, challengeId }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("register-options error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
