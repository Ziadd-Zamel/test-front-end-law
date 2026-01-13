import MailPage from "./_components/mail-page";

interface PageProps {
  params: Promise<{
    mailboxType: string;
    folder: string;
  }>;
  searchParams: Promise<{
    skipToken?: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Resolve params
  const resolvedParams = await params;

  // Extract route params
  const mailboxType = resolvedParams.mailboxType as mailboxType;
  const folder = resolvedParams.folder as mailfolderType;

  return <MailPage folder={folder} mailboxType={mailboxType} />;
}
