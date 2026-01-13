"use client";
import { useRefreshToken } from "@/app/auth/_hooks/use-auth";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

const REFRESH_INTERVAL = 10000;
const STORAGE_KEY = "token-expires-at";

export function TokenRefreshProvider({ children }: TokenRefreshProviderProps) {
  const { refreshToken, isPending, session } = useRefreshToken();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }
    const setupRefreshInterval = () => {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Get the stored next refresh time
      const storedNextTime = Cookies.get(STORAGE_KEY);
      const now = Date.now();

      let nextRefreshTime: number;
      let initialDelay: number;

      if (storedNextTime) {
        // Parse the stored time
        nextRefreshTime = parseInt(storedNextTime, 10);

        // Calculate how much time is left
        const timeLeft = nextRefreshTime - now;

        if (timeLeft <= 0) {
          // Time has already passed, refresh immediately and set new schedule
          if (!isPending) {
            refreshToken();
          }
          nextRefreshTime = now + REFRESH_INTERVAL;
          initialDelay = REFRESH_INTERVAL;
        } else {
          // Wait for the remaining time
          initialDelay = timeLeft;
        }
      } else {
        // No stored time, start fresh
        nextRefreshTime = now + REFRESH_INTERVAL;
        initialDelay = REFRESH_INTERVAL;
      }

      // Set up the first timeout for the initial delay
      const initialTimeout = setTimeout(() => {
        if (!isPending) {
          refreshToken();
        }

        // Now set up the regular interval
        intervalRef.current = setInterval(() => {
          if (!isPending) {
            refreshToken();
          }
        }, REFRESH_INTERVAL);
      }, initialDelay);

      // Store the timeout so we can clear it on cleanup
      return initialTimeout;
    };

    const initialTimeout = setupRefreshInterval();

    // Cleanup function
    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshToken, isPending, session]);

  return <>{children}</>;
}
