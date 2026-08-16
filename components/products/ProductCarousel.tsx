"use client";

import React, { useRef, useState } from "react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductCompareModal from "./ProductCompareModal";
import { ChevronLeft, ChevronRight, Scale } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCarouselProps {
  products: Product[];
  onOpenDetails?: (productId: string) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onOpenDetails,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const scroll = (dir: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = dir === "right" ? 200 : -200;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!products || !Array.isArray(products) || products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full mt-2"
    >
      {/* Top action bar: Compare button when 2+ products */}
      {products.length >= 2 && (
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[11px] font-bold text-gray-500 dark:text-purple-300">
            {products.length} options found
          </span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100/80 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-200 text-xs font-bold border border-purple-200 dark:border-purple-700/60 transition-colors shadow-sm cursor-pointer"
          >
            <Scale size={13} className="text-purple-700 dark:text-yellow-400" />
            <span>Compare Items ({products.length})</span>
          </motion.button>
        </div>
      )}

      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md hidden md:flex cursor-pointer"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
        aria-label="Scroll left"
      >
        <ChevronLeft size={16} style={{ color: "var(--text-secondary)" }} />
      </button>

      {/* Scroll container */}
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto scroll-x snap-x snap-mandatory pb-2"
        style={{ scrollPaddingLeft: "4px" }}
      >
        {products.map((p, i) => (
          <div key={p.id} className="snap-start flex-shrink-0">
            <ProductCard product={p} index={i} onOpenDetails={onOpenDetails} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md hidden md:flex cursor-pointer"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
        aria-label="Scroll right"
      >
        <ChevronRight size={16} style={{ color: "var(--text-secondary)" }} />
      </button>

      {/* Side-by-side compare modal */}
      <ProductCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={products}
      />
    </motion.div>
  );
};
export default ProductCarousel;
