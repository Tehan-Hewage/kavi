"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Package, Truck, Home, XCircle } from "lucide-react";

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
  timeline,
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
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-2xl p-5 shadow-md max-w-md w-full my-3">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          Order Tracking Status
        </h4>
        {recipient && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Recipient: <span className="font-semibold">{recipient}</span>
          </p>
        )}
        {estimatedDelivery && (
          <p className="text-xs text-[#4C1D6E] dark:text-purple-300 font-semibold mt-1">
            Est. Delivery: {new Date(estimatedDelivery).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="space-y-6 relative">
        {isCancelled ? (
          <div className="flex gap-4 items-start relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">Order Cancelled</p>
              <p className="text-xs text-gray-500 mt-0.5">This order has been cancelled.</p>
            </div>
          </div>
        ) : (
          statuses.map((item, idx) => {
            const isCompleted = idx <= currentIndex;
            const isActive = idx === currentIndex;
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="flex gap-4 items-start relative"
              >
                {/* Connecting Line Segment */}
                {idx < statuses.length - 1 && (
                  <div
                    className="absolute left-5 top-10 bottom-[-24px] w-[2px]"
                    style={{ background: idx < currentIndex ? "#4C1D6E" : "#EBEBEB" }}
                  />
                )}

                {/* Dot Container */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 ${
                      isActive ? "scale-110" : ""
                    }`}
                    style={
                      isCompleted
                        ? { background: "#4C1D6E", borderColor: "#4C1D6E", color: "#FFFFFF" }
                        : { background: "transparent", borderColor: "#EBEBEB", color: "var(--text-tertiary)" }
                    }
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Active dot pulse ring */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-[-5px] rounded-full border-2 z-0"
                      style={{ borderColor: "#FFC700" }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-bold transition-colors"
                    style={{
                      color: isActive ? "#4C1D6E" : isCompleted ? "var(--text-primary)" : "var(--text-tertiary)"
                    }}
                  >
                    {item.label}
                  </p>
                  {timelineMatch ? (
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                        {timelineMatch.event}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(timelineMatch.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ) : isCompleted ? (
                    <p className="text-xs text-gray-500 mt-0.5">Completed</p>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">Pending</p>
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
