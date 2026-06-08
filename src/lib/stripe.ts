import Stripe from "stripe";
import { getDb } from "@lib/db";
import { planRequests } from "@db/schema";
import { eq } from "drizzle-orm";

type CreateCheckoutParams = {
  stripeSecretKey: string;
  requestId: string;
  customerEmail: string;
  siteUrl: string;
  cancelUrl: string;
  env: Env;
};

export async function createCheckoutSession({
  stripeSecretKey,
  requestId,
  customerEmail,
  siteUrl,
  cancelUrl,
  env,
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
    success_url: `${siteUrl}/custom-plans/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      requestId: requestId,
    },
  });

  if (!stripeSession.url) {
    throw new Error("Failed to create Stripe session");
  }

  const db = getDb(env);
  await db
    .update(planRequests)
    .set({ stripeSessionId: stripeSession.id, updatedAt: new Date() })
    .where(eq(planRequests.id, requestId));

  return stripeSession.url;
}
