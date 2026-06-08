/**
 * Shared admin check.
 * Prefers the `admin` boolean column if present, otherwise falls back to env var email check.
 */
export function isAdmin(user: { email?: string | null; admin?: boolean | null } | null, adminEmail?: string): boolean {
  if (!user) return false;
  if (user.admin === true) return true;
  if (adminEmail && user.email === adminEmail) return true;
  return false;
}
