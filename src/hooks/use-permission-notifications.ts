"use client";

import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";
import { useRefreshToken } from "@/app/auth/_hooks/use-auth";
import { showPushNotification } from "@/hooks/browser-notification";

interface PermissionNotification {
  title: string;
  message: string;
  permissionNotification?: number;
}

export const usePermissionNotifications = (token: string | null) => {
  const { refreshToken } = useRefreshToken();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://api.abdullah-hassan.com/notificationHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => console.log("🟢 SignalR connected"))
      .catch((err) => console.error("SignalR connection failed", err));

    connection.on(
      "ReceiveNotification",
      async (notification: PermissionNotification) => {
        // In-app toast
        toast.info(notification.title, {
          description: notification.message,
        });

        // Browser push
        showPushNotification({
          title: notification.title,
          message: notification.message,
        });

        // Token refresh if required
        if (notification.permissionNotification === 1) {
          try {
            refreshToken();
          } catch (err) {
            console.error("Token refresh failed", err);
          }
        }
      },
    );

    connection.onreconnecting(() => console.warn("⚠️ SignalR reconnecting..."));

    connection.onreconnected((id) => console.log("🔄 SignalR reconnected", id));

    return () => {
      connection.stop().then(() => console.log("🔴 SignalR disconnected"));
    };
  }, [token, refreshToken]);
};
