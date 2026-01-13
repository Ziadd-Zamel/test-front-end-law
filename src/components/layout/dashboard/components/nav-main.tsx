"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import LinkButton from "@/components/common/link-button";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isBlanck?: boolean;
    isActive?: boolean;
    isRed?: boolean;
    items?: {
      title: string;
      isBlanck?: boolean;
      url: string;
    }[];
  }[];
}) {
  const router = useRouter();

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="mt-12">
        {items.map((item) => {
          // If item has no sub-items, render as a direct button
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => handleNavigation(item.url)}
                  className={`cursor-pointer ${
                    item.isRed ? "text-red-500 hover:text-red-600" : ""
                  }`}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className=" overflow-hidden transition-all duration-200 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <SidebarMenuSub dir="rtl">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem
                        className="hover:bg-blue-50 duration-300 transition-all"
                        key={subItem.title}
                      >
                        <SidebarMenuSubButton
                          asChild
                          className="cursor-pointer"
                        >
                          <LinkButton
                            openInNewTab={subItem.isBlanck}
                            href={subItem.url}
                          >
                            {subItem.title}
                          </LinkButton>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
