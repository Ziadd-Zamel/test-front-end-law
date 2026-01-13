/* eslint-disable @typescript-eslint/no-explicit-any */
// components/mail/forms/auto-mail-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSendAutoMail } from "../../../_hooks/use-mail";
import {
  SendAutoMailFields,
  SendAutoMailSchema,
} from "@/lib/schemas/mail.schema";
import { useTaskOrCase } from "@/hooks/use-task-or-case";

export function AutoMailForm() {
  const { sendAutoMail, isPending } = useSendAutoMail();
  const [refType, setRefType] = useState<"task" | "case" | undefined>(
    undefined
  );

  const { data: refData, isPending: refPending } = useTaskOrCase(refType);

  const form = useForm<SendAutoMailFields>({
    resolver: zodResolver(SendAutoMailSchema),
    defaultValues: {
      subject: "",
      content: "",
      refType: undefined,
      refId: undefined,
    },
  });

  function onSubmit(values: SendAutoMailFields) {
    sendAutoMail(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* REF TYPE + REF ID */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="refType"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>نوع المرجع</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setRefType(value as "task" | "case");
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المرجع" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="task">مهمة</SelectItem>
                    <SelectItem value="case">قضية</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="refId"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>المعرف المرجعي</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={
                    field.value !== undefined
                      ? field.value.toString()
                      : undefined
                  }
                  disabled={!refType || refPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المعرف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {refData?.data?.map((item: any) => (
                      <SelectItem
                        key={item.encryptedId}
                        value={item.encryptedId.toString()}
                      >
                        {refType === "task" ? item.nameOfWork : item.caseTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SUBJECT */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الموضوع</FormLabel>
              <FormControl>
                <Input placeholder="أدخل الموضوع" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CONTENT */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المحتوى</FormLabel>
              <FormControl>
                <Textarea
                  className="h-32 text-right"
                  placeholder="اكتب المحتوى هنا..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12" disabled={isPending}>
          {isPending ? (
            <>
              جاري الإرسال...
              <Loader2 className="size-4 animate-spin ml-2" />
            </>
          ) : (
            "إرسال الإشعار"
          )}
        </Button>
      </form>
    </Form>
  );
}
