import MailPage from "./_components/mail-page";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    mailboxType: string;
    folder: string;
  }>;
  searchParams: Promise<{
    skipToken?: string;
  }>;
}

// Valid values
const VALID_MAILBOX_TYPES = ["Info", "Auto", "Employee"] as const;
const VALID_FOLDERS = ["inbox", "sent", "junk"] as const;

type mailboxType = (typeof VALID_MAILBOX_TYPES)[number];
type mailfolderType = (typeof VALID_FOLDERS)[number];

export default async function Page({ params }: PageProps) {
  // Resolve params
  const resolvedParams = await params;

  // Extract route params
  const mailboxType = resolvedParams.mailboxType;
  const folder = resolvedParams.folder;

  // Validate mailboxType and folder
  if (
    !VALID_MAILBOX_TYPES.includes(mailboxType as mailboxType) ||
    !VALID_FOLDERS.includes(folder as mailfolderType)
  ) {
    notFound();
  }

  return (
    <MailPage
      folder={folder as mailfolderType}
      mailboxType={mailboxType as mailboxType}
    />
  );
}
