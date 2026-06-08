import { test, expect } from "@playwright/test";

test("apply form walks through all steps to Review", async ({ page }) => {
  await page.goto("/custom-plans/apply");

  // ── Step 1: Account ──
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "password123456");
  await page.fill('input[name="confirmPassword"]', "password123456");

  await page.click("#next-btn");
  await expect(page.locator("#step-counter")).not.toHaveText("Step 1");

  // ── Step 2: Body ──
  await expect(page.locator('input[name="age"]')).toBeVisible({ timeout: 3000 });
  await page.fill('input[name="age"]', "30");
  await page.fill('input[name="weight"]', "80");
  await page.fill('input[name="height"]', "180");

  await page.click("#next-btn");

  // ── Step 3: Activity ──
  await expect(page.locator('input[name="steps"]')).toBeVisible({ timeout: 3000 });
  await page.fill('input[name="steps"]', "10000");
  await page.selectOption('select[name="jobType"]', { label: "Desk Job / Sedentary (Standard Hours)" });
  await page.fill('textarea[name="jobDescription"]', "I sit at a desk all day coding.");

  await page.click("#next-btn");

  // ── Step 4: Training ──
  await expect(page.locator('input[name="frequency"]')).toBeVisible({ timeout: 3000 });
  await page.fill('input[name="frequency"]', "4");

  // Select days: Mon, Tue, Thu, Fri
  await page.locator('.day-btn[data-day="Mon"]').click();
  await page.locator('.day-btn[data-day="Tue"]').click();
  await page.locator('.day-btn[data-day="Thu"]').click();
  await page.locator('.day-btn[data-day="Fri"]').click();

  await page.click("#next-btn");

  // ── Step 5: Goals ──
  await expect(page.locator('textarea[name="failureExp"]')).toBeVisible({ timeout: 3000 });
  await page.fill('textarea[name="failureExp"]', "I train to failure regularly.");
  await page.fill('textarea[name="goals"]', "Build muscle and get stronger.");

  await page.click("#next-btn");

  // ── Step 6: Review ──
  await expect(page.locator("#pay-btn")).toBeVisible({ timeout: 3000 });
  await expect(page.locator("#step-counter")).toHaveText(/Step 6/);
});
