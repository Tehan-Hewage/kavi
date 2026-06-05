"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export type VoiceStatus = "idle" | "recording" | "transcribing" | "error";

interface UseVoiceOptions {
  onTranscript: (text: string) => void;
  language?: string; // "en" | "si" | "ta" | "tanglish"
}

// Preferred MIME types in priority order
const PREFERRED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/mp4",
];

function getSupportedMimeType(): string {
  if (typeof window === "undefined" || !window.MediaRecorder) return "audio/webm";
  for (const type of PREFERRED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "audio/webm";
}

export function useVoice({ onTranscript, language = "en" }: UseVoiceOptions) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);

  const supported =
    typeof window !== "undefined" &&
    !!window.MediaRecorder &&
    !!navigator.mediaDevices?.getUserMedia;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopStream();
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const clearError = useCallback(() => {
    if (isMountedRef.current) {
      setErrorMsg(null);
      setStatus("idle");
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!supported) {
      setErrorMsg("Voice input is not supported in your browser.");
      setStatus("error");
      return;
    }
    if (status === "recording" || status === "transcribing") return;

    setErrorMsg(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      chunksRef.current = [];
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stopStream();
        if (!isMountedRef.current) return;

        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];

        if (blob.size < 1000) {
          // Too short — no speech captured
          if (isMountedRef.current) setStatus("idle");
          return;
        }

        if (isMountedRef.current) setStatus("transcribing");

        try {
          const formData = new FormData();
          formData.append("audio", blob, "recording.webm");
          formData.append("language", language);

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();

          if (!isMountedRef.current) return;

          if (data.transcript?.trim()) {
            onTranscript(data.transcript.trim());
          }
          setStatus("idle");
        } catch (err) {
          if (!isMountedRef.current) return;
          console.error("[useVoice] transcription error:", err);
          setErrorMsg("Transcription failed — please try again.");
          setStatus("error");
        }
      };

      recorder.onerror = () => {
        if (!isMountedRef.current) return;
        stopStream();
        setErrorMsg("Recording error — please try again.");
        setStatus("error");
      };

      recorder.start(250); // collect data every 250 ms
      if (isMountedRef.current) setStatus("recording");
    } catch (err: any) {
      stopStream();
      if (!isMountedRef.current) return;
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setErrorMsg("Microphone access denied. Please allow mic access and try again.");
      } else {
        setErrorMsg("Could not start recording — please try again.");
      }
      setStatus("error");
    }
  }, [supported, status, language, onTranscript]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    } else {
      stopStream();
      if (isMountedRef.current) setStatus("idle");
    }
  }, []);

  return {
    status,
    isListening: status === "recording",
    isTranscribing: status === "transcribing",
    supported,
    errorMsg,
    startListening,
    stopListening,
    clearError,
  };
}
