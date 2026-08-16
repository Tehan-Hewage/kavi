import { getMcpClient, resetMcpClient } from "./mcp-client";
import { assertEmailFromConversation } from "./phase2-guard";
import type {
  CustomerDetails,
  OrderHistoryResponse,
  CustomerAddressesResponse,
} from "./phase2-types";

const PHASE2_TOKEN = process.env.KAPRUKA_PHASE2_TOKEN;

if (!PHASE2_TOKEN) {
  console.warn(
    "⚠️  KAPRUKA_PHASE2_TOKEN is not set — Phase 2 customer tools will fail."
  );
}

export async function callMcpTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<unknown> {
  if (toolName === "kapruka_clear_cart") {
    return { success: true, message: "Cart cleared successfully" };
  }

  const client = await getMcpClient();

  try {
    // Clone input to avoid mutating parameters passed by callers
    const clonedInput = JSON.parse(JSON.stringify(input || {}));

    // NOTE: The Kapruka MCP server expects tool inputs wrapped under a
    // "params" key inside the JSON-RPC "arguments" object, i.e.:
    //   arguments: { params: { q: "...", ... }, response_format: "json" }
    // This is non-standard vs. the MCP spec (which expects arguments flat),
    // but matches the Kapruka server implementation.
    const argumentsObject = clonedInput.params ? clonedInput : { params: clonedInput };

    // Force JSON response format so the UI can render structured product carousels/cards
    if (argumentsObject.params) {
      argumentsObject.params.response_format = "json";
    }

    const result = await client.callTool({ name: toolName, arguments: argumentsObject });

    // Parse result — MCP returns content array with text blocks
    if (result.content && Array.isArray(result.content)) {
      const textContent = result.content
        .filter((c: any) => c.type === "text")
        .map((c: any) => c.text)
        .join("");

      try {
        const parsed = JSON.parse(textContent);
        return sanitizeMcpResult(parsed);
      } catch {
        return sanitizeMcpResult(textContent);
      }
    }
    return sanitizeMcpResult(result);
  } catch (error: any) {
    const msg = String(error);

    // Surface rate-limit errors as friendly messages the AI can relay to the user
    if (
      msg.includes("429") ||
      msg.toLowerCase().includes("rate limit") ||
      msg.toLowerCase().includes("too many requests")
    ) {
      // Reset the MCP client in case the connection is now stale
      resetMcpClient();
      throw new Error(
        "rate_limit: Kapruka is receiving too many requests right now. Please wait a moment and try again."
      );
    }

    console.error(`MCP tool error [${toolName}]:`, error);
    throw new Error(`Tool ${toolName} failed: ${msg}`);
  }
}

// ─── Phase 2 Customer Tools ─────────────────────────────────────

export async function getCustomerDetails(
  email: string,
  conversationEmails: Set<string>
): Promise<CustomerDetails> {
  assertEmailFromConversation(email, conversationEmails);

  const client = await getMcpClient();
  const result = await client.callTool({
    name: "kapruka_customer_details",
    arguments: {
      params: {
        email,
        access_token:    PHASE2_TOKEN,
        response_format: "json",
      },
    },
  });

  return parsePhase2Result<CustomerDetails>(result);
}

export async function getOrderHistory(
  email: string,
  conversationEmails: Set<string>,
  limit = 5
): Promise<OrderHistoryResponse> {
  assertEmailFromConversation(email, conversationEmails);

  const client = await getMcpClient();
  const result = await client.callTool({
    name: "kapruka_order_history",
    arguments: {
      params: {
        email,
        access_token:    PHASE2_TOKEN,
        limit:           Math.min(Math.max(limit || 5, 1), 20),
        response_format: "json",
      },
    },
  });

  return parsePhase2Result<OrderHistoryResponse>(result);
}

export async function getCustomerAddresses(
  email: string,
  conversationEmails: Set<string>
): Promise<CustomerAddressesResponse> {
  assertEmailFromConversation(email, conversationEmails);

  const client = await getMcpClient();
  const result = await client.callTool({
    name: "kapruka_customer_addresses",
    arguments: {
      params: {
        email,
        access_token:    PHASE2_TOKEN,
        response_format: "json",
      },
    },
  });

  return parsePhase2Result<CustomerAddressesResponse>(result);
}

function parsePhase2Result<T>(result: unknown): T {
  const content = (result as { content?: { type: string; text: string }[] })?.content;
  if (!content) throw new Error("Empty response from Phase 2 tool");

  const textBlock = content.find(c => c.type === "text");
  if (!textBlock) throw new Error("No text content in Phase 2 tool response");

  try {
    const parsed = JSON.parse(textBlock.text) as T;
    return sanitizeMcpResult(parsed);
  } catch {
    throw new Error(`Phase 2 tool returned non-JSON: ${textBlock.text.slice(0, 200)}`);
  }
}

function cleanGarbledText(text: string): string {
  if (typeof text !== "string") return text;
  
  let cleaned = text.replace(/(?:[Nn&]#(?:226|8364|8211|8212|8217|8220|8221|147|148|150|151|153);?\s*)+/g, " - ");
  
  cleaned = cleaned
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")");
    
  cleaned = cleaned.replace(/\s*-\s*-\s*/g, " - ");
  cleaned = cleaned.replace(/\s+/g, " ");
  return cleaned.trim();
}

function sanitizeMcpResult(val: any): any {
  if (val === null || val === undefined) {
    return val;
  }
  if (typeof val === "string") {
    return cleanGarbledText(val);
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeMcpResult);
  }
  if (typeof val === "object") {
    const res: Record<string, any> = {};
    for (const key of Object.keys(val)) {
      res[key] = sanitizeMcpResult(val[key]);
    }
    return res;
  }
  return val;
}
