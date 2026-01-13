"use client";

import * as React from "react";
import { TableBuilder } from "@/components/common/table-builder";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableEmptyState } from "@/components/common/table-states";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SETTLEMENT_CATEGORY_TABLE_HEADERS } from "@/lib/constants/settlement.constant";
import { Pagination } from "@/lib/types/api";
import SettlementCategoryDialog from "./category-dialog";
import DeleteSettlementCategoryDialog from "./delete-category-dialog";

// ==================== HELPERS ====================

const getStatusBadgeVariant = (isActive: boolean): "success" | "error" => {
  return isActive ? "success" : "error";
};

export default function CategoriesTable({
  categories,
  pagination,
  responsePagination,
}: {
  categories: SettlementCategory[];
  pagination: {
    currentPage: number;
    limit: number;
  };
  responsePagination?: Pagination;
}) {
  return (
    <TableBuilder<SettlementCategory>
      hasFooter
      tableHeader={
        <div className="flex items-center justify-between w-full md:flex-row flex-col gap-6">
          <div className="flex self-start items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-white" />
            <h2 className="text-3xl font-semibold">الفئات</h2>
          </div>
          <SettlementCategoryDialog />
        </div>
      }
      pagination={
        responsePagination && responsePagination.totalCount > pagination.limit
          ? pagination
          : undefined
      }
      totalPages={responsePagination?.totalPages || 1}
      tableHeadNames={SETTLEMENT_CATEGORY_TABLE_HEADERS}
      tableData={categories}
      headRowClasses="text-center"
      emptyState={
        <TableEmptyState
          title="لا توجد تصنيفات"
          description="لم يتم العثور على أي تصنيفات تسوية حتى الآن."
          className="h-fit"
        />
      }
      renderRow={(category) => (
        <TableRow key={category.id}>
          {/* Name */}
          <TableCell className="text-center font-medium">
            {category.name}
          </TableCell>

          {/* Description */}
          <TableCell className="text-center text-gray-600">
            {category.description || "—"}
          </TableCell>

          {/* Status */}
          <TableCell className="text-center">
            <div className="flex justify-center">
              <Badge variant={getStatusBadgeVariant(category.isActive)}>
                {category.isActive ? "مفعّل" : "غير مفعّل"}
              </Badge>
            </div>
          </TableCell>

          {/* Actions */}
          <TableCell className="text-center">
            <div className="flex items-center justify-center gap-2">
              <SettlementCategoryDialog
                category={category}
                trigger={
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />

              <DeleteSettlementCategoryDialog
                categoryId={category.id}
                categoryName={category.name}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
