"use client";

import React from "react";

interface LoadingSkeletonProps {
  count?: number;
  layout?: "grid" | "carousel";
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  layout = "carousel",
}) => {
  const items = Array.from({ length: count });

  if (layout === "carousel") {
    return (
      <div className="flex gap-4 overflow-hidden py-3 -mx-4 md:mx-0 w-full">
        {items.map((_, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[180px] md:w-[220px] bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700/60 shadow-sm animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="h-28 md:h-36 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
            {/* Category Skeleton */}
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            {/* Title Skeleton */}
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1.5" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            {/* Price & Button Skeleton */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 dark:border-gray-700/50">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full py-2">
      {items.map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700/60 shadow-sm animate-pulse"
        >
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1.5" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 dark:border-gray-700/50">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default LoadingSkeleton;
