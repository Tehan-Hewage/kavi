import { getMcpClient } from "./mcp-client";

export async function callMcpTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<unknown> {
  const client = await getMcpClient();

  try {
    // Clone input to avoid mutating parameters passed by callers
    const clonedInput = JSON.parse(JSON.stringify(input || {}));
    
    // Wrap flat arguments in a 'params' property as expected by the Kapruka MCP server
    const argumentsObject = clonedInput.params ? clonedInput : { params: clonedInput };
    
    // Force JSON response format to ensure the UI can render structured product carousels/cards
    if (argumentsObject.params) {
      argumentsObject.params.response_format = "json";
    }
    
    const result = await client.callTool({ name: toolName, arguments: argumentsObject });

    // Parse result - MCP returns content array with text blocks
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
  } catch (error) {
    console.error(`MCP tool error [${toolName}]:`, error);
    throw new Error(`Tool ${toolName} failed: ${String(error)}`);
  }
}
