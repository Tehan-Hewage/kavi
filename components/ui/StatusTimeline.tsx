"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Package, Truck, Home, XCircle, Calendar, User, Navigation } from "lucide-react";

interface TimelineEvent {
  event: string;
  timestamp: string;
}

interface StatusTimelineProps {
  status: "pending" | "confirmed" | "processing" | "out_for_delivery" | "delivered" | "cancelled";
  timeline: TimelineEvent[];
  estimatedDelivery?: string;
  recipient?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  status,
  timeline = [],
  estimatedDelivery,
  recipient,
}) => {
  const statuses = [
    { key: "pending", label: "Order Pending", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "processing", label: "Processing", icon: Package },
    { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Home },
  ];

  const getStatusIndex = (s: string) => {
    return statuses.findIndex((item) => item.key === s);
  };

  const currentIndex = getStatusIndex(status);
  const isCancelled = status === "cancelled";

  return (
    <div className="bg-white/95 dark:bg-[#1E1136]/95 border border-purple-100/80 dark:border-purple-800/40 rounded-2xl p-5 shadow-[0_4px_24px_rgba(76,29,110,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md max-w-md w-full my-3">
      {/* Header Bar */}
      <div className="border-b border-gray-100 dark:border-purple-900/40 pb-3.5 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-700 dark:text-purple-300">
              <Navigation size={14} className="rotate-45" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200">
              Order Tracking Status
            </h4>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50 uppercase">
            Live
          </span>
        </div>

        {(recipient || estimatedDelivery) && (
          <div className="mt-3 space-y-1.5 pt-2 border-t border-gray-100/60 dark:border-purple-900/20 text-xs">
            {recipient && (
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-purple-200/80">
                <User size={13} className="text-purple-500 dark:text-purple-400 flex-shrink-0" />
                <span>Recipient: <strong className="text-gray-900 dark:text-white">{recipient}</strong></span>
              </div>
            )}
            {estimatedDelivery && (
              <div className="flex items-center gap-1.5 text-purple-800 dark:text-yellow-300 font-semibold">
                <Calendar size={13} className="text-purple-600 dark:text-yellow-400 flex-shrink-0" />
                <span>
                  Est. Delivery: {new Date(estimatedDelivery).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Steps List */}
      <div className="space-y-6 relative">
        {isCancelled ? (
          <div className="flex gap-4 items-start relative z-10 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400 flex-shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Order Cancelled</p>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5">This order has been cancelled.</p>
            </div>
          </div>
        ) : (
          statuses.map((item, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const isFuture = idx > currentIndex;
            const Icon = item.icon;

            // Find matching event from timeline
            const timelineMatch = timeline.find(
              (t) =>
                t.event.toLowerCase().includes(item.key.toLowerCase()) ||
                (item.key === "pending" && t.event.toLowerCase().includes("created"))
            );

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.28 }}
                className="flex gap-3.5 items-start relative"
              >
                {/* Connecting Line Segment */}
                {idx < statuses.length - 1 && (
                  <div
                    className={`absolute left-[19px] top-10 bottom-[-24px] w-[2px] transition-colors ${
                      idx < currentIndex
                        ? "bg-purple-600 dark:bg-purple-500"
                        : "bg-gray-200 dark:bg-purple-950/60"
                    }`}
                  />
                )}

                {/* Node Icon Container */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                      isActive
                        ? "scale-105 bg-purple-700 dark:bg-purple-600 text-white ring-4 ring-yellow-400/40 dark:ring-yellow-400/30 border-2 border-yellow-400 shadow-[0_0_16px_rgba(255,199,0,0.35)]"
                        : isCompleted
                        ? "bg-purple-600 dark:bg-purple-700 text-white shadow-sm border border-purple-500/40"
                        : "bg-gray-100 dark:bg-purple-950/40 text-gray-400 dark:text-purple-400/40 border border-gray-200 dark:border-purple-900/30"
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>

                  {/* Active dot pulse ring */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-[-5px] rounded-full border-2 border-yellow-400 z-0 pointer-events-none"
                      animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </div>

                {/* Label & Details */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-bold transition-colors ${
                        isActive
                          ? "text-purple-900 dark:text-yellow-300"
                          : isCompleted
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-purple-400/50"
                      }`}
                    >
                      {item.label}
                    </p>
                    {isActive && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-yellow-100 dark:bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 uppercase tracking-wider">
                        Current
                      </span>
                    )}
                  </div>

                  {timelineMatch ? (
                    <div className="mt-0.5">
                      <p className="text-xs text-gray-600 dark:text-purple-200/90 font-medium">
                        {timelineMatch.event}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-purple-400/60 mt-0.5">
                        {new Date(timelineMatch.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ) : isActive ? (
                    <p className="text-xs text-purple-700 dark:text-yellow-200/90 font-semibold mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                      In progress right now
                    </p>
                  ) : isCompleted ? (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Completed
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-purple-400/40 mt-0.5">Pending</p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default StatusTimeline;
