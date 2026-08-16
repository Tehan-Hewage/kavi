"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Star, ShoppingCart, Zap } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { YellowButton } from "@/components/ui/buttons/YellowButton";
import { getValidImageUrl } from "@/lib/image-utils";

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const { addItem, cart } = useCart();
  const { formatPrice } = useCurrency();

  if (!isOpen || products.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-[#1E1136] border border-purple-100 dark:border-purple-800/60 shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/40">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Side-by-Side Product Comparison
                </h3>
                <p className="text-xs text-gray-500 dark:text-purple-300">
                  Comparing {products.length} items from Kapruka catalog
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-purple-900/60 transition-colors text-gray-500 dark:text-purple-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 no-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 min-w-[550px]">
              {products.map((product) => {
                const inCart = cart.some((i) => i.id === product.id);
                const priceVal =
                  typeof product.price === "object" && product.price !== null
                    ? (product.price as any).amount || 0
                    : typeof product.price === "number"
                    ? product.price
                    : parseFloat(String(product.price || 0));

                return (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-gray-50/80 dark:bg-purple-950/30 border border-gray-100 dark:border-purple-900/40 shadow-sm"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-white dark:bg-purple-900/20">
                        <Image
                          src={getValidImageUrl(product.image_url)}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[2rem]">
                        {product.name}
                      </h4>

                      {/* Price */}
                      <div className="mt-2 text-base font-extrabold text-purple-900 dark:text-yellow-300">
                        {formatPrice(priceVal)}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-semibold">
                        <Star size={12} className="fill-amber-400" />
                        <span>{product.rating ?? "4.8"}</span>
                        <span className="text-gray-400 dark:text-purple-400 font-normal">
                          ({product.review_count ?? 120})
                        </span>
                      </div>

                      {/* Spec Specs */}
                      <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-purple-900/40 space-y-1.5 text-[11px]">
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Zap size={11} />
                          <span>Same-Day Available</span>
                        </div>
                        <div className="text-gray-500 dark:text-purple-300">
                          Delivery: <strong className="text-gray-800 dark:text-white">Rs 350 flat</strong>
                        </div>
                        {product.category && (
                          <div className="text-gray-500 dark:text-purple-300 truncate">
                            Category: <span className="capitalize">{typeof product.category === "string" ? product.category : (product.category as any).name || "Gift"}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-2">
                      <YellowButton
                        size="sm"
                        fullWidth
                        showSuccess
                        successText="Added!"
                        icon={<ShoppingCart size={13} />}
                        onClick={() =>
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: priceVal,
                            image_url: product.image_url,
                          })
                        }
                      >
                        {inCart ? "In Cart ✓" : "Add to Cart"}
                      </YellowButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ProductCompareModal;
