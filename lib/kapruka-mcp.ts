// lib/kapruka-mcp.ts
// All 7 confirmed real tool names and schemas from mcp.kapruka.com

const MCP_URL = process.env.KAPRUKA_MCP_URL ?? "https://mcp.kapruka.com/mcp";

async function callMcpTool(tool: string, params: Record<string, unknown>) {
  const res = await fetch(MCP_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id:      Date.now(),
      method:  "tools/call",
      params:  { name: tool, arguments: params },
    }),
  });
  if (!res.ok) throw new Error(`MCP error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

// ── Tool 1: Search products ────────────────────────────────────────────────
// Searches catalog by keyword + filters. Pagination capped at 3 pages.
export async function searchProducts(params: {
  q:            string;
  category?:    string;    // top-level category name from kapruka_list_categories
  min_price?:   number;    // LKR
  max_price?:   number;    // LKR
  in_stock_only?: boolean; // default true
  sort?:        "relevance" | "price_asc" | "price_desc" | "newest";
  limit?:       number;    // default 10
  cursor?:      string;    // pagination
  currency?:    "LKR" | "USD";
}) {
  return callMcpTool("kapruka_search_products", params);
}

// ── Tool 2: Get product details ───────────────────────────────────────────
// Full details: name, price, stock, variants, images, shipping, direct URL
export async function getProduct(params: {
  product_id: string;
  currency?:  "LKR" | "USD";
}) {
  return callMcpTool("kapruka_get_product", params);
}

// ── Tool 3: List categories ───────────────────────────────────────────────
// Top-level category names with browse URLs
// Pass any name as `category` filter in kapruka_search_products
export async function listCategories(params?: {
  depth?: number;   // default 1
}) {
  return callMcpTool("kapruka_list_categories", params ?? {});
}

// ── Tool 4: List delivery cities ──────────────────────────────────────────
// Searches by canonical name OR vernacular alias (Sinhala/Tamil city names)
// Returns up to 50 matches. Use to validate city before creating order.
export async function listDeliveryCities(params: {
  query: string;   // e.g. "Colombo", "කොළඹ", "කොළඹ"
  limit?: number;  // default 50
}) {
  return callMcpTool("kapruka_list_delivery_cities", params);
}

// ── Tool 5: Check delivery ────────────────────────────────────────────────
// Checks if a city can receive an order on a given date.
// Returns: flat LKR rate + perishable warning (for cakes/flowers/combos)
export async function checkDelivery(params: {
  city:          string;        // canonical city name
  delivery_date: string;        // ISO date: "2026-06-08"
  product_id?:   string;        // include for perishable warning
}) {
  return callMcpTool("kapruka_check_delivery", params);
}

// ── Tool 6: Create order ──────────────────────────────────────────────────
// Guest checkout — no Kapruka account needed.
// Returns a click-to-pay URL locked for 60 minutes.
export async function createOrder(params: {
  cart: Array<{
    product_id: string;
    quantity:   number;
    variant_id?: string;  // if product has variants (size, colour, etc.)
  }>;
  recipient: {
    name:    string;
    phone:   string;
    address: string;
    city:    string;
  };
  delivery: {
    date: string;          // ISO date: "2026-06-08"
  };
  sender?: {
    name?:  string;
    phone?: string;
  };
  gift_message?: string;   // printed on card included with order
  currency?: "LKR" | "USD";
}) {
  return callMcpTool("kapruka_create_order", params);
}

// ── Tool 7: Track order ───────────────────────────────────────────────────
// Returns status, recipient, items, timestamped delivery progress
export async function trackOrder(params: {
  order_number: string;  // from confirmation email or order complete page
}) {
  return callMcpTool("kapruka_track_order", params);
}
