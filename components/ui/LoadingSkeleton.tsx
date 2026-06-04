"use client";

import React from "react";

interface LoadingSkeletonProps {
  count?: number;
  layout?: "grid" | "carousel" | "message" | "chips";
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  layout = "carousel",
}) => {
  const items = Array.from({ length: count });

  if (layout === "carousel") {
    return (
      <div className="flex gap-3 overflow-hidden py-2 -mx-4 md:mx-0 w-full">
        {items.map((_, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 flex flex-col overflow-hidden"
            style={{
              width:        "168px",
              borderRadius: "12px",
              background:   "var(--card-bg)",
              border:       "1px solid var(--card-border)",
              boxShadow:    "var(--card-shadow)",
            }}
          >
            {/* Image Shimmer */}
            <div className="relative w-full h-[168px] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
              <div className="skeleton w-full h-full rounded-t-xl" />
              {/* Category Badge Shimmer */}
              <div className="skeleton absolute top-2 left-2 h-4 w-12 rounded-full" />
            </div>
            {/* Body Shimmer */}
            <div className="flex flex-col gap-2.5 p-3 flex-1 justify-between">
              <div className="space-y-2">
                {/* Title Line 1 */}
                <div className="skeleton h-3 w-full" />
                {/* Title Line 2 */}
                <div className="skeleton h-3 w-3/4" />
                {/* Rating Shimmer */}
                <div className="skeleton h-2.5 w-16" />
                {/* Price Shimmer */}
                <div className="skeleton h-4.5 w-20 mt-1" />
              </div>
              {/* Button Shimmer */}
              <div className="skeleton h-8 w-full rounded-lg mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (layout === "chips") {
    // Render horizontal chips skeleton
    const chipWidths = ["w-20", "w-28", "w-24", "w-16", "w-32"];
    return (
      <div className="flex gap-2 overflow-hidden py-1 w-full flex-nowrap">
        {items.map((_, idx) => {
          const widthClass = chipWidths[idx % chipWidths.length];
          return (
            <div
              key={idx}
              className={`skeleton flex-shrink-0 h-8 ${widthClass} rounded-full`}
            />
          );
        })}
      </div>
    );
  }

  if (layout === "message") {
    return (
      <div className="space-y-2 w-full">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-[90%]" />
        <div className="skeleton h-3 w-[65%]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full py-2">
      {items.map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col overflow-hidden"
          style={{
            borderRadius: "12px",
            background:   "var(--card-bg)",
            border:       "1px solid var(--card-border)",
            boxShadow:    "var(--card-shadow)",
          }}
        >
          <div className="relative aspect-square">
            <div className="skeleton w-full h-full rounded-t-xl" />
          </div>
          <div className="p-3 space-y-2">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-3.5 w-full" />
            <div className="skeleton h-3.5 w-2/3" />
            <div className="skeleton h-4 w-12" />
            <div className="skeleton h-8 w-full rounded-lg mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
