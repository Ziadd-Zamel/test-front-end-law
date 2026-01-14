"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Paperclip, Link2Off } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MailMessage } from "@/lib/api/mail.api";
import { formatDate } from "@/lib/utils/format-date";
import { useLogMailRead } from "../../../_hooks/use-mail";

interface EmailCardProps {
  message: MailMessage;
  type?: "inbox" | "sent" | "junk";
  mailboxType: string;
  folder: string;
  noFilters?: boolean;
}

export default function EmailCard({
  message,
  type = "inbox",
  mailboxType,
  folder,
}: EmailCardProps) {
  const { logMailRead, isPending } = useLogMailRead();

  const router = useRouter();

  // Determine if the message is unread
  const isUnread =
    (!message.isRead && type === "inbox") ||
    (!message.isRead && type === "junk");

  // Get sender initials
  const initials = message.senderName?.charAt(0).toUpperCase() || "u";

  // Check if message has no reference
  const hasNoReference = !message.refId && !message.refType;

  // Encode messageId for URL
  const encodedMessageId = encodeURIComponent(message.id);
  const detailUrl = `/email-hub/${mailboxType}/${folder}/${encodedMessageId}`;

  // Click handler
  const handleClick = () => {
    if (isPending) return;
    if (isUnread) {
      logMailRead(message.id, {
        onSuccess: () => router.push(detailUrl),
        onError: () => router.push(detailUrl),
      });
    } else {
      router.push(detailUrl);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer border-b border-gray-100",
        "transition-colors duration-150 rounded-md",
        "bg-white hover:bg-gray-50",
        isUnread && "bg-blue-50/30"
      )}
    >
      <div className="px-6 py-4 flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="size-10 text-white">
            <AvatarFallback
              className={cn(
                "text-white bg-blue-600 font-semibold",
                isUnread ? "bg-blue-600" : "bg-gray-200"
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          {isUnread && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1">
          {/* Top Row */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-sm break-words",
                  isUnread
                    ? "font-bold text-gray-900"
                    : "font-medium text-gray-700"
                )}
              >
                {message.senderName}
              </h3>

              {/* Attachment Badge */}
              {message.hasAttachments && (
                <Badge variant="outline" className="h-5 px-1 py-0">
                  <Paperclip size={10} className="text-gray-400" />
                </Badge>
              )}

              {/* No Reference Badge */}
              {hasNoReference && (
                <Badge
                  variant="outline"
                  className="h-3 px-1 py-0 border-red-600 bg-red-50"
                  title="لا يوجد ارتباط"
                >
                  <Link2Off size={10} className="text-red-600" />
                </Badge>
              )}
            </div>

            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatDate(message.receivedDateTime)}
            </span>
          </div>

          <p
            className={cn(
              "text-sm break-words line-clamp-1 mb-4",
              isUnread ? "font-semibold text-gray-900" : "text-gray-700"
            )}
          >
            {message.subject || "(بدون عنوان)"}
          </p>

          <p
            className={cn(
              "text-xs line-clamp-1 w-full max-w-full overflow-hidden text-ellipsis break-words",
              isUnread ? "text-gray-700" : "text-gray-500"
            )}
          >
            {message.bodyPreview}
          </p>
        </div>
      </div>
    </div>
  );
}
