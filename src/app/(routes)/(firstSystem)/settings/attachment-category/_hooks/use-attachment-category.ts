"use client";
import {
  addAttachmentCategoryService,
  updateAttachmentCategoryService,
  deleteAttachmentCategoryService,
  type AddCategoryPayload,
  type UpdateCategoryPayload,
} from "@/lib/services/attachment.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook for adding a new attachment category
 */
export function useAddAttachmentCategory() {
  const router = useRouter();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: AddCategoryPayload) => {
      const result = await addAttachmentCategoryService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إضافة الفئة بنجاح!");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة الفئة");
    },
  });

  return {
    isPending,
    error,
    addCategory: mutate,
  };
}

/**
 * Hook for updating an existing attachment category
 */
export function useUpdateAttachmentCategory() {
  const router = useRouter();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: UpdateCategoryPayload) => {
      const result = await updateAttachmentCategoryService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم تحديث الفئة بنجاح!");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الفئة");
    },
  });

  return {
    isPending,
    error,
    updateCategory: mutate,
  };
}

/**
 * Hook for deleting an attachment category
 */
export function useDeleteAttachmentCategory() {
  const router = useRouter();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (categoryId: string) => {
      const result = await deleteAttachmentCategoryService(categoryId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم حذف الفئة بنجاح!");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الفئة");
    },
  });

  return {
    isPending,
    error,
    deleteCategory: mutate,
  };
}
