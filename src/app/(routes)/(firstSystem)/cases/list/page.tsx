import { Suspense } from "react";
import CasesChart from "./_components/cases-chart";
import CasesData from "./_components/cases-data";
import CategoryStatsChartSkeleton from "./_components/skeletons/category-stats-chart-skeleton";
import CasesStatsCards from "./_components/cases-stats-cards";
import CasesStatsCardsSkeleton from "./_components/skeletons/cases-stats-cards-skeleton";
import TableSkeleton from "@/components/common/table-skeleton";

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
    <div className=" w-full box-container pt-20 pb-10 flex flex-col gap-10">
      <Suspense fallback={<CasesStatsCardsSkeleton />}>
        <CasesStatsCards />
      </Suspense>
      <Suspense fallback={<CategoryStatsChartSkeleton />}>
        <CasesChart />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <CasesData mainLimit={mainLimit} mainPage={mainPage} />
      </Suspense>
    </div>
  );
}
