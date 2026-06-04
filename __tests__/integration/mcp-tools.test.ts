import { describe, it, expect } from "vitest";
import { callMcpTool } from "@/lib/mcp-tools";
import { server } from "@/__mocks__/kapruka-mcp";
import { errorHandlers } from "@/__mocks__/kapruka-mcp";
import { http, HttpResponse } from "msw";

describe("MCP Tool Wrappers", () => {

  describe("kapruka_search_products", () => {
    it("returns an array of products", async () => {
      const result = await callMcpTool("kapruka_search_products", { query: "birthday cake" }) as unknown[];
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("each product has required fields", async () => {
      const products = await callMcpTool("kapruka_search_products", { query: "cake" }) as Record<string, unknown>[];
      products.forEach(p => {
        expect(p).toHaveProperty("id");
        expect(p).toHaveProperty("name");
        expect(p).toHaveProperty("price");
        expect(p).toHaveProperty("image_url");
      });
    });

    it("passes query parameter correctly", async () => {
      let capturedBody: any;
      server.use(
        http.post("https://mcp.kapruka.com/mcp", async ({ request }) => {
          const body = await request.json() as { id?: any };
          capturedBody = body;
          return HttpResponse.json({
            jsonrpc: "2.0",
            id: body.id,
            result: {
              content: [{ type: "text", text: JSON.stringify([]) }]
            }
          });
        })
      );
      await callMcpTool("kapruka_search_products", { query: "Samsung phone", limit: 5 });
      expect(capturedBody.params).toMatchObject({
        name: "kapruka_search_products",
        arguments: {
          params: {
            query: "Samsung phone",
            limit: 5,
            response_format: "json",
          }
        },
      });
    });

    it("passes min_price and max_price correctly when filtering by budget", async () => {
      let capturedBody: any;
      server.use(
        http.post("https://mcp.kapruka.com/mcp", async ({ request }) => {
          const body = await request.json() as { id?: any };
          capturedBody = body;
          return HttpResponse.json({
            jsonrpc: "2.0",
            id: body.id,
            result: {
              content: [{ type: "text", text: JSON.stringify([]) }]
            }
          });
        })
      );
      await callMcpTool("kapruka_search_products", { q: "cake", min_price: 3000, max_price: 5000 });
      expect(capturedBody.params).toMatchObject({
        name: "kapruka_search_products",
        arguments: {
          params: {
            q: "cake",
            min_price: 3000,
            max_price: 5000,
            response_format: "json",
          }
        },
      });
    });
  });

  describe("kapruka_get_categories", () => {
    it("returns categories array", async () => {
      const cats = await callMcpTool("kapruka_get_categories", {}) as unknown[];
      expect(Array.isArray(cats)).toBe(true);
      expect(cats.length).toBeGreaterThan(0);
    });

    it("each category has id, name, slug", async () => {
      const cats = await callMcpTool("kapruka_get_categories", {}) as Record<string, unknown>[];
      cats.forEach(c => {
        expect(c).toHaveProperty("id");
        expect(c).toHaveProperty("name");
        expect(c).toHaveProperty("slug");
      });
    });
  });

  describe("kapruka_quote_delivery", () => {
    it("returns deliverable: true for a valid city", async () => {
      const quote = await callMcpTool("kapruka_quote_delivery", {
        product_id:    "prod-123",
        city:          "Colombo",
        delivery_date: "2026-06-20",
      }) as Record<string, unknown>;
      expect(quote.deliverable).toBe(true);
      expect(typeof quote.delivery_fee).toBe("number");
    });

    it("returns deliverable: false when city is unavailable", async () => {
      server.use(errorHandlers.notDeliverableHandler);
      const quote = await callMcpTool("kapruka_quote_delivery", {
        product_id:    "prod-123",
        city:          "UnknownCity",
        delivery_date: "2026-06-20",
      }) as Record<string, unknown>;
      expect(quote.deliverable).toBe(false);
    });
  });

  describe("kapruka_create_order", () => {
    it("returns order_id and pay_url", async () => {
      const order = await callMcpTool("kapruka_create_order", {
        items:         [{ product_id: "prod-1", quantity: 1 }],
        recipient:     { name: "Nimal", phone: "+94771234567", address: "No 1, Main St", city: "Colombo" },
        delivery_date: "2026-06-20",
      }) as Record<string, unknown>;
      expect(order).toHaveProperty("order_id");
      expect(order).toHaveProperty("pay_url");
      expect(order).toHaveProperty("expires_at");
      expect(typeof order.total).toBe("number");
    });

    it("returns pay_url that starts with https://", async () => {
      const order = await callMcpTool("kapruka_create_order", {
        items:         [{ product_id: "prod-1", quantity: 1 }],
        recipient:     { name: "Nimal", phone: "+94771234567", address: "No 1", city: "Colombo" },
        delivery_date: "2026-06-20",
      }) as Record<string, unknown>;
      expect((order.pay_url as string).startsWith("https://")).toBe(true);
    });

    it("includes gift_message when provided — BONUS", async () => {
      let capturedArgs: any;
      server.use(
        http.post("https://mcp.kapruka.com/mcp", async ({ request }) => {
          const body = await request.json() as { id?: any; params: { arguments: unknown } };
          capturedArgs = body.params.arguments;
          return HttpResponse.json({
            jsonrpc: "2.0",
            id: body.id,
            result: {
              content: [{ type: "text", text: JSON.stringify({ order_id: "KP-1", pay_url: "https://kapruka.com/pay/1", total: 3500, expires_at: new Date(Date.now() + 3600000).toISOString() }) }]
            }
          });
        })
      );
      await callMcpTool("kapruka_create_order", {
        items:         [{ product_id: "prod-1", quantity: 1 }],
        recipient:     { name: "Nimal", phone: "+94771234567", address: "No 1", city: "Colombo" },
        delivery_date: "2026-06-20",
        gift_message:  "Happy Birthday Amma!",
        sender_name:   "Your Son",
      });
      
      const unwrappedArgs = capturedArgs.params || capturedArgs;
      expect(unwrappedArgs.gift_message).toBe("Happy Birthday Amma!");
      expect(unwrappedArgs.sender_name).toBe("Your Son");
    });
  });

  describe("kapruka_track_order", () => {
    it("returns order status and timeline", async () => {
      const tracking = await callMcpTool("kapruka_track_order", {
        order_id: "KP-20260604-1234",
      }) as Record<string, unknown>;
      expect(tracking).toHaveProperty("order_id");
      expect(tracking).toHaveProperty("status");
      expect(Array.isArray(tracking.timeline)).toBe(true);
    });
  });

  describe("Error handling", () => {
    it("throws a descriptive error on 429 rate limit", async () => {
      server.use(errorHandlers.rateLimitHandler);
      await expect(
        callMcpTool("kapruka_search_products", { query: "cake" })
      ).rejects.toThrow();
    });

    it("throws on network failure", async () => {
      server.use(errorHandlers.networkErrorHandler);
      await expect(
        callMcpTool("kapruka_search_products", { query: "cake" })
      ).rejects.toThrow();
    });
  });
});
