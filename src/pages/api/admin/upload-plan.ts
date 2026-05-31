import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as dbSchema from "../../../db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  
  const ADMIN_EMAIL = env.ADMIN_EMAIL || "admin@buffbook.com";
  if (!session?.user || session.user.email !== ADMIN_EMAIL) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const formData = await ctx.request.formData();
    const requestId = formData.get("requestId")?.toString();
    const file = formData.get("pdf") as File;

    if (!requestId || !file || file.type !== "application/pdf") {
      return new Response("Invalid request", { status: 400 });
    }

    const pdfKey = `plans/${requestId}.pdf`;
    
    // Upload to R2
    await env.PLANS_BUCKET.put(pdfKey, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: "application/pdf"
      }
    });

    // Update DB status to delivered
    const db = drizzle(env.DB, { schema: dbSchema });
    await db.update(dbSchema.planRequests)
      .set({ 
        status: "delivered", 
        pdfKey: pdfKey, 
        updatedAt: new Date() 
      })
      .where(eq(dbSchema.planRequests.id, requestId));

    // Redirect back to admin dashboard
    return ctx.redirect("/admin");
  } catch (err) {
    console.error("Upload error:", err);
    return new Response("Upload failed", { status: 500 });
  }
};
