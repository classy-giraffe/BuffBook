import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { isAdmin } from "@lib/admin";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const isUserAdmin = isAdmin(ctx.locals.user, env.ADMIN_EMAIL);

  return new Response(JSON.stringify({ isAdmin: isUserAdmin }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
