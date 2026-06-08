import type { APIRoute } from "astro";
import { getDb } from "@lib/db";
import { user as userTable, account } from "@db/schema";
import { env } from "cloudflare:workers";
import { hashPassword } from "@lib/password";
import { eq } from "drizzle-orm";

export const prerender = false;

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

  const db = getDb(env);

  const existingUser = await db.select().from(userTable).where(eq(userTable.email, ADMIN_EMAIL)).get();

  if (existingUser) {
    return new Response("Admin already configured", { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();

  await db.insert(userTable).values({
    id: userId,
    name: "Admin",
    email: ADMIN_EMAIL,
    emailVerified: true,
    admin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(account).values({
    id: userId,
    accountId: userId,
    providerId: "credential",
    userId: userId,
    password: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return ctx.redirect("/admin/login");
};
