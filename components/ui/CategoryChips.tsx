"use client";

import React from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  product_count?: number;
}

interface CategoryChipsProps {
  categories: Category[];
  onSelectCategory?: (slug: string, name: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar -mx-4 md:mx-0">
      {categories.map((category, idx) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05, duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory?.(category.slug, category.name)}
          className="flex-shrink-0 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-kapruka-purple dark:hover:border-kapruka-purple rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
        >
          {category.name}
          {category.product_count !== undefined && (
            <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">
              ({category.product_count})
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
};
export default CategoryChips;
