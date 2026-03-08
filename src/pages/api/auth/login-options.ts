import type { APIRoute } from "astro";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import {
  isAllowedEmail,
  getKV,
  getUser,
  saveChallenge,
  getRpId,
} from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  try {
    const { email } = (await context.request.json()) as { email: string };

    if (!email || !isAllowedEmail(email)) {
      return new Response(JSON.stringify({ error: "Unauthorized email" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const kv = getKV(context);
    const user = await getUser(kv);

    if (!user || user.credentials.length === 0) {
      return new Response(
        JSON.stringify({ error: "No passkey registered", needsRegistration: true }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const rpID = getRpId(context);

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.credentials.map((cred) => ({
        id: cred.credentialId,
        transports: cred.transports as any,
      })),
      userVerification: "preferred",
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
    console.error("login-options error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
