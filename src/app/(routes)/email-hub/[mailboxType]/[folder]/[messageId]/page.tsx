import MessageDetailsPage from "./_components/message-details-page";
const convertMailboxType = (
  mailboxType: string
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
  const folder = resolvedParams.folder;
  const messageId = resolvedParams.messageId;
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
