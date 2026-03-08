/// <reference types="astro/client" />

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

type Runtime = import("@astrojs/cloudflare").Runtime<{
  AUTH_KV: KVNamespace;
  SESSION_SECRET: string;
}>;

declare namespace App {
  interface Locals extends Runtime {
    session: {
      userId?: string;
    };
  }
}
