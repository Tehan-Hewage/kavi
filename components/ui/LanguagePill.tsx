"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Language } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

const OPTIONS: { value: Language; label: string; short: string }[] = [
  { value: "en",       label: "English",  short: "EN"  },
  { value: "si",       label: "සිංහල",    short: "සිං" },
  { value: "ta",       label: "தமிழ்",    short: "த"   },
  { value: "tanglish", label: "Tanglish", short: "Ta"  },
];

export const LanguagePill: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click (mobile dropdown only)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = OPTIONS.find((o) => o.value === language)!;

  return (
    <div ref={ref} className="relative">

      {/* ── MOBILE: dropdown trigger (hidden on sm+) ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-colors duration-200 select-none"
        style={{
          background: "rgba(255,255,255,0.18)",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.25)",
          whiteSpace: "nowrap",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{active.short}</span>
        <ChevronDown
          size={10}
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* ── MOBILE: dropdown panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            className="sm:hidden absolute right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl z-[9999]"
            style={{
              minWidth: "130px",
              background: "rgba(30, 10, 50, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {OPTIONS.map((opt) => {
              const isActive = language === opt.value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => { setLanguage(opt.value); setOpen(false); }}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-semibold transition-colors duration-150"
                  style={{
                    color: isActive ? "#FFD700" : "rgba(255,255,255,0.85)",
                    background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <span>{opt.label}</span>
                  {isActive && <Check size={11} style={{ color: "#FFD700" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DESKTOP: original pill row (hidden below sm) ── */}
      <div
        className="hidden sm:flex items-center p-1 rounded-full gap-0.5"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        {OPTIONS.map((opt) => {
          const isActive = language === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setLanguage(opt.value)}
              className="relative px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 flex items-center justify-center"
              style={{ color: isActive ? "#4C1D6E" : "rgba(255,255,255,0.75)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default LanguagePill;
