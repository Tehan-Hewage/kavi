"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { X, ShoppingCart, Check, Info } from "lucide-react";
import { getValidImageUrl } from "@/lib/image-utils";

interface ProductDetailModalProps {
  productId: string | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
}) => {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const { currency: activeCurrency, formatPrice } = useCurrency();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setSelectedColor(null);
      setSelectedSize(null);
      setActiveImageIdx(0);
      return;
    }

    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/product?id=${productId}&currency=${activeCurrency}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
        
        // Auto-select first variant color & size
        const validVars = (data.variants || []).filter((v: any) => v.name && v.name.trim() !== "");
        if (validVars.length > 0) {
          const firstVar = validVars[0];
          const parts = firstVar.name.split("/").map((s: any) => s.trim());
          if (parts.length === 2) {
            setSelectedColor(parts[0]);
            setSelectedSize(parts[1]);
          } else {
            const val = parts[0];
            const isSize = /^(S|M|L|XL|XXL|XXXL|XS|FS|FREE\s*SIZE|[0-9]+[a-z]*)$/i.test(val);
            if (isSize) {
              setSelectedSize(val);
            } else {
              setSelectedColor(val);
            }
          }
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, activeCurrency]);

  // Helper to parse variant names
  // e.g. "GreyPrinted / M" -> { color: "GreyPrinted", size: "M" }
  interface ParsedVariant {
    id: string;
    name: string;
    price: number;
    color?: string;
    size?: string;
  }

  const parsedVariants: ParsedVariant[] = (product?.variants || [])
    .filter((v) => v.name && v.name.trim() !== "")
    .map((v) => {
      const parts = v.name.split("/").map((s) => s.trim());
      if (parts.length === 2) {
        return { ...v, color: parts[0], size: parts[1] };
      }
      const val = parts[0];
      const isSize = /^(S|M|L|XL|XXL|XXXL|XS|FS|FREE\s*SIZE|[0-9]+[a-z]*)$/i.test(val);
      if (isSize) {
        return { ...v, size: val };
      }
      return { ...v, color: val };
    });

  // Extract unique colors and sizes
  const uniqueColors = Array.from(
    new Set(parsedVariants.map((v) => v.color).filter(Boolean) as string[])
  );
  const uniqueSizes = Array.from(
    new Set(parsedVariants.map((v) => v.size).filter(Boolean) as string[])
  );

  const getSelectedVariant = (): ParsedVariant | null => {
    if (parsedVariants.length === 0) return null;
    
    // Attempt exact match on both color and size
    let match = parsedVariants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    if (match) return match;

    // Fallback: match color
    if (selectedColor) {
      match = parsedVariants.find((v) => v.color === selectedColor);
      if (match) return match;
    }

    // Fallback: match size
    if (selectedSize) {
      match = parsedVariants.find((v) => v.size === selectedSize);
      if (match) return match;
    }

    return parsedVariants[0];
  };

  const selectedVariant = getSelectedVariant();

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const match = parsedVariants.find((v) => v.color === color && v.size === selectedSize);
    if (!match) {
      const firstAvailableForColor = parsedVariants.find((v) => v.color === color);
      if (firstAvailableForColor) {
        setSelectedSize(firstAvailableForColor.size || null);
      }
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const match = parsedVariants.find((v) => v.color === selectedColor && v.size === size);
    if (!match) {
      const firstAvailableForSize = parsedVariants.find((v) => v.size === size);
      if (firstAvailableForSize) {
        setSelectedColor(firstAvailableForSize.color || null);
      }
    }
  };

  const getColorHex = (colorName: string): string | null => {
    const name = colorName.toLowerCase().replace(/\s+/g, "");
    if (name.includes("blue"))   return "#007cff";
    if (name.includes("grey") || name.includes("gray")) return "#6b7280";
    if (name.includes("red"))    return "#ef4444";
    if (name.includes("black"))  return "#111827";
    if (name.includes("white"))  return "#ffffff";
    if (name.includes("yellow")) return "#f59e0b";
    if (name.includes("green"))  return "#10b981";
    if (name.includes("purple")) return "#8b5cf6";
    if (name.includes("pink"))   return "#ec4899";
    if (name.includes("orange")) return "#f97316";
    if (name.includes("brown"))  return "#78350f";
    if (name.includes("gold"))   return "#d4a017";
    if (name.includes("silver")) return "#c0c0c0";
    if (name.includes("cream") || name.includes("beige")) return "#f5f0e8";
    // Not a recognisable colour — return null so the caller renders a text chip
    return null;
  };

  const isRealColor = (colorName: string) => getColorHex(colorName) !== null;

  if (!productId) return null;

  const getPriceVal = (price: any) => {
    if (typeof price === "object" && price !== null) {
      return price.amount ?? 0;
    }
    if (typeof price === "number") {
      return price;
    }
    return parseFloat(String(price || 0)) || 0;
  };

  // Kapruka MCP returns `in_stock`; fall back to `available` for compatibility
  const isAvailable = product ? (product.in_stock ?? product.available ?? true) : true;

  const basePrice = getPriceVal(product?.price);
  const currentPrice = selectedVariant ? getPriceVal(selectedVariant.price) : basePrice;

  const categoryName = typeof product?.category === "object" && product?.category !== null
    ? (product.category as any).name || (product.category as any).id || ""
    : product?.category || "";
  
  const formattedPrice = formatPrice(currentPrice);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image_url: product.images?.[0] || "/placeholder.png",
      variant_id: selectedVariant?.id,
      variant_name: selectedVariant?.name,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0.5 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative bg-white dark:bg-gray-900 w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">
              {loading ? "Loading details..." : product?.name || "Product details"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-kapruka-purple border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading details from Kapruka...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-2xl">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {product && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div className="space-y-3">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <Image
                      src={getValidImageUrl(product.images?.[activeImageIdx])}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Thumbnail Row */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                            activeImageIdx === idx
                              ? "border-kapruka-purple scale-95 shadow-sm"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image src={getValidImageUrl(img)} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info & Variants */}
                <div className="flex flex-col justify-between space-y-4">
                  <div>
                    <span className="px-2.5 py-1 bg-kapruka-purple/10 text-kapruka-purple dark:bg-kapruka-purple/20 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider">
                      {categoryName}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-2 leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mt-3">
                      {formattedPrice}
                    </p>
                  </div>

                  {/* Color / Variant Selector */}
                  {uniqueColors.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        {uniqueColors.some(isRealColor) ? "Color:" : "Option:"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map((color) => {
                          const isSelected = selectedColor === color;
                          const colorHex = getColorHex(color);
                          const isWhite = colorHex?.toLowerCase() === "#ffffff";

                          if (colorHex) {
                            // True colour — render a swatch circle
                            return (
                              <button
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className={`w-10 h-10 rounded-xl transition-all duration-200 relative ${
                                  isSelected
                                    ? "scale-110 shadow-lg"
                                    : "opacity-80 hover:opacity-100 hover:scale-105"
                                }`}
                                style={{
                                  backgroundColor: colorHex,
                                  border: isSelected
                                    ? "3px solid #4C1D6E"
                                    : isWhite
                                      ? "1.5px solid var(--border-strong)"
                                      : "1.5px solid transparent",
                                  boxShadow: isSelected
                                    ? "0 4px 14px rgba(76, 29, 110, 0.45)"
                                    : "none",
                                }}
                                title={color}
                              >
                                {isSelected && (
                                  <span
                                    className="absolute inset-0 flex items-center justify-center text-xs font-black"
                                    style={{
                                      color: isWhite ? "#000000" : "#ffffff",
                                      textShadow: isWhite ? "none" : "0 1px 2px rgba(0,0,0,0.5)",
                                    }}
                                  >
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          } else {
                            // Not a colour — render as a text chip (same as size selector)
                            return (
                              <button
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className={`h-10 px-4 text-xs font-bold rounded-xl border transition-all duration-200 flex items-center justify-center ${
                                  isSelected
                                    ? "bg-kapruka-purple border-kapruka-purple text-white shadow-md shadow-kapruka-purple/15"
                                    : "bg-purple-50/40 border-purple-100/50 dark:bg-gray-800 dark:border-gray-700 text-gray-850 dark:text-gray-200 hover:border-kapruka-purple/35"
                                }`}
                                style={
                                  isSelected
                                    ? { background: "#4C1D6E", borderColor: "#4C1D6E", color: "#FFFFFF" }
                                    : {}
                                }
                              >
                                {color}
                              </button>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selector */}
                  {(uniqueSizes.length > 0 || (parsedVariants.length > 0 && uniqueColors.length === 0)) && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        Size / Option:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(uniqueSizes.length > 0 ? uniqueSizes : parsedVariants.map(v => v.name)).map((size) => {
                          const isSelected = selectedSize === size || (uniqueColors.length === 0 && selectedVariant?.name === size);
                          
                          // Check if size is available for currently selected color
                          const isAvailableForColor = uniqueColors.length === 0 || parsedVariants.some(
                            (v) => v.size === size && v.color === selectedColor
                          );

                          return (
                            <button
                              key={size}
                              onClick={() => {
                                if (uniqueColors.length > 0) {
                                  handleSizeSelect(size);
                                } else {
                                  const matchingVar = parsedVariants.find(v => v.name === size);
                                  if (matchingVar) {
                                    setSelectedSize(matchingVar.size || null);
                                  }
                                }
                              }}
                              className={`h-10 px-4 text-xs font-bold rounded-xl border transition-all duration-200 flex items-center justify-center ${
                                isSelected
                                  ? "bg-kapruka-purple border-kapruka-purple text-white shadow-md shadow-kapruka-purple/15 scale-102"
                                  : isAvailableForColor
                                    ? "bg-purple-50/40 border-purple-100/50 dark:bg-gray-800 dark:border-gray-700 text-gray-850 dark:text-gray-200 hover:border-kapruka-purple/35"
                                    : "bg-gray-50 border-gray-100 text-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-600 cursor-not-allowed opacity-45"
                              }`}
                              style={
                                isSelected
                                  ? { background: "#4C1D6E", borderColor: "#4C1D6E", color: "#FFFFFF" }
                                  : {}
                              }
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Availability Check */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-500 dark:text-gray-400">Availability:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        isAvailable
                          ? "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description:
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-[140px] overflow-y-auto pr-1">
                      {product.description || "No description provided."}
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    disabled={!isAvailable}
                    onClick={handleAddToCart}
                    className="w-full mt-4 py-3 px-4 bg-kapruka-purple hover:bg-kapruka-purple-dark disabled:bg-gray-200 disabled:dark:bg-gray-800 disabled:text-gray-400 disabled:dark:text-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ProductDetailModal;
