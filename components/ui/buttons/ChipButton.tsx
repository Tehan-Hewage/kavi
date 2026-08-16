"use client";
import React from "react";
import { motion } from "framer-motion";

interface ChipProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

export function ChipButton({ icon, label, onClick }: ChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5
                 rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer
                 transition-all duration-200 shadow-sm
                 bg-white dark:bg-[#1E1136]/90
                 border-purple-100/90 dark:border-purple-800/50
                 text-gray-700 dark:text-purple-200
                 hover:border-purple-400 dark:hover:border-purple-400
                 hover:bg-purple-50 dark:hover:bg-purple-900/40
                 hover:text-purple-900 dark:hover:text-white"
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}
export default ChipButton;
