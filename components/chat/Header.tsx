"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { LanguagePill } from "../ui/LanguagePill";
import { CurrencyPill } from "../ui/CurrencyPill";
import { ThemeToggle } from "../ui/ThemeToggle";
import { IconButton } from "../ui/buttons/IconButton";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ cartCount, onOpenCart }: HeaderProps) {
  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 h-14 sm:h-16 z-50"
      style={{
        background:   "#4C1D6E",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        boxShadow:    "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* LEFT — Logo */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Image
          src="/send-online-logo.png"
          alt="Send Online"
          height={28}
          width={120}
          className="flex-shrink-0 object-contain"
          style={{ height: "28px", width: "auto", maxWidth: "110px" }}
          priority
        />

        {/* Divider + Kavi brand — desktop only */}
        <div className="hidden sm:block w-px h-6 bg-white/20" />
        <div className="hidden sm:flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            K
          </motion.div>
          <div className="leading-none">
            <p className="text-white text-sm font-semibold tracking-wide">Kavi</p>
            <p className="text-white/60 text-xs">AI Shopping Assistant</p>
          </div>
        </div>
      </div>

      {/* RIGHT — Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Language: dropdown on mobile, pill on desktop */}
        <LanguagePill />

        {/* Currency: always dropdown, flag-only on mobile */}
        <CurrencyPill />

        {/* Theme toggle — hidden on mobile to save space */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* Cart */}
        <IconButton
          icon={<ShoppingCart size={18} />}
          badge={cartCount}
          onClick={onOpenCart}
          label="Open cart"
        />
      </div>
    </header>
  );
}
