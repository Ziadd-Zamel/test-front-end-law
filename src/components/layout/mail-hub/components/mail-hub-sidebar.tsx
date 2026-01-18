"use client";

import * as React from "react";
import {
  Mail,
  Inbox,
  Send,
  Trash2,
  Search,
  type LucideIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Get icon based on folder type
const getFolderIcon = (url: string): LucideIcon => {
  if (url.includes("/inbox")) return Inbox;
  if (url.includes("/sent")) return Send;
  if (url.includes("/junk")) return Trash2;
  if (url.includes("/search")) return Search;
  if (url.includes("/send")) return Send;
  return Mail;
};

// Mail Hub specific navigation - completely flat structure
const mailHubLinks = [
  { title: "صندوق الوارد", url: "/email-hub/Info/inbox" },
  { title: "المرسل", url: "/email-hub/Info/sent" },
  { title: "البريد المزعج", url: "/email-hub/Info/junk" },
  { title: "البحث", url: "/email-hub/Info/search" },
  { title: "ارسل البريد", url: "/email-hub/Info/send" },
  { title: "صندوق الوارد", url: "/email-hub/Auto/inbox" },
  { title: "المرسل", url: "/email-hub/Auto/sent" },
  { title: "البريد المزعج", url: "/email-hub/Auto/junk" },
  { title: "البحث", url: "/email-hub/Auto/search" },
  { title: "ارسل البريد", url: "/email-hub/Auto/send" },
  { title: "صندوق الوارد", url: "/email-hub/Employee/inbox" },
  { title: "المرسل", url: "/email-hub/Employee/sent" },
  { title: "البريد المزعج", url: "/email-hub/Employee/junk" },
  { title: "البحث", url: "/email-hub/Employee/search" },
  { title: "ارسل البريد", url: "/email-hub/Employee/send" },
];

export function MailHubSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the mailbox type from the pathname (Info, Auto, or Employee)
  const pathSegments = pathname.split("/").filter(Boolean);
  const mailboxType = pathSegments[1]; // email-hub/[mailboxType]/...

  // Filter links to only show the ones matching the current segment
  const filteredLinks = React.useMemo(() => {
    if (!mailboxType) {
      return mailHubLinks;
    }
    return mailHubLinks.filter((link) =>
      link.url.toLowerCase().includes(`/${mailboxType.toLowerCase()}/`),
    );
  }, [mailboxType]);

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <Sidebar dir="rtl" {...props}>
      <SidebarHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
        <div className="flex items-center gap-3 px-4 py-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 shadow-sm">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-base text-gray-900 leading-tight">
              البريد الموحد
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="hide-scrollbar">
        <SidebarGroup>
          <SidebarMenu className="mt-2">
            {filteredLinks.map((link) => {
              const isActive = pathname === link.url;
              const Icon = getFolderIcon(link.url);
              return (
                <SidebarMenuItem key={link.url}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(link.url)}
                    className={cn(
                      "gap-4 rounded-lg text-xs cursor-pointer transition-colors",
                      isActive
                        ? "bg-gray-200 text-black"
                        : "text-gray-700 hover:bg-gray-200 hover:text-black",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
