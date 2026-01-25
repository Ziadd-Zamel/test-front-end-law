/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Paperclip,
  FileText,
  File,
  Image,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { useQueryState } from "nuqs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useReplyMail } from "@/app/(routes)/email-hub/_hooks/use-mail";
import { ReplyFields, ReplySchema } from "@/lib/schemas/mail.schema";
import { useTaskOrCase } from "@/hooks/use-task-or-case";
import { Card } from "@/components/ui/card";

interface Attachment {
  attechmentId: number;
  relativePath: string;
  originalName: string;
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

export default function ReplyForm({
  originalMessageId,
  refId,
  refType,
  mailBox,
}: {
  originalMessageId: string;
  refId?: string;
  refType?: "task" | "case";
  mailBox?: "auto" | "info" | "employeeemail";
}) {
  const { replyMail, isPending } = useReplyMail();
  const [replay, setReplay] = useQueryState("replay");

  const { data: refData, isLoading } = useTaskOrCase(refType || undefined);

  // Find the selected item and get attachments
  const availableAttachments = useMemo(() => {
    if (!refData?.data || !refId) return [];

    const selectedItem = refData.data.find(
      (item: any) => item.encryptedId === refId,
    );

    return selectedItem?.attachments || [];
  }, [refData, refId]);

  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>(
    [],
  );

  const form = useForm<ReplyFields>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      replyBodyHtml: "",
    },
  });

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

  function onSubmit(values: ReplyFields) {
    replyMail(
      {
        originalMessageId,
        replyBodyHtml: values.replyBodyHtml,
        attachments:
          selectedAttachments.length > 0 ? selectedAttachments : undefined,
      },
      {
        onSuccess: () => {
          setSelectedAttachments([]);
          form.reset();
          setReplay(null);
        },
      },
    );
  }

  // Don't show if mailBox is auto or replay is not "sent"
  if (mailBox === "auto" || replay !== "sent") {
    return null;
  }

  return (
    <div
      id="mail-reply"
      className="animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <Card className="overflow-hidden p-5 my-10 max-w-full border-0 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">كتابة رد</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setReplay(null)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ATTACHMENTS SECTION */}
            {refType && refId && !isLoading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-800">
                    المرفقات المتاحة
                  </span>
                </div>

                <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 max-h-[200px] overflow-y-auto">
                  {availableAttachments?.length === 0 ? (
                    // No attachments available
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <File className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-sm text-gray-500">
                        لا توجد مرفقات متاحة
                      </p>
                    </div>
                  ) : (
                    // Attachments list
                    <div className="space-y-2">
                      {availableAttachments.map(
                        (attachment: any, idx: number) => {
                          const extension = getFileExtension(
                            attachment.fileName,
                          );
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
                                onCheckedChange={() =>
                                  toggleAttachment(attachment)
                                }
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
                        },
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="replyBodyHtml"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="اكتب ردك هنا..."
                      className="h-32 text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12" disabled={isPending}>
              {isPending ? "جاري الإرسال..." : "إرسال الرد"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
