"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns = 5; // same as your real table headers

export default function TableSkeleton() {
  return (
    <div className="w-full py-10 box-container">
      <div className="rounded-sm bg-white border-1 border-gray-300 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-300 to-white rounded" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
          </div>
        </div>

        <Table>
          {/* Table Header */}
          <TableHeader className="bg-blue-50">
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i} className="text-center">
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="text-center py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Skeleton */}
        <div className="flex justify-center py-4 gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
