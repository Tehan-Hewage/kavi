"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);

  const supported = typeof window !== "undefined";

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (isMountedRef.current) {
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    async (text: string, language = "en") => {
      if (!supported || !text.trim()) return;

      // Stop any current playing audio
      stopSpeaking();

      if (isMountedRef.current) {
        setIsSpeaking(true);
      }

      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, language }),
        });

        if (!res.ok) {
          throw new Error(`TTS API failed: ${res.status}`);
        }

        const blob = await res.blob();
        if (!isMountedRef.current) return;

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          if (audioRef.current === audio) {
            audioRef.current = null;
            if (isMountedRef.current) {
              setIsSpeaking(false);
            }
          }
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          if (audioRef.current === audio) {
            audioRef.current = null;
            if (isMountedRef.current) {
              setIsSpeaking(false);
            }
          }
        };

        await audio.play();
      } catch (err) {
        console.error("[useTTS] Error speaking text:", err);
        if (isMountedRef.current) {
          setIsSpeaking(false);
        }
      }
    },
    [supported, stopSpeaking]
  );

  return {
    isSpeaking,
    speak,
    stop: stopSpeaking,
    supported,
  };
}
