"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ProductDetail } from "@/lib/types";
import { X, ShoppingCart, Check, Info } from "lucide-react";

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
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<{ id: string; name: string; price: number } | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setSelectedVariant(null);
      setActiveImageIdx(0);
      return;
    }

    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/product?id=${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

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

  const basePrice = getPriceVal(product?.price);
  const currentPrice = selectedVariant ? getPriceVal(selectedVariant.price) : basePrice;

  const categoryName = typeof product?.category === "object" && product?.category !== null
    ? (product.category as any).name || (product.category as any).id || ""
    : product?.category || "";
  
  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(currentPrice)
    .replace("LKR", "Rs");

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
          className="relative bg-white dark:bg-gray-900 w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
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
                      src={product.images?.[activeImageIdx] || "/placeholder.png"}
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
                          <Image src={img} alt="" fill className="object-cover" />
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

                  {/* Variants */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Select Variant:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => {
                          const isSelected = selectedVariant?.id === v.id;
                          return (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariant(v)}
                              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-kapruka-purple border-kapruka-purple text-white shadow-md shadow-kapruka-purple/10 scale-102"
                                  : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                              <span>{v.name}</span>
                              <span className={`ml-1 opacity-70 ${isSelected ? "text-white" : "text-gray-500"}`}>
                                (Rs {getPriceVal(v.price).toLocaleString()})
                              </span>
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
                        product.available
                          ? "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {product.available ? "In Stock" : "Out of Stock"}
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
                    disabled={!product.available}
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
