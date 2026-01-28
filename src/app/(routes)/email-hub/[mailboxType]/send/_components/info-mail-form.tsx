/* eslint-disable @typescript-eslint/no-explicit-any */
// components/mail/forms/info-mail-form.tsx
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
import { Loader2, Paperclip } from "lucide-react";
import { useState } from "react";
import { useSendMail } from "../../../_hooks/use-mail";
import { SendMailFields, SendMailSchema } from "@/lib/schemas/mail.schema";
import { useTaskOrCase } from "@/hooks/use-task-or-case";
import { collectAllAttachments } from "@/lib/utils/collect-asttachments";
import AttachmentsTable from "@/components/common/attachments-table";
import { AddContactDialog } from "@/app/(routes)/(firstSystem)/contacts/_components/add-contacts-dialog";
import { ContactsShareInput } from "@/components/common/contacts-share-Input";

interface InfoMailFormProps {
  onSuccess?: () => void;
}

export function InfoMailForm({ onSuccess }: InfoMailFormProps) {
  const { sendMail, isPending } = useSendMail();
  const [sharedContactIds, setSharedContactIds] = useState<string[]>([]);
  const [formKey, setFormKey] = useState(0);

  const [refType, setRefType] = useState<"task" | "case" | undefined>(
    undefined,
  );

  const form = useForm<SendMailFields>({
    resolver: zodResolver(SendMailSchema),
    defaultValues: {
      subject: "",
      refType: undefined,
      refId: undefined,
      bodyHtml: "",
    },
  });

  const { data: refData, isPending: refPending } = useTaskOrCase(refType);

  const selectedRefId = form.watch("refId");

  // Get the case or the task of the mail
  const MainRef = refData?.data.find(
    (item: any) => item.encryptedId === selectedRefId,
  );
  // state for selected attachments
  const [selectedAttachments, setSelectedAttachments] = useState<
    MainAttachment[]
  >([]);

  // get all attachments for the selcted case or task
  const allAttachments: MainAttachment[] = collectAllAttachments(MainRef);

  async function onSubmit(values: SendMailFields) {
    const mailData = {
      ...values,
      attachments:
        selectedAttachments.length > 0 ? selectedAttachments : undefined,
      ccClientContactIds: sharedContactIds,
    };

    sendMail(mailData, {
      onSuccess: () => {
        form.reset();
        setRefType(undefined);
        setSelectedAttachments([]);
        setSharedContactIds([]);
        setFormKey((perv) => perv + 1);
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  }
  return (
    <Form {...form} key={formKey}>
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
                    setSelectedAttachments([]);
                    form.setValue("refId", "");
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
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedAttachments([]);
                  }}
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
                        value={item.encryptedId}
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
        {/* BODY HTML */}
        <FormField
          control={form.control}
          name="bodyHtml"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نص الرسالة</FormLabel>
              <FormControl>
                <Textarea
                  className="h-32 text-right"
                  placeholder="اكتب الرسالة هنا..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormLabel className="mb-3">جهات الإتصال</FormLabel>
        <div className="flex items-center gap-2">
          <ContactsShareInput
            refId={selectedRefId}
            refType={(refType as "case") || "tasl"}
            value={sharedContactIds}
            onChange={setSharedContactIds}
          />
          <AddContactDialog
            refId={selectedRefId}
            refType={(refType as "case") || "tasl"}
          />
        </div>
        <>
          <div className="flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-800">
              {refType === "task" ? "المرفقات المتاحة" : "الجلسات والمرفقات"}
            </span>
          </div>
          {refType ? (
            <div className="max-h-[600px] overflow-auto">
              <AttachmentsTable
                attachments={allAttachments}
                selectedItems={selectedAttachments}
                onSelectionChange={(selectedIds) =>
                  setSelectedAttachments(selectedIds)
                }
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 max-h-[300px] overflow-y-auto">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Paperclip className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  الرجاء اختيار نوع المرجع أولاً
                </p>
              </div>
            </div>
          )}
        </>
        <Button type="submit" className="w-full h-12" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin ml-2" />
              جاري الإرسال...
            </>
          ) : (
            "إرسال"
          )}
        </Button>
      </form>
    </Form>
  );
}
