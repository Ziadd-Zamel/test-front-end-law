"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDeleteSettlementCategory } from "@/app/(routes)/(firstSystem)/settlement/_hooks/use-settlement";

interface DeleteSettlementCategoryDialogProps {
  categoryId: string;
  categoryName: string;
  trigger?: React.ReactNode;
}

export default function DeleteCategoryDialog({
  categoryId,
  categoryName,
  trigger,
}: DeleteSettlementCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { isPending, deleteCategory } = useDeleteSettlementCategory();

  const handleDelete = () => {
    deleteCategory(categoryId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isPending}
          >
            <FaRegTrashCan className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="text-right" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right text-red-500 text-lg">
            حذف تصنيف الصلح
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right text-sm">
            هل أنت متأكد من حذف التصنيف {categoryName}؟ لا يمكن التراجع عن هذا
            الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "جار الحذف..." : "تأكيد الحذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
