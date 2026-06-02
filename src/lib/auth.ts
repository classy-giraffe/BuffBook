import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../db/schema";

export function createAuth(env: any) {
    const db = drizzle(env.DB, { schema: dbSchema });
    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
        }),
        emailAndPassword: {
            enabled: true,
            password: {
                hash: async (password: string) => {
                    const salt = crypto.getRandomValues(new Uint8Array(16));
                    const key = await crypto.subtle.importKey(
                        "raw",
                        new TextEncoder().encode(password),
                        { name: "PBKDF2" },
                        false,
                        ["deriveBits"]
                    );
                    const hash = await crypto.subtle.deriveBits(
                        { name: "PBKDF2", salt, iterations: 10000, hash: "SHA-256" },
                        key,
                        256
                    );
                    const saltHex = Array.from(salt).map((b: number) => b.toString(16).padStart(2, '0')).join('');
                    const hashHex = Array.from(new Uint8Array(hash)).map((b: number) => b.toString(16).padStart(2, '0')).join('');
                    return `${saltHex}:${hashHex}`;
                },
                verify: async (arg1: any, arg2?: string) => {
                    const password = typeof arg1 === 'object' ? arg1.password : arg1;
                    const hash = typeof arg1 === 'object' ? arg1.hash : arg2;
                    if (!password || !hash) return false;
                    
                    const parts = hash.split(':');
                    if (parts.length !== 2) return false;
                    const [saltHex, originalHashHex] = parts;
                    
                    const saltMatch = saltHex.match(/.{1,2}/g);
                    if (!saltMatch) return false;
                    const salt = new Uint8Array(saltMatch.map((byte: string) => parseInt(byte, 16)));
                    
                    const key = await crypto.subtle.importKey(
                        "raw",
                        new TextEncoder().encode(password),
                        { name: "PBKDF2" },
                        false,
                        ["deriveBits"]
                    );
                    const newHash = await crypto.subtle.deriveBits(
                        { name: "PBKDF2", salt, iterations: 10000, hash: "SHA-256" },
                        key,
                        256
                    );
                    const newHashHex = Array.from(new Uint8Array(newHash)).map((b: number) => b.toString(16).padStart(2, '0')).join('');
                    return newHashHex === originalHashHex;
                }
            }
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
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
    });
}
