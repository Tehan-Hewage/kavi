import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the Anthropic SDK as a constructable function to avoid the dangerouslyAllowBrowser checks during imports in jsdom
vi.mock("@anthropic-ai/sdk", () => {
  const MockAnthropic = vi.fn().mockImplementation(function (this: any) {
    this.messages = {
      create: vi.fn()
    };
  });
  return {
    default: MockAnthropic
  };
});

import { POST } from "@/app/api/chat/route";
import { NextRequest } from "next/server";

vi.mock("@/lib/mcp-tools", () => ({
  callMcpTool: vi.fn().mockImplementation(async () => ({ success: true })),
}));

describe("Load Testing chat API", () => {
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.GEMINI_API_KEY = "test_gemini_key";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("handles 10 concurrent requests without crashing or dropping responses", async () => {
    const mockResponse = {
      candidates: [{ content: { parts: [{ text: "Concurrency response" }] } }],
    };

    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response;
    });

    const requests = Array.from({ length: 10 }, (_, i) => {
      const payload = {
        messages: [{ role: "user", content: `Load request ${i}` }],
        language: "en",
        cart: [],
      };
      return new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    });

    const results = await Promise.all(requests.map(req => POST(req)));

    results.forEach(res => {
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("text/event-stream");
    });

    fetchSpy.mockRestore();
  });
});
