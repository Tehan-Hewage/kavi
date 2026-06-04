import { test, expect } from "@playwright/test";

test.describe("Error Handling", () => {
  test("displays friendly error message when chatbot api returns a rate limit error", async ({ page }) => {
    // Intercept /api/chat and return a rate limit error chunk
    await page.route("**/api/chat", async (route) => {
      const sseData = `data: ${JSON.stringify({ type: "error", message: "rate_limit" })}\n\n`;
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: sseData,
      });
    });

    await page.goto("/");
    const input = page.getByRole("textbox");
    await input.fill("hello");
    await input.press("Enter");

    // Expect friendly rate limit message
    await expect(page.getByText("Adoh, it's a bit busy right now!")).toBeVisible({ timeout: 15000 });
  });

  test("displays friendly generic error message when chatbot API connection fails", async ({ page }) => {
    // Intercept /api/chat and fail connection
    await page.route("**/api/chat", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/");
    const input = page.getByRole("textbox");
    await input.fill("hello");
    await input.press("Enter");

    // Expect generic error alert
    await expect(page.getByText(/System Alert/i).or(page.getByText(/trouble/i))).toBeVisible({ timeout: 15000 });
  });
});
