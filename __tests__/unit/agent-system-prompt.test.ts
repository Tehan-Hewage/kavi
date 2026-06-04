import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "@/lib/agent-system-prompt";
import { makeCartItem } from "@/__mocks__/test-data-factories";

describe("buildSystemPrompt", () => {

  it("includes English instruction for 'en' language", () => {
    const prompt = buildSystemPrompt("en", []);
    expect(prompt).toContain("Respond in English");
  });

  it("includes Sinhala instruction for 'si' language", () => {
    const prompt = buildSystemPrompt("si", []);
    expect(prompt).toContain("Sinhala");
    expect(prompt).toContain("සිංහල");
  });

  it("includes Tamil instruction for 'ta' language", () => {
    const prompt = buildSystemPrompt("ta", []);
    expect(prompt).toContain("Tamil");
  });

  it("includes Tanglish instruction for 'tanglish' language", () => {
    const prompt = buildSystemPrompt("tanglish", []);
    expect(prompt).toContain("Tanglish");
  });

  it("shows 'Cart is currently empty' when no items", () => {
    const prompt = buildSystemPrompt("en", []);
    expect(prompt).toContain("Cart is currently empty");
  });

  it("lists cart items when cart has items", () => {
    const items = [
      makeCartItem({ name: "Birthday Cake",  quantity: 1 }),
      makeCartItem({ name: "Samsung Galaxy", quantity: 2 }),
    ] as any[];
    const prompt = buildSystemPrompt("en", items);
    expect(prompt).toContain("Birthday Cake");
    expect(prompt).toContain("Samsung Galaxy");
  });

  it("includes today's date", () => {
    const today = new Date().toISOString().split("T")[0];
    const prompt = buildSystemPrompt("en", []);
    expect(prompt).toContain(today);
  });

  it("mentions Kavi as the agent name", () => {
    const prompt = buildSystemPrompt("en", []);
    expect(prompt).toContain("Kavi");
  });

  it("mentions Kapruka", () => {
    const prompt = buildSystemPrompt("en", []);
    expect(prompt).toContain("Kapruka");
  });
});
