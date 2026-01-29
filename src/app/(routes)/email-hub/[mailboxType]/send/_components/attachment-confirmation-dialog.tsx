"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AttachmentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  message: string;
}

export function AttachmentConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  message,
}: AttachmentConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right mt-5 text-xl">
            تأكيد الإرسال
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right mt-5">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 mt-10">
          <AlertDialogCancel className="w-1/2">إلغاء</AlertDialogCancel>
          <AlertDialogAction className="w-1/2" onClick={onConfirm}>
            إرسال بدون مرفقات
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
