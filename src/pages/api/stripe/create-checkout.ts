import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@lib/db";
import { planRequests } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { createCheckoutSession } from "@lib/stripe";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const { user } = ctx.locals;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const formData = await ctx.request.formData();
    const requestId = formData.get("requestId")?.toString();

    if (!requestId) {
      return new Response("Invalid request ID", { status: 400 });
    }

    const db = getDb(env);

    const existingRequests = await db
      .select()
      .from(planRequests)
      .where(and(eq(planRequests.id, requestId), eq(planRequests.userId, user.id), eq(planRequests.status, "pending_payment")))
      .limit(1);

    const planRequest = existingRequests[0];

    if (!planRequest) {
      return new Response("Request not found or already paid", { status: 404 });
    }

    const checkoutUrl = await createCheckoutSession({
      stripeSecretKey: env.STRIPE_SECRET_KEY,
      requestId: planRequest.id,
      customerEmail: user.email!,
      siteUrl: ctx.url.origin,
      cancelUrl: `${ctx.url.origin}/dashboard`,
      env,
    });

    return ctx.redirect(checkoutUrl);
  } catch (err) {
    console.error("Create checkout error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
