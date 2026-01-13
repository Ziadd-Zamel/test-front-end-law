"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import UserDropDown from "@/components/layout/dashboard/components/user-dropdown";

interface MailHubHeaderProps {
  session: Session | null;
}

// Mail Hub links - same as sidebar to match titles
const mailHubLinks = [
  { title: " صندوق الوارد", url: "/email-hub/Info/inbox" },
  { title: "المرسل", url: "/email-hub/Info/sent" },
  { title: "البريد المزعج", url: "/email-hub/Info/junk" },
  { title: "صندوق الوارد", url: "/email-hub/Auto/inbox" },
  { title: "المرسل", url: "/email-hub/Auto/sent" },
  { title: "البريد المزعج", url: "/email-hub/Auto/junk" },
  { title: "صندوق الوارد", url: "/email-hub/Employee/inbox" },
  { title: " المرسل", url: "/email-hub/Employee/sent" },
  { title: "البريد المزعج", url: "/email-hub/Employee/junk" },
];

// Get page title from matching link
const getPageTitle = (pathname: string): string => {
  if (pathname === "/email-hub") return "البريد الموحد";

  const matchedLink = mailHubLinks.find((link) => link.url === pathname);
  if (matchedLink) return matchedLink.title.trim();

  // Fallback - extract from URL
  const pathSegments = pathname.split("/").filter(Boolean);
  const mailboxType = pathSegments[1];
  if (mailboxType && !pathSegments[2]) return mailboxType;

  return "البريد الموحد";
};

export function MailHubHeader({ session }: MailHubHeaderProps) {
  const pathname = usePathname();
  const IsVerified =
    session?.user.phoneNumberConfirmed && session.user.emailConfirmed;

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="flex h-16 bg-white border-b border-gray-200 shrink-0 items-center justify-between px-4">
      {/* Sidebar Trigger and Page Title on Right */}
      <div className="flex items-center gap-3 min-w-[200px]">
        {IsVerified && <SidebarTrigger className="-mr-1" />}
        {IsVerified && (
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            {pageTitle}
          </h1>
        )}
      </div>

      {/* User Menu on Left */}
      <div className="flex items-center">
        <UserDropDown session={session} />
      </div>
    </header>
  );
}
