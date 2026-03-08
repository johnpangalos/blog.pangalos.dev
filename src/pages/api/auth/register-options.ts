import type { APIRoute } from "astro";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import {
  isAllowedEmail,
  getKV,
  getUser,
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
    const existingUser = await getUser(kv);
    const rpID = getRpId(context);

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
        transports: cred.transports as AuthenticatorTransport[],
      })),
    });

    context.session?.set("challenge", options.challenge);
    context.session?.set("challengeEmail", email);

    return new Response(JSON.stringify({ options }), {
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

type AuthenticatorTransport =
  | "ble"
  | "cable"
  | "hybrid"
  | "internal"
  | "nfc"
  | "smart-card"
  | "usb";
