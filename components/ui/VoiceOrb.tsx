"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Square } from "lucide-react";

interface VoiceOrbProps {
  visible: boolean;
  onStop: () => void;
}

const BAR_HEIGHTS = [14, 20, 28, 20, 14, 22, 16, 26, 18, 24, 16, 20, 14];
const BAR_DELAYS = [0, 0.1, 0.2, 0.15, 0.05, 0.25, 0.1, 0.3, 0.05, 0.2, 0.15, 0.1, 0.25];

export function VoiceOrb({ visible, onStop }: VoiceOrbProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="voice-orb"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="relative flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md"
            style={{
              background: "linear-gradient(135deg, rgba(76,29,110,0.92) 0%, rgba(107,45,150,0.92) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 8px 32px rgba(76,29,110,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Waveform bars */}
            <div className="flex items-center gap-0.5 h-8">
              {BAR_HEIGHTS.map((h, i) => (
                <motion.span
                  key={i}
                  className="block w-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.85)" }}
                  animate={{
                    height: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.4],
                    opacity: [0.5, 1, 0.7, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: BAR_DELAYS[i],
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Label */}
            <span className="text-white/90 text-xs font-semibold tracking-wide whitespace-nowrap select-none">
              Kavi is speaking…
            </span>

            {/* Stop button */}
            <motion.button
              whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.9 }}
              onClick={onStop}
              aria-label="Stop speaking"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <Square size={11} className="text-white fill-white" />
            </motion.button>

            {/* Subtle pulsing glow ring */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "transparent",
                boxShadow: "0 0 0 6px rgba(107,45,150,0.35)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VoiceOrb;
