"use client";

import {
  sendMailService,
  sendEmployeeMailService,
  sendAutoMailService,
  replayMailService,
  searchMailService,
  logMailReadService,
  type sendMailBody,
  type sendEmployeeMailBody,
  type sendAutoMailBody,
  type replayMailBody,
  type searchMailBody,
  updateMessageService,
  updateMessageBody,
} from "@/lib/services/mail.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for sending mail to clients
 * Used to send mail with attachments and references
 */
export function useSendMail() {
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: sendMailBody) => {
      const result = await sendMailService({ body: data });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إرسال البريد بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["mail"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إرسال البريد");
    },
  });

  return {
    isPending,
    error,
    sendMail: mutate,
  };
}

/**
 * Hook for sending mail to employees
 * Used for internal employee communication
 */
export function useSendEmployeeMail() {
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: sendEmployeeMailBody) => {
      const result = await sendEmployeeMailService({ body: data });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إرسال البريد للموظف بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["mail"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إرسال البريد");
    },
  });

  return {
    isPending,
    error,
    sendEmployeeMail: mutate,
  };
}

/**
 * Hook for sending auto-notification emails
 * Used for automated system notifications
 */
export function useSendAutoMail() {
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: sendAutoMailBody) => {
      const result = await sendAutoMailService({ body: data });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إرسال الإشعار التلقائي بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["mail"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إرسال الإشعار");
    },
  });

  return {
    isPending,
    error,
    sendAutoMail: mutate,
  };
}

/**
 * Hook for replying to mail
 * Used to reply to existing emails with attachments
 */
export function useReplyMail() {
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: replayMailBody) => {
      const result = await replayMailService({ body: data });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم الرد على البريد بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["mail"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء الرد على البريد");
    },
  });

  return {
    isPending,
    error,
    replyMail: mutate,
  };
}

/**
 * Hook for searching mail
 * Used to search emails by reference type and ID
 */
export function useSearchMail() {
  const { isPending, error, mutate, data } = useMutation({
    mutationFn: async ({
      body,
      mailboxType,
      pageNumber,
      pageSize,
    }: {
      body: searchMailBody;
      mailboxType: mailboxType;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      const result = await searchMailService({
        body,
        mailboxType,
        pageNumber,
        pageSize,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء البحث في البريد");
    },
  });

  return {
    isPending,
    error,
    searchMail: mutate,
    searchResults: data,
  };
}

/**
 * Hook for logging mail read status
 * Used to track when emails are read
 */
export function useLogMailRead() {
  const queryClient = useQueryClient();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (mailId: string) => {
      const result = await logMailReadService(mailId);
      console.log(result);
      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mail"] });
    },
    onError: (error: Error) => {
      console.error("Failed to log mail read:", error.message);
    },
  });

  return {
    isPending,
    error,
    logMailRead: mutate,
  };
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: updateMessageBody) => {
      const result = await updateMessageService(data);
      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم تحديث المرجع بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["mail"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث المرجع");
    },
  });

  return {
    isPending,
    error,
    updateMessage: mutate,
  };
}
