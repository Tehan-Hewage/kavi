import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { CartProvider } from "@/components/providers/CartProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Kavi - Shop Kapruka with AI",
  description: "Sri Lanka's smartest AI shopping assistant. Powered by Kapruka.",
  keywords: ["Kapruka", "AI Shopping Agent", "Sri Lanka", "Kavi Chatbot", "Kapruka Agent Challenge 2026"],
  authors: [{ name: "Kavi Development Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Kavi - Shop Kapruka with AI",
    description: "Chat your way to the perfect gift. Delivered anywhere in Sri Lanka.",
    images: ["/og-image.png"],
    type: "website",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload Sinhala and Tamil fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;500;600&family=Noto+Sans+Tamil:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} h-full overflow-hidden`}>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
