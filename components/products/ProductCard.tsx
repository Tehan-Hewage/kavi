"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, Star } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Product } from "@/lib/types";
import { YellowButton } from "@/components/ui/buttons/YellowButton";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { getValidImageUrl } from "@/lib/image-utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  onOpenDetails?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  onOpenDetails,
}) => {
  const { addItem, updateQuantity, cart } = useCart();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [quantity, setQuantity] = useState(1);
  const cartItem = cart.find((i) => i.id === product.id);
  const inCart = !!cartItem;

  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? (product.category as any).name || (product.category as any).id || ""
      : product.category;

  const priceVal =
    typeof product.price === "object" && product.price !== null
      ? (product.price as any).amount || 0
      : typeof product.price === "number"
      ? product.price
      : parseFloat(String(product.price || 0));

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: priceVal,
      image_url: product.image_url,
      quantity: quantity,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 24px rgba(76, 29, 110, 0.18)",
        transition: { duration: 0.2 },
      }}
      onClick={() => onOpenDetails?.(product.id)}
      className="flex-shrink-0 flex flex-col overflow-hidden cursor-pointer rounded-2xl transition-all duration-200"
      style={{
        width: "172px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {/* Image Container */}
      <div className="relative w-full h-40">
        <Image
          src={getValidImageUrl(product.image_url)}
          alt={product.name}
          fill
          sizes="172px"
          className="object-cover rounded-t-2xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />

        {/* Category badge */}
        <span
          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm"
          style={{ background: "#4C1D6E", color: "#FFFFFF" }}
        >
          {categoryName || "Gift"}
        </span>

        {/* Same-day / Fast delivery badge */}
        <span className="absolute bottom-2 left-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-white flex items-center gap-0.5 shadow-sm backdrop-blur-sm">
          <Zap size={9} />
          <span>Fast Delivery</span>
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5 p-3 flex-1 justify-between">
        <div className="space-y-1">
          {/* Name */}
          <p
            className="text-xs font-semibold leading-tight text-gray-900 dark:text-white"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.25rem",
            }}
          >
            {product.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-gray-500 dark:text-purple-300">
              {product.rating ?? "4.8"} ({product.review_count ?? 124})
            </span>
          </div>

          {/* Price */}
          <p className="text-sm font-extrabold text-purple-950 dark:text-yellow-300">
            {formatPrice(priceVal)}
          </p>
        </div>

        {/* Quantity Controls & Add to Cart */}
        <div className="mt-auto pt-1 space-y-1.5">
          {!inCart && (
            <div
              className="flex items-center justify-between px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-purple-950/40 text-xs font-bold"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] text-gray-500 dark:text-purple-300">Qty</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-4 h-4 rounded flex items-center justify-center bg-gray-200 dark:bg-purple-800 text-gray-700 dark:text-white font-bold hover:bg-gray-300 cursor-pointer"
                >
                  −
                </button>
                <span className="w-4 text-center text-xs text-gray-800 dark:text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-4 h-4 rounded flex items-center justify-center bg-gray-200 dark:bg-purple-800 text-gray-700 dark:text-white font-bold hover:bg-gray-300 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <YellowButton
            size="sm"
            fullWidth
            showSuccess
            successText="In Cart ✓"
            icon={<ShoppingCart size={12} />}
            onClick={handleAdd}
          >
            {inCart ? `In Cart (${cartItem?.quantity || 1}) ✓` : t.addToCart}
          </YellowButton>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
