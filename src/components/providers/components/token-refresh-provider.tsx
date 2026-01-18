"use client";

import { useRefreshToken } from "@/app/auth/_hooks/use-auth";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

const SESSION_OWNER_KEY = "session-owner-id";
const REFRESH_INTERVAL = 10000;
const STORAGE_KEY = "token-expires-at";

function getMyTabId() {
  let id = sessionStorage.getItem(SESSION_OWNER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_OWNER_KEY, id);
  }
  return id;
}

function isLeader() {
  const owner = localStorage.getItem(SESSION_OWNER_KEY);
  const me = getMyTabId();
  return owner && me && owner === me;
}

interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

export function TokenRefreshProvider({ children }: TokenRefreshProviderProps) {
  const { refreshToken, isPending, session } = useRefreshToken();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session) return;

    if (!isLeader()) return;

    const handleStorageChange = () => {
      if (!localStorage.getItem(SESSION_OWNER_KEY)) {
        sessionStorage.setItem(SESSION_OWNER_KEY, getMyTabId());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const run = () => {
      if (!isLeader()) return;
      if (!isPending) refreshToken();
    };

    const now = Date.now();
    const storedNext = Cookies.get(STORAGE_KEY);

    let initialDelay = REFRESH_INTERVAL;

    if (storedNext) {
      const next = parseInt(storedNext, 10);
      const diff = next - now;
      if (diff > 0) initialDelay = diff;
    }

    const initialTimeout = setTimeout(() => {
      run();
      intervalRef.current = setInterval(run, REFRESH_INTERVAL);
    }, initialDelay);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearTimeout(initialTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session, isPending, refreshToken]);

  return <>{children}</>;
}
