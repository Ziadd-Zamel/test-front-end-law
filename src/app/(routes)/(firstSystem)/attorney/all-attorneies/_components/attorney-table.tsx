import * as React from "react";
import { TableBuilder } from "@/components/common/table-builder";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AllAttorney, UserAttorney } from "@/lib/types/attorney";
import { TableEmptyState } from "@/components/common/table-states";
import FilterSelect from "@/components/common/filter-select";
import RevokeButton from "./revoke-button";
import { Eye } from "lucide-react";
import { Pagination } from "@/lib/types/api";
import LinkButton from "@/components/common/link-button";
import ClientsFilter from "@/components/common/clients-filter";

// Map Arabic statuses to generic badge variants
const getBadgeVariant = (
  status: UserAttorney["attorneyStatus"],
): "success" | "error" | "warning" | "info" | "neutral" => {
  switch (status) {
    case "معتمدة":
      return "success";
    case "منتهية":
    case "مفسوخة كلياً":
      return "error";
    default:
      return "neutral";
  }
};

const requestHeader = [
  { headName: "رقم الوكالة", className: "text-center" },
  { headName: "اسم العميل", className: "text-center" },
  { headName: "تاريخ الإصدار", className: "text-center" },
  { headName: "تاريخ الانتهاء", className: "text-center" },
  { headName: "الحالة", className: "text-center" },
  { headName: "الإجرائات", className: "text-center" },
];

const statuesFilter = [
  { label: "منتهية", value: "550e8400-e29b-41d4-a716-446655440002" },
  { label: "معتمدة", value: "550e8400-e29b-41d4-a716-446655440000" },
  { label: "مفسوخة كلياً", value: "550e8400-e29b-41d4-a716-446655440001 " },
];

export default function AttorneyTable({
  attorney,
  pagination,
  responsePagination,
}: {
  attorney: AllAttorney[];
  responsePagination: Pagination | undefined;
  pagination: {
    currentPage: number;
    limit: number;
  };
}) {
  return (
    <TableBuilder<AllAttorney>
      pagination={
        responsePagination && responsePagination.totalCount > 5
          ? pagination
          : undefined
      }
      totalPages={responsePagination?.totalPages || 1}
      tableHeader={
        <>
          <div className="flex items-center justify-between w-full md:gap-0 gap-6 md:flex-row flex-col">
            <div className="flex self-start items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-white" />
              <h2 className="text-3xl font-semibold">الوكالات</h2>
            </div>
            <div className="flex items-center gap-4 self-end sm:flex-row flex-col">
              <ClientsFilter />
              <FilterSelect
                filterItems={statuesFilter}
                filterName="status"
                placeholder="اختر الحالة"
              />
            </div>
          </div>
        </>
      }
      tableHeadNames={requestHeader}
      tableData={attorney}
      headRowClasses="text-center"
      emptyState={
        <TableEmptyState
          title="لا توجد وكالات قانونية"
          description="لم يتم العثور على أي وكالات قانونية. أضف أول وكالة للبدء."
          className="h-fit"
        />
      }
      renderRow={(request) => (
        <TableRow key={request.id}>
          <TableCell className="text-center">
            #{request.attorneyNumber}
          </TableCell>
          <TableCell className="text-center">
            <p className="font-medium">{request.clientName}</p>
          </TableCell>
          <TableCell className="text-center">
            <p className="text-sm font-medium">{request.issueDate}</p>
          </TableCell>
          <TableCell className="text-center">
            <p className="text-sm font-medium">{request.expiryDate}</p>
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
              <LinkButton href={`/attorney/all-attorneies/${request.id}`}>
                <Eye className="h-4 w-4" />
              </LinkButton>
              <RevokeButton
                attorneyNumber={request.attorneyNumber.toString()}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
