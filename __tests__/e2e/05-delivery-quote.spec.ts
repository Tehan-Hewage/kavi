import { test, expect } from "@playwright/test";

test.describe("Delivery Availability", () => {
  test("checking delivery to a valid city returns success info", async ({ page }) => {
    await page.route("**/api/chat", async (route) => {
      const postData = JSON.parse(route.request().postData() || "{}");
      const userMessage = postData.messages?.[postData.messages.length - 1]?.content || "";

      let sseData = "";
      if (userMessage.includes("check delivery") || userMessage.includes("availability")) {
        sseData = 
          `data: ${JSON.stringify({ type: "tool_start", tool: "kapruka_check_delivery", input: { city: "Colombo" } })}\n\n` +
          `data: ${JSON.stringify({ type: "tool_result", tool: "kapruka_check_delivery", result: { available: true, rate: 350 }, input: { city: "Colombo" } })}\n\n` +
          `data: ${JSON.stringify({ type: "text", delta: "Delivery is available to Colombo with Rs 350 delivery charge." })}\n\n` +
          `data: ${JSON.stringify({ type: "done" })}\n\n`;
      } else {
        const searchResults = [
          { id: "CAKE1", name: "Springtime Birthday Ribbon Cake", price: 5770, image_url: "https://www.kapruka.com/images/test-product.jpg" }
        ];
        sseData = 
          `data: ${JSON.stringify({ type: "tool_start", tool: "kapruka_search_products", input: { q: "birthday cake" } })}\n\n` +
          `data: ${JSON.stringify({ type: "tool_result", tool: "kapruka_search_products", result: searchResults, input: { q: "birthday cake" } })}\n\n` +
          `data: ${JSON.stringify({ type: "text", delta: "Here is what I found:" })}\n\n` +
          `data: ${JSON.stringify({ type: "done" })}\n\n`;
      }

      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: sseData,
      });
    });

    await page.goto("/");
    const input = page.getByRole("textbox");

    // Add item first
    await input.fill("birthday cake");
    await input.press("Enter");
    await expect(page.getByText("Here is what I found:")).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Add to Cart", exact: true }).click();
    await expect(page.getByRole("button", { name: /In Cart/i })).toBeVisible();

    // Ask about delivery
    await input.fill("Can you check delivery availability to Colombo?");
    await input.press("Enter");

    // Expect delivery result card in chat list
    const resultCard = page.locator("div").filter({ hasText: "Delivery Check Result" }).first();
    await expect(resultCard).toBeVisible({ timeout: 15000 });
    await expect(resultCard.getByText("Colombo", { exact: true })).toBeVisible();
    await expect(resultCard.getByText("Rs 350", { exact: true })).toBeVisible();
  });
});
