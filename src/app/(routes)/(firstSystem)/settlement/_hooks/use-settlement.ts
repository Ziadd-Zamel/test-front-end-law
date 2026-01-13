"use client";

import {
  createSettlementCategoryService,
  updateSettlementCategoryService,
  deleteSettlementCategoryService,
  createSettlementRequestService,
  updateSettlementRequestService,
  createSettlementSessionService,
  updateSettlementSessionService,
  type SettlementCategoryCreatePayload,
  type SettlementCategoryUpdatePayload,
  type SettlementSessionUpdatePayload,
} from "@/lib/services/settlement.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ==================== SETTLEMENT CATEGORY HOOKS ====================
type MutationPayload = {
  formData: FormData;
  setFormKey?: React.Dispatch<React.SetStateAction<number>>;
};
export type CreateSettlementSessionPayload = {
  requestId: string;
  sessionStatus: "" | "مؤجلة" | "تعذر الصلح" | "تم الصلح" | "جلسة قادمة";
  sessionReport: string;
  sessionDate: Date;
  descriptions?: string;
  settlementPdf?: {
    file?: File;
    name?: string;
    description?: string;
  };
};

/**
 * Hook for creating a new settlement request category
 */
export function useCreateSettlementCategory() {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (data: SettlementCategoryCreatePayload) => {
      const result = await createSettlementCategoryService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إضافة تصنيف الصلح بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة تصنيف الصلح");
    },
  });

  return {
    isPending,
    error,
    createCategory: mutate,
    createCategoryAsync: mutateAsync,
  };
}

/**
 * Hook for updating a settlement request category
 */
export function useUpdateSettlementCategory() {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (data: SettlementCategoryUpdatePayload) => {
      const result = await updateSettlementCategoryService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم تحديث تصنيف الصلح بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث تصنيف الصلح");
    },
  });

  return {
    isPending,
    error,
    updateCategory: mutate,
    updateCategoryAsync: mutateAsync,
  };
}

/**
 * Hook for deleting a settlement request category
 */
export function useDeleteSettlementCategory() {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteSettlementCategoryService(id);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم حذف تصنيف الصلح بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف تصنيف الصلح");
    },
  });

  return {
    isPending,
    error,
    deleteCategory: mutate,
    deleteCategoryAsync: mutateAsync,
  };
}

// ==================== SETTLEMENT REQUEST HOOKS ====================

/**
 * Hook for creating a new settlement request
 * Accepts FormData with settlement request details and files
 */
export function useCreateSettlementRequest() {
  const router = useRouter();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async ({ formData }: MutationPayload) => {
      const result = await createSettlementRequestService(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("تم إنشاء طلب الصلح بنجاح!");
      router.push("/settlement/settlement-request");
      if (variables.setFormKey) {
        variables.setFormKey((prev) => prev + 1);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء طلب الصلح");
    },
  });

  return {
    isPending,
    error,
    createRequest: mutate,
    createRequestAsync: mutateAsync,
  };
}

/**
 * Hook for updating a settlement request
 * Accepts FormData with updated settlement request details and files
 */
export function useUpdateSettlementRequest() {
  const router = useRouter();
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async ({ formData }: MutationPayload) => {
      const result = await updateSettlementRequestService(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("تم تحديث طلب الصلح بنجاح!");
      router.push("/settlement/settlement-request");
      if (variables.setFormKey) {
        variables.setFormKey((prev) => prev + 1);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث طلب الصلح");
    },
  });

  return {
    isPending,
    error,
    updateRequest: mutate,
    updateRequestAsync: mutateAsync,
  };
}

// ==================== SETTLEMENT SESSION HOOKS ====================

/**
 * Hook for creating a new settlement request session
 * Accepts FormData with session details and files
 */
export function useCreateSettlementSession() {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (data: CreateSettlementSessionPayload) => {
      if (
        data.sessionStatus !== "مؤجلة" &&
        (!data.settlementPdf?.file ||
          !data.settlementPdf.name?.trim() ||
          !data.settlementPdf.description?.trim())
      ) {
        throw new Error("يجب رفع ملف الصلح و ملئ بياناته");
      }

      // ==================== DATE FORMAT ====================
      const date = new Date(data.sessionDate);

      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(2, "0")}.${String(
        date.getMilliseconds()
      ).padStart(6, "0")}`;

      // ==================== FORM DATA ====================
      const formData = new FormData();
      formData.append("RequestId", data.requestId);
      formData.append("SessionStatus", data.sessionStatus);
      formData.append("SessionReport", data.sessionReport);
      formData.append("SessionDate", formattedDate);

      if (data.descriptions) {
        formData.append("Descriptions", data.descriptions);
      }

      if (data.settlementPdf?.file) {
        formData.append("Attachments[0]", data.settlementPdf.file);
        formData.append("Descriptions[0]", data.settlementPdf.description!);
        formData.append("OriginalFilesName[0]", data.settlementPdf.name!);
      }
      const result = await createSettlementSessionService(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إنشاء جلسة الصلح بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء جلسة الصلح");
    },
  });

  return {
    isPending,
    error,
    createSession: mutate,
    createSessionAsync: mutateAsync,
  };
}

/**
 * Hook for updating a settlement request session
 */
export function useUpdateSettlementSession() {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (data: SettlementSessionUpdatePayload) => {
      const result = await updateSettlementSessionService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم تحديث جلسة الصلح بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث جلسة الصلح");
    },
  });

  return {
    isPending,
    error,
    updateSession: mutate,
    updateSessionAsync: mutateAsync,
  };
}
