/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface Env {
  DRAFTS: KVNamespace;
  WRITE_PASSWORD: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
}

declare namespace App {
  interface Locals extends Runtime {}
}
