"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import CartItem from "./CartItem";
import { YellowButton } from "@/components/ui/buttons/YellowButton";
import { IconButton } from "@/components/ui/buttons/IconButton";

const drawerVariants = {
  closed: { x: "100%", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  open:   { x: 0,      transition: { duration: 0.4,  ease: [0.16, 1, 0.3, 1] } },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open:   { opacity: 1 },
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  onProceedToCheckout,
}: CartDrawerProps) {
  const { cart: items, cartSubtotal: total } = useCart();
  const { formatPrice } = useCurrency();
  
  // Delivery fee is always LKR 350 — formatPrice converts it for display
  const deliveryFee = items.length > 0 ? 350 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{
              width:      "min(380px, 100vw)",
              background: "var(--bg-surface)",
              borderLeft: "1px solid var(--border-subtle)",
              boxShadow:  "var(--shadow-modal)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ background: "#4C1D6E" }}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-white" />
                <h2 className="font-bold text-base text-white">
                  Your Cart ({items.length})
                </h2>
              </div>
              <IconButton icon={<X size={18} />} onClick={onClose} label="Close cart" />
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <ShoppingBag size={48} style={{ color: "var(--border-subtle)" }} />
                  <p className="font-bold text-sm" style={{ color: "var(--text-tertiary)" }}>Your cart is empty</p>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Ask Kavi to find something!
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <CartItem key={`${item.id}-${item.variant_id || ""}`} item={item} />
                ))
              )}
            </div>

            {/* Summary + CTA */}
            {items.length > 0 && (
              <div className="border-t px-5 py-5 flex flex-col gap-4" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex flex-col gap-2 text-sm font-semibold">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                    <span style={{ color: "var(--text-primary)" }}>{formatPrice(total)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-secondary)" }}>Delivery</span>
                      <span style={{ color: "var(--text-primary)" }}>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t font-extrabold text-base" style={{ borderColor: "var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-primary)" }}>Total</span>
                    <span style={{ color: "#4C1D6E" }}>
                      {formatPrice(total + deliveryFee)}
                    </span>
                  </div>
                </div>

                <YellowButton
                  size="lg"
                  fullWidth
                  onClick={() => {
                    onClose();
                    onProceedToCheckout?.();
                  }}
                >
                  Proceed to Checkout →
                </YellowButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
