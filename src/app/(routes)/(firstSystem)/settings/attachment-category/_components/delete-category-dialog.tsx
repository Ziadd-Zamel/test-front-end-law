"use client";

import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAttachmentCategory } from "../_hooks/use-attachment-category";
import { CustomTooltip } from "@/components/common/custom-tooltip";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
}

export default function DeleteCategoryDialog({
  categoryId,
  categoryName,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const { isPending, deleteCategory } = useDeleteAttachmentCategory();

  const handleDelete = () => {
    deleteCategory(categoryId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CustomTooltip content="حذف التصنيف">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isPending}
          >
            <FaRegTrashCan className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      </CustomTooltip>
      <DialogContent className="sm:max-w-md text-start">
        <DialogHeader className="text-right mt-5">
          <DialogTitle className="text-right">حذف التصنيف</DialogTitle>
          <DialogDescription className="text-right">
            هل أنت متأكد من حذف التصنيف &quot;{categoryName}&quot;؟ لا يمكن
            التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "جار الحذف..." : "تأكيد الحذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
