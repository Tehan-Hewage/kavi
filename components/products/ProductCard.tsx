"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Product } from "@/lib/types";

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
  const { addItem, cart } = useCart();
  const { t } = useLanguage();
  const inCart = cart.some((i) => i.id === product.id);

  const categoryName = typeof product.category === "object" && product.category !== null
    ? (product.category as any).name || (product.category as any).id || ""
    : product.category;

  const priceVal = typeof product.price === "object" && product.price !== null
    ? (product.price as any).amount || 0
    : typeof product.price === "number"
      ? product.price
      : parseFloat(String(product.price || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={() => onOpenDetails?.(product.id)}
      className="flex-shrink-0 flex flex-col overflow-hidden cursor-pointer h-full"
      style={{
        width:        "168px",
        borderRadius: "16px",
        background:   "var(--bg-surface)",
        border:       "1px solid var(--border-subtle)",
        boxShadow:    "var(--shadow-card)",
      }}
    >
      {/* Product Image Area */}
      <div className="relative w-full" style={{ height: "168px" }}>
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="168px"
          className="object-cover"
          style={{ borderRadius: "16px 16px 0 0" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
        {/* Category badge */}
        {categoryName && (
          <span
            className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
            style={{
              background: "rgba(74,58,232,0.85)",
              color:      "#ffffff",
              backdropFilter: "blur(4px)",
            }}
          >
            {categoryName}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-3 flex-1 justify-between">
        <div className="space-y-1">
          {/* Product Name */}
          <p
            className="text-sm font-semibold leading-tight hover:text-brand-purple transition-colors"
            style={{
              color:             "var(--text-primary)",
              display:           "-webkit-box",
              WebkitLineClamp:   2,
              WebkitBoxOrient:   "vertical",
              overflow:          "hidden",
              minHeight:         "2.5rem"
            }}
          >
            {product.name}
          </p>

          {/* Price */}
          <p
            className="text-base font-extrabold"
            style={{ color: "var(--brand-purple)" }}
          >
            Rs {priceVal.toLocaleString("en-LK")}
          </p>
        </div>

        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <span style={{ color: "#F5C518", fontSize: "12px" }}>★</span>
            <span className="text-[11px] font-bold" style={{ color: "var(--text-secondary)" }}>
              4.8 (124 reviews)
            </span>
          </div>

          {/* Add to cart button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                id: product.id,
                name: product.name,
                price: priceVal,
                image_url: product.image_url,
              });
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-full transition-all shadow-sm"
            style={{
              background:   inCart ? "var(--bg-subtle)" : "var(--brand-purple)",
              color:        inCart ? "var(--brand-purple)" : "#FFFFFF",
              border:       inCart ? "1px solid var(--brand-purple)" : "none",
            }}
          >
            <ShoppingCart size={13} />
            {inCart ? "In Cart ✓" : t.addToCart}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
