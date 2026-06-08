import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { getDb } from "@lib/db";
import { planRequests } from "@db/schema";
import { env } from "cloudflare:workers";
import { isAdmin } from "@lib/admin";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const { user } = ctx.locals;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const planId = ctx.params.planId;
  if (!planId) return new Response("Missing Plan ID", { status: 400 });

  const db = getDb(env);
  const planRequest = await db.select().from(planRequests).where(eq(planRequests.id, planId)).get();

  if (!planRequest) return new Response("Not found", { status: 404 });

  if (planRequest.userId !== user.id && !isAdmin(user, env.ADMIN_EMAIL)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (planRequest.status !== "delivered" || !planRequest.pdfKey) {
    return new Response("Plan not delivered yet", { status: 400 });
  }

  try {
    const object = await env.PLANS_BUCKET.get(planRequest.pdfKey);
    if (!object) {
      return new Response("File not found in storage", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    const safeName = planRequest.name
      ? planRequest.name.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "_").slice(0, 64)
      : "Plan";
    headers.set(
      "Content-Disposition",
      `inline; filename="BuffBook_CustomPlan_${safeName}.pdf"`
    );

    return new Response(object.body, { headers });
  } catch (err) {
    console.error("Download error:", err);
    return new Response("Failed to fetch file", { status: 500 });
  }
};
