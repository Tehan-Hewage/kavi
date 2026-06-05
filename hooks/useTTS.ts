"use client";

import { useRef, useState, useCallback, useEffect } from "react";

// Map app language codes → BCP-47 locale for TTS voice selection
const TTS_LOCALE_MAP: Record<string, string> = {
  en: "en",
  si: "si",
  ta: "ta",
  tanglish: "ta",
};

// Max chunk length to avoid browser TTS cutting out on long text
const MAX_CHUNK_LENGTH = 180;

/**
 * Split text into speakable chunks at natural sentence/clause boundaries.
 * Keeps chunks under MAX_CHUNK_LENGTH characters.
 */
function splitIntoChunks(text: string): string[] {
  // Remove markdown syntax that doesn't make sense when spoken
  const cleaned = text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // bold
    .replace(/\*(.*?)\*/g, "$1")       // italic
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // code
    .replace(/#{1,6}\s/g, "")          // headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/^\s*[-*+]\s+/gm, "")     // bullet points
    .replace(/\s{2,}/g, " ")           // multiple spaces
    .trim();

  // Split at sentence-ending punctuation
  const sentences = cleaned.split(/(?<=[.!?।])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length > MAX_CHUNK_LENGTH) {
      if (current.trim()) chunks.push(current.trim());
      // If sentence itself is too long, split at commas/clauses
      if (sentence.length > MAX_CHUNK_LENGTH) {
        const sub = sentence.split(/(?<=[,;:])\s+/);
        let subCurrent = "";
        for (const s of sub) {
          if ((subCurrent + " " + s).trim().length > MAX_CHUNK_LENGTH) {
            if (subCurrent.trim()) chunks.push(subCurrent.trim());
            subCurrent = s;
          } else {
            subCurrent = subCurrent ? subCurrent + " " + s : s;
          }
        }
        if (subCurrent.trim()) chunks.push(subCurrent.trim());
        current = "";
      } else {
        current = sentence;
      }
    } else {
      current = current ? current + " " + sentence : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(Boolean);
}

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);
  const isMountedRef = useRef(true);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopSpeaking();
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utteranceQueueRef.current = [];
    isSpeakingRef.current = false;
    currentUtteranceRef.current = null;
    if (isMountedRef.current) setIsSpeaking(false);
  }, [supported]);

  /** Pick the best available voice for the given BCP-47 locale prefix */
  const pickVoice = useCallback(
    (localePrefix: string): SpeechSynthesisVoice | null => {
      if (!supported) return null;
      const voices = window.speechSynthesis.getVoices();
      // Prefer exact match, then prefix match
      return (
        voices.find((v) => v.lang.toLowerCase() === localePrefix.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(localePrefix.toLowerCase())) ||
        voices.find((v) => v.lang.startsWith("en")) || // fallback to English
        null
      );
    },
    [supported]
  );

  const speakNext = useCallback(
    (localePrefix: string) => {
      if (!supported) return;
      const queue = utteranceQueueRef.current;
      if (queue.length === 0) {
        isSpeakingRef.current = false;
        if (isMountedRef.current) setIsSpeaking(false);
        return;
      }

      const text = queue.shift()!;
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;

      // Set voice after voices are loaded
      const setVoiceAndSpeak = () => {
        const voice = pickVoice(localePrefix);
        if (voice) utterance.voice = voice;
        utterance.lang = localePrefix.includes("-")
          ? localePrefix
          : localePrefix === "si"
          ? "si-LK"
          : localePrefix === "ta"
          ? "ta-IN"
          : "en-US";
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;

        utterance.onend = () => {
          if (!isMountedRef.current) return;
          speakNext(localePrefix);
        };
        utterance.onerror = () => {
          utteranceQueueRef.current = [];
          isSpeakingRef.current = false;
          if (isMountedRef.current) setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      };

      // If voices not yet loaded, wait for them
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener("voiceschanged", setVoiceAndSpeak, { once: true });
      } else {
        setVoiceAndSpeak();
      }
    },
    [supported, pickVoice]
  );

  const speak = useCallback(
    (text: string, language = "en") => {
      if (!supported || !text.trim()) return;
      // Cancel any in-flight speech
      window.speechSynthesis.cancel();
      utteranceQueueRef.current = [];

      const localePrefix = TTS_LOCALE_MAP[language] ?? "en";
      const chunks = splitIntoChunks(text);
      utteranceQueueRef.current = chunks;

      isSpeakingRef.current = true;
      if (isMountedRef.current) setIsSpeaking(true);
      speakNext(localePrefix);
    },
    [supported, speakNext]
  );

  return {
    isSpeaking,
    speak,
    stop: stopSpeaking,
    supported,
  };
}
