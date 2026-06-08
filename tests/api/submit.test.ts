import { describe, it, expect, vi, beforeEach } from "vitest";
import { env as mockEnv } from "cloudflare:workers";

// Set up Stripe env
(mockEnv as Record<string, unknown>).STRIPE_SECRET_KEY = "sk_test";

// Mock database
vi.mock("@lib/db", () => ({
  getDb: () => ({
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: "plan-123" }]) }) }),
    select: vi.fn(),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn() }) }),
  }),
}));

// Mock auth
vi.mock("@lib/auth", () => ({
  createAuth: () => ({
    api: {
      signUpEmail: vi.fn().mockResolvedValue({ token: "session-token", user: { id: "user-1" } }),
    },
  }),
}));

// Mock better-auth URL
(mockEnv as Record<string, unknown>).BETTER_AUTH_URL = "http://localhost:4321";

describe("custom-plans submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("module exports POST handler", async () => {
    const mod = await import("../../src/pages/api/custom-plans/submit");
    expect(mod.POST).toBeDefined();
    expect(mod.prerender).toBe(false);
  });

  it("redirects with validation error on empty form", async () => {
    const { POST } = await import("../../src/pages/api/custom-plans/submit");

    const request = new Request("http://localhost/api/custom-plans/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ submitAction: "save" }).toString(),
    });

    const redirectSpy = vi.fn((url: string) => new Response(null, { status: 302, headers: { Location: url } }));

    const ctx = {
      request,
      locals: { user: null, session: null, csrfToken: null },
      redirect: redirectSpy,
    };

    const response = await POST(ctx as any);
    expect(response.status).toBe(302);
    const location = response.headers.get("Location") || "";
    expect(location).toContain("/custom-plans/apply");
    expect(location).toContain("error=validation");
  });
});
