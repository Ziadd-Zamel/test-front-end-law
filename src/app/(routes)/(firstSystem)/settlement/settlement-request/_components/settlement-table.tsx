"use client";

import * as React from "react";
import { TableBuilder } from "@/components/common/table-builder";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableEmptyState } from "@/components/common/table-states";
import FilterSelect from "@/components/common/filter-select";
import { Pencil, FilePlus } from "lucide-react";
import LinkButton from "@/components/common/link-button";
import { Pagination } from "@/lib/types/api";
import {
  SETTLEMENT_STATUSES,
  SETTLEMENT_TABLE_HEADERS,
} from "@/lib/constants/settlement.constant";
import { useRouter } from "next/navigation";

// ==================== HELPERS ====================

const getBadgeVariant = (
  status: Settlement["status"],
): "success" | "error" | "warning" | "info" | "neutral" => {
  switch (status) {
    case "تم الصلح":
      return "success";
    case "تعذر الصلح":
      return "error";
    case "قيد النظر":
      return "warning";
    default:
      return "neutral";
  }
};

export default function SettlementTable({
  settlements,
  pagination,
  responsePagination,
}: {
  settlements: Settlement[];
  responsePagination: Pagination | undefined;
  pagination: {
    currentPage: number;
    limit: number;
  };
}) {
  const router = useRouter();
  return (
    <TableBuilder<Settlement>
      pagination={
        responsePagination && responsePagination.totalCount > 5
          ? pagination
          : undefined
      }
      totalPages={responsePagination?.totalPages || 1}
      tableHeader={
        <div className="flex items-center justify-between w-full md:flex-row flex-col gap-6">
          <div className="flex self-start items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-white" />
            <h2 className="text-3xl font-semibold">طلبات الصلح</h2>
          </div>

          <div className="self-end">
            <FilterSelect
              filterItems={SETTLEMENT_STATUSES}
              filterName="status"
              placeholder="اختر الحالة"
            />
          </div>
        </div>
      }
      tableHeadNames={SETTLEMENT_TABLE_HEADERS}
      tableData={settlements}
      headRowClasses="text-center"
      emptyState={
        <TableEmptyState
          title="لا توجد طلبات تسوية"
          description="لم يتم العثور على أي طلبات تسوية حتى الآن."
          className="h-fit"
        />
      }
      renderRow={(request) => (
        <TableRow
          className="cursor-pointer"
          key={request.id}
          onClick={() =>
            router.push(`/settlement/settlement-request/${request.id}`)
          }
        >
          <TableCell className="text-center">{request.categoryName}</TableCell>

          <TableCell className="text-center">
            <p className="font-medium">{request.clientName}</p>
          </TableCell>

          <TableCell className="text-center">
            {request.clientPosition}
          </TableCell>

          <TableCell className="text-center">{request.opponentName}</TableCell>

          <TableCell className="text-center">
            {request.createdAtFormatted}
          </TableCell>

          <TableCell className="text-center">
            <div className="flex justify-center">
              <Badge variant={getBadgeVariant(request.status)}>
                {request.status}
              </Badge>
            </div>
          </TableCell>

          <TableCell className="text-center">
            <div className="flex items-center justify-center gap-2">
              <LinkButton
                href={`/settlement/add-edit-settlement/${request.id}`}
              >
                <Pencil className="h-4 w-4" />
              </LinkButton>
              <LinkButton
                href={`/cases/add-edit-case/${request.id}?from=settlement`}
              >
                <FilePlus className="h-4 w-4" />
              </LinkButton>
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
