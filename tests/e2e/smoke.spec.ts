import { test, expect } from "@playwright/test";

test("custom plans page loads with correct title", async ({ page }) => {
  await page.goto("/custom-plans");
  await expect(page.getByRole("heading", { name: /hand-crafted/i })).toBeVisible();
});

test("custom plans page has CTA button", async ({ page }) => {
  await page.goto("/custom-plans");
  const cta = page.locator('a[href="/custom-plans/apply"]').first();
  await expect(cta).toBeVisible();
});

test("apply form loads with progress bar", async ({ page }) => {
  await page.goto("/custom-plans/apply");
  await expect(page.locator("#progress-bar")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Assessment/ })).toBeVisible();
});

test("apply form has first step visible", async ({ page }) => {
  await page.goto("/custom-plans/apply");

  // Account step should be visible (when not logged in)
  await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();

  // Next button should be present
  await expect(page.locator("#next-btn")).toBeVisible();
});

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /getting bigger/i })).toBeVisible();
});

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 5000 });
});
