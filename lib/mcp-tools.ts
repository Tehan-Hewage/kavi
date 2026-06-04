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
        return JSON.parse(textContent);
      } catch {
        return textContent;
      }
    }
    return result;
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
