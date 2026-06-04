"use client";
import { motion } from "framer-motion";

interface IconButtonProps {
  icon: React.ReactNode;
  badge?: number;
  onClick?: () => void;
  label?: string;
}

export function IconButton({ icon, badge, onClick, label }: IconButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1,  background: "rgba(255,255,255,0.15)" }}
      whileTap={  { scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      onClick={onClick}
      aria-label={label}
      className="relative w-10 h-10 rounded-full flex items-center justify-center"
      style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}
    >
      {icon}
      {/* Animated badge */}
      {badge != null && badge > 0 && (
        <motion.span
          key={badge}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                     flex items-center justify-center text-[10px] font-bold"
          style={{ background: "#FFC700", color: "#1A1000" }}
        >
          {badge > 9 ? "9+" : badge}
        </motion.span>
      )}
    </motion.button>
  );
}
export default IconButton;
