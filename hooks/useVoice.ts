"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export type VoiceStatus = "idle" | "requesting" | "listening" | "error";

interface UseVoiceOptions {
  onTranscript: (text: string) => void;
  language?: string; // "en" | "si" | "ta" | "tanglish"
}

// Map app language codes → BCP-47 locale for SpeechRecognition
const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  si: "si-LK",
  ta: "ta-IN",
  tanglish: "ta-IN",
};

// Minimal type shim for Web Speech API (not always present in TS DOM lib)
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: any) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: any) => void) | null;
}

export function useVoice({ onTranscript, language = "en" }: UseVoiceOptions) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isMountedRef = useRef(true);

  // Detect browser support
  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clean up any active recognition
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!supported) {
      setErrorMsg("Voice input is not supported in your browser.");
      setStatus("error");
      return;
    }
    if (status === "listening" || status === "requesting") return;

    const SpeechRecognitionAPI: new () => ISpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.lang = LOCALE_MAP[language] ?? "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    setStatus("requesting");
    setErrorMsg(null);

    recognition.onstart = () => {
      if (isMountedRef.current) setStatus("listening");
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript.trim() && isMountedRef.current) {
        onTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      if (!isMountedRef.current) return;
      const msg =
        event.error === "not-allowed"
          ? "Microphone access denied. Please allow mic access and try again."
          : event.error === "network"
          ? "Network error during voice recognition."
          : `Voice error: ${event.error}`;
      setErrorMsg(msg);
      setStatus("error");
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      if (isMountedRef.current) {
        setStatus((prev) => (prev !== "error" ? "idle" : prev));
      }
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (_) {
      setStatus("error");
      setErrorMsg("Could not start voice recognition.");
      recognitionRef.current = null;
    }
  }, [supported, status, language, onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    setStatus("idle");
  }, []);

  const clearError = useCallback(() => {
    setErrorMsg(null);
    setStatus("idle");
  }, []);

  return {
    status,
    isListening: status === "listening",
    isRequesting: status === "requesting",
    supported,
    errorMsg,
    startListening,
    stopListening,
    clearError,
  };
}
