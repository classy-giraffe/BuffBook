import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../../../db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const { user } = ctx.locals;
  
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { age, weight, height } = (await ctx.request.json()) as any;
    const db = drizzle(env.DB, { schema: dbSchema });

    // Ensure they are numbers (or null)
    const updateData: any = {};
    if (age) updateData.age = parseInt(age);
    if (weight) updateData.weight = parseInt(weight);
    if (height) updateData.height = parseInt(height);

    updateData.updatedAt = new Date();

    await db.update(dbSchema.user)
      .set(updateData)
      .where(eq(dbSchema.user.id, user.id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
