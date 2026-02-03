"use client";

import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";

export const usePermissionNotifications = (token: string | null) => {
  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://api.abdullah-hassan.com/notificationHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("🟢 Connected to SignalR");
      })
      .catch((error) => {
        console.error("SignalR connection error:", error);
      });

    connection.on("ReceiveNotification", (notification) => {
      console.log(notification);

      toast.info(notification.title, {
        description: notification.message,
      });
    });

    return () => {
      connection.stop().then(() => {
        console.log("🔴 Disconnected from SignalR");
      });
    };
  }, [token]);
};
