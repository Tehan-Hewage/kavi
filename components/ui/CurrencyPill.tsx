"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrency, SupportedCurrency } from "@/components/providers/CurrencyProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

const CURRENCY_OPTIONS: { value: SupportedCurrency; label: string; flag: string }[] = [
  { value: "LKR", label: "LKR",  flag: "🇱🇰" },
  { value: "USD", label: "USD",  flag: "🇺🇸" },
  { value: "GBP", label: "GBP",  flag: "🇬🇧" },
  { value: "AUD", label: "AUD",  flag: "🇦🇺" },
  { value: "CAD", label: "CAD",  flag: "🇨🇦" },
  { value: "EUR", label: "EUR",  flag: "🇪🇺" },
];

export const CurrencyPill: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = CURRENCY_OPTIONS.find((o) => o.value === currency)!;

  return (
    <div ref={ref} className="relative">
      {/* Trigger button — matches LanguagePill style */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-colors duration-200 select-none"
        style={{
          background: "rgba(255,255,255,0.18)",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.25)",
          whiteSpace: "nowrap",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{active.flag}</span>
        <span>{active.label}</span>
        <ChevronDown
          size={10}
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            className="absolute right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl z-[9999]"
            style={{
              minWidth: "130px",
              background: "rgba(30, 10, 50, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {CURRENCY_OPTIONS.map((opt) => {
              const isActive = currency === opt.value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => { setCurrency(opt.value); setOpen(false); }}
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
                  <span className="flex items-center gap-2">
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </span>
                  {isActive && <Check size={11} style={{ color: "#FFD700" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencyPill;
