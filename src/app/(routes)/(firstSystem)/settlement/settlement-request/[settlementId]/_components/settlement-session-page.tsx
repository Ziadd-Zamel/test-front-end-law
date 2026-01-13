import {
  PageEmptyState,
  PageErrorState,
} from "@/components/common/page-states";
import { getSettlementById } from "@/lib/api/Settlement.api";
import catchError from "@/lib/utils/catch-error";
import SettlementSessionsTable from "./settlement-session-table";
import SettlementDetailsView from "./settlement-details-view";

export default async function SettlementSessionPage({
  settlementId,
}: {
  settlementId: string;
}) {
  // fetching
  const [payload, error] = await catchError(() =>
    getSettlementById(settlementId)
  );

  // error state
  if (error) {
    return <PageErrorState error={error} />;
  }

  // empty state
  if (!payload?.data) {
    return <PageEmptyState />;
  }
  const lastSession =
    payload?.data.sessions?.[payload.data.sessions.length - 1];
  const isLastSessionSettled = lastSession?.sessionStatus === "تم الصلح";
  return (
    <div className="w-full space-y-6 box-container py-10">
      <SettlementDetailsView data={payload.data} />
      <SettlementSessionsTable
        sessions={payload?.data.sessions}
        requestId={payload.data.id}
        CanAddCase={!isLastSessionSettled}
      />
    </div>
  );
}
