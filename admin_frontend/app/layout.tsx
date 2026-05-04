import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { RBACProvider } from '@/contexts/RBACContext';
import { AdminProvider } from '@/contexts/AdminContext';

// Req 1.2: Soft Luxury Design System Fonts
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vibe Survey Admin",
  description: "System Admin Dashboard for Vibe Survey Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
          <AuthProvider>
            <RBACProvider>
              <AdminProvider>{children}</AdminProvider>
            </RBACProvider>
          </AuthProvider>
        </body>
    </html>
  );
}
