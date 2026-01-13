"use client";

import {
  PageEmptyState,
  PageErrorState,
} from "@/components/common/page-states";
import { Loader2 } from "lucide-react";
import EmailCard from "./mail-card";
import { Button } from "@/components/ui/button";
import { useMailMessages } from "@/app/(routes)/email-hub/_hooks/use-mail-messages";
import { EmailListSkeleton } from "./email-card-skeleton";

interface MailPageProps {
  mailboxType: "Info" | "Auto" | "Employee";
  folder: "inbox" | "sent" | "junk";
}

export default function MailPage({ folder, mailboxType }: MailPageProps) {
  // Get Mail Data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useMailMessages(mailboxType, folder);

  console.log(data);

  // Loading State
  if (isLoading) {
    return <EmailListSkeleton />;
  }

  // Error State
  if (isError) {
    return <PageErrorState error={error as Error} />;
  }

  const allMessages = data?.pages.flatMap((page) => page.data.messages) ?? [];

  // Empty State
  if (allMessages.length === 0) {
    return <PageEmptyState />;
  }

  return (
    <section className="overflow-hidden relative">
      {/** All emails */}
      {allMessages.map((message) => (
        <EmailCard
          key={message.id}
          message={message}
          type={folder}
          mailboxType={mailboxType}
          folder={folder}
        />
      ))}

      {/** Load more button */}
      {hasNextPage && (
        <div className="flex justify-center py-6 px-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="min-w-[120px]"
          >
            {isFetchingNextPage ? (
              <>
                <span>جاري التحميل...</span>
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
              </>
            ) : (
              <span>تحميل المزيد</span>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
