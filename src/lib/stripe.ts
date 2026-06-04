import Stripe from "stripe";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../db/schema";
import { eq } from "drizzle-orm";

type CreateCheckoutParams = {
  stripeSecretKey: string;
  requestId: string;
  customerEmail: string;
  siteUrl: string;
  cancelUrl: string;
  db: D1Database;
};

export async function createCheckoutSession({
  stripeSecretKey,
  requestId,
  customerEmail,
  siteUrl,
  cancelUrl,
  db,
}: CreateCheckoutParams): Promise<string> {
  const stripe = new Stripe(stripeSecretKey);

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
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      requestId: requestId,
    },
  });

  if (!stripeSession.url) {
    throw new Error("Failed to create Stripe session");
  }

  const orm = drizzle(db, { schema: dbSchema });
  await orm
    .update(dbSchema.planRequests)
    .set({ stripeSessionId: stripeSession.id, updatedAt: new Date() })
    .where(eq(dbSchema.planRequests.id, requestId));

  return stripeSession.url;
}
