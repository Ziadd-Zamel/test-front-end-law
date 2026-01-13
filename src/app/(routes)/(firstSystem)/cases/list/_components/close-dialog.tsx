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
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import PdfUploader from "@/components/common/pdf-uploader";
import { useCloseCase } from "../../_hooks/use-cases";
import { toast } from "sonner";

const CloseCaseReasonSchema = z.object({
  reason: z
    .string()
    .min(1, "سبب الإغلاق مطلوب")
    .min(10, "يجب أن يكون سبب الإغلاق 10 أحرف على الأقل")
    .max(500, "يجب ألا يتجاوز سبب الإغلاق 500 حرف"),
  endDate: z.string().min(1, "تاريخ انتهاء القضية مطلوب"),
  casePdf: z
    .object({
      file: z.instanceof(File),
      name: z.string().min(1, "اسم الملف مطلوب"),
      description: z.string().min(1, "وصف الملف مطلوب"),
    })
    .refine((data) => data.file.size <= 5000000, {
      message: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
      path: ["file"],
    })
    .refine((data) => data.file.type === "application/pdf", {
      message: "يجب أن يكون الملف بصيغة PDF",
      path: ["file"],
    })
    .optional()
    .nullable(),
});

type CloseCaseReasonFields = z.infer<typeof CloseCaseReasonSchema>;

interface CloseCaseDialogProps {
  caseId: number;
  caseNumber: string;
  disabled?: boolean;
}

export default function CloseCaseDialog({
  caseId,
  caseNumber,
}: CloseCaseDialogProps) {
  const [open, setOpen] = useState(false);
  const { isPending, closeCase } = useCloseCase();
  const form = useForm<CloseCaseReasonFields>({
    resolver: zodResolver(CloseCaseReasonSchema),
    defaultValues: {
      reason: "",
      endDate: "",
    },
  });

  const handleSubmit = (values: CloseCaseReasonFields) => {
    if (
      !values.casePdf?.file ||
      !values.casePdf.name?.trim() ||
      !values.casePdf.description?.trim()
    ) {
      toast.error("يجب رفع ملف القضية و ملئ بياناته");
      return;
    }
    // Convert date from YYYY-MM-DD to YYYY-MM-DD HH:MM:SS.ffffff format
    const date = new Date(values.endDate);
    const formattedDate = `${values.endDate} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${date.getMilliseconds().toString().padStart(6, "0")}`;

    const formData = new FormData();
    formData.append("CaseId", caseId.toString());
    formData.append("CloseDate", formattedDate);
    formData.append("CaseClosureReport", values.reason);
    formData.append("JudgmentDocument", values.casePdf?.file);
    formData.append("JudgmentOriginalFileName", values.casePdf?.name);
    formData.append("JudgmentDocumentDescription", values.casePdf?.description);

    closeCase(
      { formData, caseId: caseId.toString() },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

      <DialogContent className="sm:max-w-md text-start pt-12 max-h-[90vh] hide-scrollbar overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>إغلاق القضية</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من إغلاق القضية رقم #{caseNumber}؟ يرجى إدخال سبب
            الإغلاق.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>تاريخ انتهاء القضية</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value ? new Date(field.value) : undefined}
                      setDate={(date) => {
                        const dateString = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        field.onChange(dateString);
                      }}
                      placeholder="اختر تاريخ الميلاد"
                      className={cn(
                        fieldState.error && "border-red-500 focus:border-none"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سبب الإغلاق</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="أدخل سبب إغلاق القضية..."
                      className="min-h-24 resize-none"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="casePdf"
              render={({ field: { value, onChange } }) => (
                <FormItem className="">
                  <FormLabel className="text-base font-semibold">
                    ملف القضية (PDF)
                  </FormLabel>
                  <FormControl>
                    <PdfUploader
                      value={value}
                      onChange={(file) => {
                        onChange(file);
                      }}
                      maxSizeMB={10}
                      disabled={isPending}
                      size="small"
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
                {isPending ? "جار الإغلاق..." : "تأكيد الإغلاق"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
