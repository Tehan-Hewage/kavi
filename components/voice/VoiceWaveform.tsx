"use client";
import { motion } from "framer-motion";

export default function VoiceWaveform({
  audioLevel, isActive, color = "#1A7A4A"
}: { audioLevel: number; isActive: boolean; color?: string }) {
  if (!isActive) return null;
  const bars = [0.4, 0.65, 1.0, 0.75, 1.0, 0.55, 0.4];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex items-center justify-center gap-[3px] px-3"
    >
      {bars.map((mult, i) => (
        <motion.div key={i} className="w-[3px] rounded-full" style={{ background: color }}
          animate={{ height: `${Math.max(4, audioLevel * mult * 0.28 + 5)}px` }}
          transition={{ duration: 0.08, delay: i * 0.015, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
