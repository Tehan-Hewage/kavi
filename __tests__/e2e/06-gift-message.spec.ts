import { test, expect } from "@playwright/test";

test.describe("Gift Messaging — BONUS", () => {
  test("typing 'add a gift message' reveals gift input", async ({ page }) => {
    await page.route("**/api/chat", async (route) => {
      const postData = JSON.parse(route.request().postData() || "{}");
      const userMessage = postData.messages?.[postData.messages.length - 1]?.content || "";

      let sseData = "";
      if (userMessage.includes("gift") || userMessage.includes("checkout")) {
        sseData = 
          `data: ${JSON.stringify({ type: "text", delta: "Here is your checkout form with gift card customizations: [checkout-form]" })}\n\n` +
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

    // Ask for checkout/gift message
    await input.fill("Please show the checkout form");
    await input.press("Enter");

    // Wait for the checkout form to render
    const formHeading = page.getByText("Delivery Details");
    await expect(formHeading).toBeVisible({ timeout: 30000 });

    // Click gift order checkbox to reveal gift details
    await page.locator("input[type='checkbox']").click();

    // Gift message inputs should appear
    const textarea = page.getByPlaceholder("Write a sweet message...");
    await expect(textarea).toBeVisible();

    // Gift message shows 200 character limit counter
    const counter = page.getByText("0/200");
    await expect(counter).toBeVisible();
  });
});
