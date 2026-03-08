import type { APIRoute } from "astro";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import {
  getKV,
  getUser,
  saveUser,
  getRpId,
  getOrigin,
} from "../../../lib/auth";

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
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: {
        id: matchingCred.credentialId,
        publicKey: new Uint8Array(matchingCred.publicKey),
        counter: matchingCred.counter,
        transports: matchingCred.transports as AuthenticatorTransport[],
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

    context.session?.set("challenge", null);
    context.session?.set("challengeEmail", null);
    context.session?.set("email", email);

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

type AuthenticatorTransport =
  | "ble"
  | "cable"
  | "hybrid"
  | "internal"
  | "nfc"
  | "smart-card"
  | "usb";
