"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Square, Volume2, Sparkles } from "lucide-react";

interface VoiceOrbProps {
  visible: boolean;
  onStop: () => void;
}

const BAR_HEIGHTS = [12, 22, 30, 24, 16, 26, 18, 30, 20, 26, 16, 22, 12];
const BAR_DELAYS = [0, 0.08, 0.16, 0.12, 0.04, 0.2, 0.08, 0.24, 0.04, 0.16, 0.12, 0.08, 0.2];

export function VoiceOrb({ visible, onStop }: VoiceOrbProps) {
  const [speed, setSpeed] = useState<"1x" | "1.25x" | "1.5x">("1x");

  const toggleSpeed = () => {
    const next = speed === "1x" ? "1.25x" : speed === "1.25x" ? "1.5x" : "1x";
    setSpeed(next);
    const audios = document.querySelectorAll("audio");
    const rate = next === "1x" ? 1.0 : next === "1.25x" ? 1.25 : 1.5;
    audios.forEach((a) => (a.playbackRate = rate));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="voice-orb"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <div
            className="relative flex items-center gap-3.5 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border border-purple-300/40"
            style={{
              background: "linear-gradient(135deg, #3A1254 0%, #4C1D6E 50%, #6B2D96 100%)",
              boxShadow: "0 12px 36px rgba(76,29,110,0.55), 0 0 0 1px rgba(255,255,255,0.15)",
            }}
          >
            {/* Waveform Equalizer Bars */}
            <div className="flex items-center gap-1 h-8">
              {BAR_HEIGHTS.map((h, i) => (
                <motion.span
                  key={i}
                  className="block w-1 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#FFC700" : "#FFFFFF",
                    boxShadow: i % 2 === 0 ? "0 0 8px rgba(255,199,0,0.6)" : "none",
                  }}
                  animate={{
                    height: [h * 0.35, h, h * 0.5, h * 0.95, h * 0.35],
                    opacity: [0.6, 1, 0.75, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: BAR_DELAYS[i],
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Label */}
            <div className="flex items-center gap-1.5">
              <span className="text-white text-xs font-bold tracking-tight whitespace-nowrap select-none">
                Kavi is speaking…
              </span>
              <Sparkles size={11} className="text-yellow-300 animate-pulse" />
            </div>

            {/* Speed Toggle Pill */}
            <button
              onClick={toggleSpeed}
              title="Toggle Audio Speed"
              className="px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-[10px] font-bold text-yellow-300 transition-colors cursor-pointer"
            >
              {speed}
            </button>

            {/* Stop button */}
            <motion.button
              whileHover={{ scale: 1.12, background: "rgba(255,255,255,0.25)" }}
              whileTap={{ scale: 0.92 }}
              onClick={onStop}
              aria-label="Stop speaking"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer bg-white/15 hover:bg-white/25 border border-white/20"
            >
              <Square size={10} className="text-white fill-white" />
            </motion.button>

            {/* Radiant glowing aura */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: "0 0 20px rgba(255,199,0,0.3)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VoiceOrb;
