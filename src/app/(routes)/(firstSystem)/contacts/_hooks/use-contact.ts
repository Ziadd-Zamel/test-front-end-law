"use client";

import {
  addContactService,
  updateContactService,
  deleteContactService,
  type AddContactPayload,
  type UpdateContactPayload,
} from "@/lib/services/contact.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook for adding a new contact
 */
export function useAddContact() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: AddContactPayload) => {
      const result = await addContactService(data);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إضافة جهة الاتصال بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة جهة الاتصال");
    },
  });

  return {
    isPending,
    error,
    addContact: mutate,
  };
}

/**
 * Hook for updating an existing contact
 */
export function useUpdateContact() {
  const router = useRouter();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: UpdateContactPayload) => {
      const result = await updateContactService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم تحديث جهة الاتصال بنجاح!");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث جهة الاتصال");
    },
  });

  return {
    isPending,
    error,
    updateContact: mutate,
  };
}

/**
 * Hook for deleting a contact
 */
export function useDeleteContact() {
  const router = useRouter();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (contactId: string) => {
      const result = await deleteContactService(contactId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم حذف جهة الاتصال بنجاح!");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف جهة الاتصال");
    },
  });

  return {
    isPending,
    error,
    deleteContact: mutate,
  };
}
