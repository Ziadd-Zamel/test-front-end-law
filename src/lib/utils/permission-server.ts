import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

/**
 * Server-side permission checker
 * Use this in Server Components, API Routes, and Server Actions
 *
 * @param permissionName - The name of the permission to check
 * @returns Promise<boolean> - True if user has the permission, false otherwise
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { hasPermission } from "@/lib/utils/permissions.server";
 *
 * export default async function Page() {
 *   const canView = await hasPermission("قائمة جميع الوكالات");
 *
 *   if (!canView) {
 *     return <div>Access Denied</div>;
 *   }
 *
 *   return <div>Protected Content</div>;
 * }
 * ```
 */
export async function hasPermission(permissionName: string): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return false;
    }

    const permissions = session.user.permissions || [];

    const hasAccess = permissions.some(
      (permission) => permission.name === permissionName
    );

    if (hasAccess) {
      console.log(
        `✅ [hasPermission] User has permission: "${permissionName}"`
      );
    } else {
      console.log(
        `🚫 [hasPermission] User lacks permission: "${permissionName}"`
      );
    }

    return hasAccess;
  } catch (error) {
    console.error("❌ [hasPermission] Error checking permission:", error);
    return false;
  }
}

/**
 * Server-side multiple permissions checker
 * Check if user has ALL the specified permissions
 *
 * @param permissionNames - Array of permission names to check
 * @returns Promise<boolean> - True if user has ALL permissions, false otherwise
 *
 * @example
 * ```tsx
 * const canEdit = await hasAllPermissions(["قائمة جميع الوكالات", "تعديل الوكالة"]);
 * ```
 */
export async function hasAllPermissions(
  permissionNames: string[]
): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return false;
    }

    const permissions = session.user.permissions || [];
    const permissionNameSet = new Set(permissions.map((p) => p.name));

    return permissionNames.every((name) => permissionNameSet.has(name));
  } catch (error) {
    console.error("❌ [hasAllPermissions] Error checking permissions:", error);
    return false;
  }
}

/**
 * Server-side any permission checker
 * Check if user has ANY of the specified permissions
 *
 * @param permissionNames - Array of permission names to check
 * @returns Promise<boolean> - True if user has ANY permission, false otherwise
 *
 * @example
 * ```tsx
 * const canAccess = await hasAnyPermission(["قائمة جميع الوكالات", "عرض الوكالة"]);
 * ```
 */
export async function hasAnyPermission(
  permissionNames: string[]
): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return false;
    }

    const permissions = session.user.permissions || [];
    const permissionNameSet = new Set(permissions.map((p) => p.name));

    return permissionNames.some((name) => permissionNameSet.has(name));
  } catch (error) {
    console.error("❌ [hasAnyPermission] Error checking permissions:", error);
    return false;
  }
}

/**
 * Get all user permissions (server-side)
 *
 * @returns Promise<Array<{id: number, name: string}>> - Array of user permissions
 */
export async function getUserPermissions(): Promise<
  Array<{ id: number; name: string }>
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return [];
    }

    return session.user.permissions || [];
  } catch (error) {
    console.error("❌ [getUserPermissions] Error getting permissions:", error);
    return [];
  }
}
