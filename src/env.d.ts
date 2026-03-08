/// <reference types="astro/client" />

interface SendEmailBinding {
  send(message: import("cloudflare:email").EmailMessage): Promise<void>;
}

type Runtime = import("@astrojs/cloudflare").Runtime<{
  AUTH_STORE: KVNamespace;
  SEND_EMAIL: SendEmailBinding;
  SITE_URL: string;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
