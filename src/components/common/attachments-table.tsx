"use client";

import * as React from "react";
import { TableBuilder } from "@/components/common/table-builder";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableEmptyState } from "@/components/common/table-states";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import AttachmentDetailsDialog from "./attachments-dialog";
import { useGenerateFile } from "@/hooks/mutation/use-generate-file";
import { CustomTooltip } from "./custom-tooltip";

const tableHeaders = [
  { headName: "اسم الملف", className: "text-center" },
  { headName: "التصنيف", className: "text-center w-[200px]" },
  { headName: "تم الرفع بواسطة", className: "text-center w-[250px]" },
  { headName: "الحجم", className: "text-center w-[50px]" },
  { headName: "الإجراءات", className: "text-center w-[50px]" },
];

function formatFileSize(size: number) {
  if (!size) return "-";
  const kb = size / 1024;
  const mb = kb / 1024;

  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${kb.toFixed(2)} KB`;
}

type AttachmentsTableProps = {
  attachments: MainAttachment[];
  selectedItems?: MainAttachment[];
  onSelectionChange?: (selected: MainAttachment[]) => void;
};

export default function AttachmentsTable({
  attachments,
  selectedItems,
  onSelectionChange,
}: AttachmentsTableProps) {
  const { generateFile } = useGenerateFile();
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const allSelected =
    selectedItems?.length === attachments.length && attachments.length > 0;

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(attachments);
    }
  };

  const toggleRow = (attachment: MainAttachment) => {
    if (!onSelectionChange) return;
    if (!selectedItems) return;

    if (selectedItems.some((item) => item.id === attachment.id)) {
      onSelectionChange(
        selectedItems.filter((item) => item.id !== attachment.id),
      );
    } else {
      onSelectionChange([...selectedItems, attachment]);
    }
  };

  const handleDownload = (file: MainAttachment) => {
    setDownloadingId(file.id);
    generateFile(
      {
        filepath: file.relativePath,
        name: file.originalName,
      },
      {
        onSettled: () => {
          setDownloadingId(null);
        },
      },
    );
  };

  return (
    <TableBuilder<MainAttachment>
      tableHeader={<></>}
      tableHeadNames={tableHeaders}
      tableData={attachments}
      headRowClasses="text-center"
      emptyState={
        <TableEmptyState
          title="لا توجد مرفقات"
          description="لم يتم إضافة أي مرفقات بعد"
          className="h-fit"
        />
      }
      selectAllHeader={
        onSelectionChange ? (
          <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
        ) : undefined
      }
      renderRow={(file) => (
        <TableRow key={file.id}>
          {onSelectionChange && selectedItems && (
            <TableCell className="text-center w-[70px]">
              <Checkbox
                checked={selectedItems.some((item) => item.id === file.id)}
                onCheckedChange={() => toggleRow(file)}
              />
            </TableCell>
          )}

          <TableCell className="text-center font-medium">
            {file.originalName}
          </TableCell>

          <TableCell className="text-center">
            {file.categoryName || "لا يوجد تصنيف"}
          </TableCell>
          <TableCell className="text-center ">
            {file.uploadedByName || "غير معروف"}
          </TableCell>
          <TableCell className="text-center">
            {formatFileSize(file.size)}
          </TableCell>

          <TableCell className="text-center">
            <CustomTooltip content="تحميل الملف">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(file)}
                disabled={downloadingId === file.id}
                className="h-8 w-8"
              >
                {downloadingId === file.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </CustomTooltip>
            <AttachmentDetailsDialog file={file} />
          </TableCell>
        </TableRow>
      )}
    />
  );
}
