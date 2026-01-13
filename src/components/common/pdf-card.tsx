"use client";

import { Download, FileText, Loader2 } from "lucide-react";
import { useGenerateFile } from "@/hooks/mutation/use-generate-file";
import clsx from "clsx";
import { MailAttachment } from "@/lib/api/mail.api";

// Type guard to check if it's a SettlementAttachment
function isSettlementAttachment(
  pdf: SettlementAttachments | MailAttachment
): pdf is SettlementAttachments {
  return "description" in pdf;
}

export function PdfCard({
  pdf,
  variant = "horizontal",
}: {
  pdf: SettlementAttachments | MailAttachment;
  variant?: "horizontal" | "square";
}) {
  const { generateFile, isPending } = useGenerateFile();

  const handleDownload = () => {
    if (!isPending) generateFile(pdf.relativePath);
  };

  const isSettlement = isSettlementAttachment(pdf);

  // Square variant for mail attachments - Icon only
  if (variant === "square") {
    return (
      <div
        onClick={handleDownload}
        className={clsx(
          "flex items-center justify-center",
          "w-16 h-16 sm:w-20 sm:h-20",
          "border rounded-lg",
          "cursor-pointer transition",
          "hover:bg-gray-50 hover:shadow-md hover:scale-105",
          "bg-red-50 text-red-600",
          isPending && "opacity-60 cursor-not-allowed"
        )}
        title={pdf.originalName} // Tooltip on hover
      >
        {isPending ? (
          <Loader2 className="size-8 sm:size-10 animate-spin" />
        ) : (
          <FileText className="size-8 sm:size-10" />
        )}
      </div>
    );
  }

  // Horizontal variant (original design)
  return (
    <div
      onClick={handleDownload}
      className={clsx(
        "flex items-center gap-3 sm:gap-4",
        "p-3 sm:p-4",
        "border rounded-lg sm:rounded-xl",
        "cursor-pointer transition",
        "hover:bg-gray-50 hover:shadow-sm",
        isPending && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* PDF Icon */}
      <div
        className="
          flex items-center justify-center
          w-10 h-10 sm:w-12 sm:h-12
          rounded-md sm:rounded-lg
          bg-red-50 text-red-600
          shrink-0
        "
      >
        <FileText className="size-5 sm:size-6" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-medium truncate">
          {pdf.originalName}
        </p>

        {isSettlement && pdf.description && (
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {pdf.description}
          </p>
        )}

        {isSettlement && pdf.uploadedAt && (
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
            {pdf.uploadedAt}
          </p>
        )}
      </div>

      {/* Download / Loader */}
      <div className="text-muted-foreground shrink-0">
        {isPending ? (
          <Loader2 className="size-4 sm:size-5 animate-spin" />
        ) : (
          <Download className="size-4 sm:size-5" />
        )}
      </div>
    </div>
  );
}
