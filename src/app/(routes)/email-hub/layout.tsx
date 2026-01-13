import MailHubLayout from "@/components/layout/mail-hub";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MailHubLayout>{children}</MailHubLayout>;
}
