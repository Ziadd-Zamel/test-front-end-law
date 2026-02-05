export interface PushNotificationPayload {
  title: string;
  message: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function showPushNotification(payload: PushNotificationPayload) {
  if (!isBrowser()) return;
  if (Notification.permission !== "granted") return;

  new Notification(payload.title, {
    body: payload.message,
    icon: "/icons/notification.png",
    badge: "/icons/badge.png",
    silent: false,
  });
}

export function shouldAskNotificationPermission(): boolean {
  if (!isBrowser()) return false;
  return Notification.permission === "default";
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isBrowser()) return false;

  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}
