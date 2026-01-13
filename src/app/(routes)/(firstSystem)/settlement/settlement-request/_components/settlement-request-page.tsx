import { TableErrorState } from "@/components/common/table-states";
import SettlementTable from "./settlement-table";
import { getAllSettlement } from "@/lib/api/Settlement.api";
import catchError from "@/lib/utils/catch-error";

export default async function SettlementRequestPage({
  pagination,
  status,
}: {
  pagination: {
    currentPage: number;
    limit: number;
  };
  status: string;
}) {
  // fetching
  const [payload, error] = await catchError(() =>
    getAllSettlement({
      PageNumber: pagination.currentPage,
      pageSize: pagination.limit,
      status,
    })
  );

  // error state
  if (error) {
    return <TableErrorState error={error} />;
  }

  // table
  return (
    <div className="w-full box-container pt-20 pb-10">
      <SettlementTable
        settlements={payload?.data || []}
        responsePagination={payload?.pagination}
        pagination={pagination}
      />
    </div>
  );
}
