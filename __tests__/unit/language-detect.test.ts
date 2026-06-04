import { describe, it, expect } from "vitest";
import { detectLanguage } from "@/lib/language-detect";

describe("detectLanguage", () => {

  describe("Sinhala detection", () => {
    it("detects Sinhala Unicode script", () => {
      expect(detectLanguage("මට කේක් එකක් ඕනෙ")).toBe("si");
    });
    it("detects mixed Sinhala + English", () => {
      expect(detectLanguage("I want a කේක් for birthday")).toBe("si");
    });
    it("detects Sinhala numerals context", () => {
      expect(detectLanguage("රු 3000 ට ගිෆ්ට් ඕනෙ")).toBe("si");
    });
  });

  describe("Tamil detection", () => {
    it("detects Tamil Unicode script", () => {
      expect(detectLanguage("என்னால் ஒரு கேக் வேண்டும்")).toBe("ta");
    });
    it("detects mixed Tamil + English", () => {
      expect(detectLanguage("birthday cake வேண்டும்")).toBe("ta");
    });
  });

  describe("Tanglish detection", () => {
    it("detects common Tanglish keywords — machan", () => {
      expect(detectLanguage("machan I want a cake da")).toBe("tanglish");
    });
    it("detects Tanglish keyword — romba", () => {
      expect(detectLanguage("romba nalla iruku this product")).toBe("tanglish");
    });
    it("detects Tanglish keyword — vanakam", () => {
      expect(detectLanguage("vanakam I need flowers")).toBe("tanglish");
    });
    it("detects Tanglish keyword — epdi", () => {
      expect(detectLanguage("epdi use pannuvom this?")).toBe("tanglish");
    });
  });

  describe("English detection", () => {
    it("returns English for plain English text", () => {
      expect(detectLanguage("I want to buy a birthday cake")).toBe("en");
    });
    it("returns English for short English text", () => {
      expect(detectLanguage("hello")).toBe("en");
    });
    it("returns English for empty string", () => {
      expect(detectLanguage("")).toBe("en");
    });
  });
});
