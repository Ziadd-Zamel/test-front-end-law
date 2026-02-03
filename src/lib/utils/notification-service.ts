// utils/notificationService.ts

/**
 * Register Service Worker for push notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers not supported");
    return null;
  }

  try {
    const registration =
      await navigator.serviceWorker.register("/service-worker.js");
    console.log("✅ Service Worker registered:", registration);
    return registration;
  } catch (error) {
    console.error("❌ Service Worker registration failed:", error);
    return null;
  }
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("Browser does not support notifications");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  console.log(`Notification permission: ${permission}`);
  return permission;
}

/**
 * Subscribe to push notifications
 * Note: This requires a VAPID public key from your backend
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration,
  vapidPublicKey?: string,
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey
        ? urlBase64ToUint8Array(vapidPublicKey)
        : undefined,
    });

    console.log("✅ Push subscription created:", subscription);
    return subscription;
  } catch (error) {
    console.error("❌ Push subscription failed:", error);
    return null;
  }
}

/**
 * Send subscription to backend
 */
export async function sendSubscriptionToBackend(
  subscription: PushSubscription,
  token: string,
): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to send subscription to backend:", error);
    return false;
  }
}

/**
 * Initialize push notifications (call this on app load)
 */
export async function initializePushNotifications(
  token: string,
  vapidPublicKey?: string,
): Promise<boolean> {
  try {
    // 1. Request permission
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return false;
    }

    // 2. Register service worker
    const registration = await registerServiceWorker();
    if (!registration) {
      console.log("Service worker registration failed");
      return false;
    }

    // 3. Subscribe to push (optional - only if using Web Push API)
    if (vapidPublicKey) {
      const subscription = await subscribeToPushNotifications(
        registration,
        vapidPublicKey,
      );

      if (subscription) {
        // 4. Send subscription to backend
        await sendSubscriptionToBackend(subscription, token);
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to initialize push notifications:", error);
    return false;
  }
}

/**
 * Helper function to convert VAPID key
 */
function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
