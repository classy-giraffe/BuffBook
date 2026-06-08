/**
 * Simple CSRF token utilities for form protection.
 *
 * Token is stored as an HttpOnly SameSite=Strict cookie.
 * On POST, the form must submit the same token in a hidden field.
 * The middleware validates they match.
 */

const COOKIE_NAME = "buffbook-csrf";

export function generateToken(): string {
  return crypto.randomUUID();
}

export function getCsrfCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 60}`;
}

export function getCsrfClearCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

export function validateCsrf(
  cookieHeader: string | null,
  formToken: string | null,
): boolean {
  if (!cookieHeader || !formToken) return false;

  const cookies = parseCookies(cookieHeader);
  const cookieToken = cookies[COOKIE_NAME];
  return !!cookieToken && cookieToken === formToken;
}

function parseCookies(header: string): Record<string, string> {
  const result: Record<string, string> = {};
  header.split(";").forEach((pair) => {
    const [key, ...rest] = pair.trim().split("=");
    if (key) result[key] = rest.join("=");
  });
  return result;
}
