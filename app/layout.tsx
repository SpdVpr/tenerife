import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cielo Dorado - Luxusní apartmán na Tenerife | Los Gigantes",
  description: "Luxusní apartmán s výhledem na oceán v Los Gigantes, Tenerife. Kapacita 4 osoby, terasa 27m², střešní bazén. Rezervujte nyní!",
  keywords: ["Tenerife", "apartmán", "Los Gigantes", "ubytování", "dovolená", "Kanárské ostrovy"],
  openGraph: {
    title: "Cielo Dorado - Luxusní apartmán na Tenerife",
    description: "Luxusní apartmán s výhledem na oceán v Los Gigantes, Tenerife",
    type: "website",
    locale: "cs_CZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
