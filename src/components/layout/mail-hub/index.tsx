import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MailHubSidebar } from "./components/mail-hub-sidebar";
import { MailHubHeader } from "./components/mail-hub-header";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function MailHubLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const IsVerified =
    session?.user.phoneNumberConfirmed && session.user.emailConfirmed;

  return (
    <SidebarProvider>
      {IsVerified && <MailHubSidebar />}
      <SidebarInset>
        <MailHubHeader session={session} />
        <div className="w-full bg-white h-full relative">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
