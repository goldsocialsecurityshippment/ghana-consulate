import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.acemobilehub.com"),
  title: {
    default: "Ace Mobile Hub | Buy, Sell & Swap iPhones in Ghana",
    template: "%s | Ace Mobile Hub",
  },
  description:
    "Ghana's trusted iPhone specialist. Buy, sell, or swap genuine iPhones from iPhone 7 to the latest models. Based at Accra Circle Mall with nationwide delivery across Ghana.",
  keywords: [
    "buy iPhone Ghana",
    "sell iPhone Ghana",
    "swap iPhone Ghana",
    "iPhone Accra",
    "iPhone installment Ghana",
    "genuine iPhone Ghana",
    "iPhone Circle Mall",
    "used iPhone Ghana",
    "iPhone trade-in Ghana",
    "iPhone delivery Ghana",
  ],
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://www.acemobilehub.com",
    siteName: "Ace Mobile Hub",
    title: "Ace Mobile Hub | Buy, Sell & Swap iPhones in Ghana",
    description:
      "Ghana's trusted iPhone specialist based at Accra Circle Mall. Genuine devices, secure transactions, and nationwide delivery.",
    images: [
      {
        url: "/images/hero/hero-bg.svg",
        width: 1440,
        height: 900,
        alt: "Ace Mobile Hub — iPhone Specialists in Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ace Mobile Hub | Buy, Sell & Swap iPhones in Ghana",
    description:
      "Ghana's trusted iPhone specialist. Genuine devices, secure transactions, nationwide delivery.",
    images: ["/images/hero/hero-bg.svg"],
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Ace Mobile Hub",
              image: "https://www.acemobilehub.com/images/hero/hero-bg.svg",
              telephone: "+233545420719",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Circle Mall",
                addressLocality: "Accra",
                addressCountry: "GH",
              },
              url: "https://www.acemobilehub.com",
              openingHours: ["Mo-Sa 09:00-19:00", "Su 11:00-17:00"],
              priceRange: "$$",
              description:
                "Ghana's premier iPhone specialist. Buy, sell, swap, and purchase on installment. Nationwide delivery available.",
              areaServed: {
                "@type": "Country",
                name: "Ghana",
              },
              sameAs: [
                `https://wa.me/233545420719`,
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
