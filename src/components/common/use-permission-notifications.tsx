"use client";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissionNotifications } from "@/hooks/use-permission-notifications";

export default function PermissionNotificationListener() {
  const { token } = useAuthToken();
  usePermissionNotifications(token);

  return null;
}
