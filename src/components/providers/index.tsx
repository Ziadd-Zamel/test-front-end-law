import PermissionNotificationListener from "../common/use-permission-notifications";
import { Toaster } from "../ui/sonner";
import FingerprintProvider from "./components/fingerprint-client";
import ReactQueryProvider from "./components/react-query.provider";
import SessionClientProvider from "./components/session-client-provider";
import { ThemeProvider } from "./components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/react";
import { TokenRefreshProvider } from "./components/token-refresh-provider";
import DisabledProtection from "./components/disabled-protection";
import { getAuthHeader } from "@/lib/utils/auth-header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Providers({ children }: ProvidersProps) {
  const session = await getServerSession(authOptions);
  const token = session?.user ? await getAuthHeader() : null;
  const baseUrl = process.env.NOTI_URL;

  // Check verification status
  const profile = session?.user;
  const emailConfirmed = profile?.emailConfirmed ?? false;
  const phoneNumberConfirmed = profile?.phoneNumberConfirmed ?? false;
  const isVerified = emailConfirmed || phoneNumberConfirmed;

  return (
    <SessionClientProvider>
      <ReactQueryProvider>
        {token && isVerified && (
          <PermissionNotificationListener
            baseUrl={baseUrl || ""}
            token={token.token}
          />
        )}

        {isVerified ? (
          <TokenRefreshProvider>
            <DisabledProtection />
            <ThemeProvider
              defaultTheme="light"
              attribute="class"
              enableSystem={false}
              storageKey="next-theme"
            >
              <NuqsAdapter>
                <FingerprintProvider>
                  {children}
                  <Toaster />
                </FingerprintProvider>
              </NuqsAdapter>
            </ThemeProvider>
          </TokenRefreshProvider>
        ) : (
          <>
            <DisabledProtection />
            <ThemeProvider
              defaultTheme="light"
              attribute="class"
              enableSystem={false}
              storageKey="next-theme"
            >
              <NuqsAdapter>
                <FingerprintProvider>
                  {children}
                  <Toaster />
                </FingerprintProvider>
              </NuqsAdapter>
            </ThemeProvider>
          </>
        )}
      </ReactQueryProvider>
    </SessionClientProvider>
  );
}
