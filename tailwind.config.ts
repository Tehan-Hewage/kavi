import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple:       "#4A3AE8",
          "purple-dark":"#3528C7",
          "purple-mid": "#7B6FF0",
          "purple-light":"#EEF0FF",
          yellow:       "#F5C518",
          "yellow-dark":"#D4A514",
          "yellow-light":"#FFF9E0",
        },
      },
      fontFamily: {
        sans:    ["Inter", "-apple-system", "sans-serif"],
        sinhala: ["Noto Sans Sinhala", "Inter", "sans-serif"],
        tamil:   ["Noto Sans Tamil",   "Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "28px",
      },
      animation: {
        "fade-up":       "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1)",
        "fade-in":       "fadeIn 0.2s ease-out",
        "slide-right":   "slideRight 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-up":      "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
        "scale-in":      "scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        "bounce-light":  "bounceLight 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        "shimmer":       "shimmer 1.5s ease-in-out infinite",
        "pulse-slow":    "pulse 3s ease-in-out infinite",
        "typing-dot":    "typingDot 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideRight: {
          "0%":   { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideUp: {
          "0%":   { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        scaleIn: {
          "0%":   { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        bounceLight: {
          "0%":   { transform: "scale(0.95)" },
          "60%":  { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)" },
        },
        typingDot: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%":            { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        "card":  "0 2px 8px rgba(74,58,232,0.08)",
        "card-hover": "0 8px 24px rgba(74,58,232,0.16)",
        "modal": "0 24px 64px rgba(0,0,0,0.24)",
        "pay":   "0 4px 20px rgba(245,197,24,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
