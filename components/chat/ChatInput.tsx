"use client";

import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <div
      className="flex items-end gap-2 p-3 border shadow-sm transition-shadow duration-200"
      style={{
        background:   "var(--bg-surface)",
        borderColor:  "var(--border-subtle)",
        borderRadius: "20px",
      }}
      onFocus={() => {
        if (textareaRef.current) {
          textareaRef.current.parentElement!.style.borderColor = "var(--border-strong)";
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
      <button
        onClick={handleSubmit}
        disabled={isEmpty || disabled}
        className="p-2.5 text-white rounded-full shadow-sm transition-all duration-150 flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "var(--brand-purple)",
        }}
        onMouseEnter={e => {
          if (!isEmpty && !disabled) {
            e.currentTarget.style.background = "var(--brand-purple-dark)";
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "var(--brand-purple)";
        }}
      >
        {disabled ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
export default ChatInput;
