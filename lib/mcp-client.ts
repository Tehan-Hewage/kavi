import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MCP_URL = "https://mcp.kapruka.com/mcp";

let _client: Client | null = null;

export async function getMcpClient(): Promise<Client> {
  if (_client) return _client;
  
  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL));
  _client = new Client({ name: "kavi-shopping-agent", version: "1.0.0" }, { capabilities: {} });
  await _client.connect(transport);
  return _client;
}
