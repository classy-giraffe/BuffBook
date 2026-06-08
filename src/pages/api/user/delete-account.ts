import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@lib/db";
import { eq } from "drizzle-orm";
import { planRequests, session, account, verification, user as userTable } from "@db/schema";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const { user, userSession } = ctx.locals;

  if (!user || !userSession) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const db = getDb(env);

    const plans = await db.select({ pdfKey: planRequests.pdfKey })
      .from(planRequests)
      .where(eq(planRequests.userId, user.id));

    for (const plan of plans) {
      if (plan.pdfKey) {
        await env.PLANS_BUCKET.delete(plan.pdfKey);
      }
    }

    await db.delete(planRequests).where(eq(planRequests.userId, user.id));
    await db.delete(session).where(eq(session.userId, user.id));
    await db.delete(account).where(eq(account.userId, user.id));

    if (user.email) {
      await db.delete(verification).where(eq(verification.identifier, user.email));
    }

    await db.delete(userTable).where(eq(userTable.id, user.id));

    const headers = new Headers();
    headers.append("Set-Cookie", "buffbook-session-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
    headers.append("Content-Type", "application/json");

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (err) {
    console.error("Account deletion error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
