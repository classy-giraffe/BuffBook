import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as dbSchema from "../../../db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const planId = ctx.params.planId;
  if (!planId) return new Response("Missing Plan ID", { status: 400 });

  const db = drizzle(env.DB, { schema: dbSchema });
  const planRequest = await db.query.planRequests.findFirst({
    where: eq(dbSchema.planRequests.id, planId)
  });

  if (!planRequest) return new Response("Not found", { status: 404 });

  // Only the owner or the admin can download the plan
  const ADMIN_EMAIL = env.ADMIN_EMAIL || "admin@buffbook.com";
  if (planRequest.userId !== session.user.id && session.user.email !== ADMIN_EMAIL) {
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
    headers.set("Content-Disposition", `inline; filename="BuffBook_CustomPlan_${planRequest.name.replace(/\s+/g, '_')}.pdf"`);

    return new Response(object.body, {
      headers,
    });
  } catch (err) {
    console.error("Download error:", err);
    return new Response("Failed to fetch file", { status: 500 });
  }
};
