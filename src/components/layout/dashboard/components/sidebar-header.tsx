"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Notifications from "./notifications";
import QuickAccessMenu from "./quick-access-menu";
import UserDropDown from "./user-dropdown";
import { Session } from "next-auth";

interface SidebarHeaderProps {
  session: Session | null;
}

export function SidebarHeader({ session }: SidebarHeaderProps) {
  const router = useRouter();
  const IsVerified =
    session?.user.phoneNumberConfirmed && session.user.emailConfirmed;

  return (
    <header className="flex h-16 bg-gray-100 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {IsVerified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-9 w-9"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="!text-xs">الرجوع إلي الخلف</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
        {IsVerified && <SidebarTrigger className="-mr-1" />}
      </div>
      <div className="flex items-center gap-3">
        {IsVerified && <Notifications />}
        {IsVerified && <QuickAccessMenu />}

        <UserDropDown session={session} />
      </div>
    </header>
  );
}
