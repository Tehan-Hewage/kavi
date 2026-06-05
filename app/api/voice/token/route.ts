import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-live-preview:generateEphemeralToken",
      {
        method:  "POST",
        headers: {
          "Content-Type":   "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          ttl:         "300s",
          usageConfig: { maxInputTokens: 4096 },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to generate token: ${res.status} ${await res.text()}`);
    }

    const data = await res.json() as { token: string; expireTime: string };
    return NextResponse.json({ token: data.token, expiresAt: data.expireTime });

  } catch (error) {
    console.error("Token error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
