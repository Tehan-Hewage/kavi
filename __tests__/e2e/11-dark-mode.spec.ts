import { test, expect } from "@playwright/test";

test.describe("Dark Mode Toggle", () => {
  test("toggling light and dark mode updates html classes", async ({ page }) => {
    await page.goto("/");

    // Locate the toggle button using the title attribute
    const toggleBtn = page.getByTitle("Toggle Light/Dark Theme");
    await expect(toggleBtn).toBeVisible();

    const htmlEl = page.locator("html");
    
    // Check initial state
    const hasDarkClass = await htmlEl.evaluate((el) => el.classList.contains("dark"));

    // Click the toggle button to switch
    await toggleBtn.click();

    if (hasDarkClass) {
      // Should now be light mode (no dark class)
      await expect(htmlEl).not.toHaveClass(/dark/);
    } else {
      // Should now be dark mode (has dark class)
      await expect(htmlEl).toHaveClass(/dark/);
    }

    // Toggle again to return to initial state
    await toggleBtn.click();
    if (hasDarkClass) {
      await expect(htmlEl).toHaveClass(/dark/);
    } else {
      await expect(htmlEl).not.toHaveClass(/dark/);
    }
  });
});
