import * as React from "react";
import { TableBuilder } from "@/components/common/table-builder";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableEmptyState } from "@/components/common/table-states";
import { Pencil } from "lucide-react";
import { Pagination } from "@/lib/types/api";
import LinkButton from "@/components/common/link-button";
import CloseCaseDialog from "./close-dialog";
import { hasPermission } from "@/lib/utils/permission-server";

const requestHeader = [
  { headName: "رقم القضية", className: "text-center" },
  { headName: "عنوان القضية", className: "text-center" },
  { headName: "التصنيف", className: "text-center" },
  { headName: "اسم العميل", className: "text-center" },
  { headName: "صفة العميل", className: "text-center" },
  { headName: "اسم الخصم", className: "text-center" },
  { headName: "المحكمة", className: "text-center" },
  { headName: "الجلسة القادمة", className: "text-center" },
  { headName: "الحالة", className: "text-center" },
  { headName: "الإجراءات", className: "text-center" },
];

function getCaseStatusBadge(isArchived: number, isActive: number) {
  if (isArchived === 1) return "destructive";
  return isActive === 1 ? "success" : "secondary";
}

export default async function CasesTable({
  cases,
  pagination,
  responsePagination,
}: {
  cases: Case[];
  responsePagination: Pagination | undefined;
  pagination: {
    currentPage: number;
    limit: number;
  };
}) {
  const permission = await hasPermission("تعديل القضايا المغلقة");
  return (
    <TableBuilder<Case>
      pagination={
        responsePagination && responsePagination.totalCount > 4
          ? pagination
          : undefined
      }
      totalPages={responsePagination?.totalPages || 1}
      tableHeader={
        <div className="flex items-center justify-between w-full md:gap-0 gap-6 md:flex-row flex-col">
          <div className="flex self-start items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-white" />
            <h2 className="text-3xl font-semibold">قضاياي</h2>
          </div>
        </div>
      }
      tableHeadNames={requestHeader}
      tableData={cases}
      headRowClasses="text-center"
      emptyState={
        <TableEmptyState
          title="لا توجد قضايا"
          description="لم يتم العثور على أي قضايا. أضف أول قضية للبدء."
          className="h-fit"
        />
      }
      renderRow={(caseItem) => (
        <TableRow key={caseItem.id}>
          <TableCell className="text-center  truncate max-w-[150px]">
            #{caseItem.caseNumber}
          </TableCell>

          <TableCell className="text-center truncate max-w-[100px]">
            {caseItem.caseTitle}
          </TableCell>

          <TableCell className="text-center truncate max-w-[100px]">
            {caseItem.caseCategory}
          </TableCell>

          <TableCell className="text-center truncate max-w-[100px]">
            {caseItem.clientName}
          </TableCell>

          <TableCell className="text-center truncate max-w-[100px]">
            {caseItem.clientPosition}
          </TableCell>

          <TableCell className="text-center truncate max-w-[100px]">
            {caseItem.opponentName}
          </TableCell>

          <TableCell className="text-center truncate max-w-[100px]">
            {caseItem.courtName}
          </TableCell>

          <TableCell className="text-center truncate max-w-[100px]">
            {caseItem.nextSessionDate ? caseItem.nextSessionDate : "—"}
          </TableCell>

          <TableCell className="text-center">
            <Badge
              variant={getCaseStatusBadge(
                caseItem.isArchived,
                caseItem.isActive,
              )}
            >
              {caseItem.isArchived === 1
                ? "مغلقة"
                : caseItem.isActive === 1
                  ? "نشطة"
                  : "غير نشطة"}
            </Badge>
          </TableCell>

          <TableCell className="text-center truncate max-w-[100px]">
            <div className="flex items-center justify-center gap-2">
              <LinkButton
                disabled={!permission}
                href={`/cases/add-edit-case/${caseItem.id}`}
              >
                <Pencil className="h-4 w-4" />
              </LinkButton>
              <CloseCaseDialog
                caseId={caseItem.id}
                caseNumber={caseItem.caseNumber}
                disabled={caseItem.isArchived === 1}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
