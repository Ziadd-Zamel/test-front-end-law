"use client";

import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";
import { useRefreshToken } from "@/app/auth/_hooks/use-auth";

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
      .then(() => {
        console.log("🟢 Connected to SignalR");
      })
      .catch((error) => {
        console.error("SignalR connection error:", error);
      });

    connection.on("ReceiveNotification", async (notification) => {
      console.log(notification);

      toast.info(notification.title, {
        description: notification.message,
      });
      console.log();
      // Refresh token after receiving notification
      try {
        if (notification.permissionNotification === 1) {
          await refreshToken();
        }

        console.log("🟢 Reconnected successfully");
      } catch (error) {
        console.error("Failed to refresh token or reconnect:", error);
      }
    });

    // Handle reconnection events
    connection.onreconnected((connectionId) => {
      console.log("🔄 Reconnected to SignalR", connectionId);
    });

    connection.onreconnecting((error) => {
      console.log("⚠️ Attempting to reconnect...", error);
    });

    return () => {
      connection.stop().then(() => {
        console.log("🔴 Disconnected from SignalR");
      });
    };
  }, [token, refreshToken]);
};
