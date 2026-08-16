import { describe, it, expect } from "vitest";
import { assertEmailFromConversation } from "@/lib/phase2-guard";

describe("Phase 2 email provenance guard", () => {
  it("allows an email the user actually typed", () => {
    const emails = new Set(["sandaru.perera@gmail.com"]);
    expect(() => assertEmailFromConversation("sandaru.perera@gmail.com", emails))
      .not.toThrow();
  });

  it("blocks an email that was never mentioned in the conversation", () => {
    const emails = new Set(["sandaru.perera@gmail.com"]);
    expect(() => assertEmailFromConversation("someone.else@gmail.com", emails))
      .toThrow();
  });

  it("blocks when no emails have been provided at all", () => {
    const emails = new Set<string>();
    expect(() => assertEmailFromConversation("anyone@gmail.com", emails))
      .toThrow();
  });
});
