import { test, expect } from "@playwright/test";

test.describe("Welcome Screen", () => {

  test("shows Kavi welcome message on first load", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/I am Kavi/i)).toBeVisible();
  });

  test("shows welcome headline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/How can I help you/i).first()).toBeVisible();
  });

  test("shows suggestion chips", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Birthday cakes")).toBeVisible();
    await expect(page.getByText("Send flowers")).toBeVisible();
  });

  test("shows language toggle with all 4 options", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("EN", { exact: true })).toBeVisible();
    await expect(page.getByText("සිංහල", { exact: true })).toBeVisible();
    await expect(page.getByText("தமிழ்", { exact: true })).toBeVisible();
    await expect(page.getByText("Tanglish", { exact: true })).toBeVisible();
  });

  test("page title is correct", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Kavi/i);
  });
});
