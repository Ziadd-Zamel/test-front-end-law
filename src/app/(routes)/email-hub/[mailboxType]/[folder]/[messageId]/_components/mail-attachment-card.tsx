"use client";

import { Loader2, FileText, File, Image, FileSpreadsheet } from "lucide-react";
import { useGenerateFile } from "@/hooks/mutation/use-generate-file";
import clsx from "clsx";
import { MailAttachment } from "@/lib/api/mail.api";

// Get file extension from filename
function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

// Get appropriate icon for file type
function getFileIcon(extension: string) {
  switch (extension) {
    case "pdf":
      return FileText;

    case "doc":
    case "docx":
    case "txt":
      return FileText;

    case "xls":
    case "xlsx":
    case "csv":
      return FileSpreadsheet;

    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
      return Image;

    default:
      return File;
  }
}

// Get icon color based on file type
function getIconColor(extension: string): string {
  switch (extension) {
    case "pdf":
      return "text-red-500";
    case "doc":
    case "docx":
      return "text-blue-500";
    case "xls":
    case "xlsx":
    case "csv":
      return "text-green-600";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
}

// Format file size
// function formatFileSize(bytes?: number): string {
//   if (!bytes) return "";
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
//   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
// }

export function MailAttachmentCard({ pdf }: { pdf: MailAttachment }) {
  console.log(pdf);
  const { generateFile, isPending } = useGenerateFile();

  const handleDownload = () => {
    if (!isPending)
      generateFile({
        filepath: pdf.relativePath,
        contentType: pdf.contentType,
        name: pdf.originalName,
      });
  };

  const extension = getFileExtension(pdf.originalName);
  const FileIcon = getFileIcon(extension);
  const iconColor = getIconColor(extension);
  //   const fileSize = formatFileSize(pdf.size);

  return (
    <div
      onClick={handleDownload}
      className={clsx(
        "flex items-center gap-2 p-2",
        "bg-white border border-gray-200 rounded-md",
        "cursor-pointer group",
        "hover:bg-gray-50 hover:border-gray-300",
        "transition-all",
        "min-w-0",
        isPending && "opacity-60 cursor-wait",
      )}
    >
      {/* File Icon */}
      <div className={clsx("flex-shrink-0", iconColor)}>
        {isPending ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : (
          <FileIcon className="w-7 h-7" />
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-900 truncate font-normal">
          {pdf.originalName}
        </p>
        {/* {fileSize && <p className="text-xs text-gray-500 mt-0.5">{fileSize}</p>} */}
      </div>
    </div>
  );
}
