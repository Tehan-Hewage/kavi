import { NextRequest, NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp-tools";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const currency = searchParams.get("currency") || "LKR";

  if (!id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  try {
    const result = await callMcpTool("kapruka_get_product", { product_id: id, currency });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
