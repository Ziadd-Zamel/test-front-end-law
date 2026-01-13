"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { exportDataService } from "@/lib/services/shared.service";

/**
 * Hook for exporting/downloading data
 */
export function useExportData() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async ({
      exportType,
      entityId,
    }: {
      exportType: string;
      entityId: string;
    }) => {
      const result = await exportDataService(exportType, entityId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: (data) => {
      if (data?.fileBytes && data?.fileName) {
        try {
          // Decode base64 to binary
          const binaryString = atob(data.fileBytes);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Create blob and download
          const blob = new Blob([bytes], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = data.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success("تم تحميل الملف بنجاح!");
        } catch (err) {
          console.error("Download error:", err);
          toast.error("فشل تحميل الملف");
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الملف");
    },
  });

  return {
    isPending,
    error,
    exportData: mutate,
  };
}
