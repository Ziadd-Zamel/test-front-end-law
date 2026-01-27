/* eslint-disable jsx-a11y/alt-text */
"use client";

import { TableBuilder } from "./table-builder";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image, FileSpreadsheet, File } from "lucide-react";
import { useGenerateFile } from "@/hooks/mutation/use-generate-file";

export interface MailAttachment {
  attechmentId: string;
  originalName: string;
  relativePath: string;
  contentType: string;
  downloadUrl: string | null;
  createdBy: string;
  size: string;
}

interface AttachmentsTableProps {
  attachments: MailAttachment[];
  title?: string;
}

export function AttachmentsTable({
  attachments,
  title,
}: AttachmentsTableProps) {
  const { generateFile, isPending } = useGenerateFile();

  // Get appropriate icon based on file type
  const getFileIcon = (contentType: string, fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    if (
      contentType.startsWith("image/") ||
      ["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")
    ) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    if (
      ["xlsx", "xls", "csv"].includes(ext || "") ||
      contentType.includes("spreadsheet")
    ) {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    }
    if (contentType === "application/pdf" || ext === "pdf") {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  // Format file size
  const formatSize = (size: string) => {
    const bytes = parseFloat(size);
    if (isNaN(bytes)) return size;

    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} كيلوبايت`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} جيجابايت`;
  };

  const handleDownload = (attachment: MailAttachment) => {
    generateFile({
      filepath: attachment.relativePath,
      contentType: attachment.contentType,
      name: attachment.originalName,
    });
  };

  const tableHeadNames = [
    { headName: "نوع الملف", className: "text-right" },
    { headName: "اسم الملف", className: "text-right" },
    { headName: "الحجم", className: "text-right" },
    { headName: "أنشأ بواسطة", className: "text-right" },
    { headName: "الإجراءات", className: "text-center w-[120px]" },
  ];

  const renderRow = (attachment: MailAttachment) => (
    <TableRow key={attachment.attechmentId} className="hover:bg-gray-50">
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {getFileIcon(attachment.contentType, attachment.originalName)}
        </div>
      </TableCell>

      <TableCell className="text-right">
        <span className="font-medium text-gray-900">
          {attachment.originalName}
        </span>
      </TableCell>

      <TableCell className="text-right">
        <span className="text-sm text-gray-600">
          {formatSize(attachment.size)}
        </span>
      </TableCell>

      <TableCell className="text-right">
        <span className="text-sm text-gray-600">{attachment.createdBy}</span>
      </TableCell>

      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownload(attachment)}
          disabled={isPending}
          className="hover:bg-blue-50"
        >
          <Download className="w-4 h-4 ml-2" />
          تحميل
        </Button>
      </TableCell>
    </TableRow>
  );

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12">
      <File className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-lg font-medium text-gray-900">لا توجد مرفقات</p>
      <p className="text-sm text-gray-500 mt-1">لم يتم إرفاق أي ملفات</p>
    </div>
  );

  return (
    <TableBuilder
      tableHeader={
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-gray-900">
            {title || "المرفقات"}
          </h3>
          <span className="text-sm text-gray-500">
            {attachments.length} {attachments.length === 1 ? "ملف" : "ملفات"}
          </span>
        </div>
      }
      tableHeadNames={tableHeadNames}
      tableData={attachments}
      renderRow={renderRow}
      emptyState={emptyState}
      headRowClasses="text-right"
    />
  );
}
