"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { useUpdateAttachmentCategory } from "../_hooks/use-attachment-category";
import { CustomTooltip } from "@/components/common/custom-tooltip";

// Schema for category name validation
const UpdateCategorySchema = z.object({
  categoryName: z
    .string()
    .min(1, "اسم التصنيف مطلوب")
    .min(2, "يجب أن يكون اسم التصنيف حرفين على الأقل")
    .max(100, "يجب ألا يتجاوز اسم التصنيف 100 حرف"),
});

type UpdateCategoryFields = z.infer<typeof UpdateCategorySchema>;

interface UpdateCategoryDialogProps {
  categoryId: string;
  currentCategoryName: string;
}

export default function UpdateCategoryDialog({
  categoryId,
  currentCategoryName,
}: UpdateCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateCategoryFields>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      categoryName: currentCategoryName,
    },
  });

  const { isPending, updateCategory } = useUpdateAttachmentCategory();

  const handleSubmit = (values: UpdateCategoryFields) => {
    updateCategory(
      {
        id: categoryId,
        categoryName: values.categoryName,
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
    form.reset({ categoryName: currentCategoryName });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CustomTooltip content="تعديل التصنيف">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      </CustomTooltip>
      <DialogContent className="sm:max-w-md text-start">
        <DialogHeader className="text-right mt-5">
          <DialogTitle className="text-right">تعديل التصنيف</DialogTitle>
          <DialogDescription className="text-right sr-only">
            قم بتعديل اسم التصنيف أدناه
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم التصنيف</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل اسم التصنيف..."
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "جار التحديث..." : "تحديث"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
