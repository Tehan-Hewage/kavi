"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Loader2, Volume2, VolumeX } from "lucide-react";
import VoiceButton   from "@/components/voice/VoiceButton";
import VoiceWaveform from "@/components/voice/VoiceWaveform";
import { useGeminiLive } from "@/hooks/useGeminiLive";
import { CartItem } from "@/types/cart";

interface Props {
  onSend:    (text: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  language?:  string;
  cart?:      CartItem[];
}

export default function ChatInput({
  onSend,
  isLoading = false,
  disabled = false,
  language = "en",
  cart = [],
}: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isReallyLoading = isLoading || disabled;

  const {
    state: voiceState, startSession, stopSession, interrupt,
    audioLevel, lastTranscript, isEnabled, setEnabled,
  } = useGeminiLive(language, cart, onSend);

  const isListening = voiceState === "listening";

  return (
    <div className="px-3 py-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
      <AnimatePresence mode="wait">

        {isListening ? (
          <motion.div key="wave"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center h-12 rounded-2xl px-4 gap-3"
            style={{ background: "var(--input-bg)", border: "1.5px solid #1A7A4A" }}>
            <VoiceWaveform audioLevel={audioLevel} isActive={true} />
            {lastTranscript && (
              <span className="text-xs truncate flex-1" style={{ color: "var(--text-secondary)" }}>
                {lastTranscript}
              </span>
            )}
            <VoiceButton state={voiceState} audioLevel={audioLevel}
              onStart={startSession} onStop={stopSession} onInterrupt={interrupt}
              isEnabled={isEnabled} onToggleMute={() => setEnabled(!isEnabled)} />
          </motion.div>
        ) : (
          <motion.div key="text"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-end gap-2 rounded-2xl px-3 py-2.5"
            style={{ background: "var(--input-bg)", border: "1.5px solid var(--input-border)" }}>

            <textarea ref={textareaRef} value={value}
              onChange={e => {
                setValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (value.trim() && !isReallyLoading) { onSend(value.trim()); setValue(""); }
                }
              }}
              placeholder="What are you shopping for? Or tap 🎤 to talk..."
              rows={1} disabled={isReallyLoading}
              className="flex-1 resize-none outline-none bg-transparent text-sm leading-relaxed"
              style={{ color: "var(--text-primary)", minHeight: "24px", maxHeight: "120px" }}
            />

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <motion.button whileTap={{ scale: 0.88 }} onClick={() => setEnabled(!isEnabled)}
                className="w-8 h-8 rounded-full flex items-center justify-center" title={isEnabled ? "Mute Kavi" : "Unmute Kavi"}>
                {isEnabled
                  ? <Volume2 size={15} style={{ color: "var(--k-purple)" }} />
                  : <VolumeX size={15} style={{ color: "var(--text-tertiary)" }} />}
              </motion.button>

              <VoiceButton state={voiceState} audioLevel={audioLevel}
                onStart={startSession} onStop={stopSession} onInterrupt={interrupt}
                isEnabled={isEnabled} onToggleMute={() => setEnabled(!isEnabled)} />

              <motion.button
                aria-label="Send message"
                animate={{ background: value.trim() && !isReallyLoading ? "#4C1D6E" : "#D1D1D1" }}
                whileTap={value.trim() && !isReallyLoading ? { scale: 0.9 } : {}}
                onClick={() => {
                  if (value.trim() && !isReallyLoading) { onSend(value.trim()); setValue(""); }
                }}
                disabled={!value.trim() || isReallyLoading}
                className="w-10 h-10 rounded-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isReallyLoading
                    ? <Loader2 key="s" size={16} className="text-white animate-spin" />
                    : <ArrowUp  key="a" size={18} className="text-white" />}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[10px] text-center mt-1.5" style={{ color: "var(--text-tertiary)" }}>
        Tap 🎤 to talk · Tap again to interrupt · 🔊 to mute
      </p>
    </div>
  );
}
