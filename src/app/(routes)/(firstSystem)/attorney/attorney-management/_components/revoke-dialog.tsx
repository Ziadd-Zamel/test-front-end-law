"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaRegTrashCan } from "react-icons/fa6";
import { useChangeStatuAttorney } from "../../_hooks/use-attorney";
import { CustomTooltip } from "@/components/common/custom-tooltip";

// Schema for revoke reason validation
const RevokeReasonSchema = z.object({
  reason: z
    .string()
    .min(1, "سبب الإلغاء مطلوب")
    .min(10, "يجب أن يكون سبب الإلغاء 10 أحرف على الأقل")
    .max(500, "يجب ألا يتجاوز سبب الإلغاء 500 حرف"),
});

type RevokeReasonFields = z.infer<typeof RevokeReasonSchema>;

interface RevokeDialogProps {
  attorneyId: number;
  attorneyNumber: string;
  disabled?: boolean;
}

export default function RevokeDialog({
  attorneyId,
  attorneyNumber,
  disabled = false,
}: RevokeDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<RevokeReasonFields>({
    resolver: zodResolver(RevokeReasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { isPending, revokeAttorney } = useChangeStatuAttorney();
  const handleSubmit = (values: RevokeReasonFields) => {
    revokeAttorney(
      {
        attorneyId,
        reason: values.reason || "",
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      },
    );
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CustomTooltip content=" إلغاء الوكالة">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700  hover:bg-red-50"
            disabled={isPending || !disabled}
          >
            <FaRegTrashCan className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      </CustomTooltip>
      <DialogContent className="sm:max-w-md text-start pt-12">
        <DialogHeader className="sr-only">
          <div className="flex items-center gap-2">
            <DialogTitle>إلغاء الوكالة</DialogTitle>
          </div>
          <DialogDescription>
            هل أنت متأكد من إلغاء الوكالة رقم #{attorneyNumber}؟ يرجى إدخال سبب
            الإلغاء أدناه.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سبب الإلغاء</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="أدخل سبب إلغاء الوكالة..."
                      className="min-h-24 resize-none"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                إلغاء
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "جار الإلغاء..." : "تأكيد الإلغاء"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
