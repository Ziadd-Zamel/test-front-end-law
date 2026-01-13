import { GetCaseCountByCategory } from "@/lib/api/cases";
import catchError from "@/lib/utils/catch-error";
import CategoryStatsChart from "./category-stats-chart";
import { PageEmptyState } from "@/components/common/page-states";

export default async function CasesChart() {
  const [cases, error] = await catchError(() => GetCaseCountByCategory());

  if (!cases) {
    return <PageEmptyState />;
  }

  if (error) {
    return <PageEmptyState />;
  }
  return (
    <div className="h-[500px] relative">
      <CategoryStatsChart caseCountData={cases?.data.categories} />
    </div>
  );
}
