import { Zain } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

// تحميل خط Zain
const zain = Zain({
  subsets: ["arabic"],
  variable: "--font-zain",
  weight: ["200", "300", "400", "700", "800", "900"],
});

export const metadata = {
  title: "النظام القانوني",
  description: "نظام إدارة قانونية متطور مع دعم النفاذ الوطني",
  keywords: "قانوني, النفاذ الوطني, المملكة العربية السعودية, خدمات قانونية",
  authors: [{ name: "النظام القانوني" }],
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={zain.variable}>
      <body className="font-zain antialiased bg-background">
        <Providers>
          <main className="flex flex-col min-h-screen overflow-hidden">
            <div className="flex-1">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
