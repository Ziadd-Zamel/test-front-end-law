import { Suspense } from "react";
import SettlementSessionPage from "./_components/settlement-session-page";
import SettlementDetailsSkeleton from "./_components/settlement-details-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{
    settlementId?: string;
  }>;
}) {
  // resolve params
  const resolvedParams = await params;
  return (
    <Suspense fallback={<SettlementDetailsSkeleton />}>
      <SettlementSessionPage settlementId={resolvedParams.settlementId || ""} />
    </Suspense>
  );
}
