"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSkeleton from "../ui/LoadingSkeleton";

interface TypingIndicatorProps {
  show: boolean;
  toolName?: string;   // e.g. "kapruka_search_products"
  hideAvatar?: boolean;
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
  hideAvatar = false,
}) => {
  const renderIndicatorContent = () => {
    if (toolName === "kapruka_search_products") {
      return (
        <div className="w-full flex-1 max-w-[85%] md:max-w-[70%]">
          <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5 px-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-kapruka-purple" />
            {TOOL_LABELS[toolName]}
          </div>
          <LoadingSkeleton layout="carousel" count={3} />
        </div>
      );
    }

    if (toolName === "kapruka_list_categories" || toolName === "kapruka_get_categories") {
      return (
        <div className="w-full flex-1 max-w-[85%] md:max-w-[70%]">
          <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5 px-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-kapruka-purple" />
            {TOOL_LABELS[toolName]}
          </div>
          <LoadingSkeleton layout="chips" count={5} />
        </div>
      );
    }

    const label = toolName ? (TOOL_LABELS[toolName] ?? "Thinking...") : "Kavi is typing...";

    return (
      <div className="flex flex-col gap-1.5 w-full max-w-[220px] md:max-w-[300px]">
        <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 px-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-kapruka-purple" />
          {label}
        </div>
        <div
          className="px-4 py-3 border border-gray-100 dark:border-gray-800/80"
          style={{
            background:   "var(--card-bg)",
            borderRadius: "4px 20px 20px 20px",
            boxShadow:    "var(--card-shadow)",
            borderLeft:   "3px solid #4C1D6E",
          }}
        >
          <LoadingSkeleton layout="message" />
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4, transition: { duration: 0.15 } }}
          className="flex items-end gap-3 mb-4 w-full"
        >
          {/* Kavi avatar */}
          {!hideAvatar ? (
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mb-1 shadow-sm"
              style={{ background: "#4C1D6E" }}
            >
              K
            </div>
          ) : (
            <div className="w-8 h-8 flex-shrink-0" />
          )}

          {renderIndicatorContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default TypingIndicator;
