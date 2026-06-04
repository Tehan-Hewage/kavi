import { test, expect } from "@playwright/test";

test.describe("Order Tracking", () => {
  test("tracking an existing order displays the status timeline", async ({ page }) => {
    // Intercept API search request and return mock search result stream
    await page.route("**/api/chat", async (route) => {
      const trackingData = {
        order_id: "KP-20260604-1234",
        status: "out_for_delivery",
        recipient: "Nimal Perera",
        estimated_delivery: new Date(Date.now() + 7200000).toISOString(),
        timeline: [
          { event: "Order placed", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
          { event: "Confirmed", timestamp: new Date(Date.now() - 86400000).toISOString() },
          { event: "Processing", timestamp: new Date(Date.now() - 3600000).toISOString() },
          { event: "Out for delivery", timestamp: new Date().toISOString() },
        ],
      };
      
      const sseData = 
        `data: ${JSON.stringify({ type: "tool_start", tool: "kapruka_track_order", input: { order_number: "KP-20260604-1234" } })}\n\n` +
        `data: ${JSON.stringify({ type: "tool_result", tool: "kapruka_track_order", result: trackingData, input: { order_number: "KP-20260604-1234" } })}\n\n` +
        `data: ${JSON.stringify({ type: "text", delta: "Here is your order tracking details:" })}\n\n` +
        `data: ${JSON.stringify({ type: "done" })}\n\n`;

      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: sseData,
      });
    });

    await page.goto("/");
    const input = page.getByRole("textbox");

    // Request tracking
    await input.fill("track order KP-20260604-1234");
    await input.press("Enter");

    // Expect status timeline component
    const timelineHeader = page.getByText("Order Tracking Status");
    await expect(timelineHeader).toBeVisible({ timeout: 15000 });
    
    // Expect timeline checkpoints to render
    await expect(page.getByText("Out for Delivery")).toBeVisible();
    await expect(page.getByText("Recipient: Nimal Perera")).toBeVisible();
  });
});
