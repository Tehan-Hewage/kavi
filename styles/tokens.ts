// styles/tokens.ts

export const tokens = {

  // ─── Brand Colors ───────────────────────────────────────────
  brand: {
    purple: "#4A3AE8",   // Kapruka primary - all CTAs, agent bubbles
    purpleDark: "#3528C7",   // hover state
    purpleLight: "#EEF0FF",   // tints, backgrounds
    purpleMid: "#7B6FF0",   // subtle accents

    yellow: "#F5C518",   // Kapruka accent - pay button, highlights
    yellowDark: "#D4A514",   // hover
    yellowLight: "#FFF9E0",   // tint backgrounds
  },

  // ─── Semantic Colors (light mode) ───────────────────────────
  light: {
    bgPage: "#F7F7FB",   // entire page background
    bgSurface: "#FFFFFF",   // cards, bubbles, panels
    bgSubtle: "#F0F0F7",   // input bg, secondary surfaces
    bgOverlay: "rgba(0,0,0,0.4)",

    textPrimary: "#0E0D1A",   // headings, body
    textSecondary: "#5C5A7A",   // muted labels
    textTertiary: "#9896B4",   // placeholders, timestamps

    borderSubtle: "#E4E3F2",   // card borders
    borderStrong: "#C4C2E0",   // focused inputs

    userBubble: "#4A3AE8",   // user message bg
    userBubbleText: "#FFFFFF",
    agentBubble: "#FFFFFF",   // agent message bg
    agentBubbleText: "#0E0D1A",

    toolChip: "#EEF0FF",   // "searching products..." chip bg
    toolChipText: "#3528C7",

    success: "#0E7A4F",
    successBg: "#E8F8F0",
    warning: "#92610A",
    warningBg: "#FFF8E6",
    error: "#C0392B",
    errorBg: "#FDF0EE",
  },

  // ─── Semantic Colors (dark mode) ────────────────────────────
  dark: {
    bgPage: "#0C0B17",
    bgSurface: "#161526",
    bgSubtle: "#1E1D32",
    bgOverlay: "rgba(0,0,0,0.6)",

    textPrimary: "#EEEDF8",
    textSecondary: "#9896B4",
    textTertiary: "#5C5A7A",

    borderSubtle: "#2A2840",
    borderStrong: "#4A3AE8",

    userBubble: "#4A3AE8",
    userBubbleText: "#FFFFFF",
    agentBubble: "#1E1D32",
    agentBubbleText: "#EEEDF8",

    toolChip: "#1E1D32",
    toolChipText: "#7B6FF0",

    success: "#34D399",
    successBg: "#052E1A",
    warning: "#FBD38D",
    warningBg: "#2D1F00",
    error: "#FC8181",
    errorBg: "#2D0A0A",
  },

  // ─── Typography ─────────────────────────────────────────────
  font: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    sinhala: "'Noto Sans Sinhala', 'Inter', sans-serif",
    tamil: "'Noto Sans Tamil', 'Inter', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  // ─── Font Sizes ─────────────────────────────────────────────
  text: {
    xs: "11px",
    sm: "13px",
    base: "15px",
    md: "16px",
    lg: "18px",
    xl: "22px",
    "2xl": "28px",
    "3xl": "36px",
  },

  // ─── Spacing ────────────────────────────────────────────────
  space: {
    1: "4px", 2: "8px", 3: "12px", 4: "16px",
    5: "20px", 6: "24px", 8: "32px", 10: "40px",
    12: "48px", 16: "64px",
  },

  // ─── Border Radius ──────────────────────────────────────────
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "20px",
    "2xl": "28px",
    full: "9999px",
  },

  // ─── Shadows ────────────────────────────────────────────────
  shadow: {
    sm: "0 1px 3px rgba(74,58,232,0.08), 0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 16px rgba(74,58,232,0.12), 0 2px 8px rgba(0,0,0,0.08)",
    lg: "0 12px 40px rgba(74,58,232,0.16), 0 4px 16px rgba(0,0,0,0.10)",
    card: "0 2px 8px rgba(74,58,232,0.08)",
  },

  // ─── Animation Durations ────────────────────────────────────
  duration: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
    slower: "600ms",
  },

  easing: {
    spring: "cubic-bezier(0.16, 1, 0.3, 1)",
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};
