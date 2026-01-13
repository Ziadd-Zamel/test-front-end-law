"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  SettlementSessionFields,
  SettlementSessionSchema,
} from "@/lib/schemas/settlement.schema";
import { useCreateSettlementSession } from "../../../_hooks/use-settlement";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import PdfUploader from "@/components/common/pdf-uploader";

interface CreateSettlementSessionDialogProps {
  requestId: string;
  trigger?: React.ReactNode;
}

export default function CreateSettlementSessionDialog({
  requestId,
  trigger,
}: CreateSettlementSessionDialogProps) {
  const [open, setOpen] = useState(false);

  // Hook
  const { isPending, createSession } = useCreateSettlementSession();

  // Form
  const form = useForm<SettlementSessionFields>({
    resolver: zodResolver(SettlementSessionSchema),
    defaultValues: {
      sessionStatus: "",
      sessionReport: "",
      sessionDate: undefined,
      descriptions: "",
    },
  });

  async function onSubmit(values: SettlementSessionFields) {
    const payload = {
      requestId,
      sessionStatus: values.sessionStatus,
      sessionReport: values.sessionReport,
      sessionDate: values.sessionDate,
      descriptions: values.descriptions,
      settlementPdf: values.settlementPdf ?? undefined,
    };

    createSession(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>إضافة جلسة جديدة</Button>}
      </DialogTrigger>
      <DialogContent className=" w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto hide-scrollbar">
        <DialogHeader className="text-center flex flex-col items-center">
          <DialogTitle className="text-lg text-blue-700">
            إضافة جلسة صلح جديدة
          </DialogTitle>
          <DialogDescription className="sr-only">
            أدخل بيانات الجلسة الجديدة أدناه
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Session Status & Session Date */}
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sessionStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حالة الجلسة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة الجلسة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="تم الصلح">تم الصلح</SelectItem>
                        <SelectItem value="تعذر الصلح"> تعذر الصلح</SelectItem>
                        <SelectItem value="مؤجلة">مؤجلة</SelectItem>
                        <SelectItem value="جلسة قادمة">جلسة قادمة </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionDate"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>تاريخ الجلسة</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date)}
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
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Session Report */}
              <FormField
                control={form.control}
                name="sessionReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تقرير الجلسة</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل تقرير الجلسة"
                        value={field.value || ""}
                        onChange={field.onChange}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descriptions */}
              <FormField
                control={form.control}
                name="descriptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل ملاحظات إضافية"
                        value={field.value || ""}
                        onChange={field.onChange}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="settlementPdf"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    ملف الصلح (PDF)
                  </FormLabel>
                  <FormControl>
                    <PdfUploader
                      value={value}
                      onChange={onChange}
                      maxSizeMB={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    جاري الإضافة...
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "إضافة الجلسة"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
