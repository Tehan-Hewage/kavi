import { getMcpClient, resetMcpClient } from "./mcp-client";

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
    // VERIFY against live server if tool calls return "unknown parameter" errors.
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

function cleanGarbledText(text: string): string {
  if (typeof text !== "string") return text;
  
  // 1. Replaces pseudo-entities representing garbled UTF-8 characters (like en-dash, smart quotes, etc.)
  let cleaned = text.replace(/(?:[Nn&]#(?:226|8364|8211|8212|8217|8220|8221|147|148|150|151|153);?\s*)+/g, " - ");
  
  // 2. Decode standard HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")");
    
  // 3. Clean up double spaces or extra dashes
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
