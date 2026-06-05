"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRequestIdRef = useRef<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    currentRequestIdRef.current = null; // Cancel any in-flight requests
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

      // Stop any current playing audio and cancel in-flight requests
      stopSpeaking();
      
      // Clear any previous error
      if (isMountedRef.current) {
        setError(null);
      }
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }

      const requestId = Math.random().toString(36).substring(7);
      currentRequestIdRef.current = requestId;

      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, language }),
        });

        if (!res.ok) {
          if (res.status === 429) {
            throw new Error("Rate limit hit");
          }
          throw new Error(`TTS API failed: ${res.status}`);
        }

        const blob = await res.blob();
        if (!isMountedRef.current) return;

        // If another speak request or stop request has been made in the meantime, abort playing
        if (currentRequestIdRef.current !== requestId) {
          return;
        }

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplaying = () => {
          if (isMountedRef.current && currentRequestIdRef.current === requestId) {
            setIsSpeaking(true);
          }
        };

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
      } catch (err: any) {
        console.error("[useTTS] Error speaking text:", err);
        if (isMountedRef.current && currentRequestIdRef.current === requestId) {
          setIsSpeaking(false);
          const errorMsg = err?.message?.includes("Rate limit")
            ? "Rate limit hit. Please wait a moment."
            : "TTS failed. Please try again.";
          setError(errorMsg);

          // Auto-clear error after 3.5 seconds
          if (errorTimerRef.current) {
            clearTimeout(errorTimerRef.current);
          }
          errorTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setError(null);
            }
          }, 3500);
        }
      }
    },
    [supported, stopSpeaking]
  );

  return {
    isSpeaking,
    error,
    speak,
    stop: stopSpeaking,
    supported,
  };
}
