/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import { MailMessageDetails } from "@/lib/api/mail.api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReplyDialog from "./reply-dialog";
import { formatDate } from "@/lib/utils/format-date";
import UpdateMessageDialog from "../../_components/update-message-dialog";
import { useTaskOrCase } from "@/hooks/use-task-or-case";
import { useMemo } from "react";
import { Eye, Paperclip } from "lucide-react";
import { MailAttachmentCard } from "./mail-attachment-card";

export default function MailBody({
  mail,
  mailBox,
}: {
  mail: MailMessageDetails;
  mailBox?: "auto" | "info" | "employeeemail";
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
      (item: any) => item.encryptedId === mail.refId
    );

    return selectedItem?.attachments || [];
  }, [refData, mail.refId]);

  // Check if we should show the update message dialog
  const shouldShowUpdateDialog =
    mailBox === "info" &&
    (!mail.refId || mail.refId === "0") &&
    (!mail.refType || mail.refType === "");

  return (
    <>
      {/* Update Message Dialog - Outside the card */}
      {shouldShowUpdateDialog && (
        <div className="mb-4 flex justify-end">
          <UpdateMessageDialog messageId={mail.id} />
        </div>
      )}

      <Card className="overflow-hidden p-0 max-w-full border-0 shadow-sm">
        <div className="bg-white max-w-full">
          {/* Outlook-style Header */}
          <div className="border-b border-gray-200">
            {/* Subject Line - Outlook Style */}
            <div className="px-6 pt-5 pb-3">
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                {mail.subject || "(بدون عنوان)"}
              </h1>
            </div>

            {/* Sender Info and Actions - Outlook Layout */}
            <div className="px-6 pb-4">
              {/* Desktop Layout */}
              <div className="hidden md:flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 flex-shrink-0 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium flex items-center justify-center h-full w-full rounded-full">
                      {getInitials(mail.senderName)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Sender Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {mail.senderName}
                      </span>
                      <span className="text-xs text-gray-500">
                        &lt;{mail.senderEmail}&gt;
                      </span>
                    </div>

                    {/* Recipients - Outlook compact style */}
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500">إلى:</span>
                        <span className="truncate">
                          {mail.toRecipientsNames || mail.toRecipients}
                        </span>
                      </div>
                      {mail.ccRecipientsNames && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500">نسخة:</span>
                          <span className="truncate">
                            {mail.ccRecipientsNames}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Date - below sender info like Outlook */}
                    <div className="text-xs text-gray-500 mt-2">
                      {formatDate(mail.receivedDateTime)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Outlook Style */}
                {mailBox !== "auto" && (
                  <ReplyDialog
                    originalMessageId={mail.id}
                    refId={mail.refId}
                    refType={refType}
                    availableAttachments={availableAttachments}
                  />
                )}
              </div>

              {/* Mobile Layout */}
              <div className="flex flex-col gap-3 md:hidden">
                {/* Top Row: Avatar, Name, and Date */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium flex items-center justify-center h-full w-full rounded-full">
                      {getInitials(mail.senderName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {mail.senderName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {mail.senderEmail}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(mail.receivedDateTime)}
                      </span>
                    </div>

                    {/* Recipients */}
                    <div className="text-xs text-gray-600 mt-1.5 space-y-0.5">
                      <div className="flex gap-1.5">
                        <span className="text-gray-500">إلى:</span>
                        <span className="truncate">
                          {mail.toRecipientsNames || mail.toRecipients}
                        </span>
                      </div>
                      {mail.ccRecipientsNames && (
                        <div className="flex gap-1.5">
                          <span className="text-gray-500">نسخة:</span>
                          <span className="truncate">
                            {mail.ccRecipientsNames}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                {mailBox === "info" && (
                  <div className="flex justify-end">
                    <ReplyDialog
                      refId={mail.refId}
                      refType={refType}
                      originalMessageId={mail.id}
                      availableAttachments={availableAttachments}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachments - Outlook Style (at the top, after header) */}
          {mail.hasAttachments &&
            mail.attachments &&
            mail.attachments.length > 0 && (
              <div className="border-y border-gray-200 bg-gray-50 px-6 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-700">
                    {mail.attachmentCount || mail.attachments.length} مرفقات
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {mail.attachments.map((attachment) => (
                    <MailAttachmentCard
                      key={attachment.attechmentId}
                      pdf={attachment}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Email Body - Outlook spacing */}
          <div className="px-6 py-6">
            <div
              className="prose prose-sm max-w-none text-[13px] leading-relaxed text-gray-900"
              dangerouslySetInnerHTML={{ __html: mail.body }}
            />
          </div>

          {/* Mail History - Very Simple */}
          {mail.showMessages && mail.showMessages.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  سجل المشاهدة
                </h3>
                <span className="text-sm text-gray-500 mr-auto">
                  ({mail.showMessages.length})
                </span>
              </div>
              <div className="space-y-2 mt-5">
                {mail.showMessages.map((viewer, index) => (
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
                          المشاهدة رقم {index + 1}
                        </span>
                      </div>
                    </div>{" "}
                    <span className="text-gray-500 text-xs">
                      {formatDate(viewer.dateTime)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
