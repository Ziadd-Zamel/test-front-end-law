"use client";

import {
  addCaseService,
  closeCaseService,
  editCaseService,
  type AddCasePayload,
  type EditCasePayload,
} from "@/lib/services/cases.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook for adding a new case
 * Used to create a case with client and case details
 */
export function useAddCase() {
  const router = useRouter();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: AddCasePayload) => {
      const result = await addCaseService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إضافة القضية بنجاح!");
      router.push("/cases/list");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة القضية");
    },
  });

  return {
    isPending,
    error,
    addCase: mutate,
  };
}

/**
 * Hook for editing a case
 * Used to update an existing case
 */
export function useEditCase() {
  const router = useRouter();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: EditCasePayload) => {
      const result = await editCaseService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم تعديل القضية بنجاح!");
      router.back();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تعديل القضية");
    },
  });

  return {
    isPending,
    error,
    editCase: mutate,
  };
}

/**
 * Hook for closing a case
 * Used to close an existing case with closure data
 */
export function useCloseCase() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async ({
      formData,
      caseId,
    }: {
      formData: FormData;
      caseId: string;
    }) => {
      const result = await closeCaseService(formData, caseId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },

    onSuccess: () => {
      toast.success("تم إغلاق القضية بنجاح!");
    },

    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إغلاق القضية");
    },
  });

  return {
    isPending,
    error,
    closeCase: mutate,
  };
}
