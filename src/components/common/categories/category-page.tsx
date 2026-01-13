import {
  PageEmptyState,
  PageErrorState,
} from "@/components/common/page-states";
import { getSettlementCategories } from "@/lib/api/Settlement.api";
import catchError from "@/lib/utils/catch-error";
import SettlementCategoriesTable from "./category-table";

export default async function CategoryPage({
  pagination,
}: {
  pagination: {
    currentPage: number;
    limit: number;
  };
}) {
  // fetching
  const [payload, error] = await catchError(() =>
    getSettlementCategories({
      pageNumber: pagination.currentPage,
      pageSize: pagination.limit,
      onlyActive: false,
    })
  );

  // error state
  if (error) {
    return <PageErrorState error={error} />;
  }

  // empty state
  if (!payload?.data) {
    return <PageEmptyState />;
  }

  return (
    <div className="w-full space-y-6 box-container py-10">
      <SettlementCategoriesTable
        pagination={pagination}
        responsePagination={payload.pagination}
        categories={payload?.data}
      />
    </div>
  );
}
