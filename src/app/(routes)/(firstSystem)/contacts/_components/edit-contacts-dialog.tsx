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
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  UpdateContactFields,
  UpdateContactSchema,
} from "@/lib/schemas/contact.schema";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { useUpdateContact } from "../_hooks/use-contact";

interface UpdateContactDialogProps {
  contact: {
    id: string;
    clientName: string;
    email: string;
    phoneNumber: string;
  };
}

export function UpdateContactDialog({ contact }: UpdateContactDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateContact, isPending } = useUpdateContact();

  const form = useForm<UpdateContactFields>({
    resolver: zodResolver(UpdateContactSchema),
    defaultValues: {
      clientName: contact.clientName,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
    },
  });

  function onSubmit(values: UpdateContactFields) {
    updateContact(
      {
        id: contact.id,
        ...values,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>تعديل جهة الاتصال</DialogTitle>
          <DialogDescription>قم بتعديل معلومات جهة الاتصال</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* CLIENT NAME */}
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  "تحديث"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
