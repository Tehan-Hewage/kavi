"use client";
import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function OutlineButton({ children, onClick, size = "md", fullWidth }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-1.5 font-semibold
        border transition-all duration-200
        border-purple-600/40 dark:border-purple-400/50
        text-purple-700 dark:text-purple-200
        bg-purple-50/50 dark:bg-purple-950/30
        hover:bg-purple-100/80 dark:hover:bg-purple-900/50
        hover:border-purple-600 dark:hover:border-purple-400
        ${size === "sm" ? "px-3 py-1.5 text-xs rounded-xl" :
          size === "lg" ? "px-6 py-3 text-base rounded-2xl" :
          "px-4 py-2 text-sm rounded-xl"}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {children}
    </motion.button>
  );
}
export default OutlineButton;
