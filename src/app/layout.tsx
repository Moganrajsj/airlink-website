import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  title: "Airlink Broadband | A Brand of Sriram Broadband Services Pvt. Ltd.",
  description: "Experience blazing fast broadband with Airlink Broadband. Enterprise-grade internet, leased lines, SD-WAN, and residential fiber solutions by Sriram Broadband Services Pvt. Ltd.",
  keywords: "broadband, fiber internet, leased line, SD-WAN, Airlink Broadband, internet service provider, Dharmapuri, Chennai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="bg-background text-dark">
        <AuthProvider>
          <ConditionalLayout>
            <PageTransition>
              {children}
            </PageTransition>
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
