import { setupServer } from "msw/node";
import { http, HttpResponse, passthrough } from "msw";
import {
  makeProductList,
  makeProduct,
  makeCategories,
  makeDeliveryQuote,
  makeOrder,
  makeOrderTracking,
} from "./test-data-factories";

// MSW handler for the MCP endpoint
const handlers = [
  http.post("https://mcp.kapruka.com/mcp", async ({ request }) => {
    const body = await request.json() as {
      method: string;
      id?: any;
      params?: { name: string; arguments: Record<string, unknown> };
    };

    // If it is a notification (no id member), do not return any response block.
    // Return 200 OK with empty body.
    if (body.id === undefined) {
      return new HttpResponse(null, { status: 200 });
    }

    // MCP JSON-RPC style — route by tool name
    if (body.method === "tools/call") {
      const toolName = body.params?.name;
      const args     = body.params?.arguments ?? {};

      let resultPayload: unknown = null;

      switch (toolName) {

        case "kapruka_search_products":
          resultPayload = makeProductList(6);
          break;

        case "kapruka_get_categories":
        case "kapruka_list_categories":
          resultPayload = makeCategories();
          break;

        case "kapruka_get_product":
          resultPayload = makeProduct({ id: args.product_id as string });
          break;

        case "kapruka_quote_delivery":
        case "kapruka_check_delivery":
          resultPayload = makeDeliveryQuote();
          break;

        case "kapruka_create_order":
          resultPayload = makeOrder();
          break;

        case "kapruka_clear_cart":
          resultPayload = { success: true, message: "Cart cleared successfully" };
          break;

        case "kapruka_track_order":
          resultPayload = makeOrderTracking();
          break;

        case "kapruka_check_availability":
          resultPayload = { available: true, cities: ["Colombo", "Kandy", "Galle"] };
          break;

        default:
          return HttpResponse.json({
            jsonrpc: "2.0",
            id: body.id,
            error: { code: -32601, message: `Unknown tool: ${toolName}` }
          }, { status: 400 });
      }

      return HttpResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{
            type: "text",
            text: JSON.stringify(resultPayload),
          }]
        }
      });
    }

    // MCP initialize / list tools
    if (body.method === "initialize") {
      return HttpResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          serverInfo: { name: "mock-mcp-server", version: "1.0.0" }
        }
      });
    }
    if (body.method === "tools/list") {
      return HttpResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          tools: [
            { name: "kapruka_search_products", description: "Search products", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_get_categories", description: "Get categories", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_list_categories", description: "List categories", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_get_product", description: "Get product details", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_quote_delivery", description: "Quote delivery", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_check_delivery", description: "Check delivery", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_create_order", description: "Create order", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_track_order", description: "Track order", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_check_availability", description: "Check availability", inputSchema: { type: "object", properties: {} } },
            { name: "kapruka_clear_cart", description: "Clear cart", inputSchema: { type: "object", properties: {} } },
          ]
        }
      });
    }

    return HttpResponse.json({
      jsonrpc: "2.0",
      id: body.id,
      error: { code: -32601, message: "Unknown method" }
    }, { status: 400 });
  }),
];

// Special handlers for error scenarios
export const errorHandlers = {
  // Simulate 429 rate limit
  rateLimitHandler: http.post("https://mcp.kapruka.com/mcp", async ({ request }) => {
    const body = await request.json() as { id?: any };
    return HttpResponse.json({
      jsonrpc: "2.0",
      id: body.id,
      error: { code: 429, message: "Rate limit exceeded" }
    }, { status: 429 });
  }),

  // Simulate network failure
  networkErrorHandler: http.post("https://mcp.kapruka.com/mcp", () =>
    HttpResponse.error()
  ),

  // Simulate city not deliverable
  notDeliverableHandler: http.post("https://mcp.kapruka.com/mcp", async ({ request }) => {
    const body = await request.json() as { id?: any; params?: { name: string } };
    if (body.params?.name === "kapruka_quote_delivery" || body.params?.name === "kapruka_check_delivery") {
      return HttpResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{ type: "text", text: JSON.stringify({ deliverable: false, available: false }) }]
        }
      });
    }
    return passthrough();
  }),
};

export const server = setupServer(...handlers);
