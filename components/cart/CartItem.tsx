"use client";

import React from "react";
import Image from "next/image";
import { motion, PanInfo } from "framer-motion";
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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -60) {
      removeItem(item.id, item.variant_id);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background delete trigger on swipe */}
      <div className="absolute inset-0 flex items-center justify-end pr-4 bg-rose-500 text-white font-bold text-xs rounded-2xl">
        <Trash2 size={16} className="mr-1" />
        <span>Delete</span>
      </div>

      {/* Swipeable foreground card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="relative flex gap-3 p-3 rounded-2xl bg-white dark:bg-[#1E1136] border border-gray-100 dark:border-purple-900/50 items-center justify-between shadow-sm"
      >
        {/* Product Image */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-purple-900/20 flex-shrink-0 border border-gray-100 dark:border-purple-800/40">
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
          <p className="text-xs font-black mt-1 text-purple-900 dark:text-yellow-300">
            {formattedPrice}
          </p>
        </div>

        {/* Quantity & Delete Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-purple-950/40 p-1 rounded-xl border border-gray-200 dark:border-purple-900/40">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant_id)}
              className="w-6 h-6 rounded-lg bg-white dark:bg-purple-900 flex items-center justify-center text-xs font-bold text-purple-900 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-800 shadow-sm cursor-pointer"
            >
              −
            </button>
            <span data-testid="qty-display" className="text-xs font-extrabold w-5 text-center text-gray-800 dark:text-gray-200">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant_id)}
              className="w-6 h-6 rounded-lg bg-white dark:bg-purple-900 flex items-center justify-center text-xs font-bold text-purple-900 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-800 shadow-sm cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id, item.variant_id)}
            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default CartItem;
