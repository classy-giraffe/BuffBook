import { getAuth } from "../../../lib/auth";
import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async (ctx) => {
	const auth = getAuth();
	return auth.handler(ctx.request);
};
