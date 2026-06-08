import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("password", () => {
  describe("hashPassword", () => {
    it("returns a salt:hash string", async () => {
      const result = await hashPassword("my-password");
      expect(result).toMatch(/^[0-9a-f]{64}:[0-9a-f]{64}$/);
    });

    it("produces different hashes for the same password", async () => {
      const h1 = await hashPassword("same-password");
      const h2 = await hashPassword("same-password");
      expect(h1).not.toBe(h2);
    });

    it("includes a 64-char hex salt", async () => {
      const result = await hashPassword("test");
      const [salt] = result.split(":");
      expect(salt.length).toBe(64);
    });

    it("includes a 64-char hex hash", async () => {
      const result = await hashPassword("test");
      const [, hash] = result.split(":");
      expect(hash.length).toBe(64);
    });
  });

  describe("verifyPassword", () => {
    it("returns true for matching password", async () => {
      const hash = await hashPassword("correct-horse-battery-staple");
      const result = await verifyPassword("correct-horse-battery-staple", hash);
      expect(result).toBe(true);
    });

    it("returns false for wrong password", async () => {
      const hash = await hashPassword("original-password");
      const result = await verifyPassword("wrong-password", hash);
      expect(result).toBe(false);
    });

    it("returns false for malformed hash string", async () => {
      const result = await verifyPassword("password", "not-a-valid-hash");
      expect(result).toBe(false);
    });

    it("returns false for hash with only one part", async () => {
      const result = await verifyPassword("password", "singlesalt");
      expect(result).toBe(false);
    });

    it("returns false for empty stored hash", async () => {
      const result = await verifyPassword("password", "");
      expect(result).toBe(false);
    });

    it("is case sensitive", async () => {
      const hash = await hashPassword("CaseSensitive");
      const result = await verifyPassword("casesensitive", hash);
      expect(result).toBe(false);
    });
  });
});
