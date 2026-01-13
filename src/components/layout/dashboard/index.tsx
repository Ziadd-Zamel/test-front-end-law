import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarHeader } from "./components/sidebar-header";
import { ReactNode } from "react";
import CustomBreadcrumb from "@/components/common/custom-breadcrumb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getNavItems } from "@/lib/utils/get-nav-Items";
import { getUserPermissions } from "@/lib/utils/permission-server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const IsVerified =
    session?.user.phoneNumberConfirmed && session.user.emailConfirmed;

  // Get user permissions and generate nav items
  const userPermissions = (await getUserPermissions()) || [];
  const navItems = getNavItems(userPermissions);

  return (
    <SidebarProvider>
      {IsVerified && <AppSidebar navItems={navItems} />}
      <SidebarInset>
        <SidebarHeader session={session} />
        <div className="w-full bg-gray-50 h-full relative">
          {IsVerified && (
            <div className="w-full pr-6 pt-8">
              <CustomBreadcrumb />
            </div>
          )}

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
