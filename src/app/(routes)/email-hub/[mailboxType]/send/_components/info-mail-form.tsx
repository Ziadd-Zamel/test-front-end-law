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
import {
  Loader2,
  Paperclip,
  FileText,
  File,
  Image,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { useSendMail } from "../../../_hooks/use-mail";
import { SendMailFields, SendMailSchema } from "@/lib/schemas/mail.schema";
import { useTaskOrCase } from "@/hooks/use-task-or-case";
import clsx from "clsx";

interface Attachment {
  attechmentId: number;
  relativePath: string;
  originalName: string;
}

interface InfoMailFormProps {
  onSuccess?: () => void;
}

// Get file extension from filename
function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

// Get appropriate icon for file type
function getFileIcon(extension: string) {
  switch (extension) {
    case "pdf":
      return FileText;
    case "doc":
    case "docx":
    case "txt":
      return FileText;
    case "xls":
    case "xlsx":
    case "csv":
      return FileSpreadsheet;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
      return Image;
    default:
      return File;
  }
}

// Get icon color based on file type
function getIconColor(extension: string): string {
  switch (extension) {
    case "pdf":
      return "text-red-500";
    case "doc":
    case "docx":
      return "text-blue-500";
    case "xls":
    case "xlsx":
    case "csv":
      return "text-green-600";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
}

export function InfoMailForm({ onSuccess }: InfoMailFormProps) {
  const { sendMail, isPending } = useSendMail();
  const [refType, setRefType] = useState<"task" | "case" | undefined>(
    undefined,
  );
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>(
    [],
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
    (item: any) => item.encryptedId === selectedRefId,
  );

  // Get all attachments from selected item
  // For tasks, it's direct attachments; for cases, it's from sessions
  const getAvailableData = () => {
    if (!selectedItem) return [];

    if (refType === "task") {
      return selectedItem.attachments || [];
    } else if (refType === "case") {
      return selectedItem.sessions || [];
    }

    return [];
  };

  const availableData = getAvailableData();

  // Handle attachment selection
  const toggleAttachment = (attachment: any) => {
    const formattedAttachment: Attachment = {
      attechmentId: attachment.encryptedFileId,
      relativePath: attachment.relativePath,
      originalName: attachment.fileName,
    };

    setSelectedAttachments((prev) => {
      const exists = prev.find(
        (a) => a.attechmentId === formattedAttachment.attechmentId,
      );
      if (exists) {
        return prev.filter(
          (a) => a.attechmentId !== formattedAttachment.attechmentId,
        );
      }
      return [...prev, formattedAttachment];
    });
  };

  const isAttachmentSelected = (attachment: any) => {
    return selectedAttachments.some(
      (a) => a.attechmentId === attachment.encryptedFileId,
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
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-800">
              {refType === "task" ? "المرفقات المتاحة" : "الجلسات والمرفقات"}
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 max-h-[300px] overflow-y-auto">
            {!refType ? (
              // No type selected
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Paperclip className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  الرجاء اختيار نوع المرجع أولاً
                </p>
              </div>
            ) : !selectedRefId ? (
              // Type selected but no item selected
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Paperclip className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  الرجاء اختيار {refType === "task" ? "المهمة" : "القضية"}
                </p>
              </div>
            ) : availableData.length === 0 ? (
              // Item selected but no attachments
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <File className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">لا توجد مرفقات متاحة</p>
              </div>
            ) : refType === "task" ? (
              // Task attachments - direct list
              <div className="space-y-2">
                {availableData.map((attachment: any, idx: number) => {
                  const extension = getFileExtension(attachment.fileName);
                  const FileIcon = getFileIcon(extension);
                  const iconColor = getIconColor(extension);

                  return (
                    <div
                      key={idx}
                      className={clsx(
                        "flex items-center gap-3 p-3",
                        "bg-white border rounded-md",
                        "hover:bg-gray-50 transition-colors",
                        isAttachmentSelected(attachment)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200",
                      )}
                    >
                      <Checkbox
                        id={`attachment-${idx}`}
                        checked={isAttachmentSelected(attachment)}
                        onCheckedChange={() => toggleAttachment(attachment)}
                      />

                      <div className={clsx("flex-shrink-0", iconColor)}>
                        <FileIcon className="w-6 h-6" />
                      </div>

                      <label
                        htmlFor={`attachment-${idx}`}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <p className="text-sm text-gray-900 truncate font-medium">
                          {attachment.fileName}
                        </p>
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Case attachments - grouped by sessions
              <div className="space-y-4">
                {availableData.map((session: any, sessionIdx: number) => (
                  <div
                    key={sessionIdx}
                    className="border border-gray-200 rounded-lg p-4 bg-white"
                  >
                    <div className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">
                        الجلسة {session.sessionNumber}
                      </span>
                      {session.attachments && (
                        <span className="text-xs text-gray-500">
                          ({session.attachments.length} مرفق)
                        </span>
                      )}
                    </div>

                    {session.attachments && session.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {session.attachments.map(
                          (attachment: any, attIdx: number) => {
                            const extension = getFileExtension(
                              attachment.fileName,
                            );
                            const FileIcon = getFileIcon(extension);
                            const iconColor = getIconColor(extension);

                            return (
                              <div
                                key={attIdx}
                                className={clsx(
                                  "flex items-center gap-3 p-2",
                                  "bg-gray-50 border rounded-md",
                                  "hover:bg-gray-100 transition-colors",
                                  isAttachmentSelected(attachment)
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200",
                                )}
                              >
                                <Checkbox
                                  id={`session-${sessionIdx}-attachment-${attIdx}`}
                                  checked={isAttachmentSelected(attachment)}
                                  onCheckedChange={() =>
                                    toggleAttachment(attachment)
                                  }
                                />

                                <div
                                  className={clsx("flex-shrink-0", iconColor)}
                                >
                                  <FileIcon className="w-5 h-5" />
                                </div>

                                <label
                                  htmlFor={`session-${sessionIdx}-attachment-${attIdx}`}
                                  className="flex-1 min-w-0 cursor-pointer"
                                >
                                  <p className="text-xs text-gray-900 truncate font-normal">
                                    {attachment.fileName}
                                  </p>
                                </label>
                              </div>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        لا توجد مرفقات في هذه الجلسة
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedAttachments.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-700 font-medium">
                ✓ تم اختيار {selectedAttachments.length} مرفق
              </p>
            </div>
          )}
        </div>

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
