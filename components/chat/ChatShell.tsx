"use client";

import React, { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import Header from "./Header";
import CartDrawer from "../cart/CartDrawer";
import SuggestionChips, { CHIP_SETS } from "../ui/SuggestionChips";
import ChatInput from "./ChatInput";

interface ChatShellProps {
  children: React.ReactNode;
  onSend: (text: string) => void;
  isThinking?: boolean;
  activeChipContext?: "initial" | "afterSearch" | "afterCart" | "afterOrder";
  onProceedToCheckout?: () => void;
}

export default function ChatShell({
  children,
  onSend,
  isThinking = false,
  activeChipContext = "initial",
  onProceedToCheckout,
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
        <ChatInput onSend={onSend} disabled={isThinking} />
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
