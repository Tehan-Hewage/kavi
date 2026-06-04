"use client";

import React from "react";
import { motion } from "framer-motion";

// Context-aware chip sets
export const CHIP_SETS = {
  initial: [
    { label: "Birthday cakes",   icon: "🎂", message: "Show me birthday cakes"            },
    { label: "Send flowers",     icon: "💐", message: "I want to send flowers"             },
    { label: "Electronics",      icon: "📱", message: "Browse electronics"                 },
    { label: "Track my order",   icon: "📦", message: "Track my order"                     },
    { label: "Gift ideas",       icon: "🎁", message: "I need a gift idea under Rs 3,000"   },
    { label: "Chocolates",       icon: "🍫", message: "Show me chocolates"                 },
  ],
  afterSearch: [
    { label: "Add to cart",      icon: "🛒", message: "Add the first product to my cart"   },
    { label: "More options",     icon: "🔍", message: "Show me more options"                },
    { label: "Check delivery",   icon: "🚚", message: "Check delivery to Colombo"          },
    { label: "Different budget", icon: "💰", message: "Show me cheaper options"             },
  ],
  afterCart: [
    { label: "Checkout",         icon: "✅", message: "I'm ready to checkout"              },
    { label: "Add gift message", icon: "💌", message: "Add a gift message"                  },
    { label: "Keep shopping",    icon: "🛍", message: "I want to add more items"            },
  ],
  afterOrder: [
    { label: "Track this order", icon: "📍", message: "Track my order"                     },
    { label: "Shop again",       icon: "🛒", message: "I want to buy something else"        },
  ],
};

interface SuggestionChipsProps {
  chips: { label: string; icon: string; message: string }[];
  onSelect: (message: string) => void;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  chips,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 px-4 py-2 overflow-x-auto scroll-x flex-nowrap md:flex-wrap no-scrollbar"
    >
      {chips.map((chip, i) => (
        <motion.button
          key={chip.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(chip.message)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap"
          style={{
            background: "var(--bg-surface)",
            border:     "1px solid var(--border-subtle)",
            color:      "var(--text-secondary)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-purple)";
            (e.currentTarget as HTMLElement).style.color       = "var(--brand-purple)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
            (e.currentTarget as HTMLElement).style.color       = "var(--text-secondary)";
          }}
        >
          <span>{chip.icon}</span>
          <span>{chip.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};
export default SuggestionChips;
