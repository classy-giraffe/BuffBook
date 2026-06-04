import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const { user } = ctx.locals;
  
  const ADMIN_EMAIL = env.ADMIN_EMAIL;
  const isAdmin = user ? user.email === ADMIN_EMAIL : false;

  return new Response(JSON.stringify({ isAdmin }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
