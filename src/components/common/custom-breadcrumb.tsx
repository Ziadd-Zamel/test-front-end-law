"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

const routeNameMap: { [key: string]: { name: string; link: boolean } } = {
  "/": { name: "الرئيسية", link: true },
  "/policies": { name: "السياسات", link: true },

  // Attorney Management Routes
  "/attorney": { name: "الوكالات", link: true },
  "/attorney/my-attorneies": { name: "وكالاتي", link: true },
  "/attorney/attorney-management": { name: "إدارة الوكالات", link: true },
  "/attorney/add": { name: "إضافة وكالة جديدة", link: true },
  "/attorney/verify": { name: "التحقق من الوكالة", link: true },
  "/attorney/revoke": { name: "إلغاء الوكالة", link: true },
  "/attorney/request": { name: "طلب وكالة", link: true },
  "/attorney/all-attorneies": { name: "جميع الوكالات", link: true },

  // Cases Routes
  "/cases": { name: "القضايا", link: true },
  "/cases/category": { name: "الفئات", link: true },
  "/cases/add-edit-case": { name: "إضافة قضية", link: true },
  "/cases/add-edit-case/[caseId]": { name: "تعديل قضية", link: true },
  "/cases/list": { name: "إدارة القضايا", link: true },

  // سettlement Routes
  "/settlement": { name: "الصلح", link: true },
  "/settlement/add-edit-settlement": { name: " طلب صلح جديد", link: true },
  "/settlement/add-edit-settlement/[slugs]": {
    name: "تعديل طلب صلح",
    link: true,
  },
  "/settlement/settlement-request": { name: "طلبات الصلح", link: true },
  "/settlement/settlement-request/[settlementId]": {
    name: "تفاصيل الطلب",
    link: true,
  },
  "/settlement/category": { name: "الفئات", link: true },

  // settings
  "/settings": { name: "الأعدادات", link: true },
  "/settings/permissions": { name: "الصلاحيات", link: true },

  // Dynamic routes
  "/attorney/my-attorneies/[attorneyId]": {
    name: "تفاصيل الوكالة",
    link: true,
  },
  "/attorney/all-attorneies/[attorneyId]": {
    name: "تفاصيل الوكالة",
    link: true,
  },
  "/attorney/attorney-management/[attorneyId]": {
    name: "تفاصيل الطلب",
    link: true,
  },
};

interface CustomBreadcrumbProps {
  className?: string;
  black?: boolean;
}

export default function CustomBreadcrumb({
  className,
  black,
}: CustomBreadcrumbProps) {
  const pathname = usePathname();
  const router = useRouter();

  const pathSegments = pathname.split("/").filter(Boolean);

  if (pathname === "/") return null;

  const isDynamicId = (val: string) => {
    // number
    if (/^\d+$/.test(val)) return true;

    // uuid-like with hyphens
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F-]{13,}$/.test(val)) return true;

    // long opaque ids (base64-ish / random strings)
    if (/^[A-Za-z0-9_-]{10,}$/.test(val)) return true;

    return false;
  };
  // Normalize dynamic parts
  const normalizePath = (segments: string[]) => {
    const normalized = [...segments];
    const last = normalized.at(-1) || "";

    if (isDynamicId(last)) {
      const parentPath = normalized.slice(0, -1).join("/");

      if (
        parentPath === "attorney/my-attorneies" ||
        parentPath === "attorney/all-attorneies" ||
        parentPath === "attorney/attorney-management"
      ) {
        normalized[normalized.length - 1] = "[attorneyId]";
      } else if (parentPath === "cases/add-edit-case") {
        normalized[normalized.length - 1] = "[caseId]";
      } else if (parentPath === "settlement/settlement-request") {
        normalized[normalized.length - 1] = "[settlementId]";
      } else if (parentPath === "settlement/add-edit-settlement") {
        normalized[normalized.length - 1] = "[slugs]";
      }
    }

    return "/" + normalized.join("/");
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList
        className={cn(
          black
            ? "text-black hover:text-black/50"
            : "text-blue-700 hover:text-blue-700/50"
        )}
      >
        {/* Home item */}
        <BreadcrumbItem>
          <button
            onClick={() => handleNavigate("/")}
            className="text-blue-700 hover:text-black cursor-pointer transition-colors"
          >
            <Home className="size-5" />
          </button>
        </BreadcrumbItem>

        {pathSegments.length > 0 && (
          <BreadcrumbSeparator className="-ml-1 -mr-2" />
        )}

        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const normalizedHref = normalizePath(
            pathSegments.slice(0, index + 1)
          );
          const isLast = index === pathSegments.length - 1;

          const routeInfo = routeNameMap[normalizedHref];
          const displayName =
            routeInfo?.name ||
            segment.charAt(0).toUpperCase() +
              segment.slice(1).replace(/-/g, " ");

          // Skip "add-edit-case" segment when there's a case ID after it
          const nextSegment = pathSegments[index + 1];
          if (
            segment === "add-edit-case" &&
            nextSegment &&
            /^\d+$/.test(nextSegment)
          ) {
            return null;
          }

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbItem className="text-base">
                {isLast ? (
                  <BreadcrumbPage className="text-black">
                    {displayName}
                  </BreadcrumbPage>
                ) : (
                  <button
                    onClick={() => handleNavigate(href)}
                    className="text-blue-700 hover:text-black cursor-pointer transition-colors"
                  >
                    {displayName}
                  </button>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="-ml-1" />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
