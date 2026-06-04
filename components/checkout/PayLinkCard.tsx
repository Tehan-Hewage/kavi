"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Clock, CheckCircle } from "lucide-react";

interface PayLinkProps {
  orderId:   string;
  payUrl:    string;
  expiresAt: string;    // ISO string
  items:     { name: string; quantity: number; price: number }[];
  total:     number;
  delivery:  number;
}

export const PayLinkCard: React.FC<PayLinkProps> = ({
  orderId,
  payUrl,
  expiresAt,
  items,
  total,
  delivery,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const end  = new Date(expiresAt).getTime();
    const tick = () => setSecondsLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const isExpired    = secondsLeft === 0;
  const isUrgent     = secondsLeft < 300; // < 5 minutes

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm rounded-3xl overflow-hidden my-3"
      style={{
        background:  "var(--bg-surface)",
        border:      `2px solid ${isUrgent && !isExpired ? "#E53E3E" : "var(--brand-yellow)"}`,
        boxShadow:   "0 4px 20px rgba(245,197,24,0.25)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ background: "var(--brand-yellow-light, #FFF9E0)" }}
      >
        <CheckCircle size={20} style={{ color: "#0E7A4F" }} />
        <div>
          <p className="font-bold text-sm text-gray-800 dark:text-gray-900">
            Order Created!
          </p>
          <p className="text-xs font-semibold text-gray-500">
            #{orderId}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4 flex flex-col gap-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        {items && items.length > 0 ? (
          items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs font-semibold">
              <span style={{ color: "var(--text-secondary)" }}>
                {item.name} × {item.quantity}
              </span>
              <span style={{ color: "var(--text-primary)" }}>
                Rs {item.price.toLocaleString("en-LK")}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 italic">Guest Checkout Items</p>
        )}
        <div className="flex justify-between text-xs font-semibold">
          <span style={{ color: "var(--text-secondary)" }}>Delivery</span>
          <span style={{ color: "var(--text-primary)" }}>Rs {delivery.toLocaleString("en-LK")}</span>
        </div>
        <div
          className="flex justify-between font-extrabold text-sm md:text-base pt-2 mt-1 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <span style={{ color: "var(--text-primary)" }}>Total</span>
          <span style={{ color: "var(--brand-purple)" }}>
            Rs {total.toLocaleString("en-LK")}
          </span>
        </div>
      </div>

      {/* Timer + CTA */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {/* Countdown */}
        {!isExpired && (
          <div className="flex items-center gap-2">
            <Clock size={14} style={{ color: isUrgent ? "#E53E3E" : "var(--text-secondary)" }} />
            <span
              className="text-xs font-bold"
              style={{ color: isUrgent ? "#E53E3E" : "var(--text-secondary)" }}
            >
              Pay within:
            </span>
            <span
              className="font-mono font-black text-base"
              style={{ color: isUrgent ? "#E53E3E" : "var(--brand-purple)" }}
            >
              {mins}:{secs}
            </span>
          </div>
        )}

        {isExpired && (
          <p className="text-xs text-red-500 font-bold">
            This link has expired. Ask Kavi to create a new one.
          </p>
        )}

        {/* Pay Now button */}
        {!isExpired && (
          <motion.a
            whileTap={{ scale: 0.97 }}
            href={payUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full py-4 rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-2 overflow-hidden shadow-md"
            style={{
              background: "var(--brand-yellow)",
              color:      "#1A1400",
            }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            PAY NOW
            <ExternalLink size={16} />
          </motion.a>
        )}

        <p
          className="text-center text-[10px] font-bold"
          style={{ color: "var(--text-tertiary)" }}
        >
          Secure payment on Kapruka.com
        </p>
      </div>
    </motion.div>
  );
};
export default PayLinkCard;
