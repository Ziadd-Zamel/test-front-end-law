"use client";

import * as React from "react";
import { TableBuilder } from "@/components/common/table-builder";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableEmptyState } from "@/components/common/table-states";
import { SETTLEMENT_SESSION_TABLE_HEADERS } from "@/lib/constants/settlement.constant";
import CreateSettlementSessionDialog from "./settlement-session-dialog";
import { ExportButton } from "@/components/common/export-button";

// ==================== HELPERS ====================

const getBadgeVariant = (
  status: SettlementSession["sessionStatus"]
): "success" | "error" | "warning" | "info" | "neutral" => {
  switch (status) {
    case "تم الصلح":
      return "success";
    case "تعذر الصلح":
      return "error";
    case "مؤجلة":
      return "warning";
    default:
      return "neutral";
  }
};

export default function SettlementSessionsTable({
  sessions,
  requestId,
  CanAddCase = true,
}: {
  sessions: SettlementSession[];
  requestId: string;
  CanAddCase?: boolean;
}) {
  return (
    <TableBuilder<SettlementSession>
      hasFooter
      tableHeader={
        <div className="flex items-center justify-between w-full md:flex-row flex-col gap-6">
          <div className="flex self-start items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-white" />
            <h2 className="text-3xl font-semibold">جلسات الصلح</h2>
          </div>
          {CanAddCase && (
            <CreateSettlementSessionDialog requestId={requestId} />
          )}
        </div>
      }
      tableHeadNames={SETTLEMENT_SESSION_TABLE_HEADERS}
      tableData={sessions}
      headRowClasses="text-center"
      emptyState={
        <TableEmptyState
          title="لا توجد جلسات"
          description="لم يتم العثور على أي جلسات تسوية حتى الآن."
          className="h-fit"
        />
      }
      renderRow={(session) => (
        <TableRow key={session.id}>
          <TableCell className="text-center">{session.sessionNumber}</TableCell>

          <TableCell className="text-center">
            {session.sessionDateFormatted}
          </TableCell>

          <TableCell className="text-center">
            <div className="flex justify-center">
              <Badge variant={getBadgeVariant(session.sessionStatus)}>
                {session.sessionStatus}
              </Badge>
            </div>
          </TableCell>
          <TableCell className="text-center">
            <ExportButton
              iconOnly
              entityId={session.id}
              exportType="SettlementRequestSessionReport"
            />
          </TableCell>
        </TableRow>
      )}
    />
  );
}
