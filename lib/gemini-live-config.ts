import { buildKaviSystemPrompt } from "./kavi-system-prompt";
import { CartItem } from "@/types/cart";

export function buildLiveSessionConfig(language: string, cart: CartItem[]) {
  return {
    setup: {
      model: "models/gemini-3.1-flash-live-preview",
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Aoede" },
          },
        },
        thinkingConfig: {
          thinkingLevel: "minimal", // lowest latency
        },
      },
      systemInstruction: {
        parts: [{ text: buildKaviSystemPrompt(language, cart) }],
      },
    },
  };
}
