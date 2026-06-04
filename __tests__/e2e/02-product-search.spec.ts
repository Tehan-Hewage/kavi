import { test, expect } from "@playwright/test";

test.describe("Product Search", () => {
  test("typing a message and sending shows agent response and product list", async ({ page }) => {
    // Intercept API search request and return mock search result stream
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
    await input.fill("Show me birthday cakes");
    await input.press("Enter");

    // Agent response text
    await expect(page.getByText("Here is what I found:")).toBeVisible({ timeout: 15000 });

    // Product card should be rendered
    await expect(page.getByText("Springtime Birthday Ribbon Cake")).toBeVisible();
    await expect(page.getByText("Rs 5,770")).toBeVisible();
  });
});
