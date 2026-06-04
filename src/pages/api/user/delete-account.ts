import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../../../db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const { user, session } = ctx.locals;

  if (!user || !session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const db = drizzle(env.DB, { schema: dbSchema });

    await db.delete(dbSchema.planRequests)
      .where(eq(dbSchema.planRequests.userId, user.id));

    await db.delete(dbSchema.session)
      .where(eq(dbSchema.session.userId, user.id));

    await db.delete(dbSchema.account)
      .where(eq(dbSchema.account.userId, user.id));

    await db.delete(dbSchema.verification)
      .where(eq(dbSchema.verification.identifier, user.email));

    await db.delete(dbSchema.user)
      .where(eq(dbSchema.user.id, user.id));

    const headers = new Headers();
    headers.append("Set-Cookie", "buffbook-session-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
    headers.append("Content-Type", "application/json");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers
    });
  } catch (err) {
    console.error("Account deletion error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
