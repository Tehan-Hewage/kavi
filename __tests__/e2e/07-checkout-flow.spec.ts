import { test, expect } from "@playwright/test";

test.describe("Full Checkout Flow", () => {
  test("full journey: search → add → checkout → pay link", async ({ page }) => {
    // Intercept API search request and return mock search result stream
    await page.route("**/api/chat", async (route) => {
      const postData = JSON.parse(route.request().postData() || "{}");
      const userMessage = postData.messages?.[postData.messages.length - 1]?.content || "";

      let sseData = "";
      if (userMessage.includes("Confirming order details") || userMessage.includes("Recipient Name")) {
        const orderResult = {
          order_id: "KP-TEST-001",
          pay_url: "https://www.kapruka.com/pay/KP-TEST-001",
          total: 5770,
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          items: [{ name: "Springtime Birthday Ribbon Cake", quantity: 1, price: 5770 }],
          delivery: 350,
        };
        sseData = 
          `data: ${JSON.stringify({ type: "tool_start", tool: "kapruka_create_order", input: {} })}\n\n` +
          `data: ${JSON.stringify({ type: "tool_result", tool: "kapruka_create_order", result: orderResult, input: {} })}\n\n` +
          `data: ${JSON.stringify({ type: "text", delta: "Your order has been created. Pay here: [Click here to pay](https://www.kapruka.com/pay/KP-TEST-001)" })}\n\n` +
          `data: ${JSON.stringify({ type: "done" })}\n\n`;
      } else if (userMessage.includes("checkout") || userMessage.includes("ready to pay")) {
        sseData = 
          `data: ${JSON.stringify({ type: "text", delta: "Here is your checkout form: [checkout-form]" })}\n\n` +
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

    // Step 1: Search
    await input.fill("birthday cake");
    await input.press("Enter");
    await expect(page.getByText("Here is what I found:")).toBeVisible({ timeout: 15000 });

    // Step 2: Add to cart
    await page.getByRole("button", { name: "Add to Cart", exact: true }).click();
    await expect(page.getByRole("button", { name: /In Cart/i })).toBeVisible();

    // Step 3: Trigger checkout
    await input.fill("I want to checkout");
    await input.press("Enter");

    // Wait for the checkout form to render
    const formHeading = page.getByText("Delivery Details");
    await expect(formHeading).toBeVisible({ timeout: 15000 });

    // Step 4: Fill the form
    await page.getByPlaceholder("e.g. Ruwan Perera").fill("Ruwan Perera");
    await page.getByPlaceholder("e.g. 077 123 4567").fill("0771234567");
    await page.getByPlaceholder("Street address, apartment, ward, etc.").fill("No. 12, Main Street");
    await page.locator("select").selectOption("Colombo");

    // Date Picker Input
    const dateInput = page.locator("input[type='date']");
    await dateInput.fill("2026-06-20");

    // Step 5: Submit form
    await page.getByRole("button", { name: /Confirm & Review Details/i }).click();

    // Step 6: Wait for PayLinkCard order creation details
    const payButton = page.getByText("PAY NOW").first();
    await expect(payButton).toBeVisible({ timeout: 30000 });
    
    // Check order ID is displayed
    await expect(page.getByText("KP-TEST-001")).toBeVisible();
  });
});
