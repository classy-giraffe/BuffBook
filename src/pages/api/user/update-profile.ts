import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@lib/db";
import { user as userTable } from "@db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const { user } = ctx.locals;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { age, weight, height } = (await ctx.request.json()) as { age?: string; weight?: string; height?: string };
    const db = getDb(env);

    const updateData: Record<string, Date | number> = {};
    if (age) updateData.age = parseInt(age);
    if (weight) updateData.weight = parseInt(weight);
    if (height) updateData.height = parseInt(height);
    updateData.updatedAt = new Date();

    await db.update(userTable).set(updateData).where(eq(userTable.id, user.id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
