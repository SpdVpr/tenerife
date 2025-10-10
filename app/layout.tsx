import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Cielo Dorado - Luxusní apartmán na Tenerife | Los Gigantes",
  description: "Luxusní apartmán s výhledem na oceán v Los Gigantes, Tenerife. Kapacita 4 osoby, terasa 27m², střešní bazén. Rezervujte nyní!",
  keywords: ["Tenerife", "apartmán", "Los Gigantes", "ubytování", "dovolená", "Kanárské ostrovy"],

  // Open Graph metadata (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: "Cielo Dorado - Luxusní apartmán na Tenerife",
    description: "Luxusní apartmán s výhledem na oceán v Los Gigantes, Tenerife. Kapacita 4 osoby, terasa 27m², střešní bazén.",
    type: "website",
    locale: "cs_CZ",
    url: "https://www.cielodorado-tenerife.eu",
    siteName: "Cielo Dorado",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cielo Dorado - Premium apartmán na Tenerife s výhledem na oceán",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Cielo Dorado - Luxusní apartmán na Tenerife",
    description: "Luxusní apartmán s výhledem na oceán v Los Gigantes, Tenerife. Kapacita 4 osoby, terasa 27m², střešní bazén.",
    images: ["/images/og-image.jpg"],
  },

  // Icons (favicon)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },

  // Additional metadata
  metadataBase: new URL("https://www.cielodorado-tenerife.eu"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0c4a6e" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
