"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useRevokeAttorney } from "../../_hooks/use-attorney";
import { CustomTooltip } from "@/components/common/custom-tooltip";

interface RevokeButtonProps {
  attorneyNumber: string;
}

export default function RevokeButton({ attorneyNumber }: RevokeButtonProps) {
  const { isPending, revokeAttorney } = useRevokeAttorney();

  const handleRevoke = () => {
    revokeAttorney({
      attorneyNumber: attorneyNumber,
      rejectionReason: "تم الإلغاء من قبل المستخدم",
    });
  };

  return (
    <CustomTooltip content="فسخ الوكالة">
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:text-red-400"
        onClick={handleRevoke}
        disabled={isPending}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </CustomTooltip>
  );
}
