"use client";

import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowUp, Mic, MicOff, WifiOff } from "lucide-react";
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
  // Only reveal mic button after client-side mount to avoid SSR hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Local error display state — auto-clears after 3 s
  const [showError, setShowError] = useState(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice hook — transcript auto-fills and submits
  const { isListening, errorMsg, startListening, stopListening, supported: voiceSupported, clearError } =
    useVoice({
      language,
      onTranscript: (text: string) => {
        setValue(text);
        setTimeout(() => {
          onSend(text);
          setValue("");
        }, 0);
      },
    });

  // When errorMsg appears, briefly show the error badge then auto-dismiss
  useEffect(() => {
    if (errorMsg) {
      setShowError(true);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setShowError(false);
        clearError();
      }, 3500);
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [errorMsg, clearError]);

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
      setShowError(false);
      startListening();
    }
  };

  const isEmpty = !value.trim();
  const canSend = !isEmpty && !disabled && !isListening;
  const isLoading = disabled;

  // Derive a short user-friendly error label
  const shortError =
    errorMsg?.includes("denied") ? "Mic access denied" :
    errorMsg?.includes("network") || errorMsg?.includes("Network") ? "Network error — tap to retry" :
    errorMsg ? "Voice error — tap to retry" : null;

  return (
    <div
      className="flex items-center gap-2 p-3 border shadow-sm transition-all duration-200"
      style={{
        background:   "var(--bg-surface)",
        borderColor:  isListening ? "#e74c3c" : showError ? "#e67e22" : "var(--input-border)",
        borderRadius: "20px",
        boxShadow: isListening
          ? "0 0 0 3px rgba(231,76,60,0.25)"
          : showError
          ? "0 0 0 2px rgba(230,126,34,0.2)"
          : undefined,
        transition: "border-color 0.25s, box-shadow 0.25s",
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
      {/* Mic button — only shown on client after mount (avoids SSR hydration mismatch) */}
      {mounted && voiceSupported && (
        <div className="relative flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleMicClick}
            disabled={disabled}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            className="w-9 h-9 rounded-full flex items-center justify-center relative disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: isListening
                ? "rgba(231,76,60,0.12)"
                : showError
                ? "rgba(230,126,34,0.1)"
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
              {showError ? (
                <motion.span
                  key="mic-error"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <WifiOff size={15} className="text-orange-400" />
                </motion.span>
              ) : isListening ? (
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

          {/* Error tooltip — floats above the mic button, auto-dismisses */}
          <AnimatePresence>
            {showError && shortError && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.92 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-xl pointer-events-none z-50"
                style={{
                  background: "rgba(230,126,34,0.92)",
                  color: "#fff",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {shortError}
                {/* Arrow */}
                <span
                  className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                  style={{ borderTopColor: "rgba(230,126,34,0.92)" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isListening}
        placeholder={isListening ? "Listening… speak now 🎙" : t.placeholder}
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
