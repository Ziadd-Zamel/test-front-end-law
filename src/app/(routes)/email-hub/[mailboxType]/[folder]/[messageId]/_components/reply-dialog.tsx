/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Reply,
  Paperclip,
  FileText,
  File,
  Image,
  FileSpreadsheet,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import clsx from "clsx";

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

export default function ReplySheet({
  originalMessageId,
  refId,
  refType,
  availableAttachments = [],
}: {
  originalMessageId: string;
  refId?: string;
  refType?: "task" | "case";
  availableAttachments?: any[];
}) {
  const { replyMail, isPending } = useReplyMail();
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>(
    [],
  );
  const [open, setOpen] = useState(false);

  const form = useForm<ReplyFields>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      replyBodyHtml: "",
    },
  });

  // Reset selected attachments and form when sheet closes
  useEffect(() => {
    if (!open) {
      setSelectedAttachments([]);
      form.reset();
    }
  }, [open, form]);

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
          setOpen(false);
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* TRIGGER BUTTON */}
      <SheetTrigger asChild>
        <Button variant={"ghost"}>
          <Reply className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      {/* CONTENT */}
      <SheetContent
        side="bottom"
        className="w-full h-full max-h-screen overflow-auto py-5"
      >
        <div className="box-container max-w-2xl border border-gray-300 p-5 rounded-2xl shadow-sm my-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-gray-800 ">
              كتابة رد
            </SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-6"
            >
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

              {/* ATTACHMENTS SECTION */}
              {refType && refId && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">
                      المرفقات المتاحة
                    </span>
                  </div>

                  <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 max-h-[200px]  overflow-y-auto">
                    {availableAttachments.length === 0 ? (
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

                                <div
                                  className={clsx("flex-shrink-0", iconColor)}
                                >
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

                  {/* {selectedAttachments.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-sm text-blue-700 font-medium">
                        ✓ تم اختيار {selectedAttachments.length} مرفق
                      </p>
                    </div>
                  )} */}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12"
                disabled={isPending}
              >
                {isPending ? "جاري الإرسال..." : "إرسال الرد"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
