import type { APIRoute } from "astro";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
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

export const POST: APIRoute = async (context) => {
  try {
    const { credential, challengeId } = (await context.request.json()) as {
      credential: any;
      challengeId: string;
    };

    const kv = getKV(context);
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

    const user = await getUser(kv);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const matchingCred = user.credentials.find(
      (c) => c.credentialId === credential.id,
    );
    if (!matchingCred) {
      return new Response(JSON.stringify({ error: "Credential not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rpID = getRpId(context);
    const origin = getOrigin(context);

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: {
        id: matchingCred.credentialId,
        publicKey: new Uint8Array(matchingCred.publicKey),
        counter: matchingCred.counter,
        transports: matchingCred.transports as any,
      },
    });

    if (!verification.verified) {
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Update counter for replay protection
    matchingCred.counter = verification.authenticationInfo.newCounter;
    await saveUser(kv, user);

    const sessionToken = await createSession(kv);
    setSessionCookie(context, sessionToken);

    return new Response(JSON.stringify({ verified: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("login-verify error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
