import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as dbSchema from "../db/schema";

// Create a lazily-initialized singleton auth instance.
// In the Cloudflare Workers runtime, `env` from "cloudflare:workers"
// is stable per isolate, so we can safely cache this.
let _auth: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
    if (_auth) return _auth;
    const db = drizzle(env.DB, { schema: dbSchema });
    _auth = betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
        }),
        emailAndPassword: {
            enabled: true,
        },
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
    });
    return _auth;
}
