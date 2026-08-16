"use client";

import React from "react";
import { motion } from "framer-motion";

// Context-aware smart follow-up chip sets
export const CHIP_SETS = {
  initial: [
    { label: "Birthday cakes",       icon: "🎂", message: "Show me birthday cakes"            },
    { label: "Send flowers",         icon: "💐", message: "I want to send flowers"             },
    { label: "Electronics",          icon: "📱", message: "Browse electronics"                 },
    { label: "Track my order",       icon: "📦", message: "Track my order"                     },
    { label: "Gift ideas",           icon: "🎁", message: "I need a gift idea under Rs 3,000"   },
    { label: "Chocolates",           icon: "🍫", message: "Show me chocolates"                 },
  ],
  afterSearch: [
    { label: "Add matching flowers", icon: "💐", message: "Show me flowers to go with this" },
    { label: "Add gift note",        icon: "✍️", message: "Add a free personalized gift card" },
    { label: "Check delivery",       icon: "🚚", message: "Check delivery fee and cutoff"     },
    { label: "Under Rs 3,000",       icon: "💰", message: "Show me options under Rs 3,000"    },
    { label: "More options",         icon: "🔍", message: "Show me more product options"       },
  ],
  afterCart: [
    { label: "Checkout now",         icon: "💳", message: "I'm ready to checkout"              },
    { label: "Add chocolates",       icon: "🍫", message: "Add chocolates to my cart"         },
    { label: "Check delivery date",  icon: "📅", message: "Check delivery date options"        },
    { label: "Keep browsing",        icon: "🛍️", message: "Show me popular gift hampers"       },
  ],
  afterOrder: [
    { label: "Track this order",     icon: "📍", message: "Track my order"                     },
    { label: "Order again",          icon: "🔁", message: "I want to reorder this"             },
    { label: "Browse birthday gifts",icon: "🎂", message: "Show me birthday gifts"            },
  ],
};

import ChipButton from "./buttons/ChipButton";

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
      className="flex gap-2 px-1 py-1 overflow-x-auto flex-nowrap no-scrollbar scroll-smooth items-center w-full"
    >
      {chips.map((chip, i) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className="flex-shrink-0"
        >
          <ChipButton
            icon={chip.icon}
            label={chip.label}
            onClick={() => onSelect(chip.message)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
export default SuggestionChips;
