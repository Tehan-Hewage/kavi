import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MCP_URL = "https://mcp.kapruka.com/mcp";

let _client: Client | null = null;

export async function getMcpClient(): Promise<Client> {
  if (_client) return _client;

  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL));
  const client = new Client({ name: "kavi-shopping-agent", version: "1.0.0" }, { capabilities: {} });

  try {
    await client.connect(transport);
    _client = client;
    return _client;
  } catch (err) {
    // Don't cache a broken client — next request will retry
    _client = null;
    throw new Error(`Failed to connect to Kapruka MCP at ${MCP_URL}: ${String(err)}`);
  }
}

/** Call this to force a reconnect on the next tool call (e.g. after sustained errors). */
export function resetMcpClient() {
  _client = null;
}
