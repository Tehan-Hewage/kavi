"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useAudioCapture } from "./useAudioCapture";
import { buildLiveSessionConfig } from "@/lib/gemini-live-config";
import { CartItem } from "@/types/cart";

const WS_BASE = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";

export type LiveState = "idle" | "connecting" | "listening" | "processing" | "speaking" | "error";

export function useGeminiLive(
  language: string,
  cart:     CartItem[],
  onAgentMessage?: (text: string) => void
) {
  const [state,          setState]          = useState<LiveState>("idle");
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const [lastResponse,   setLastResponse]   = useState<string | null>(null);
  const [isEnabled,      setEnabled]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);

  const wsRef           = useRef<WebSocket | null>(null);
  const audioCtxRef     = useRef<AudioContext | null>(null);
  const audioQueueRef   = useRef<AudioBuffer[]>([]);
  const isPlayingRef    = useRef(false);
  const responseTextRef = useRef("");

  const { startCapture, stopCapture, audioLevel } = useAudioCapture();

  const playNextChunk = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setState(s => s === "speaking" ? "listening" : s);
      return;
    }
    isPlayingRef.current = true;
    setState("speaking");
    const buffer = audioQueueRef.current.shift()!;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = playNextChunk;
    source.start();
  }, []);

  const enqueueAudio = useCallback(async (base64Pcm: string) => {
    const bytes   = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0));
    const int16   = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;

    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
    const ctx    = audioCtxRef.current;
    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);
    audioQueueRef.current.push(buffer);
    if (!isPlayingRef.current) playNextChunk();
  }, [playNextChunk]);

  const stopAudio = useCallback(() => {
    audioQueueRef.current = [];
    audioCtxRef.current?.close();
    audioCtxRef.current  = null;
    isPlayingRef.current = false;
  }, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data as string);
      if (msg.serverContent) {
        const parts = msg.serverContent.modelTurn?.parts ?? [];
        for (const part of parts) {
          if (part.inlineData?.mimeType?.startsWith("audio/pcm")) {
            enqueueAudio(part.inlineData.data);
          }
          if (part.text) {
            responseTextRef.current += part.text;
            setLastResponse(responseTextRef.current);
          }
        }
        if (msg.serverContent.turnComplete) {
          const fullText = responseTextRef.current;
          responseTextRef.current = "";
          if (fullText && onAgentMessage) onAgentMessage(fullText);
          setState("listening");
        }
      }
      if (msg.inputTranscription?.text) {
        setLastTranscript(msg.inputTranscription.text);
        setState("processing");
      }
      if (msg.setupComplete) {
        setState("listening");
        startCapture((base64Pcm) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              realtimeInput: { audio: { data: base64Pcm, mimeType: "audio/pcm;rate=16000" } },
            }));
          }
        });
      }
    } catch (err) { console.error("WS parse error:", err); }
  }, [enqueueAudio, onAgentMessage, startCapture]);

  const startSession = useCallback(async () => {
    if (!isEnabled) return;
    setState("connecting"); setError(null);
    try {
      const { token } = await fetch("/api/voice/token").then(r => r.json()) as { token: string };
      const ws = new WebSocket(`${WS_BASE}?access_token=${token}`);
      wsRef.current = ws;
      ws.onopen    = () => ws.send(JSON.stringify(buildLiveSessionConfig(language, cart)));
      ws.onmessage = handleMessage;
      ws.onerror   = () => { setError("Voice connection failed"); setState("error"); };
      ws.onclose   = () => { stopCapture(); if (state !== "idle") setState("idle"); };
    } catch (err) {
      setError(String(err)); setState("error");
    }
  }, [isEnabled, language, cart, handleMessage, stopCapture, state]);

  const stopSession = useCallback(() => {
    stopCapture(); stopAudio();
    wsRef.current?.close(); wsRef.current = null;
    setState("idle");
  }, [stopCapture, stopAudio]);

  const interrupt = useCallback(() => {
    stopAudio();
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ realtimeInput: { activityEnd: {} } }));
    }
    setState("listening");
  }, [stopAudio]);

  useEffect(() => () => stopSession(), [stopSession]);

  return { state, startSession, stopSession, interrupt, audioLevel,
           lastTranscript, lastResponse, isEnabled, setEnabled, error };
}
