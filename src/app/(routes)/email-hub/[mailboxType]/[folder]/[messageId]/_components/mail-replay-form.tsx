/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryState } from "nuqs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { useReplyMail } from "@/app/(routes)/email-hub/_hooks/use-mail";
import { ReplyFields, ReplySchema } from "@/lib/schemas/mail.schema";
import { useTaskOrCase } from "@/hooks/use-task-or-case";
import { Card } from "@/components/ui/card";
import { collectAllAttachments } from "@/lib/utils/collect-asttachments";
import { useState } from "react";
import AttachmentsTable from "@/components/common/attachments-table";
import TableSkeleton from "@/components/common/table-skeleton";
import { ContactsShareInput } from "@/components/common/contacts-share-Input";
import { AddContactDialog } from "@/app/(routes)/(firstSystem)/contacts/_components/add-contacts-dialog";

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
  // Replay mail hook
  const { replyMail, isPending } = useReplyMail();

  // State to toggle the replay form
  const [replay, setReplay] = useQueryState("replay");
  const [sharedContactIds, setSharedContactIds] = useState<string[]>([]);

  // Get the cases or the tasks
  const { data: refData, isPending: LoadingRef } = useTaskOrCase(
    refType || undefined,
  );

  // Get the case or the task of the mail
  const MainRef = refData?.data.find((item: any) => item.encryptedId === refId);

  // state for selected attachments
  const [selectedAttachments, setSelectedAttachments] = useState<
    MainAttachment[]
  >([]);

  // get all attachments for the selcted case or task
  const allAttachments: MainAttachment[] = collectAllAttachments(MainRef);

  const form = useForm<ReplyFields>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      replyBodyHtml: "",
    },
  });

  function onSubmit(values: ReplyFields) {
    replyMail(
      {
        originalMessageId,
        replyBodyHtml: values.replyBodyHtml,
        attachments: selectedAttachments,
        ccClientContactIds: sharedContactIds,
      },
      {
        onSuccess: () => {
          form.reset();
          setSelectedAttachments([]);
          setSharedContactIds([]);
          setReplay(null);
        },
      },
    );
  }

  if (mailBox === "auto" || replay !== "sent") return null;

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
            {refId && (
              <>
                <FormLabel className="mb-3">جهات الإتصال</FormLabel>
                <div className="flex items-center gap-2">
                  <ContactsShareInput
                    refId={refId}
                    refType={(refType as "case") || "tasl"}
                    value={sharedContactIds}
                    onChange={setSharedContactIds}
                  />
                  <AddContactDialog
                    refId={refId}
                    refType={(refType as "case") || "tasl"}
                  />
                </div>
              </>
            )}
            <FormField
              control={form.control}
              name="replyBodyHtml"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">الرد</FormLabel>
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
            {refType && refId && (
              <>
                {LoadingRef ? (
                  <TableSkeleton />
                ) : (
                  <AttachmentsTable
                    attachments={allAttachments}
                    selectedItems={selectedAttachments}
                    onSelectionChange={(selectedIds) =>
                      setSelectedAttachments(selectedIds)
                    }
                  />
                )}
              </>
            )}
            <Button
              type="submit"
              className="w-full h-12 mt-5"
              disabled={isPending}
            >
              {isPending ? "جاري الإرسال..." : "إرسال الرد"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
