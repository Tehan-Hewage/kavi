import { test, expect } from "@playwright/test";

test.describe("Mobile Viewport Size", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("renders layout correctly on a 390px wide screen", async ({ page }) => {
    await page.goto("/");

    // Verify main components are present
    await expect(page.getByText(/your Kapruka shopping assistant/i)).toBeVisible();
    await expect(page.getByRole("textbox")).toBeVisible();

    // Verify the cart drawer adapts nicely
    const cartButton = page.locator("header button").last();
    await cartButton.click();

    const drawer = page.locator("div").filter({ has: page.getByRole("heading", { name: /Your Cart/i }) }).first();
    // The width of the drawer on mobile should be 100vw/380px max
    const box = await drawer.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(390);
  });
});
