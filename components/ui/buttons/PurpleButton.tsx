"use client";
import { motion } from "framer-motion";
import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function PurpleButton({ children, onClick, disabled, size = "md", fullWidth, loading, icon }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // Ripple effect
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const circle = document.createElement("span");
    const rect   = btn.getBoundingClientRect();
    circle.className = "ripple-circle";
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top  = `${e.clientY - rect.top}px`;
    btn.appendChild(circle);
    circle.addEventListener("animationend", () => circle.remove());
    onClick?.();
  };

  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-7 py-3.5 text-base rounded-2xl",
  }[size];

  return (
    <motion.button
      ref={btnRef}
      whileHover={disabled ? {} : { scale: 1.02, boxShadow: "0 6px 20px rgba(76,29,110,0.35)" }}
      whileTap={disabled   ? {} : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={disabled || loading ? undefined : handleRipple}
      disabled={disabled || loading}
      className={`
        relative ripple-container overflow-hidden
        flex items-center justify-center gap-2
        font-semibold transition-colors
        ${sizeClasses}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={{
        background:  disabled ? "#9A9A9A" : "linear-gradient(135deg, #4C1D6E 0%, #6B2D96 100%)",
        color:       "#FFFFFF",
        border:      "none",
      }}
      // Hover gradient shift via CSS
      onMouseEnter={e => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLElement).style.background =
            "linear-gradient(135deg, #3A1254 0%, #4C1D6E 100%)";
        }
      }}
      onMouseLeave={e => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLElement).style.background =
            "linear-gradient(135deg, #4C1D6E 0%, #6B2D96 100%)";
        }
      }}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
export default PurpleButton;
