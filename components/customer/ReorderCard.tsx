"use client";
import React from "react";
import { motion } from "framer-motion";
import { YellowButton } from "@/components/ui/buttons/YellowButton";
import { RotateCcw, Sparkles } from "lucide-react";

export function ReorderCard({
  itemName,
  onReorder,
}: {
  itemName: string;
  onReorder: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid="reorder-card"
      className="flex items-center justify-between gap-3 p-3.5 rounded-2xl my-2 max-w-md w-full bg-white/95 dark:bg-[#1E1136]/95 border border-purple-100 dark:border-purple-800/40 shadow-sm hover:shadow-md backdrop-blur-md"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-50 dark:bg-purple-900/50 border border-purple-100 dark:border-purple-800/60">
          <RotateCcw size={15} className="text-purple-600 dark:text-purple-300" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
              Buy this again?
            </p>
            <Sparkles size={11} className="text-amber-400" />
          </div>
          <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">
            {itemName}
          </p>
        </div>
      </div>
      <YellowButton size="sm" onClick={onReorder}>
        Reorder
      </YellowButton>
    </motion.div>
  );
}
