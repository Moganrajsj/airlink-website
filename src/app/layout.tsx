import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Airlink Broadband | A Brand of Sriram Broadband Services Pvt. Ltd.",
  description: "Experience blazing fast broadband with Airlink Broadband. Enterprise-grade internet, leased lines, SD-WAN, and residential fiber solutions by Sriram Broadband Services Pvt. Ltd.",
  keywords: "broadband, fiber internet, leased line, SD-WAN, Airlink Broadband, internet service provider, Dharmapuri, Chennai",
  openGraph: {
    title: "Airlink Broadband | High-Speed Fiber Internet",
    description: "Experience blazing fast broadband with Airlink Broadband. Enterprise-grade internet and residential fiber solutions.",
    url: "https://www.srirambroadband.com",
    siteName: "Airlink Broadband",
    images: [
      {
        url: "/airlink-logo.png",
        width: 800,
        height: 600,
        alt: "Airlink Broadband Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Airlink Broadband | High-Speed Fiber Internet",
    description: "Experience blazing fast broadband with Airlink Broadband. Enterprise-grade internet and residential fiber solutions.",
    images: ["/airlink-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${poppins.variable} bg-background text-dark font-inter`}>
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
