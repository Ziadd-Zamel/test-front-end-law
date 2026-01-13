import catchError from "@/lib/utils/catch-error";
import { getMessageDetails } from "@/lib/api/mail.api";
import {
  PageEmptyState,
  PageErrorState,
} from "@/components/common/page-states";
import MailBody from "./mail-body";
import MailReplies from "./mail-replies";

interface PageProps {
  mailBox: "auto" | "info" | "employeeemail";
  folder: string;
  employeeId: number;
  messageId: string;
}

export default async function MessageDetailsPage({
  employeeId,
  mailBox,
  messageId,
}: PageProps) {
  // Fetching
  const [payload, error] = await catchError(() =>
    getMessageDetails(messageId, mailBox, employeeId)
  );

  // Handle error state
  if (error) {
    return <PageErrorState error={error} />;
  }

  // Handle empty state
  if (!payload?.data?.messages || payload?.data?.messages.length === 0) {
    return <PageEmptyState />;
  }

  // First message is the main email
  const mainMessage = payload?.data?.messages[0];

  // Rest are replies
  const replies = payload?.data?.messages.slice(1);

  // const views = mainMessage.showMessages;

  return (
    <div className="min-h-screen bg-gray-50 box-container py-10">
      {/* Main Email */}
      <MailBody mailBox={mailBox} mail={mainMessage} />

      {/* Replies Section */}
      {replies.length > 0 && <MailReplies replies={replies} />}

      {/* View History */}
      {/* {views && views.length > 0 && <MailHistory messages={views} />} */}
    </div>
  );
}
