import { getMcpClient } from "./mcp-client";

export async function callMcpTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<unknown> {
  const client = await getMcpClient();

  try {
    const result = await client.callTool({ name: toolName, arguments: input });

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
