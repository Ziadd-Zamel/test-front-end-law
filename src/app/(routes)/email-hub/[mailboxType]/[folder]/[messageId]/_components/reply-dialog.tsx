/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Reply, Paperclip } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

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

export default function ReplyDialog({
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
    []
  );
  const [open, setOpen] = useState(false);

  const form = useForm<ReplyFields>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      replyBodyHtml: "",
    },
  });

  // Reset selected attachments and form when dialog closes
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
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Reply className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      {/* CONTENT */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle className="text-xl font-bold text-gray-800">
            كتابة رد
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
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
                      className="h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ATTACHMENTS SECTION - Only show if refType and refId exist and there are attachments */}
            {refType && refId && availableAttachments.length > 0 && (
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
              {isPending ? "جاري الإرسال..." : "إرسال الرد"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
