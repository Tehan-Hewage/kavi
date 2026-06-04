"use client";
import { motion } from "framer-motion";

interface ChipProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

export function ChipButton({ icon, label, onClick }: ChipProps) {
  return (
    <motion.button
      whileHover={{
        scale:       1.04,
        background:  "var(--k-purple-tint2)",
        borderColor: "var(--k-purple)",
        color:       "var(--k-purple)",
        boxShadow:   "0 2px 12px rgba(76,29,110,0.15)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2
                 rounded-full text-sm font-medium whitespace-nowrap border cursor-pointer"
      style={{
        background:  "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        color:       "var(--text-secondary)",
      }}
    >
      <span className="text-base">{icon}</span>
      {label}
    </motion.button>
  );
}
export default ChipButton;
