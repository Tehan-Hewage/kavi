"use client";

import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowUp, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/hooks/useVoice";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const { t, language } = useLanguage();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice hook — transcript auto-fills and submits
  const { status: voiceStatus, isListening, errorMsg, startListening, stopListening, supported: voiceSupported } =
    useVoice({
      language,
      onTranscript: (text: string) => {
        // Fill textarea and immediately send
        setValue(text);
        setTimeout(() => {
          onSend(text);
          setValue("");
        }, 0);
      },
    });

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

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const isEmpty = !value.trim();
  const canSend = !isEmpty && !disabled && !isListening;
  const isLoading = disabled;
  const placeholderText = isListening
    ? "Listening… speak now 🎙"
    : errorMsg
    ? errorMsg
    : t.placeholder;

  return (
    <div
      className="flex items-center gap-2 p-3 border shadow-sm transition-all duration-200"
      style={{
        background:   "var(--bg-surface)",
        borderColor:  isListening ? "#e74c3c" : "var(--input-border)",
        borderRadius: "20px",
        boxShadow: isListening
          ? "0 0 0 3px rgba(231,76,60,0.25)"
          : undefined,
      }}
      onFocus={() => {
        if (textareaRef.current && !isListening) {
          const el = textareaRef.current.parentElement!;
          el.style.borderColor = "var(--input-focus-border)";
          el.style.boxShadow = "var(--input-focus-shadow)";
        }
      }}
      onBlur={() => {
        if (textareaRef.current && !isListening) {
          const el = textareaRef.current.parentElement!;
          el.style.borderColor = "var(--input-border)";
          el.style.boxShadow = "none";
        }
      }}
    >
      {/* Mic button — show only when supported */}
      {voiceSupported && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleMicClick}
          disabled={disabled}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center relative disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: isListening
              ? "rgba(231,76,60,0.12)"
              : "var(--bg-muted, rgba(0,0,0,0.06))",
            transition: "background 0.2s",
          }}
        >
          {/* Pulsing ring while listening */}
          {isListening && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.span
                key="mic-on"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MicOff size={16} className="text-red-500" />
              </motion.span>
            ) : (
              <motion.span
                key="mic-off"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Mic size={16} style={{ color: "var(--text-secondary, #888)" }} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isListening}
        placeholder={placeholderText}
        className="flex-1 max-h-40 bg-transparent resize-none border-0 text-sm font-semibold focus:outline-none focus:ring-0 py-1 px-2 no-scrollbar"
        style={{
          color: isListening ? "var(--text-secondary)" : "var(--text-primary)",
          transition: "color 0.2s",
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
