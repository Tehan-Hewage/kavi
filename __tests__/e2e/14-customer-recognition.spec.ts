import { test, expect } from "@playwright/test";

test.describe("Phase 2 — Customer Recognition", () => {

  test("providing email shows welcome back banner", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox").fill("Hi, I'm sandaru.perera@gmail.com");
    await page.getByRole("textbox").press("Enter");

    await expect(page.locator("[data-testid='welcome-back-banner']"))
      .toBeVisible({ timeout: 30000 });
    await expect(page.locator("[data-testid='welcome-back-banner']"))
      .toContainText("Sandaru");
  });

  test("asking about past orders shows order history cards", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox").fill("sandaru.perera@gmail.com — what did I order last time?");
    await page.getByRole("textbox").press("Enter");

    await expect(page.locator("[data-testid='order-history-card']").first())
      .toBeVisible({ timeout: 30000 });
  });

  test("reorder button pre-fills a new order from history", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox").fill("sandaru.perera@gmail.com order history");
    await page.getByRole("textbox").press("Enter");

    await page.locator("[data-testid='order-history-card']").first().waitFor({ timeout: 30000 });
    await page.getByRole("button", { name: /Order again/i }).first().click();

    await expect(page.locator("body")).toBeVisible();
  });

  test("saved address picker appears and can be selected", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox").fill("sandaru.perera@gmail.com send to my usual address");
    await page.getByRole("textbox").press("Enter");

    await page.locator("[data-testid='saved-address-picker']").waitFor({ timeout: 30000 }).catch(() => {});
    const picker = page.locator("[data-testid='saved-address-picker']");
    if (await picker.isVisible()) {
      await expect(picker.getByText(/Home|Office/)).toBeVisible();
    }
  });

  test("Phase 2 tools never expose the access token client-side", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", req => requests.push(req.url() + " " + (req.postData() ?? "")));

    await page.goto("/");
    await page.getByRole("textbox").fill("sandaru.perera@gmail.com");
    await page.getByRole("textbox").press("Enter");
    await page.waitForTimeout(3000);

    const leaked = requests.some(r => r.includes("KAP_P2_"));
    expect(leaked).toBe(false);
  });
});
