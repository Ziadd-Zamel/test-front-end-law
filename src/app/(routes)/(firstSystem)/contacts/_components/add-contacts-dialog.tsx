"use client";

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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import {
  AddContactFields,
  AddContactSchema,
} from "@/lib/schemas/contact.schema";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { useAddContact } from "../_hooks/use-contact";
import { toast } from "sonner";

interface AddContactDialogProps {
  refType: "case" | "task";
  refId?: string;
}

export function AddContactDialog({ refType, refId }: AddContactDialogProps) {
  const [open, setOpen] = useState(false);
  const { addContact, isPending } = useAddContact();

  const form = useForm<AddContactFields>({
    resolver: zodResolver(AddContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      JobPosition: "",
    },
  });

  function onSubmit(values: AddContactFields) {
    if (!values.email && !values.phoneNumber) {
      toast.error("يجب ادخال الايميل او رقم الهاتف");
      return;
    }
    console.log(values);
    addContact(
      {
        ...values,
        refType,
        refId: refId || "",
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      },
    );
  }

  const isTriggerDisabled = !refId || !refType;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isTriggerDisabled} className="" asChild>
        <Button className="w-fit h-12 text-xs!">
          <Plus className="size-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl!">
        <DialogHeader className="mt-5">
          <DialogTitle>إضافة جهة اتصال جديدة</DialogTitle>
          <DialogDescription>
            قم بإضافة جهة اتصال جديدة مرتبطة بـ
            {refType === "case" ? "القضية" : "المهمة"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME */}
            <div className="flex items-center gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل الاسم" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="JobPosition"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>وصف العمل</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل الوصف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE NUMBER */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      placeholder="أدخل رقم الهاتف"
                      defaultCountry="SA"
                      international
                      className={cn(
                        fieldState.error && "border-red-500 focus:border-none",
                      )}
                      style={{ direction: "ltr" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
                disabled={isPending}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                disabled={isPending}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  "إضافة"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
