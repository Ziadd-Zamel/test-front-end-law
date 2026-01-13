"use client";

import { useSession } from "next-auth/react";

/**
 * Client-side permission checker hook
 * Use this in Client Components
 *
 * @returns Object with permission checking functions
 *
 * @example
 * ```tsx
 * "use client";
 *
 * import { usePermissions } from "@/lib/utils/permissions.client";
 *
 * export default function ClientComponent() {
 *   const { hasPermission, hasAllPermissions, permissions, isLoading } = usePermissions();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   if (!hasPermission("قائمة جميع الوكالات")) {
 *     return <div>Access Denied</div>;
 *   }
 *
 *   return <div>Protected Content</div>;
 * }
 * ```
 */
export function usePermissions() {
  const { data: session, status } = useSession();

  const permissions = session?.user?.permissions || [];
  const isLoading = status === "loading";

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permissionName: string): boolean => {
    if (!session || !session.user) {
      return false;
    }

    return permissions.some((permission) => permission.name === permissionName);
  };

  /**
   * Check if user has ALL specified permissions
   */
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    if (!session || !session.user) {
      return false;
    }

    const permissionNameSet = new Set(permissions.map((p) => p.name));
    return permissionNames.every((name) => permissionNameSet.has(name));
  };

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (!session || !session.user) {
      return false;
    }

    const permissionNameSet = new Set(permissions.map((p) => p.name));
    return permissionNames.some((name) => permissionNameSet.has(name));
  };

  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isLoading,
    isAuthenticated: !!session,
  };
}
