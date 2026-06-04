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
      className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 h-16 z-50"
      style={{
        background:   "#4C1D6E",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        boxShadow:    "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* LEFT — Logo + Kavi brand */}
      <div className="flex items-center gap-3">
        {/* Send Online logo */}
        <Image
          src="/send-online-logo.png"
          alt="Send Online"
          height={32}
          width={140}
          className="flex-shrink-0 object-contain"
          style={{ height: "32px", width: "auto" }}
          priority
        />

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/20" />

        {/* Kavi pill */}
        <div className="hidden sm:flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full flex items-center justify-center
                       text-white text-sm font-bold"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            K
          </motion.div>
          <div className="hidden sm:block leading-none">
            <p className="text-white text-sm font-semibold tracking-wide">Kavi</p>
            <p className="text-white/60 text-xs">AI Shopping Assistant</p>
          </div>
        </div>
      </div>

      {/* RIGHT — Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <LanguagePill />
        <CurrencyPill />
        <ThemeToggle />
        <IconButton
          icon={<ShoppingCart size={20} />}
          badge={cartCount}
          onClick={onOpenCart}
          label="Open cart"
        />
      </div>
    </header>
  );
}

