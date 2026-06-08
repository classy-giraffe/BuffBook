import { createAuth } from "@lib/auth";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const ALL: APIRoute = async (ctx) => {
	const auth = createAuth(env);
	return auth.handler(ctx.request);
};
