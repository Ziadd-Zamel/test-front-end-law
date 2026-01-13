import MailSearchPage from "./_components/mail-search-page";

interface PageProps {
  params: Promise<{
    mailboxType: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Resolve params
  const resolvedParams = await params;

  // Extract route params
  const mailboxType = resolvedParams.mailboxType as mailboxType;

  return <MailSearchPage mailboxType={mailboxType} />;
}
