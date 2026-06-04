import { describe, it, expect } from "vitest";

// Helper: format price as Sri Lankan Rupees
function formatLKR(amount: number): string {
  return `Rs ${amount.toLocaleString("en-LK")}`;
}

describe("LKR price formatting", () => {
  it("formats small prices correctly", () => {
    expect(formatLKR(350)).toBe("Rs 350");
  });
  it("formats thousands with comma", () => {
    expect(formatLKR(3500)).toBe("Rs 3,500");
  });
  it("formats large prices correctly", () => {
    expect(formatLKR(89990)).toBe("Rs 89,990");
  });
  it("formats zero", () => {
    expect(formatLKR(0)).toBe("Rs 0");
  });
});
