import { Suspense } from "react";
import TableSkeleton from "@/components/common/table-skeleton";
import CategoryPage from "@/components/common/categories/category-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    pageNumber?: string;
    pageSize?: string;
  }>;
}) {
  // Resolve Params
  const resolvedParams = await searchParams;

  // variables
  const mainPage = Math.max(1, Number(resolvedParams.pageNumber) || 1);
  const mainLimit = Math.max(
    1,
    Math.min(50, Number(resolvedParams.pageSize) || 5)
  );
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CategoryPage
        pagination={{
          currentPage: mainPage,
          limit: mainLimit,
        }}
      />
    </Suspense>
  );
}
