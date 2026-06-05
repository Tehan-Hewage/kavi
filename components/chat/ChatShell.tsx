"use client";

import React, { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import Header from "./Header";
import CartDrawer from "../cart/CartDrawer";
import SuggestionChips, { CHIP_SETS } from "../ui/SuggestionChips";
import ChatInput from "./ChatInput";
import { CartItem } from "@/types/cart";

interface ChatShellProps {
  children: React.ReactNode;
  onSend: (text: string) => void;
  isThinking?: boolean;
  activeChipContext?: "initial" | "afterSearch" | "afterCart" | "afterOrder";
  onProceedToCheckout?: () => void;
  /** Optional VoiceOrb element to float above the input */
  voiceOrb?: React.ReactNode;
  language: string;
  cart: CartItem[];
}

export default function ChatShell({
  children,
  onSend,
  isThinking = false,
  activeChipContext = "initial",
  onProceedToCheckout,
  voiceOrb,
  language,
  cart,
}: ChatShellProps) {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const activeChips = CHIP_SETS[activeChipContext] || CHIP_SETS.initial;

  return (
    <div
      className="flex flex-col h-[100dvh] w-full overflow-x-hidden overflow-y-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Area - fills remaining height */}
      <main className="flex-1 flex overflow-hidden relative">
        {children}
      </main>

      {/* Suggestion Chips & Chat Input Box */}
      <footer className="w-full max-w-3xl mx-auto px-4 pb-4 md:pb-6 space-y-3 z-10 flex-shrink-0">
        <SuggestionChips
          chips={activeChips}
          onSelect={onSend}
        />
        {/* Input wrapper with VoiceOrb floating above */}
        <div className="relative">
          {voiceOrb}
          <ChatInput onSend={onSend} isLoading={isThinking} language={language} cart={cart} />
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
