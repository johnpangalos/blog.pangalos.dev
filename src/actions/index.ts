import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";
import {
  isAllowedEmail,
  getKV,
  getUser,
  saveUser,
  getRpId,
  getOrigin,
} from "../lib/auth";
import type { UserRecord } from "../lib/auth";

export const server = {
  auth: {
    loginOptions: defineAction({
      accept: "json",
      input: z.object({ email: z.string().email() }),
      handler: async ({ email }, context) => {
        if (!isAllowedEmail(email)) {
          throw new ActionError({ code: "FORBIDDEN", message: "Unauthorized email" });
        }

        const kv = getKV(context);
        const user = await getUser(kv);

        if (!user || user.credentials.length === 0) {
          throw new ActionError({ code: "NOT_FOUND", message: "No passkey registered" });
        }

        const rpID = getRpId(context);

        const options = await generateAuthenticationOptions({
          rpID,
          allowCredentials: user.credentials.map((cred) => ({
            id: cred.credentialId,
            transports: cred.transports ,
          })),
          userVerification: "preferred",
        });

        context.session.set("challenge", options.challenge);
        context.session.set("challengeEmail", email);

        return { options };
      },
    }),

    loginVerify: defineAction({
      accept: "json",
      input: z.object({ credential: z.any() }),
      handler: async ({ credential }, context) => {
        const challenge = await context.session.get("challenge");
        const email = await context.session.get("challengeEmail");

        if (!challenge || !email) {
          throw new ActionError({ code: "BAD_REQUEST", message: "Challenge expired or invalid" });
        }

        const kv = getKV(context);
        const user = await getUser(kv);
        if (!user) {
          throw new ActionError({ code: "NOT_FOUND", message: "User not found" });
        }

        const matchingCred = user.credentials.find(
          (c) => c.credentialId === credential.id,
        );
        if (!matchingCred) {
          throw new ActionError({ code: "BAD_REQUEST", message: "Credential not found" });
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
            transports: matchingCred.transports ,
          },
        });

        if (!verification.verified) {
          throw new ActionError({ code: "BAD_REQUEST", message: "Authentication failed" });
        }

        matchingCred.counter = verification.authenticationInfo.newCounter;
        await saveUser(kv, user);

        context.session.set("challenge", null);
        context.session.set("challengeEmail", null);
        context.session.set("email", email);

        return { verified: true };
      },
    }),

    registerOptions: defineAction({
      accept: "json",
      input: z.object({ email: z.string().email() }),
      handler: async ({ email }, context) => {
        if (!isAllowedEmail(email)) {
          throw new ActionError({ code: "FORBIDDEN", message: "Unauthorized email" });
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
            transports: cred.transports ,
          })),
        });

        context.session.set("challenge", options.challenge);
        context.session.set("challengeEmail", email);

        return { options };
      },
    }),

    registerVerify: defineAction({
      accept: "json",
      input: z.object({ credential: z.any() }),
      handler: async ({ credential }, context) => {
        const challenge = await context.session.get("challenge");
        const email = await context.session.get("challengeEmail");

        if (!challenge || !email) {
          throw new ActionError({ code: "BAD_REQUEST", message: "Challenge expired or invalid" });
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
          throw new ActionError({ code: "BAD_REQUEST", message: "Verification failed" });
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

        context.session.set("challenge", null);
        context.session.set("challengeEmail", null);
        context.session.set("email", email);

        return { verified: true };
      },
    }),

    logout: defineAction({
      accept: "json",
      handler: async (_input, context) => {
        context.session.destroy();
        return { ok: true };
      },
    }),
  },
};
