import { test, expect } from "@playwright/test";

test.describe("Multi-Item Cart — BONUS", () => {
  test("can add multiple different products and view totals", async ({ page }) => {
    // Intercept search requests based on query keywords
    await page.route("**/api/chat", async (route) => {
      const postData = JSON.parse(route.request().postData() || "{}");
      const userMessage = postData.messages?.[postData.messages.length - 1]?.content || "";
      
      let searchResults = [];
      if (userMessage.includes("cake")) {
        searchResults = [
          { id: "CAKE1", name: "Springtime Birthday Ribbon Cake", price: 5770, image_url: "https://www.kapruka.com/images/test-product.jpg" }
        ];
      } else {
        searchResults = [
          { id: "FLOW1", name: "Classic Red Roses Bouquet", price: 3450, image_url: "https://www.kapruka.com/images/test-product.jpg" }
        ];
      }

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

    // Add cake
    await input.fill("birthday cake");
    await input.press("Enter");
    await expect(page.getByText("Here is what I found:")).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Add to Cart", exact: true }).click();
    await expect(page.getByRole("button", { name: /In Cart/i })).toBeVisible();

    // Add flowers
    await input.fill("flowers");
    await input.press("Enter");
    await expect(page.getByText("Here is what I found:")).toHaveCount(2, { timeout: 15000 });
    await page.getByRole("button", { name: "Add to Cart", exact: true }).click();
    await expect(page.getByRole("button", { name: /In Cart/i })).toHaveCount(2);

    // Cart badge should be 2
    const cartButton = page.locator("header button").last();
    await expect(cartButton).toContainText("2");

    // Open Cart Drawer
    await cartButton.click();
    await expect(page.locator("h6", { hasText: "Springtime Birthday Ribbon Cake" })).toBeVisible();
    await expect(page.locator("h6", { hasText: "Classic Red Roses Bouquet" })).toBeVisible();

    // Verify subtotal calculations scoped to the Cart Drawer
    const drawer = page.locator("div").filter({ has: page.getByRole("heading", { name: /Your Cart/i }) });
    await expect(drawer.getByText("Subtotal", { exact: true })).toBeVisible();
    await expect(drawer.getByText("Total", { exact: true })).toBeVisible();
  });
});
