"use client";

import React from "react";
import Image from "next/image";
import { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { Trash2 } from "lucide-react";

import { getValidImageUrl } from "@/lib/image-utils";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { formatPrice } = useCurrency();

  const formattedPrice = formatPrice(item.price);

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800/80 items-center justify-between">
      {/* Product Image */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-700">
        <Image src={getValidImageUrl(item.image_url)} alt={item.name} fill className="object-cover" />
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0 px-1">
        <h6 className="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-1 leading-tight">
          {item.name}
        </h6>
        {item.variant_name && (
          <span className="inline-block text-[10px] font-bold text-[#4C1D6E] bg-[#4C1D6E]/10 px-1.5 py-0.5 rounded-md mt-0.5">
            {item.variant_name}
          </span>
        )}
        <p className="text-xs font-black mt-1" style={{ color: "var(--text-primary)" }}>
          {formattedPrice}
        </p>
      </div>

      {/* Quantity & Delete Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant_id)}
            className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            style={{ borderColor: "#4C1D6E", color: "#4C1D6E", background: "transparent" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#4C1D6E";
              (e.currentTarget as HTMLElement).style.color      = "#FFFFFF";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color      = "#4C1D6E";
            }}
          >
            −
          </button>
          <span data-testid="qty-display" className="text-sm font-semibold w-6 text-center text-gray-800 dark:text-gray-200">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant_id)}
            className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            style={{ borderColor: "#4C1D6E", color: "#4C1D6E", background: "transparent" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#4C1D6E";
              (e.currentTarget as HTMLElement).style.color      = "#FFFFFF";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color      = "#4C1D6E";
            }}
          >
            +
          </button>
        </div>

        <button
          onClick={() => removeItem(item.id, item.variant_id)}
          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default CartItem;
