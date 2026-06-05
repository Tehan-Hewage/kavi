"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kavi-tts-muted";

export function useMutePreference() {
  // Always start as false (SSR-safe). Read localStorage only after mount.
  const [muted, setMuted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setMuted(true);
    } catch {
      // ignore storage errors
    }
  }, []);

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
