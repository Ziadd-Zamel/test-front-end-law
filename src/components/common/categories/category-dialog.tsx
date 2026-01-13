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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import {
  SettlementCategoryFields,
  SettlementCategorySchema,
} from "@/lib/schemas/settlement.schema";
import {
  useCreateSettlementCategory,
  useUpdateSettlementCategory,
} from "@/app/(routes)/(firstSystem)/settlement/_hooks/use-settlement";

interface SettlementCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface SettlementCategoryDialogProps {
  category?: SettlementCategory | null;
  trigger?: React.ReactNode;
}

export default function CategoryDialog({
  category,
  trigger,
}: SettlementCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(category);

  // Hooks
  const { isPending: isCreating, createCategory } =
    useCreateSettlementCategory();
  const { isPending: isUpdating, updateCategory } =
    useUpdateSettlementCategory();

  // Form
  const form = useForm<SettlementCategoryFields>({
    resolver: zodResolver(SettlementCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      isActive: category?.isActive ?? true,
    },
  });

  async function onSubmit(values: SettlementCategoryFields) {
    if (isEdit && category) {
      // Update existing category
      updateCategory(
        {
          id: category.id,
          ...values,
        },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
        }
      );
    } else {
      // Create new category
      createCategory(values, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  }

  const isSubmitting = isCreating || isUpdating;

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
        {trigger || (
          <Button>{isEdit ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="text-center flex flex-col items-center">
          <DialogTitle className="text-lg text-blue-700">
            {isEdit ? "تعديل تصنيف الصلح" : "إضافة تصنيف صلح جديد"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit
              ? "قم بتعديل بيانات التصنيف أدناه"
              : "أدخل بيانات التصنيف الجديد أدناه"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم التصنيف</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم التصنيف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل وصفاً للتصنيف"
                      value={field.value || ""}
                      onChange={field.onChange}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status Field */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">حالة التصنيف</FormLabel>
                    <FormDescription>
                      هل هذا التصنيف نشط ومتاح للاستخدام؟
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                className="w-1/2"
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-1/2">
                {isSubmitting ? (
                  <>
                    {isEdit ? "جاري التعديل..." : "جاري الإضافة..."}
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>{isEdit ? "تعديل" : "إضافة"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
