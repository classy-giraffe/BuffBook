import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../../../db/schema";
import { env } from "cloudflare:workers";

export const POST: APIRoute = async (ctx) => {
  const ADMIN_EMAIL = env.ADMIN_EMAIL;
  
  if (!ADMIN_EMAIL) {
    return new Response("No ADMIN_EMAIL set", { status: 500 });
  }

  const formData = await ctx.request.formData();
  const password = formData.get("password")?.toString();

  if (!password) {
    return new Response("Password is required", { status: 400 });
  }

  const db = drizzle(env.DB, { schema: dbSchema });

  // Check if admin already exists
  const existingUser = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, ADMIN_EMAIL)
  });

  if (existingUser) {
    return new Response("Admin already configured", { status: 400 });
  }

  // Generate a hash using the same PBKDF2 logic from auth.ts
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
  const passwordHash = `${saltHex}:${hashHex}`;

  // Insert into users
  const userId = crypto.randomUUID();
  await db.insert(dbSchema.user).values({
      id: userId,
      name: "Admin",
      email: ADMIN_EMAIL,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
  });

  // Insert into accounts
  const accountId = crypto.randomUUID();
  await db.insert(dbSchema.account).values({
      id: accountId,
      accountId: accountId,
      providerId: "credential",
      userId: userId,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
  });

  return ctx.redirect("/login");
};
