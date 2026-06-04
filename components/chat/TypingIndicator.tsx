"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypingIndicatorProps {
  show: boolean;
  toolName?: string;   // e.g. "kapruka_search_products"
}

// Map tool names to friendly labels
const TOOL_LABELS: Record<string, string> = {
  kapruka_search_products:      "Searching Kapruka catalog...",
  kapruka_list_categories:      "Loading categories...",
  kapruka_get_product:         "Getting product details...",
  kapruka_check_delivery:      "Checking delivery availability...",
  kapruka_create_order:        "Creating your order...",
  kapruka_track_order:         "Looking up your order...",
  kapruka_list_delivery_cities: "Looking up delivery cities...",
};

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  show,
  toolName,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4, transition: { duration: 0.15 } }}
          className="flex items-end gap-3 mb-4"
        >
          {/* Kavi avatar */}
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
            style={{ background: "var(--brand-purple)" }}
          >
            K
          </div>

          <div
            className="px-4 py-3 flex items-center gap-3 border border-gray-100 dark:border-gray-800/80"
            style={{
              background:   "var(--agent-bubble)",
              borderRadius: "4px 20px 20px 20px",
              boxShadow:    "var(--shadow-card)",
            }}
          >
            {/* Three bouncing dots */}
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full block"
                  style={{ background: "var(--brand-purple)" }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Tool activity label */}
            {toolName && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-semibold"
                style={{ color: "var(--text-tertiary)" }}
              >
                {TOOL_LABELS[toolName] ?? "Thinking..."}
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default TypingIndicator;
