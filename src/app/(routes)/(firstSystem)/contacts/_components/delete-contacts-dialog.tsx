/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteContact } from "../_hooks/use-contact";

interface DeleteContactDialogProps {
  contactId: string;
  contactName: string;
}

export function DeleteContactDialog({
  contactId,
  contactName,
}: DeleteContactDialogProps) {
  const [open, setOpen] = useState(false);
  const { deleteContact, isPending } = useDeleteContact();

  function handleDelete() {
    deleteContact(contactId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>حذف جهة الاتصال</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من حذف جهة الاتصال "{contactName}"؟ هذا الإجراء لا يمكن
            التراجع عنه.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
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
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
