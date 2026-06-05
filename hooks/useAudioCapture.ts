"use client";
import { useRef, useCallback, useState } from "react";

export type CaptureState = "idle" | "capturing" | "error";

export function useAudioCapture() {
  const [state,      setState]      = useState<CaptureState>("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [error,      setError]      = useState<string | null>(null);

  const streamRef    = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const analyzerRef  = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  const startCapture = useCallback(async (onChunk: (base64Pcm: string) => void) => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const ctx      = new AudioContext({ sampleRate: 16000 });
      const source   = ctx.createMediaStreamSource(stream);
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 256;

      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const float32 = e.inputBuffer.getChannelData(0);
        const int16   = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          int16[i] = Math.max(-32768, Math.min(32767, float32[i] * 32768));
        }
        const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
        onChunk(base64);
      };

      source.connect(analyzer);
      source.connect(processor);
      processor.connect(ctx.destination);

      audioCtxRef.current  = ctx;
      analyzerRef.current  = analyzer;
      processorRef.current = processor;

      const data = new Uint8Array(analyzer.frequencyBinCount);
      const tick = () => {
        analyzer.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(Math.min(100, avg * 2.5));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
      setState("capturing");

    } catch (err) {
      console.error("Audio capture failed to start:", err);
      setError("Microphone access denied");
      setState("error");
    }
  }, []);

  const stopCapture = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    processorRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current = audioCtxRef.current = streamRef.current = null;
    setAudioLevel(0);
    setState("idle");
  }, []);

  return { state, startCapture, stopCapture, audioLevel, error };
}
