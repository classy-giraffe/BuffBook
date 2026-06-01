import { defineMiddleware } from "astro:middleware";
import { getAuth } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
    // If it's an API route for auth, we can just skip or let it pass,
    // but fetching the session is safe and fast for all routes.
    const auth = getAuth();
    
    // In Astro, context.request is a standard web Request.
    // better-auth can parse the session from headers.
    const sessionResult = await auth.api.getSession({ headers: context.request.headers });
    
    context.locals.user = sessionResult?.user ?? null;
    context.locals.session = sessionResult?.session ?? null;
    
    return next();
});
