import { describe, it, expect, vi, beforeEach } from "vitest";
import { env as mockEnv } from "cloudflare:workers";

const mockDelete = vi.fn().mockReturnValue({ where: vi.fn() });
const mockDbSelect = vi.fn().mockReturnValue({
  from: () => ({
    where: () => [{ pdfKey: "plans/test.pdf" }],
  }),
});

vi.mock("@lib/db", () => ({
  getDb: () => ({
    delete: mockDelete,
    select: mockDbSelect,
  }),
}));

describe("delete-account", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up mock R2 bucket with a delete method
    (mockEnv as Record<string, unknown>).PLANS_BUCKET = {
      delete: vi.fn(),
    };
  });

  it("returns 401 when user is not authenticated", async () => {
    const { POST } = await import("../../src/pages/api/user/delete-account");

    const ctx = {
      locals: { user: null, userSession: null },
    };

    const response = await POST(ctx as any);
    expect(response.status).toBe(401);
  });

  it("cleans up R2 objects before deleting DB records", async () => {
    const { POST } = await import("../../src/pages/api/user/delete-account");

    const ctx = {
      locals: {
        user: { id: "user-1", email: "test@example.com" },
        userSession: {},
      },
    };

    const response = await POST(ctx as any);
    expect(response.status).toBe(200);

    const bucket = mockEnv.PLANS_BUCKET as { delete: ReturnType<typeof vi.fn> };
    expect(bucket.delete).toHaveBeenCalledWith("plans/test.pdf");
    expect(mockDelete).toHaveBeenCalled();
  });

  it("returns 200 on successful deletion", async () => {
    const { POST } = await import("../../src/pages/api/user/delete-account");

    const ctx = {
      locals: {
        user: { id: "user-1", email: "test@example.com" },
        userSession: {},
      },
    };

    const response = await POST(ctx as any);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
