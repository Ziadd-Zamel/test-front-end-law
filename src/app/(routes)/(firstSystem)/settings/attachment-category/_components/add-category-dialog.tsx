"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";

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
import { useAddAttachmentCategory } from "../_hooks/use-attachment-category";

// Schema for category name validation
const AddCategorySchema = z.object({
  categoryName: z
    .string()
    .min(1, "اسم التصنيف مطلوب")
    .min(2, "يجب أن يكون اسم التصنيف حرفين على الأقل")
    .max(100, "يجب ألا يتجاوز اسم التصنيف 100 حرف"),
});

type AddCategoryFields = z.infer<typeof AddCategorySchema>;

export default function AddCategoryDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<AddCategoryFields>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  const { isPending, addCategory } = useAddAttachmentCategory();

  const handleSubmit = (values: AddCategoryFields) => {
    addCategory(
      {
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
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة تصنيف جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-start">
        <DialogHeader className="text-right mt-5">
          <DialogTitle className="text-right mb-3">
            إضافة تصنيف جديدة
          </DialogTitle>
          <DialogDescription className="text-right sr-only">
            أدخل اسم التصنيف الجديدة للمرفقات
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
                {isPending ? "جار الإضافة..." : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
