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

// Mock the MCP tools wrapper to avoid actual HTTP/client execution
vi.mock("@/lib/mcp-tools", () => ({
  callMcpTool: vi.fn().mockImplementation(async (toolName) => {
    if (toolName === "kapruka_search_products") {
      return [{ id: "mock-id", name: "Mock Product", price: 1000 }];
    }
    return { success: true };
  }),
}));

describe("API /api/chat route", () => {
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    originalEnv = { ...process.env };
    // Set API Keys for testing routing
    process.env.GEMINI_API_KEY = "test_gemini_key";
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("handles user messaging and returns a readable text stream using Gemini", async () => {
    // Spy on global fetch to mock Gemini API endpoint
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: "Hello, I am Kavi. How can I help you?" }],
          },
        },
      ],
    };

    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response;
    });

    const payload = {
      messages: [{ role: "user", content: "hello" }],
      language: "en",
      cart: [],
    };

    const request = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream");

    // Read the stream
    const reader = response.body?.getReader();
    expect(reader).toBeDefined();

    const decoder = new TextDecoder();
    let text = "";
    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      text += decoder.decode(value);
    }

    expect(text).toContain("Hello");
    expect(text).toContain("Kavi");
    expect(text).toContain("type");
    expect(text).toContain("done");

    fetchSpy.mockRestore();
  });

  it("handles function calls in Gemini and executes MCP tool", async () => {
    // Spy on global fetch to mock first tool call, then second text completion
    const mockToolCallResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                functionCall: {
                  name: "kapruka_search_products",
                  args: { q: "cake" },
                },
              },
            ],
          },
        },
      ],
    };

    const mockFinalTextResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: "Here are some cakes." }],
          },
        },
      ],
    };

    let callCount = 0;
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async () => {
      callCount++;
      const data = callCount === 1 ? mockToolCallResponse : mockFinalTextResponse;
      return {
        ok: true,
        status: 200,
        json: async () => data,
      } as Response;
    });

    const payload = {
      messages: [{ role: "user", content: "search cakes" }],
      language: "en",
      cart: [],
    };

    const request = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let text = "";
    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      text += decoder.decode(value);
    }

    expect(text).toContain("tool_start");
    expect(text).toContain("kapruka_search_products");
    expect(text).toContain("tool_result");
    expect(text).toContain("Here");
    expect(text).toContain("some");
    expect(text).toContain("cakes");

    fetchSpy.mockRestore();
  });
});
