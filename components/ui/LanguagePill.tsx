"use client";

import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Language } from "@/lib/types";
import { motion } from "framer-motion";

export const LanguagePill: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const options: { value: Language; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "si", label: "සිංහල" },
    { value: "ta", label: "தமிழ்" },
    { value: "tanglish", label: "Tanglish" }
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
      {options.map((opt) => {
        const isActive = language === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setLanguage(opt.value)}
            className={`relative px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeLang"
                className="absolute inset-0 bg-kapruka-purple rounded-full -z-0"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
