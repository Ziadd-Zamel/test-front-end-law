"use client";
import { usePermissionNotifications } from "@/hooks/use-permission-notifications";

export default function PermissionNotificationListener({
  token,
}: {
  token: string;
  baseUrl: string;
}) {
  usePermissionNotifications(token);

  return null;
}
