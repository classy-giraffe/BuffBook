/// <reference types="astro/client" />
/// <reference types="../worker-configuration.d.ts" />

declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}

declare namespace Cloudflare {
  interface Env {
    ADMIN_EMAIL?: string;
  }
}

interface Env {
  ADMIN_EMAIL?: string;
}
