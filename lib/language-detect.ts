import { franc } from "franc";

export type Language = "en" | "si" | "ta" | "tanglish";

export function detectLanguage(text: string): Language {
  // Detect Sinhala Unicode range: \u0D80-\u0DFF
  if (/[\u0D80-\u0DFF]/.test(text)) return "si";
  
  // Detect Tamil Unicode range: \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  
  // Detect Tanglish (Tamil words romanized mixed with English)
  const tanglishPatterns = /\b(enna|naan|vanakam|romba|epdi|machan|anna|akka|sollu|paaru)\b/i;
  if (tanglishPatterns.test(text)) return "tanglish";
  
  // Fall back to franc for other detection
  const detected = franc(text, { minLength: 10 });
  if (detected === "sin") return "si";
  if (detected === "tam") return "ta";
  
  return "en";
}
