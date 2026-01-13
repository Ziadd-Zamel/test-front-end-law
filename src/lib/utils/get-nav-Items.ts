/* eslint-disable @typescript-eslint/no-unused-vars */
export const PERMISSIONS = {
  ALL_ATTORNEYS: "قائمة جميع الوكالات",
};

interface NavItem {
  title: string;
  url: string;
  icon: string;
  isActive?: boolean;
  isBlanck?: boolean;
  isRed?: boolean;
  items?: Array<{
    title: string;
    url: string;
    isBlanck?: boolean;
  }>;
}

/**
 * Generate navigation items based on user permissions
 * @param userPermissions - Array of user permissions from session
 * @returns Array of navigation items
 */
export function getNavItems(
  userPermissions: Array<{ id: number; name: string }>
): NavItem[] {
  const navItems: NavItem[] = [
    {
      title: "الأعمال",
      url: "/business",
      icon: "FileBarChart",
      isActive: true,
    },
    {
      title: "القضايا",
      url: "/cases",
      icon: "MessageSquare",
      items: [
        {
          title: "إضافة قضية",
          url: "/cases/add-edit-case",
        },
        {
          title: "إدارة القضايا",
          url: "/cases/list",
        },
        {
          title: "الفئات",
          url: "/cases/category",
        },
      ],
    },
    {
      title: "الصلح",
      url: "/settlement",
      icon: "MessageSquare",
      items: [
        {
          title: "طلب صلح جديد",
          url: "/settlement/add-edit-settlement",
        },
        {
          title: "طلبات الصلح",
          url: "/settlement/settlement-request",
        },
        {
          title: "الفئات",
          url: "/settlement/category",
        },
      ],
    },
    {
      title: "البريد الموحد",
      url: "/email-hub",
      icon: "MessageSquare",
      items: [
        {
          title: "Info",
          url: "/email-hub/Info/inbox",
          isBlanck: true,
        },
        {
          title: "Auto",
          url: "/email-hub/Auto/inbox",
          isBlanck: true,
        },
        {
          title: "Employee",
          url: "/email-hub/Employee/inbox",
          isBlanck: true,
        },
      ],
    },
    {
      title: "الوكالات",
      url: "/attorey",
      icon: "MessageSquare",
      items: [
        {
          title: "طلب وكالة",
          url: "/attorney/request",
        },
        {
          title: "إضافة وكالة",
          url: "/attorney/add",
        },
        {
          title: "التحقق من وكالة",
          url: "/attorney/verify",
        },
        {
          title: "إدارة الطلبات",
          url: "/attorney/attorney-management",
        },
        {
          title: " وكالاتي",
          url: "/attorney/my-attorneies",
        },
        {
          title: "جميع الوكالات",
          url: "/attorney/all-attorneies",
        },
      ],
    },
    {
      title: "جميع الأعمال",
      url: "/all-business",
      icon: "Archive",
    },
    {
      title: "الجلسات القضائية",
      url: "/judicial-departments",
      icon: "Users",
    },
    {
      title: "الإجتماعات",
      url: "/statistics",
      icon: "BarChart3",
    },
    {
      title: "الاستشارات الخارجية",
      url: "/external-consultations",
      icon: "Users",
    },
    {
      title: "التعاميم",
      url: "/circulars",
      icon: "FileText",
    },
    {
      title: "إعداد مستند",
      url: "/document-creation",
      icon: "FileText",
    },
    {
      title: "حفظ مستند",
      url: "/document-save",
      icon: "Archive",
    },
    {
      title: "قائمة العملاء",
      url: "/clients-list",
      icon: "Users",
    },
    {
      title: "البريد الإلكتروني",
      url: "/email",
      icon: "Mail",
    },
    {
      title: "الاعتمادات",
      url: "/approvals",
      icon: "CheckSquare",
    },
    {
      title: "PDF Manager Pro",
      url: "/pdf-manager",
      icon: "FileText",
    },
    {
      title: "مستعرض الملفات",
      url: "/file-browser",
      icon: "Folder",
    },
    {
      title: "إدارة الموظفين",
      url: "/employee-management",
      icon: "UserCheck",
    },
    {
      title: "الأعدادات",
      url: "/settings",
      icon: "Settings",
      items: [
        {
          title: "الصلاحيات",
          url: "/settings/permissions",
        },
      ],
    },
    {
      title: "السياسات",
      url: "/policies",
      icon: "ScrollText",
      isRed: true,
    },
  ];

  return navItems;
}
