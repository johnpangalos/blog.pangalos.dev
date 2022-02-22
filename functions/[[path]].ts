import { createCloudflareKVSessionStorage, SessionStorage } from "remix";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// @ts-ignore
import * as build from "../build";

const handleRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    context.env = {
      ...context.env,
      ...createCloudflareKVSessionStorage({
        cookie: {
          name: "__blog_session",

          // all of these are optional
          expires: new Date(Date.now() + 60 * 60 * 24 * 30),
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
          sameSite: "lax",
          secrets: [context.env.CFP_TOKEN_SECRET],
          secure: process.env.NODE_ENV !== "development",
        },
        kv: context.env.DEV_BLOG,
      }),
    };
    return context;
  },
});

export function onRequest(
  context: EventContext<
    {
      CFP_TOKEN_SECRET: string;
      DEV_BLOG: KVNamespace;
    },
    any,
    SessionStorage
  >
) {
  return handleRequest(context);
}
