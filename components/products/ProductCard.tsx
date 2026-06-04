"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
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
  const { addItem, cart } = useCart();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
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
      transition={{ delay: index * 0.055, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 24px rgba(76, 29, 110, 0.18)",
        transition: { duration: 0.2 }
      }}
      onClick={() => onOpenDetails?.(product.id)}
      className="flex-shrink-0 flex flex-col overflow-hidden cursor-pointer"
      style={{
        width:        "168px",
        borderRadius: "12px",
        background:   "var(--card-bg)",
        border:       "1px solid var(--card-border)",
        boxShadow:    "var(--card-shadow)",
      }}
    >
      {/* Image */}
      <div className="relative w-full" style={{ height: "168px" }}>
        <Image
          src={getValidImageUrl(product.image_url)}
          alt={product.name}
          fill
          sizes="168px"
          className="object-cover"
          style={{ borderRadius: "12px 12px 0 0" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
        {/* Category badge — matches kapruka.com style exactly */}
        <span
          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{ background: "#4C1D6E", color: "#FFFFFF" }}
        >
          {categoryName || "General"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5 p-3 flex-1 justify-between">
        <div className="space-y-1">
          {/* Name */}
          <p
            className="text-xs font-semibold leading-tight"
            style={{
              color:           "var(--text-primary)",
              display:         "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow:        "hidden",
              minHeight:       "2.25rem"
            }}
          >
            {product.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <span style={{ color: "#FFC700", fontSize: "11px" }}>★</span>
            <span style={{ color: "var(--text-tertiary)", fontSize: "10px" }}>
              {product.rating ?? "4.8"} ({product.review_count ?? 124} reviews)
            </span>
          </div>

          {/* Price */}
          <p className="text-sm font-bold" style={{ color: "#4C1D6E" }}>
            {formatPrice(priceVal)}
          </p>
        </div>

        {/* Add to Cart — yellow, full width */}
        <div className="mt-auto pt-1">
          <YellowButton
            size="sm"
            fullWidth
            showSuccess
            successText="In Cart ✓"
            icon={<ShoppingCart size={12} />}
            onClick={(e) => {
              if (e) {
                e.stopPropagation();
              }
              addItem({
                id:        product.id,
                name:       product.name,
                price:      priceVal,
                image_url:  product.image_url,
              });
            }}
          >
            {inCart ? "In Cart ✓" : t.addToCart}
          </YellowButton>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
