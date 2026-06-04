import { describe, it, expect } from "vitest";
import { UI_STRINGS } from "@/lib/sinhala-phrases";

describe("sinhala-phrases (UI Translations)", () => {

  it("exports UI_STRINGS translations for en, si, ta, and tanglish", () => {
    expect(UI_STRINGS).toHaveProperty("en");
    expect(UI_STRINGS).toHaveProperty("si");
    expect(UI_STRINGS).toHaveProperty("ta");
    expect(UI_STRINGS).toHaveProperty("tanglish");
  });

  it("ensures all language maps have identical translation keys", () => {
    const enKeys = Object.keys(UI_STRINGS.en).sort();
    const siKeys = Object.keys(UI_STRINGS.si).sort();
    const taKeys = Object.keys(UI_STRINGS.ta).sort();
    const tgKeys = Object.keys(UI_STRINGS.tanglish).sort();

    expect(siKeys).toEqual(enKeys);
    expect(taKeys).toEqual(enKeys);
    expect(tgKeys).toEqual(enKeys);
  });

  it("contains specific required UI translation keys", () => {
    const en = UI_STRINGS.en;
    expect(en).toHaveProperty("placeholder");
    expect(en).toHaveProperty("thinking");
    expect(en).toHaveProperty("addToCart");
    expect(en).toHaveProperty("checkout");
  });

  it("returns correct translations for specific keys in Sinhala", () => {
    expect(UI_STRINGS.si.thinking).toBe("කවි සිතනවා...");
    expect(UI_STRINGS.si.addToCart).toBe("කරත්තයට එකතු කරන්න");
  });

  it("returns correct translations for specific keys in Tanglish", () => {
    expect(UI_STRINGS.tanglish.thinking).toBe("Kavi yosikiran...");
    expect(UI_STRINGS.tanglish.placeholder).toBe("Enna thedum? Type here machan!");
  });
});
