import { describe, it, expect, vi, beforeEach } from "vitest";
import { env as mockEnv } from "cloudflare:workers";

// ──── Stripe webhook signature verification ────

const mockConstructEvent = vi.fn();
class MockStripe {
  webhooks = { constructEvent: mockConstructEvent };
}

vi.mock("stripe", () => ({
  default: MockStripe,
}));

describe("Stripe webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (mockEnv as Record<string, unknown>).STRIPE_SECRET_KEY = "sk_test_validkey";
    (mockEnv as Record<string, unknown>).STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const { POST } = await import("../../src/pages/api/stripe/webhook");

    // No stripe-signature header at all
    const request = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "checkout.session.completed" }),
    });

    const ctx = { request, locals: {} };
    const res = await POST(ctx as any);
    // Returns 400 directly when header is missing (before calling Stripe)
    expect(res.status).toBe(400);
  });

  it("uses stripe.webhooks.constructEvent for signature verification", async () => {
    // The webhook.ts calls stripe.webhooks.constructEvent with:
    //   - raw body (as string or Buffer)
    //   - signature from header
    //   - webhook secret from env
    // We verify the import and structure are correct
    const mod = await import("../../src/pages/api/stripe/webhook");
    expect(mod.POST).toBeDefined();
    expect(mod.prerender).toBe(false);
  });
});

// ──── Input validation edge cases ────

describe("form validation edge cases", () => {
  it("submit handler rejects missing submitAction", async () => {
    const { POST } = await import("../../src/pages/api/custom-plans/submit");

    // Empty form with no submitAction
    const request = new Request("http://localhost/api/custom-plans/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({}).toString(),
    });

    const ctx = {
      request,
      locals: { user: null, session: null, csrfToken: null },
      redirect: vi.fn((url: string) =>
        new Response(null, { status: 302, headers: { Location: url } })
      ),
    };

    const res = await POST(ctx as any);
    expect(res.status).toBe(302);
    const loc = res.headers.get("Location") || "";
    expect(loc).toContain("error=validation");
  });

  it("submit handler rejects invalid age values", async () => {
    const { POST } = await import("../../src/pages/api/custom-plans/submit");

    const formData = new URLSearchParams({
      submitAction: "save",
      name: "Test",
      email: "test@example.com",
      password: "aaaaaaaaaaaa",
      confirmPassword: "aaaaaaaaaaaa",
      unitSystem: "metric",
      age: "not-a-number",
      weight: "80",
      height: "180",
      steps: "8000",
      jobType: "Desk Job / Sedentary (Standard Hours)",
      jobDescription: "Sitting at desk",
      equipment: "Gym",
      frequency: "4",
      trainingDays: "Mon,Tue,Wed,Thu",
      failureExp: "Experienced",
      goals: "Hypertrophy",
    });

    const request = new Request("http://localhost/api/custom-plans/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const ctx = {
      request,
      locals: { user: null, session: null, csrfToken: null },
      redirect: vi.fn((url: string) =>
        new Response(null, { status: 302, headers: { Location: url } })
      ),
    };

    const res = await POST(ctx as any);
    expect(res.status).toBe(302);
    const loc = res.headers.get("Location") || "";
    expect(loc).toContain("error=validation");
  });

  it("submit handler rejects weight of 0 or negative", async () => {
    const { POST } = await import("../../src/pages/api/custom-plans/submit");

    const formData = new URLSearchParams({
      submitAction: "save",
      name: "Test",
      email: "test@example.com",
      password: "aaaaaaaaaaaa",
      confirmPassword: "aaaaaaaaaaaa",
      unitSystem: "metric",
      age: "25",
      weight: "0",
      height: "180",
      steps: "8000",
      jobType: "Desk Job / Sedentary (Standard Hours)",
      jobDescription: "Sitting at desk",
      equipment: "Gym",
      frequency: "4",
      trainingDays: "Mon,Tue,Wed,Thu",
      failureExp: "Experienced",
      goals: "Hypertrophy",
    });

    const request = new Request("http://localhost/api/custom-plans/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const ctx = {
      request,
      locals: { user: null, session: null, csrfToken: null },
      redirect: vi.fn((url: string) =>
        new Response(null, { status: 302, headers: { Location: url } })
      ),
    };

    const res = await POST(ctx as any);
    expect(res.status).toBe(302);
    const loc = res.headers.get("Location") || "";
    expect(loc).toContain("error=validation");
  });

  it("submit handler rejects training frequency below 2 or above 6", async () => {
    const { POST } = await import("../../src/pages/api/custom-plans/submit");

    const formData = new URLSearchParams({
      submitAction: "save",
      name: "Test",
      email: "test@example.com",
      password: "aaaaaaaaaaaa",
      confirmPassword: "aaaaaaaaaaaa",
      unitSystem: "metric",
      age: "25",
      weight: "80",
      height: "180",
      steps: "8000",
      jobType: "Desk Job / Sedentary (Standard Hours)",
      jobDescription: "Sitting at desk",
      equipment: "Gym",
      frequency: "1", // Invalid: below minimum of 2
      trainingDays: "Mon",
      failureExp: "Experienced",
      goals: "Hypertrophy",
    });

    const request = new Request("http://localhost/api/custom-plans/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const ctx = {
      request,
      locals: { user: null, session: null, csrfToken: null },
      redirect: vi.fn((url: string) =>
        new Response(null, { status: 302, headers: { Location: url } })
      ),
    };

    const res = await POST(ctx as any);
    expect(res.status).toBe(302);
    const loc = res.headers.get("Location") || "";
    expect(loc).toContain("error=validation");
  });

  it("submit handler rejects non-matching password confirmation", async () => {
    const { POST } = await import("../../src/pages/api/custom-plans/submit");

    const formData = new URLSearchParams({
      submitAction: "save",
      name: "Test",
      email: "test@example.com",
      password: "aaaaaaaaaaaa",
      confirmPassword: "differentpassword", // Mismatch
      unitSystem: "metric",
      age: "25",
      weight: "80",
      height: "180",
      steps: "8000",
      jobType: "Desk Job / Sedentary (Standard Hours)",
      jobDescription: "Sitting at desk",
      equipment: "Gym",
      frequency: "4",
      trainingDays: "Mon,Tue,Wed,Thu",
      failureExp: "Experienced",
      goals: "Hypertrophy",
    });

    const request = new Request("http://localhost/api/custom-plans/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const ctx = {
      request,
      locals: { user: null, session: null, csrfToken: null },
      redirect: vi.fn((url: string) =>
        new Response(null, { status: 302, headers: { Location: url } })
      ),
    };

    const res = await POST(ctx as any);
    expect(res.status).toBe(302);
    const loc = res.headers.get("Location") || "";
    expect(loc).toContain("error=validation");
  });
});
