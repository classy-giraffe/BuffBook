import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../db/schema";
import { hashPassword, verifyPassword } from "./password";

export function createAuth(env: Env) {
    const db = drizzle(env.DB, { schema: dbSchema });
    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: { ...dbSchema },
        }),
        user: {
            additionalFields: {
                age: { type: "number", required: false },
                weight: { type: "number", required: false },
                height: { type: "number", required: false }
            },
            changeEmail: {
                enabled: true
            }
        },
        emailAndPassword: {
            enabled: true,
            minPasswordLength: 12,
            maxPasswordLength: 128,
            sendResetPassword: async ({ user, url }) => {
                console.log(`Password reset requested for ${user.email}: ${url}`);
            },
            password: {
                hash: hashPassword,
                verify: async (arg1: any, arg2?: string) => {
                    const password = typeof arg1 === 'object' ? arg1.password : arg1;
                    const hash = typeof arg1 === 'object' ? arg1.hash : arg2;
                    if (!password || !hash) return false;
                    return verifyPassword(password, hash);
                }
            }
        },
        emailVerification: {
            sendVerificationEmail: async ({ user, url }) => {
                console.log(`Verification email for ${user.email}: ${url}`);
            },
        },
        rateLimit: {
            enabled: true,
            storage: "database",
            customRules: {
                "/api/auth/sign-in/email": { window: 60, max: 5 },
                "/api/auth/sign-up/email": { window: 60, max: 3 },
            },
        },
        databaseHooks: {
            user: {
                create: {
                    before: async (user) => {
                        if (env.ADMIN_EMAIL && user.email === env.ADMIN_EMAIL) {
                            throw new Error("Admin registration blocked.");
                        }
                        return { data: user };
                    }
                }
            }
        },
        advanced: {
            useSecureCookies: env.BETTER_AUTH_URL?.startsWith("https://") ?? false,
            cookiePrefix: "buffbook",
            defaultCookieAttributes: {
                sameSite: "lax",
            },
            ipAddress: {
                ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
                disableIpTracking: false,
            },
        },
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
    });
}
