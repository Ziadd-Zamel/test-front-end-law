import MessageDetailsPage from "./_components/message-details-page";
import { notFound } from "next/navigation";

// Valid values
const VALID_MAILBOX_TYPES = ["Info", "Auto", "Employee"] as const;
const VALID_FOLDERS = ["inbox", "sent", "junk"] as const;

type MailboxType = (typeof VALID_MAILBOX_TYPES)[number];
type FolderType = (typeof VALID_FOLDERS)[number];

const convertMailboxType = (
  mailboxType: string,
): "auto" | "info" | "employeeemail" => {
  if (mailboxType.toLowerCase() === "info") return "info";
  if (mailboxType.toLowerCase() === "auto") return "auto";
  return "employeeemail";
};

interface PageProps {
  params: Promise<{
    mailboxType: string;
    folder: string;
    messageId: string;
  }>;
  searchParams: Promise<{
    employeeId?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Resolve params
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Extract route params
  const mailboxType = resolvedParams.mailboxType;
  const folder = resolvedParams.folder as FolderType;
  const messageId = resolvedParams.messageId;

  // Validate mailboxType and folder
  if (
    !VALID_MAILBOX_TYPES.includes(mailboxType as MailboxType) ||
    !VALID_FOLDERS.includes(folder as FolderType)
  ) {
    notFound();
  }

  const mailBox = convertMailboxType(mailboxType);
  const employeeId = resolvedSearchParams.employeeId
    ? Number(resolvedSearchParams.employeeId)
    : undefined;

  return (
    <MessageDetailsPage
      employeeId={employeeId || 0}
      folder={folder}
      mailBox={mailBox}
      messageId={messageId}
    />
  );
}
