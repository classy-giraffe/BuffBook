import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// We import the mock env but must re-import it after each resetModules()
// since reset creates a fresh module instance
let sendEmail: typeof import("../email").sendEmail;

beforeEach(async () => {
  mockFetch.mockReset();
  vi.resetModules();
  // Import with no API key set (default mock has empty env)
  const mod = await import("../email");
  sendEmail = mod.sendEmail;
});

describe("sendEmail", () => {
  it("does not throw when called", async () => {
    await expect(
      sendEmail({
        to: "test@example.com",
        subject: "Test",
        html: "<p>Hello</p>",
      })
    ).resolves.toBeUndefined();
  });

  it("does not call fetch when no API key is configured", async () => {
    await sendEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Hello</p>",
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls Resend API with correct payload when API key is configured", async () => {
    vi.resetModules();

    // Set RESEND_API_KEY on the mock env AFTER reset (fresh instance)
    const { env: freshEnv } = await import("cloudflare:workers");
    (freshEnv as Record<string, unknown>).RESEND_API_KEY = "re_test_key";

    const mod = await import("../email");

    mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

    await mod.sendEmail({
      to: "user@example.com",
      subject: "Reset Password",
      html: "<p>Click here</p>",
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(options.body as string);
    expect(body.to).toBe("user@example.com");
    expect(body.subject).toBe("Reset Password");
    expect(body.html).toBe("<p>Click here</p>");
    expect(body.from).toBeDefined();
    expect((options.headers as Record<string, string>).Authorization).toBe("Bearer re_test_key");
  });
});
