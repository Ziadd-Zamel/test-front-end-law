"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

type FingerprintContextValue = {
  visitorId: string | null;
  error: unknown | null;
  isLoading: boolean;
};

const FingerprintContext = createContext<FingerprintContextValue | undefined>(
  undefined
);

export function useFingerprint() {
  const ctx = useContext(FingerprintContext);
  if (!ctx) {
    throw new Error("useFingerprint must be used within a FingerprintProvider");
  }
  return ctx;
}

export default function FingerprintProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        if (isMounted) setVisitorId(result.visitorId);
      } catch (err) {
        if (isMounted) setError(err);
        // Also surface in console for debugging
        console.error("Fingerprint error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<FingerprintContextValue>(
    () => ({ visitorId, error, isLoading }),
    [visitorId, error, isLoading]
  );

  return (
    <FingerprintContext.Provider value={value}>
      {children}
    </FingerprintContext.Provider>
  );
}
