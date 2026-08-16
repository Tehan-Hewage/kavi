"use client";

import React, { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import Header from "./Header";
import CartDrawer from "../cart/CartDrawer";
import FloatingCartBar from "../cart/FloatingCartBar";
import SuggestionChips, { CHIP_SETS } from "../ui/SuggestionChips";
import ChatInput from "./ChatInput";

interface ChatShellProps {
  children: React.ReactNode;
  onSend: (text: string) => void;
  isThinking?: boolean;
  activeChipContext?: "initial" | "afterSearch" | "afterCart" | "afterOrder";
  onProceedToCheckout?: () => void;
  activeOrderRef?: string;
  activeOrderStatus?: string;
  activeOrderLocation?: string;
  onTrackActiveOrder?: () => void;
  /** Optional VoiceOrb element to float above the input */
  voiceOrb?: React.ReactNode;
}

export default function ChatShell({
  children,
  onSend,
  isThinking = false,
  activeChipContext = "initial",
  onProceedToCheckout,
  activeOrderRef,
  activeOrderStatus,
  activeOrderLocation,
  onTrackActiveOrder,
  voiceOrb,
}: ChatShellProps) {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const activeChips = CHIP_SETS[activeChipContext] || CHIP_SETS.initial;

  const handleFloatingCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      onSend("I am ready to checkout.");
    }
  };

  return (
    <div
      className="flex flex-col h-[100dvh] w-full overflow-x-hidden overflow-y-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrderRef={activeOrderRef}
        activeOrderStatus={activeOrderStatus}
        activeOrderLocation={activeOrderLocation}
        onTrackActiveOrder={onTrackActiveOrder}
      />

      {/* Main Area - fills remaining height */}
      <main className="flex-1 flex overflow-hidden relative">
        {children}
      </main>

      {/* Sticky Bottom Actions: Floating Cart + Suggestion Chips & Chat Input */}
      <footer className="w-full max-w-3xl mx-auto px-4 pb-4 md:pb-6 space-y-2.5 z-10 flex-shrink-0">
        <FloatingCartBar
          onCheckout={handleFloatingCheckout}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <SuggestionChips
          chips={activeChips}
          onSelect={onSend}
        />

        {/* Input wrapper with VoiceOrb floating above */}
        <div className="relative">
          {voiceOrb}
          <ChatInput onSend={onSend} disabled={isThinking} />
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={onProceedToCheckout}
      />
    </div>
  );
}
