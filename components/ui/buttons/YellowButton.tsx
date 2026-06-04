"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Check } from "lucide-react";

interface Props {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  showSuccess?: boolean;   // shows ✓ checkmark after click
  successText?: string;    // Custom success state text
  icon?: React.ReactNode;
  isPay?: boolean;         // enables the shine sweep animation
  href?: string;           // Optional link URL
}

export function YellowButton({
  children, onClick, disabled, size = "md",
  fullWidth, loading, showSuccess, successText, icon, isPay, href
}: Props) {
  const btnRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const [success, setSuccess] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    // Ripple
    const btn  = btnRef.current;
    if (btn) {
      const circle = document.createElement("span");
      const rect   = btn.getBoundingClientRect();
      circle.className = "ripple-circle";
      circle.style.background = "rgba(76,29,110,0.2)";  // purple ripple on yellow
      circle.style.left = `${e.clientX - rect.left}px`;
      circle.style.top  = `${e.clientY - rect.top}px`;
      btn.appendChild(circle);
      circle.addEventListener("animationend", () => circle.remove());
    }

    // Success state
    if (showSuccess) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1800);
    }

    onClick?.(e);
  };

  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-7 py-3.5 text-base rounded-2xl",
  }[size];

  const commonProps = {
    ref: btnRef,
    whileHover: disabled ? {} : {
      scale:     1.03,
      boxShadow: "0 6px 24px rgba(255,199,0,0.5)",
    },
    whileTap: disabled ? {} : { scale: 0.95 },
    transition: { type: "spring", stiffness: 420, damping: 18 },
    onClick: handleClick,
    className: `
      relative ripple-container overflow-hidden
      flex items-center justify-center gap-2
      font-bold transition-colors
      ${isPay ? "shine-sweep" : ""}
      ${sizeClasses}
      ${fullWidth ? "w-full" : ""}
      ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `,
    style: {
      background: success ? "#1A7A4A" : "#FFC700",
      color:      success ? "#FFFFFF" : "#1A1000",
      border:     "none",
      transition: "background 0.3s ease, color 0.3s ease",
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled && !loading && !success) {
        (e.currentTarget as HTMLElement).style.background = "#E6B400";
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled && !loading && !success) {
        (e.currentTarget as HTMLElement).style.background = "#FFC700";
      }
    }
  };

  const content = (
    <div className="flex items-center gap-2 justify-center">
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-k-yellow-text/30 border-t-k-yellow-text rounded-full"
        />
      ) : success ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex items-center gap-2 justify-center"
        >
          <Check size={16} className="text-white" />
          <span className="text-white">{successText || "Added!"}</span>
        </motion.div>
      ) : (
        <div className="flex items-center gap-2 justify-center">
          {icon && <span>{icon}</span>}
          {children}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...(commonProps as any)}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      disabled={disabled || loading}
      {...(commonProps as any)}
    >
      {content}
    </motion.button>
  );
}
export default YellowButton;
