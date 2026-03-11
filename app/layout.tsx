import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FastShare - Fast File Sharing | Instant & Secure by Pushkar Shinde",
  description:
    "FastShare is the fastest, most secure file sharing platform designed for APSIT college labs and public computers. Instant room creation, no login required, automatic file deletion, and end-to-end encryption. Create a room in seconds and share files securely with QR codes.",
  keywords: [
    "FastShare",
    "Fast Share APSIT",
    "FastShare Pushkar Shinde",
    "file sharing",
    "temporary file sharing",
    "secure file sharing",
    "college labs",
    "instant file sharing",
    "no login file sharing",
    "auto-delete files",
    "private file transfer",
  ],
  authors: [{ name: "Pushkar Shinde" }],
  creator: "Pushkar Shinde",
  publisher: "FastShare",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fastshare.app",
    siteName: "FastShare",
    title: "FastShare - Instant & Secure File Sharing for APSIT",
    description: "Share files instantly without login. Secure temporary file sharing by Pushkar Shinde.",
    images: [
      {
        url: "https://fastshare.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "FastShare - Fast File Sharing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastShare - Instant & Secure File Sharing",
    description: "Share files instantly without login. Secure temporary file sharing by Pushkar Shinde.",
    creator: "@PushkarShinde",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://fastshare.app",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#040204",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "FastShare",
              "alternateName": ["Fast Share APSIT", "FastShare Pushkar Shinde"],
              "description": "Fast, secure, and temporary file sharing application for college labs without requiring login or registration",
              "url": "https://fastshare.app",
              "author": {
                "@type": "Person",
                "name": "Pushkar Shinde",
              },
              "applicationCategory": "UtilityApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-bg text-primary`}>
        <Navbar />
        <main className="pt-14 sm:pt-16 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
