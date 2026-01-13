"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CategoryStatsChartSkeleton: React.FC = () => {
  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader>
        {/* Title Skeleton */}
        <div className="h-7 w-64 bg-gray-200 rounded animate-pulse mb-2" />

        {/* Stats Skeleton */}
        <div className="flex gap-6 mt-2">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        <div className="h-full w-full flex items-end justify-between gap-4 px-4 pb-8">
          {/* 10 Bar Skeletons with varying heights */}
          {[65, 80, 55, 70, 45, 60, 40, 50, 35, 30].map((height, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              {/* Bar */}
              <div
                className="w-full bg-gray-200 rounded animate-pulse"
                style={{ height: `${height}%` }}
              />
              {/* Label */}
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryStatsChartSkeleton;
