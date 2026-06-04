import { test, expect } from "@playwright/test";

test.describe("Tanglish Mode — BONUS", () => {
  test("switches UI strings to Tanglish", async ({ page }) => {
    await page.goto("/");

    // Click Tanglish button
    const tgBtn = page.getByRole("button", { name: "Tanglish" });
    await tgBtn.click();

    // Check placeholder changes to Tanglish translation
    const textarea = page.getByRole("textbox");
    await expect(textarea).toHaveAttribute("placeholder", "Enna thedum? Type here machan!");
  });
});
