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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Paperclip } from "lucide-react";
import { useState } from "react";
import { useSendMail } from "../../../_hooks/use-mail";
import { SendMailFields, SendMailSchema } from "@/lib/schemas/mail.schema";
import { useTaskOrCase } from "@/hooks/use-task-or-case";

interface Attachment {
  attechmentId: number;
  relativePath: string;
  originalName: string;
}

interface InfoMailFormProps {
  onSuccess?: () => void;
}

export function InfoMailForm({ onSuccess }: InfoMailFormProps) {
  const { sendMail, isPending } = useSendMail();
  const [refType, setRefType] = useState<"task" | "case" | undefined>(
    undefined
  );
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>(
    []
  );

  const { data: refData, isPending: refPending } = useTaskOrCase(refType);
  const form = useForm<SendMailFields>({
    resolver: zodResolver(SendMailSchema),
    defaultValues: {
      subject: "",
      refType: undefined,
      refId: undefined,
      bodyHtml: "",
    },
  });

  const selectedRefId = form.watch("refId");
  const selectedItem = refData?.data?.find(
    (item: any) => item.encryptedId === selectedRefId
  );

  // Get all attachments from selected item
  const availableAttachments = selectedItem?.attachments || [];

  // Handle attachment selection
  const toggleAttachment = (attachment: any) => {
    const formattedAttachment: Attachment = {
      attechmentId: attachment.encryptedFileId,
      relativePath: attachment.relativePath,
      originalName: attachment.fileName,
    };

    setSelectedAttachments((prev) => {
      const exists = prev.find(
        (a) => a.attechmentId === formattedAttachment.attechmentId
      );
      if (exists) {
        return prev.filter(
          (a) => a.attechmentId !== formattedAttachment.attechmentId
        );
      }
      return [...prev, formattedAttachment];
    });
  };

  const isAttachmentSelected = (attachment: any) => {
    return selectedAttachments.some(
      (a) => a.attechmentId === attachment.encryptedFileId
    );
  };

  async function onSubmit(values: SendMailFields) {
    const mailData = {
      ...values,
      attachments:
        selectedAttachments.length > 0 ? selectedAttachments : undefined,
    };

    sendMail(mailData, {
      onSuccess: () => {
        form.reset();
        setRefType(undefined);
        setSelectedAttachments([]);
        if (onSuccess) {
          onSuccess();
        }
      },
    });
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
        {/* ATTACHMENTS SECTION */}
        {availableAttachments.length > 0 && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">
                المرفقات المتاحة ({availableAttachments.length})
              </span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableAttachments.map((attachment: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Checkbox
                    id={`attachment-${idx}`}
                    checked={isAttachmentSelected(attachment)}
                    onCheckedChange={() => toggleAttachment(attachment)}
                  />
                  <label
                    htmlFor={`attachment-${idx}`}
                    className="text-sm text-gray-700 cursor-pointer flex-1 truncate"
                  >
                    {attachment.fileName}
                  </label>
                </div>
              ))}
            </div>
            {selectedAttachments.length > 0 && (
              <p className="text-xs text-blue-600 font-medium">
                تم اختيار {selectedAttachments.length} مرفق
              </p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full h-12" disabled={isPending}>
          {isPending ? (
            <>
              جاري الإرسال...
              <Loader2 className="size-4 animate-spin ml-2" />
            </>
          ) : (
            "إرسال"
          )}
        </Button>
      </form>
    </Form>
  );
}
