import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../../../db/schema";
import { env } from "cloudflare:workers";
import { hashPassword } from "../../../lib/password";

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

  const existingUser = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, ADMIN_EMAIL)
  });

  if (existingUser) {
    return new Response("Admin already configured", { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const userId = crypto.randomUUID();
  await db.insert(dbSchema.user).values({
      id: userId,
      name: "Admin",
      email: ADMIN_EMAIL,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
  });

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

  return ctx.redirect("/admin/login");
};
