"use client";

import React, { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguagePill } from "../ui/LanguagePill";
import { ThemeToggle } from "../ui/ThemeToggle";
import CartDrawer from "../cart/CartDrawer";
import SuggestionChips, { CHIP_SETS } from "../ui/SuggestionChips";
import ChatInput from "./ChatInput";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

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
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      {/* Header - fixed 64px */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 h-16 border-b"
        style={{
          background: "#0C0B17",
          borderColor: "#2A2840",
          zIndex: 50,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Kapruka logo */}
          <div className="relative w-28 h-7 md:w-32 md:h-8">
            <Image
              src="/send-online-logo.png"
              alt="Send Online"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Kavi branding */}
          <div className="flex items-center gap-2 border-l pl-3" style={{ borderColor: "#2A2840" }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-inner"
              style={{ background: "var(--brand-purple)" }}
            >
              K
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold leading-none" style={{ color: "#EEEDF8" }}>Kavi</p>
              <p className="text-[10px] font-bold mt-0.5 leading-none" style={{ color: "#9896B4" }}>AI Shopping Agent</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguagePill />
          <ThemeToggle />

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors shadow-inner"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-kapruka-purple text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow border-2 border-gray-900 animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

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
