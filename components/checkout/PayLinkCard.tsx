"use client";

import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle } from "lucide-react";
import { YellowButton } from "@/components/ui/buttons/YellowButton";
import { CurrencyContext } from "@/components/providers/CurrencyProvider";

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
  const currencyCtx = useContext(CurrencyContext);
  const currency = currencyCtx ? currencyCtx.currency : "LKR";

  useEffect(() => {
    const end  = new Date(expiresAt).getTime();
    const tick = () => setSecondsLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const isExpired = secondsLeft === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      data-testid="pay-link-card"
      className="w-full max-w-sm rounded-3xl overflow-hidden my-3 text-white border-2"
      style={{
        background:   "linear-gradient(135deg, #4C1D6E 0%, #6B2D96 100%)",
        borderColor:  "rgba(255, 199, 0, 0.5)",
        boxShadow:    "0 8px 32px rgba(76, 29, 110, 0.4)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="font-bold text-sm">✓ Order Confirmed!</span>
        </div>
        <span className="text-xs font-semibold opacity-75">#{orderId}</span>
      </div>

      {/* Items List */}
      <div className="px-5 py-4 flex flex-col gap-2 border-b border-white/10 text-xs">
        {items && items.length > 0 ? (
          items.map((item, i) => (
            <div key={i} className="flex justify-between font-medium">
              <span className="opacity-90">{item.name} × {item.quantity}</span>
              <span>
                {currency === "USD"
                  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price)
                  : `Rs ${item.price.toLocaleString("en-LK")}`}
              </span>
            </div>
          ))
        ) : (
          <p className="italic opacity-50">Guest Checkout Items</p>
        )}
        
        <div className="flex justify-between font-medium">
          <span className="opacity-90">Delivery</span>
          <span>
            {currency === "USD"
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(delivery)
              : `Rs ${delivery.toLocaleString("en-LK")}`}
          </span>
        </div>

        <div className="border-t border-white/10 pt-2 mt-1 flex justify-between font-bold text-sm">
          <span>Total</span>
          <span className="text-yellow-300">
            {currency === "USD"
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)
              : `Rs ${total.toLocaleString("en-LK")}`}
          </span>
        </div>
      </div>

      {/* Timer + Checkout Button */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {!isExpired && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-yellow-300">
              <Clock size={14} />
              <span>⏱ Pay within:</span>
            </div>
            <span className="font-mono font-bold text-sm text-yellow-300 bg-white/10 px-2 py-0.5 rounded">
              [ {mins}:{secs} ]
            </span>
          </div>
        )}

        {isExpired ? (
          <p className="text-xs text-red-300 font-bold text-center">
            This order link has expired. Ask Kavi to create a new one.
          </p>
        ) : (
          <YellowButton
            size="lg"
            fullWidth
            isPay
            href={payUrl}
            icon={<span>🔒</span>}
          >
            PAY NOW ON KAPRUKA.COM →
          </YellowButton>
        )}

        <p className="text-center text-[10px] opacity-50">
          Secure payment on Kapruka.com
        </p>
      </div>
    </motion.div>
  );
};
export default PayLinkCard;
