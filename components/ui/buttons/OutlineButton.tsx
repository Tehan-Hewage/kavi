"use client";
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
      whileHover={{ scale: 1.02, background: "var(--k-purple-tint)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 font-semibold
        border-2 transition-colors
        ${size === "sm" ? "px-3.5 py-2 text-xs rounded-lg" :
          size === "lg" ? "px-7 py-3.5 text-base rounded-2xl" :
          "px-5 py-2.5 text-sm rounded-xl"}
        ${fullWidth ? "w-full" : ""}
      `}
      style={{
        background:  "transparent",
        borderColor: "var(--k-purple)",
        color:       "var(--k-purple)",
      }}
    >
      {children}
    </motion.button>
  );
}
export default OutlineButton;
