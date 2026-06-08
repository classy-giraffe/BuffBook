import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import Stripe from "stripe";
import { getDb } from "@lib/db";
import { planRequests } from "@db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  const signature = ctx.request.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await ctx.request.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const requestId = session.metadata?.requestId;

      if (requestId) {
        const db = getDb(env);
        await db
          .update(planRequests)
          .set({ status: "paid", stripeSessionId: session.id, updatedAt: new Date() })
          .where(eq(planRequests.id, requestId));
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return new Response("Webhook Error", { status: 400 });
  }
};
