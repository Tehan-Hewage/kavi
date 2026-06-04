"use client";

import React, { useRef } from "react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md hidden md:flex"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
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
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md hidden md:flex"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
      >
        <ChevronRight size={16} style={{ color: "var(--text-secondary)" }} />
      </button>
    </motion.div>
  );
};
export default ProductCarousel;
