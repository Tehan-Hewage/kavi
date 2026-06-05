"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kavi-tts-muted";

export function useMutePreference() {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Keep localStorage in sync whenever muted changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(muted));
    } catch {
      // ignore storage errors
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  return { muted, toggleMute };
}
