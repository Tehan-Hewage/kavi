"use client";

import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { CurrencyContext } from "@/components/providers/CurrencyProvider";

interface FloatingCartBarProps {
  onCheckout: () => void;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  onCheckout,
  onOpenCart,
}) => {
  const { cartCount, cartSubtotal } = useCart();
  const currencyCtx = useContext(CurrencyContext);
  const formatPrice = currencyCtx ? currencyCtx.formatPrice : (p: number) => `Rs ${p.toLocaleString("en-LK")}`;

  if (cartCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(76,29,110,0.35)] border border-purple-400/40 backdrop-blur-lg"
        style={{
          background: "linear-gradient(135deg, rgba(76,29,110,0.95) 0%, rgba(107,45,150,0.95) 100%)",
        }}
      >
        {/* Left: Cart items & Total */}
        <button
          onClick={onOpenCart}
          className="flex items-center gap-2.5 text-left text-white group cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-yellow-300 border border-white/20">
            <ShoppingBag size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 text-purple-950 font-extrabold text-[10px] flex items-center justify-center">
              {cartCount}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight">
                {cartCount} {cartCount === 1 ? "Item" : "Items"} in Cart
              </span>
              <Sparkles size={11} className="text-yellow-300 animate-pulse" />
            </div>
            <p className="text-xs font-extrabold text-yellow-300">
              {formatPrice(cartSubtotal)}
            </p>
          </div>
        </button>

        {/* Right: 1-Tap Checkout Button */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(255,199,0,0.4)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onCheckout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          <span>Checkout</span>
          <ArrowRight size={13} className="stroke-[2.5]" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};
export default FloatingCartBar;
