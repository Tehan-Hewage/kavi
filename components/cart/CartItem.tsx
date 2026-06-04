"use client";

import React from "react";
import Image from "next/image";
import { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(item.price)
    .replace("LKR", "Rs");

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800/80 items-center justify-between">
      {/* Product Image */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-700">
        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0 px-1">
        <h6 className="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-1 leading-tight">
          {item.name}
        </h6>
        {item.variant_name && (
          <span className="inline-block text-[10px] font-bold text-kapruka-purple bg-kapruka-purple/5 px-1.5 py-0.5 rounded-md mt-0.5">
            {item.variant_name}
          </span>
        )}
        <p className="text-xs font-black text-gray-900 dark:text-white mt-1">
          {formattedPrice}
        </p>
      </div>

      {/* Quantity & Delete Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant_id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-extrabold text-gray-800 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant_id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => removeItem(item.id, item.variant_id)}
          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default CartItem;
