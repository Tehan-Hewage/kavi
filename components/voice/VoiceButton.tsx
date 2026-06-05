"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Loader2, Volume2, MicOff, PhoneOff } from "lucide-react";
import { LiveState } from "@/hooks/useGeminiLive";

interface Props {
  state:        LiveState;
  audioLevel:   number;
  onStart:      () => void;
  onStop:       () => void;
  onInterrupt:  () => void;
  isEnabled:    boolean;
  onToggleMute: () => void;
}

export default function VoiceButton({
  state, audioLevel, onStart, onStop, onInterrupt, isEnabled, onToggleMute
}: Props) {
  const isActive = state !== "idle" && state !== "error";

  const bgColor =
    state === "listening"    ? "#1A7A4A"
    : state === "speaking"   ? "#1A4A7A"
    : state === "processing" ? "#E6A817"
    : state === "connecting" ? "#E6A817"
    : state === "error"      ? "#DC2626"
    : "#4C1D6E";

  const handlePress = () => {
    if (!isEnabled) return;
    if (state === "idle" || state === "error") onStart();
    else if (state === "speaking")              onInterrupt();
    else                                        onStop();
  };

  return (
    <div className="relative flex flex-col items-center gap-1">
      {/* Pulse ring — listening */}
      <AnimatePresence>
        {state === "listening" && (
          <motion.div
            key="ring"
            className="absolute w-14 h-14 rounded-full pointer-events-none"
            style={{ background: "rgba(26,122,74,0.25)" }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1 + audioLevel / 80, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      <motion.button
        onClick={handlePress}
        whileTap={{ scale: 0.88 }}
        animate={{ background: bgColor }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg z-10"
        title={
          state === "idle"        ? "Tap to talk to Kavi"
          : state === "listening" ? "Kavi is listening — speak now"
          : state === "speaking"  ? "Tap to interrupt"
          : "End voice session"
        }
      >
        <AnimatePresence mode="wait">
          {(state === "connecting" || state === "processing") ? (
            <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader2 size={18} className="text-white animate-spin" />
            </motion.div>
          ) : state === "speaking" ? (
            <motion.div key="vol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Volume2 size={18} className="text-white" />
            </motion.div>
          ) : state === "listening" ? (
            <motion.div key="mic-on"
              initial={{ scale: 0 }} animate={{ scale: [1, 1.15, 1] }} exit={{ scale: 0 }}
              transition={{ duration: 0.9, repeat: Infinity }}>
              <Mic size={18} className="text-white" />
            </motion.div>
          ) : state === "error" ? (
            <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MicOff size={18} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Mic size={18} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* End session pill */}
      <AnimatePresence>
        {isActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={onStop}
            className="absolute -right-9 top-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "#DC2626" }}
            title="End voice session"
          >
            <PhoneOff size={11} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Status label */}
      <AnimatePresence>
        {state !== "idle" && (
          <motion.span
            initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap"
            style={{ color: bgColor }}
          >
            {state === "connecting"  ? "Connecting…"
            : state === "listening"  ? "Listening…"
            : state === "processing" ? "Thinking…"
            : state === "speaking"   ? "Speaking…"
            : state === "error"      ? "Tap to retry"
            : ""}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
