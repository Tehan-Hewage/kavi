import { describe, it, expect } from "vitest";
import { cleanMessageText } from "@/components/chat/MessageBubble";

describe("cleanMessageText", () => {
  it("strips standalone bracket placeholders", () => {
    const raw = "Here is the result:\n\n[Product Gallery]\n\nHope you like it!";
    expect(cleanMessageText(raw)).toBe("Here is the result:\n\nHope you like it!");
  });

  it("retains the [checkout-form] placeholder", () => {
    const raw = "Please fill this in:\n\n[checkout-form]";
    expect(cleanMessageText(raw)).toBe("Please fill this in:\n\n[checkout-form]");
  });

  it("strips Link: prefix inside markdown link brackets", () => {
    const raw = "Check this out: [Link: Red Roses](http://roses)";
    expect(cleanMessageText(raw)).toBe("Check this out: [Red Roses](http://roses)");
  });

  it("strips Link: prefix outside markdown link brackets", () => {
    const raw = "Check this out: Link: [Red Roses](http://roses)";
    expect(cleanMessageText(raw)).toBe("Check this out: [Red Roses](http://roses)");
  });

  it("cleans up consecutive empty lines", () => {
    const raw = "Line 1\n\n\n\nLine 2";
    expect(cleanMessageText(raw)).toBe("Line 1\n\nLine 2");
  });
});
