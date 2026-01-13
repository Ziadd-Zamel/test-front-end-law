"use client";

import React from "react";

const CasesStatsCardsSkeleton: React.FC = () => {
  return (
    <div className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  box-container">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-3xl bg-white px-4 py-6"
        >
          {/* Icon Skeleton */}
          <div className="relative flex size-14 items-center justify-center rounded-full bg-gray-200 animate-pulse" />

          <div className="flex-1 space-y-2">
            {/* Title Skeleton */}
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />

            {/* Value Skeleton */}
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CasesStatsCardsSkeleton;
