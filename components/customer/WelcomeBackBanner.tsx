"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Package, ArrowRight } from "lucide-react";
import type { CustomerDetails } from "@/lib/phase2-types";

export function WelcomeBackBanner({
  customer,
  lastOrderSummary,
  onTrackOrder,
}: {
  customer: CustomerDetails;
  lastOrderSummary?: string;
  onTrackOrder?: () => void;
}) {
  const firstName = typeof customer?.name === "string" && customer.name
    ? customer.name.split(" ")[0]
    : "there";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      data-testid="welcome-back-banner"
      className="relative overflow-hidden flex flex-col gap-2.5 px-4 py-3.5 rounded-2xl mb-3 shadow-[0_8px_24px_rgba(76,29,110,0.3)] border border-purple-400/30"
      style={{
        background: "linear-gradient(135deg, #3A1254 0%, #4C1D6E 50%, #6B2D96 100%)",
      }}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-xl border border-white/20 shadow-inner">
          👋
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-white text-sm font-bold tracking-tight">
              Welcome back, {firstName}!
            </p>
            <Sparkles size={13} className="text-amber-300 animate-pulse flex-shrink-0" />
          </div>
          {lastOrderSummary && typeof lastOrderSummary === "string" && (
            <p className="text-white/80 text-xs mt-0.5 truncate font-medium">{lastOrderSummary}</p>
          )}
        </div>
      </div>

      {onTrackOrder && (
        <button
          onClick={onTrackOrder}
          className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs text-yellow-300 font-semibold cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Package size={13} />
            <span>Active orders on your account</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/90">
            View history <ArrowRight size={11} />
          </span>
        </button>
      )}
    </motion.div>
  );
}
