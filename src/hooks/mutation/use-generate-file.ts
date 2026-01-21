"use client";

import { generateFile } from "@/lib/services/shared.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/* -------------------------------------------- 
   MIME type resolver 
--------------------------------------------- */
function getMimeType(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xls":
      return "application/vnd.ms-excel";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc":
      return "application/msword";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "zip":
      return "application/zip";
    case "csv":
      return "text/csv";
    default:
      return "application/octet-stream";
  }
}

/* -------------------------------------------- 
   Base64 → Uint8Array (safe for large files) 
--------------------------------------------- */
function base64ToUint8Array(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

/* -------------------------------------------- 
   Download helper 
--------------------------------------------- */
function downloadFile(bytes: Uint8Array, fileName: string, mimeType?: string) {
  const contentType = mimeType || getMimeType(fileName);

  const blob = new Blob([new Uint8Array(bytes)], { type: contentType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* -------------------------------------------- 
   Hook 
--------------------------------------------- */
export function useGenerateFile() {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async ({
      filepath,
      contentType,
      name,
    }: {
      filepath: string;
      contentType?: string;
      name?: string;
    }) => {
      const result = await generateFile(filepath);

      if (!result.success) {
        throw new Error(result.message || "Failed to generate file");
      }
      console.log(result);
      // Return both the API response and the passed parameters
      return {
        ...result.data,
        passedContentType: contentType,
        passedName: result.data.fileName || name,
      };
    },

    onSuccess: (data) => {
      try {
        if (!data?.fileBytes) {
          throw new Error("Invalid file response");
        }

        // Use passed name if available, otherwise fall back to API response
        const fileName = data.passedName || data.fileName;

        if (!fileName) {
          throw new Error("No file name available");
        }

        const bytes = base64ToUint8Array(data.fileBytes);

        // Use passed contentType if available, otherwise fall back to API response or getMimeType
        const contentType = data.passedContentType || data.contentType;

        downloadFile(bytes, fileName, contentType);

        toast.success("تم تحميل الملف بنجاح!");
      } catch (err) {
        console.error("Download error:", err);
        toast.error("فشل تحميل الملف");
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الملف");
    },
  });

  return {
    isPending,
    error,
    generateFile: mutate,
    mutateAsync,
  };
}
