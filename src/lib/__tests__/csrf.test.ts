import { describe, it, expect } from "vitest";
import { generateToken, getCsrfCookie, getCsrfClearCookie, validateCsrf } from "../csrf";

describe("csrf", () => {
  describe("generateToken", () => {
    it("returns a non-empty string", () => {
      const token = generateToken();
      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");
    });

    it("returns a UUID v4", () => {
      const token = generateToken();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(token)).toBe(true);
    });

    it("generates unique tokens each call", () => {
      const t1 = generateToken();
      const t2 = generateToken();
      expect(t1).not.toBe(t2);
    });
  });

  describe("getCsrfCookie", () => {
    it("includes the token in the cookie string", () => {
      const cookie = getCsrfCookie("test-token");
      expect(cookie).toContain("buffbook-csrf=test-token");
      expect(cookie).toContain("HttpOnly");
      expect(cookie).toContain("SameSite=Strict");
      expect(cookie).toContain("Max-Age=1800");
    });
  });

  describe("getCsrfClearCookie", () => {
    it("returns cookie with empty value and Max-Age=0", () => {
      const cookie = getCsrfClearCookie();
      expect(cookie).toContain("buffbook-csrf=");
      expect(cookie).toContain("Max-Age=0");
    });
  });

  describe("validateCsrf", () => {
    it("returns true when token matches cookie", () => {
      const token = generateToken();
      const cookieHeader = `buffbook-csrf=${token}; other=value`;
      expect(validateCsrf(cookieHeader, token)).toBe(true);
    });

    it("returns false when token does not match cookie", () => {
      const cookieHeader = "buffbook-csrf=abc";
      expect(validateCsrf(cookieHeader, "xyz")).toBe(false);
    });

    it("returns false when cookie header is null", () => {
      expect(validateCsrf(null, "token")).toBe(false);
    });

    it("returns false when form token is null", () => {
      expect(validateCsrf("buffbook-csrf=abc", null)).toBe(false);
    });

    it("returns false when cookie header is empty", () => {
      expect(validateCsrf("", "token")).toBe(false);
    });

    it("handles multiple cookies in the header", () => {
      const cookieHeader = "session=abc123; buffbook-csrf=my-token; theme=dark";
      expect(validateCsrf(cookieHeader, "my-token")).toBe(true);
    });

    it("is case sensitive", () => {
      const cookieHeader = "buffbook-csrf=MyToken";
      expect(validateCsrf(cookieHeader, "mytoken")).toBe(false);
    });
  });
});
