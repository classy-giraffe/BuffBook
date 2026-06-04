import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";

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

    const db = drizzle(env.DB, { schema: dbSchema });
    
    // Verify the request belongs to the user and is still pending
    const existingRequests = await db.select()
      .from(dbSchema.planRequests)
      .where(and(
        eq(dbSchema.planRequests.id, requestId),
        eq(dbSchema.planRequests.userId, user.id),
        eq(dbSchema.planRequests.status, "pending_payment")
      ))
      .limit(1);

    const planRequest = existingRequests[0];

    if (!planRequest) {
      return new Response("Request not found or already paid", { status: 404 });
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10" as any,
    });

    const siteUrl = ctx.url.origin;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Custom Hypertrophy Plan",
              description: "Hand-crafted 72-96hr turnaround",
            },
            unit_amount: 3000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/dashboard`,
      customer_email: user.email,
      metadata: {
        requestId: requestId,
      },
    });

    if (stripeSession.url) {
      await db
        .update(dbSchema.planRequests)
        .set({ stripeSessionId: stripeSession.id, updatedAt: new Date() })
        .where(eq(dbSchema.planRequests.id, requestId));
      
      return ctx.redirect(stripeSession.url);
    } else {
      return new Response("Failed to create Stripe session", { status: 500 });
    }
  } catch (err) {
    console.error("Create checkout error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
