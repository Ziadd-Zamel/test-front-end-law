"use client";

import * as React from "react";
import {
  FileBarChart,
  BarChart3,
  Users,
  Settings,
  Archive,
  UserCheck,
  Mail,
  CheckSquare,
  FileText,
  Folder,
  MessageSquare,
  ScrollText,
  LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/layout/dashboard/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  FileBarChart,
  BarChart3,
  Users,
  Settings,
  Archive,
  UserCheck,
  Mail,
  CheckSquare,
  FileText,
  Folder,
  MessageSquare,
  ScrollText,
};

interface NavItem {
  title: string;
  url: string;
  icon: string;
  isActive?: boolean;
  isRed?: boolean;
  items?: Array<{
    title: string;
    url: string;
  }>;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems: NavItem[];
}

export function AppSidebar({ navItems, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  // Don't show sidebar on verification page
  if (pathname === "/verification-required") {
    return null;
  }

  // Map icon strings to actual icon components
  const navItemsWithIcons = navItems.map((item) => ({
    ...item,
    icon: iconMap[item.icon] || MessageSquare,
  }));

  return (
    <Sidebar dir="rtl" collapsible="icon" {...props}>
      <SidebarContent className="hide-scrollbar">
        <NavMain items={navItemsWithIcons} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
