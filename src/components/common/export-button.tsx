"use client";

import { Button } from "@/components/ui/button";
import { useExportData } from "@/hooks/mutation/use-export-data";
import { Loader2 } from "lucide-react";
import { TbFileExport } from "react-icons/tb";

interface ExportButtonProps {
  exportType: string;
  entityId: string;
  iconOnly?: boolean;
}

export function ExportButton({
  exportType,
  entityId,
  iconOnly = false,
}: ExportButtonProps) {
  const { exportData, isPending } = useExportData();

  const handleGenerate = () => {
    exportData({ exportType, entityId });
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isPending}
      variant={iconOnly ? "ghost" : "default"}
      size={iconOnly ? "icon" : "default"}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <TbFileExport size={26} />
      )}

      {!iconOnly && (
        <span>{isPending ? "جاري تصدير الملف..." : "تصدير الملف"}</span>
      )}
    </Button>
  );
}
