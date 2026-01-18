"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MailMessageDetails } from "@/lib/api/mail.api";
import { formatDate } from "@/lib/utils/format-date";
import { MessageSquare, Paperclip, Eye } from "lucide-react";
import { MailAttachmentCard } from "./mail-attachment-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo } from "react";
import { useTaskOrCase } from "@/hooks/use-task-or-case";

export default function MailReplies({
  replies,
  mail,
}: {
  replies: MailMessageDetails[];
  mail: MailMessageDetails;
}) {
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  // Fetch data based on refType if it exists
  const refType = mail.refType as "task" | "case" | undefined;
  const { data: refData } = useTaskOrCase(refType);

  // Find the selected item and get attachments
  const availableAttachments = useMemo(() => {
    if (!refData?.data || !mail.refId) return [];

    const selectedItem = refData.data.find(
      (item: any) => item.encryptedId === mail.refId,
    );

    return selectedItem?.attachments || [];
  }, [refData, mail.refId]);

  return (
    <div className="mt-5 space-y-4">
      {/* Header Card */}
      <Card className="overflow-hidden p-0 border-0 shadow-sm">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">الردود</h3>
            <span className="text-sm text-gray-500 mr-auto">
              ({replies.length})
            </span>
          </div>
        </div>
      </Card>

      {/* Individual Reply Accordions */}
      <Accordion type="single" collapsible className="space-y-4">
        {replies.map((reply) => (
          <AccordionItem
            key={reply.id}
            value={`reply-${reply.id}`}
            className="border-0"
          >
            <Card className="overflow-hidden p-0 max-w-full border-0 shadow-sm">
              <AccordionTrigger className="hover:no-underline px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 w-full text-right">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium flex items-center justify-center h-full w-full rounded-full">
                      {getInitials(reply.senderName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {reply.senderName}
                      </span>
                      {/* <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        رد {index + 1}
                      </span> */}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(reply.receivedDateTime)}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-0">
                <div className="bg-white max-w-full">
                  {/* Reply Header - Outlook Style */}
                  <div className="border-t border-gray-200">
                    {/* Sender Info - Outlook Layout */}
                    <div className="px-6 pb-4 pt-5">
                      {/* Desktop Layout */}
                      <div className="hidden md:flex items-start justify-between gap-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Avatar */}
                            <Avatar className="h-10 w-10 flex-shrink-0 mt-1">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium flex items-center justify-center h-full w-full rounded-full">
                                {getInitials(reply.senderName)}
                              </AvatarFallback>
                            </Avatar>

                            {/* Sender Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {reply.senderName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  &lt;{reply.senderEmail}&gt;
                                </span>
                              </div>

                              {/* Recipients - Outlook compact style */}
                              {(reply.toRecipientsNames ||
                                reply.ccRecipientsNames) && (
                                <div className="text-xs text-gray-600 space-y-0.5">
                                  {reply.toRecipientsNames && (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-gray-500">
                                        إلى:
                                      </span>
                                      <span className="truncate">
                                        {reply.toRecipientsNames}
                                      </span>
                                    </div>
                                  )}
                                  {reply.ccRecipientsNames && (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-gray-500">
                                        نسخة:
                                      </span>
                                      <span className="truncate">
                                        {reply.ccRecipientsNames}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Date - below sender info like Outlook */}
                              <div className="text-xs text-gray-500 mt-2">
                                {formatDate(reply.receivedDateTime)}
                              </div>
                            </div>
                          </div>
                          {/* <ReplyDialog
                            originalMessageId={reply.id}
                            refId={reply.refId}
                            refType={reply.refType as "case" | "task"}
                            availableAttachments={availableAttachments}
                          /> */}
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="flex flex-col gap-3 md:hidden">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium flex items-center justify-center h-full w-full rounded-full">
                              {getInitials(reply.senderName)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                  {reply.senderName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {reply.senderEmail}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatDate(reply.receivedDateTime)}
                              </span>
                            </div>

                            {/* Recipients */}
                            {(reply.toRecipientsNames ||
                              reply.ccRecipientsNames) && (
                              <div className="text-xs text-gray-600 mt-1.5 space-y-0.5">
                                {reply.toRecipientsNames && (
                                  <div className="flex gap-1.5">
                                    <span className="text-gray-500">إلى:</span>
                                    <span className="truncate">
                                      {reply.toRecipientsNames}
                                    </span>
                                  </div>
                                )}
                                {reply.ccRecipientsNames && (
                                  <div className="flex gap-1.5">
                                    <span className="text-gray-500">نسخة:</span>
                                    <span className="truncate">
                                      {reply.ccRecipientsNames}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attachments - Outlook Style */}
                  {reply.hasAttachments &&
                    reply.attachments &&
                    reply.attachments.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Paperclip className="h-4 w-4 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-700">
                            {reply.attachmentCount || reply.attachments.length}{" "}
                            مرفقات
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          {reply.attachments.map((attachment) => (
                            <MailAttachmentCard
                              key={attachment.attechmentId}
                              pdf={attachment}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Reply Body - Outlook spacing */}
                  <div className="px-6 py-6">
                    <div
                      className="prose prose-sm max-w-none text-[13px] leading-relaxed text-gray-900"
                      dangerouslySetInnerHTML={{ __html: reply.body }}
                    />
                  </div>

                  {/* Mail History - Very Simple */}
                  {reply.showMessages && reply.showMessages.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                          سجل المشاهدة
                        </h3>
                        <span className="text-sm text-gray-500 mr-auto">
                          ({reply.showMessages.length})
                        </span>
                      </div>
                      <div className="space-y-2 mt-5">
                        {reply.showMessages.map((viewer, viewIndex) => (
                          <div
                            key={viewer.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-3">
                              {/* Avatar with blue gradient matching mail sender */}
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                                  {getInitials(viewer.name)}
                                </AvatarFallback>
                              </Avatar>

                              {/* Viewer info */}
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">
                                  {viewer.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  المشاهدة رقم {viewIndex + 1}
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {formatDate(viewer.dateTime)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
