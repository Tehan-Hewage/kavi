import { test, expect } from "@playwright/test";

test.describe("Add to Cart", () => {
  test("Add to Cart button updates badge and shows In Cart", async ({ page }) => {
    // Intercept search request
    await page.route("**/api/chat", async (route) => {
      const searchResults = [
        { id: "CAKE1", name: "Springtime Birthday Ribbon Cake", price: 5770, image_url: "https://www.kapruka.com/images/test-product.jpg" }
      ];
      const sseData = 
        `data: ${JSON.stringify({ type: "tool_start", tool: "kapruka_search_products", input: { q: "birthday cake" } })}\n\n` +
        `data: ${JSON.stringify({ type: "tool_result", tool: "kapruka_search_products", result: searchResults, input: { q: "birthday cake" } })}\n\n` +
        `data: ${JSON.stringify({ type: "text", delta: "Here is what I found:" })}\n\n` +
        `data: ${JSON.stringify({ type: "done" })}\n\n`;

      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: sseData,
      });
    });

    await page.goto("/");
    const input = page.getByRole("textbox");
    await input.fill("birthday cake");
    await input.press("Enter");

    // Wait for agent to respond and render the carousel
    await expect(page.getByText("Here is what I found:")).toBeVisible({ timeout: 15000 });

    // Target the Add to Cart button and click it
    await page.getByRole("button", { name: "Add to Cart", exact: true }).click();

    // Cart badge in header should update
    const cartButton = page.locator("header button").last();
    await expect(cartButton).toContainText("1");

    // Button text should change to In Cart
    await expect(page.getByRole("button", { name: /In Cart/i })).toBeVisible();

    // Open Cart Drawer
    await cartButton.click();
    await expect(page.getByRole("heading", { name: /Your Cart/i })).toBeVisible();
    await expect(page.locator("h6", { hasText: "Springtime Birthday Ribbon Cake" })).toBeVisible();
  });
});
