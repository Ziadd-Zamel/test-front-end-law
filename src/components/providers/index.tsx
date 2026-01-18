import PermissionNotificationListener from "../common/use-permission-notifications";
import { Toaster } from "../ui/sonner";
import FingerprintProvider from "./components/fingerprint-client";
import ReactQueryProvider from "./components/react-query.provider";
import SessionClientProvider from "./components/session-client-provider";
import { ThemeProvider } from "./components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/react";
import { TokenRefreshProvider } from "./components/token-refresh-provider";

export default async function Providers({ children }: ProvidersProps) {
  return (
    <SessionClientProvider>
      <ReactQueryProvider>
        <TokenRefreshProvider>
          <ThemeProvider
            defaultTheme="light"
            attribute="class"
            enableSystem={false}
            storageKey="next-theme"
          >
            <NuqsAdapter>
              <FingerprintProvider>
                <PermissionNotificationListener />
                {children}
                <Toaster />
              </FingerprintProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </TokenRefreshProvider>
      </ReactQueryProvider>
    </SessionClientProvider>
  );
}
