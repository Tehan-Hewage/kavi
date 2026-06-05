import { NextRequest, NextResponse } from "next/server";

const GEMINI_KEY = process.env.GEMINI_API_KEY;

const LANG_HINTS: Record<string, string> = {
  en:        "English",
  si:        "Sinhala (සිංහල)",
  ta:        "Tamil (தமிழ்)",
  tanglish:  "Tamil and English mixed (Tanglish)",
};

export async function POST(request: NextRequest) {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const audioBlob = formData.get("audio") as Blob | null;
    const language  = (formData.get("language") as string | null) ?? "en";

    if (!audioBlob || audioBlob.size === 0) {
      return NextResponse.json({ transcript: "" });
    }

    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    const mimeType    = audioBlob.type || "audio/webm";
    const langHint    = LANG_HINTS[language] ?? "English";

    const body = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Audio,
              },
            },
            {
              text: `Transcribe the speech in this audio recording accurately. The speaker is using ${langHint}. Return ONLY the transcribed text — no explanations, no quotes, no formatting. If there is no speech, return an empty string.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 512,
      },
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[/api/transcribe] Gemini error:", errText);
      return NextResponse.json({ error: "Transcription failed" }, { status: 502 });
    }

    const data      = await res.json();
    const transcript = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();

    return NextResponse.json({ transcript });
  } catch (err) {
    console.error("[/api/transcribe] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
