import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { createAuth } from "./lib/auth";
import { generateToken, getCsrfCookie, validateCsrf } from "./lib/csrf";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "frame-src 'self' https://js.stripe.com",
    "connect-src 'self' https://www.google-analytics.com https://*.stripe.com",
    "form-action 'self' https://checkout.stripe.com",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ].join("; "),
};

const PROTECTED_ROUTES = ["/dashboard", "/admin", "/login", "/custom-plans", "/api"];

const FORM_PAGES = ["/custom-plans/apply", "/admin/setup", "/admin/orders", "/dashboard"];

const CSRF_PROTECTED_ENDPOINTS = [
  "/api/admin/create-admin",
  "/api/admin/upload-plan",
  "/api/stripe/create-checkout",
  "/api/user/delete-account",
  "/api/user/update-profile",
  "/api/custom-plans/submit",
  "/custom-plans/apply",
];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const isProtected = PROTECTED_ROUTES.some((route) => url.pathname.startsWith(route));

  context.locals.csrfToken = null;
  let csrfSetCookie: string | null = null;

  // Set CSRF token on GET requests to form pages
  if (context.request.method === "GET" && FORM_PAGES.some((p) => url.pathname.startsWith(p))) {
    const existing = context.request.headers.get("cookie") || "";
    const existingToken = existing.includes("buffbook-csrf=")
      ? existing.match(/buffbook-csrf=([^;]+)/)?.[1] ?? null
      : null;
    if (existingToken) {
      context.locals.csrfToken = existingToken;
    } else {
      const newToken = generateToken();
      csrfSetCookie = getCsrfCookie(newToken);
      context.locals.csrfToken = newToken;
    }
  }

  // Validate CSRF on form submissions
  if (
    context.request.method === "POST" &&
    CSRF_PROTECTED_ENDPOINTS.some((p) => url.pathname.startsWith(p))
  ) {
    const cookieHeader = context.request.headers.get("cookie");
    let formToken: string | null = null;

    if (context.request.headers.get("content-type")?.includes("multipart/form-data")) {
      const clone = context.request.clone();
      const formData = await clone.formData();
      formToken = formData.get("csrf_token")?.toString() ?? null;
    } else if (context.request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
      const clone = context.request.clone();
      const formData = await clone.formData();
      formToken = formData.get("csrf_token")?.toString() ?? null;
    } else if (context.request.headers.get("content-type")?.includes("application/json")) {
      const clone = context.request.clone();
      try {
        const body = await clone.json() as Record<string, unknown>;
        formToken = (body.csrf_token as string) ?? null;
      } catch {
        // ignore parse errors
      }
    }

    if (!validateCsrf(cookieHeader, formToken)) {
      const res = new Response("Invalid CSRF token", { status: 403 });
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        res.headers.set(key, value);
      }
      return res;
    }
  }

  if (!isProtected) {
    const response = await next();
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }
    if (csrfSetCookie) response.headers.append("Set-Cookie", csrfSetCookie);
    return response;
  }

  const auth = createAuth(env);
  const sessionResult = await auth.api.getSession({
    headers: context.request.headers as Headers,
  });

  context.locals.user = sessionResult?.user ?? null;
  context.locals.session = sessionResult?.session ?? null;

  const response = await next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  if (csrfSetCookie) response.headers.append("Set-Cookie", csrfSetCookie);
  return response;
});
