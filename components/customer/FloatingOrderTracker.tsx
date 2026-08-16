"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, ArrowUpRight } from "lucide-react";

interface FloatingOrderTrackerProps {
  orderRef: string;
  status: string;
  location?: string;
  onClick: () => void;
}

export const FloatingOrderTracker: React.FC<FloatingOrderTrackerProps> = ({
  orderRef,
  status,
  location,
  onClick,
}) => {
  if (!orderRef) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer backdrop-blur-md"
    >
      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
      <Package size={13} className="text-yellow-300" />
      <span className="font-mono font-bold text-yellow-300">#{orderRef}</span>
      <span className="hidden sm:inline text-white/80 capitalize">· {status} {location ? `(${location})` : ""}</span>
      <ArrowUpRight size={13} className="text-white/70" />
    </motion.button>
  );
};
export default FloatingOrderTracker;
