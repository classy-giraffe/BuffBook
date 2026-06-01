import { defineMiddleware } from "astro:middleware";
import { getAuth } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
    // If it's an API route for auth, we can just skip or let it pass,
    // but fetching the session is safe and fast for all routes.
    const url = new URL(context.request.url);
    
    // Only check session on specific routes to avoid unnecessary DB hits
    // and avoid Miniflare/fetch conflicts on prerendered Starlight pages.
    const protectedRoutes = ['/dashboard', '/admin', '/login', '/custom-plans', '/api'];
    const isProtected = protectedRoutes.some(route => url.pathname.startsWith(route));
    
    if (!isProtected) {
        return next();
    }
    
    const auth = getAuth();
    
    // Convert headers to a plain object to avoid Illegal Invocation errors 
    // when mixing Cloudflare Headers with Node.js/Undici fetch internally.
    const headers = Object.fromEntries(context.request.headers.entries());
    
    const sessionResult = await auth.api.getSession({ headers });
    
    context.locals.user = sessionResult?.user ?? null;
    context.locals.session = sessionResult?.session ?? null;
    
    return next();
});
