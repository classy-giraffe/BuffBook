import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { getDb } from "@lib/db";
import { planRequests } from "@db/schema";
import { env } from "cloudflare:workers";
import { isAdmin } from "@lib/admin";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const { user } = ctx.locals;

  if (!isAdmin(user, env.ADMIN_EMAIL)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const formData = await ctx.request.formData();
    const requestId = formData.get("requestId")?.toString();
    const file = formData.get("pdf") as File;

    if (!requestId || !file) {
      return new Response("Invalid request", { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return new Response("Only PDF files are accepted", { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return new Response("File too large (max 50MB)", { status: 400 });
    }

    const pdfKey = `plans/${requestId}.pdf`;

    await env.PLANS_BUCKET.put(pdfKey, await file.arrayBuffer(), {
      httpMetadata: { contentType: "application/pdf" },
    });

    const db = getDb(env);
    await db
      .update(planRequests)
      .set({ status: "delivered", pdfKey: pdfKey, updatedAt: new Date() })
      .where(eq(planRequests.id, requestId));

    return ctx.redirect("/admin");
  } catch (err) {
    console.error("Upload error:", err);
    return new Response("Upload failed", { status: 500 });
  }
};
