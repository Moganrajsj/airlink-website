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
  title: {
    default: "Airlink Broadband | High-Speed Fiber Internet Tamil Nadu",
    template: "%s | Airlink Broadband"
  },
  description: "Experience high-speed fiber and wireless internet in Dharmapuri and Chennai with Airlink Broadband. Dedicated leased lines and residential fiber solutions for Tamil Nadu.",
  keywords: [
    "Wireless Internet Dharmapuri",
    "High Speed Internet Chennai",
    "Broadband Dharmapuri",
    "Fiber Internet Tamil Nadu",
    "Wireless Broadband Chennai",
    "Leased Line Dharmapuri",
    "Airlink Broadband Chennai",
    "Sriram Broadband Services",
    "Enterprise Internet Dharmapuri",
    "Unlimited High Speed Plans"
  ],
  authors: [{ name: "Airlink Broadband" }],
  creator: "Airlink Broadband",
  publisher: "Sriram Broadband Services Pvt. Ltd.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Airlink Broadband | High-Speed Fiber Internet",
    description: "Blazing fast fiber broadband, leased lines, and enterprise internet solutions in Tamil Nadu. Join 50,000+ happy customers.",
    url: "https://www.srirambroadband.com",
    siteName: "Airlink Broadband",
    images: [
      {
        url: "/images/og-image.png", // Assuming we have or will add this
        width: 1200,
        height: 630,
        alt: "Airlink Broadband - High Speed Fiber Internet",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Airlink Broadband | High-Speed Fiber Internet",
    description: "Experience blazing fast broadband with Airlink. Enterprise-grade internet and residential fiber solutions in Tamil Nadu.",
    images: ["/images/og-image.png"],
  },
  category: 'technology',
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
