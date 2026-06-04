"use client";

import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isEmpty = !value.trim();
  const canSend = !isEmpty && !disabled;
  const isLoading = disabled;

  return (
    <div
      className="flex items-center gap-2 p-3 border shadow-sm transition-all duration-200"
      style={{
        background:   "var(--bg-surface)",
        borderColor:  "var(--input-border)",
        borderRadius: "20px",
      }}
      onFocus={() => {
        if (textareaRef.current) {
          const el = textareaRef.current.parentElement!;
          el.style.borderColor = "var(--input-focus-border)";
          el.style.boxShadow = "var(--input-focus-shadow)";
        }
      }}
      onBlur={() => {
        if (textareaRef.current) {
          const el = textareaRef.current.parentElement!;
          el.style.borderColor = "var(--input-border)";
          el.style.boxShadow = "none";
        }
      }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={t.placeholder}
        className="flex-1 max-h-40 bg-transparent resize-none border-0 text-sm font-semibold focus:outline-none focus:ring-0 py-1 px-2 no-scrollbar"
        style={{
          color: "var(--text-primary)",
        }}
      />
      <motion.button
        whileHover={canSend ? {
          scale:     1.08,
          boxShadow: "0 4px 16px rgba(76,29,110,0.4)",
        } : {}}
        whileTap={canSend ? { scale: 0.9 } : {}}
        animate={canSend ? {
          background: ["#4C1D6E", "#6B2D96", "#4C1D6E"],
        } : { background: "#D6D6D6" }}
        transition={canSend
          ? { background: { duration: 3, repeat: Infinity } }
          : { duration: 0.2 }
        }
        onClick={handleSubmit}
        disabled={!canSend}
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center disabled:cursor-not-allowed"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <motion.div key="arrow"
              initial={{ y: 4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{    y: -4, opacity: 0 }}
            >
              <ArrowUp size={18} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
export default ChatInput;
