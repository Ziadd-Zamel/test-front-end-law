"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  pagination: {
    currentPage: number;
    limit: number;
  };
  totalPages: number;
};

export default function TablePagination({ pagination, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("pageNumber", newPage.toString());
    params.set("pageSize", pagination.limit.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRowsPerPageChange = (newLimit: string) => {
    const params = new URLSearchParams();
    params.set("pageNumber", "1");
    params.set("pageSize", newLimit);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, pagination.currentPage - halfMaxVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const hasPrevious = pagination.currentPage > 1;
  const hasNext = pagination.currentPage < totalPages;

  return (
    <div className="w-full flex items-center justify-between gap-4 py-4 px-2 border-t bg-white">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={!hasPrevious}
          onClick={() =>
            hasPrevious && handlePageChange(pagination.currentPage - 1)
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <div
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          ) : (
            <Button
              key={page}
              variant={pagination.currentPage === page ? "default" : "ghost"}
              size="icon"
              className={cn(
                "h-4 w-4 text-sm",
                pagination.currentPage === page
                  ? "text-blue-600 hover:bg-text-700 bg-transparent"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => handlePageChange(page as number)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={!hasNext}
          onClick={() =>
            hasNext && handlePageChange(pagination.currentPage + 1)
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-sm text-gray-600 whitespace-nowrap">
          عدد الصفوف لكل صفحة: {pagination.limit}
        </Label>
        <Select
          value={pagination.limit.toString()}
          onValueChange={handleRowsPerPageChange}
        >
          <SelectTrigger className="w-[90px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="!w-[70px] !max-w-[70px]">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
