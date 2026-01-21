/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface NotificationData {
  permissionName?: string;
  grantedBy?: string;
  grantedByEmail?: string;
}

interface PermissionNotification {
  title: string;
  message: string;
  date: string;
  data?: NotificationData;
}

export const usePermissionNotifications = (token: string | null) => {
  const { data: session, update } = useSession();

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://api.abdullah-hassan.com/notificationHub", {
        accessTokenFactory: () => token,
        skipNegotiation: false,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    connection.start();

    // Listen for notifications
    connection.on(
      "ReceiveNotification",
      async (notification: PermissionNotification) => {
        const isGranted = notification.title.includes("منح");
        const isRevoked = notification.title.includes("إلغاء");

        // Show toast notification
        if (isGranted) {
          toast.success(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        } else if (isRevoked) {
          toast.warning(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        } else {
          toast.info(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        }

        // Handle notification action (refresh session and profile)
        await handleNotificationAction(notification, update, session);
      },
    );

    connection.onclose(() => {});

    return () => {
      connection.stop();
    };
  }, [token, session, update]);
};

async function handleNotificationAction(
  notification: PermissionNotification,
  update: any,
  session: any,
) {
  try {
    // First, refresh the access token
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: session?.refreshToken,
      }),
    });

    if (!refreshResponse.ok) {
      console.error("❌ Failed to refresh token");
      return;
    }

    const refreshData = await refreshResponse.json();

    if (!refreshData.success) {
      console.error("❌ Token refresh failed:", refreshData.message);
      return;
    }

    await update({
      accessToken: refreshData.data.accessToken,
      refreshToken: refreshData.data.refreshToken,
    });

    toast.info("تم تحديث الصلاحيات", {
      description: "تم تحديث بياناتك بنجاح",
      duration: 3000,
    });
  } catch (error) {
    console.error("❌ Error handling notification action:", error);

    try {
      await update();
    } catch (fallbackError) {
      console.error("❌ Fallback session update failed:", fallbackError);
    }
  }
}
