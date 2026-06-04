import { test, expect } from "@playwright/test";

test.describe("Sinhala Mode — BONUS", () => {
  test("switches UI strings to Sinhala", async ({ page }) => {
    await page.goto("/");

    // Click Sinhala button
    const siBtn = page.getByRole("button", { name: "සිංහල" });
    await siBtn.click();

    // Check placeholder changes to Sinhala translation
    const textarea = page.getByRole("textbox");
    await expect(textarea).toHaveAttribute("placeholder", "ඔබ සොයන්නේ කුමක්ද?");
  });
});
