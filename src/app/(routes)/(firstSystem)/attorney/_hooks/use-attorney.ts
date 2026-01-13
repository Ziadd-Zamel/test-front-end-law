/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  addAttorneyService,
  requestAtorneyService,
  revokeAttorneyService,
  validateAttorneyService,
  changeAttorneyStatyService,
  type AttorneyRequestPayload,
  type AttorneyRevokePayload,
  type AttorneyValidationFields,
  type changestatuAtornyProps,
} from "@/lib/services/attorney.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AddAttorneyFields {
  attorneyNumber: string;
  attorneyPdf: {
    file: File;
    name: string;
    description: string;
  };
  clientId: string;
  clientType: "client" | "company";
}

/**
 * Hook for adding a new attorney
 * Accepts FormData with attorney details and files
 */
export function useAddAttorney() {
  const router = useRouter();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async ({
      values,
      validationData,
    }: {
      values: AddAttorneyFields;
      validationData: any;
    }) => {
      const formData = new FormData();
      formData.append("ClientType", values.clientType);
      formData.append("ClientId", values.clientId);
      formData.append("AttorneyPdf", values.attorneyPdf.file);
      formData.append("OriginalFileName", values.attorneyPdf.name);
      formData.append("Description", values.attorneyPdf.description);
      formData.append("AttorneyDetails", JSON.stringify(validationData));

      const result = await addAttorneyService(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: (data) => {
      toast.success("تم إضافة الوكالة بنجاح!");
      const attorneyId = data.id;
      router.push(`/attorney/my-attorneies/${attorneyId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة الوكالة");
    },
  });

  return {
    isPending,
    error,
    addAttorney: mutate,
  };
}

/**
 * Hook for requesting a new attorney
 * Used to create an attorney request with client and attorney details
 */
export function useRequestAttorney() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: AttorneyRequestPayload) => {
      const result = await requestAtorneyService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم طلب الوكالة بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء طلب الوكالة");
    },
  });

  return {
    isPending,
    error,
    requestAttorney: mutate,
  };
}

/**
 * Hook for revoking an attorney
 * Requires attorney number and rejection reason
 */
export function useRevokeAttorney() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: AttorneyRevokePayload) => {
      const result = await revokeAttorneyService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إلغاء الوكالة بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إلغاء الوكالة");
    },
  });

  return {
    isPending,
    error,
    revokeAttorney: mutate,
  };
}

/**
 * Hook for validating an attorney
 * Checks if an attorney number is valid
 */
export function useValidateAttorney() {
  const { isPending, error, mutate, data } = useMutation({
    mutationFn: async (data: AttorneyValidationFields) => {
      const result = await validateAttorneyService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم التحقق من الوكالة بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء التحقق من الوكالة");
    },
  });

  return {
    isPending,
    error,
    validationData: data,
    validateAttorney: mutate,
  };
}
export function useChangeStatuAttorney() {
  const { isPending, error, mutate, data } = useMutation({
    mutationFn: async (data: changestatuAtornyProps) => {
      const result = await changeAttorneyStatyService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إلغاء الوكالة بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء التحقق من الوكالة");
    },
  });

  return {
    isPending,
    error,
    validationData: data,
    revokeAttorney: mutate,
  };
}
