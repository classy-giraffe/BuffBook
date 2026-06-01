/// <reference types="astro/client" />
/// <reference types="../worker-configuration.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}

declare namespace Cloudflare {
  interface Env {
    ADMIN_EMAIL?: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    DB: D1Database;
    PLANS_BUCKET: R2Bucket;
  }
}

interface Env {
  ADMIN_EMAIL?: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  DB: D1Database;
  PLANS_BUCKET: R2Bucket;
}
