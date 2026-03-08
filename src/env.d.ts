/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<{
  AUTH_STORE: KVNamespace;
  RESEND_API_KEY: string;
  MAGIC_LINK_SECRET: string;
  SITE_URL: string;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
