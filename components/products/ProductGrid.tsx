"use client";

import React from "react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 w-full">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          index={idx}
        />
      ))}
    </div>
  );
};
export default ProductGrid;
