import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17382e",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "Ático Hilsol | Penthouse in Los Alcázares",
    template: "%s | Ático Hilsol",
  },
  description: "Privé penthouse voor maximaal zes gasten in Velapi Golf, Los Alcázares, met drie slaapkamers, twee badkamers, hoekterras, privésolarium en zwembad.",
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }], apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "nl_BE",
    url: "/",
    siteName: "Ático Hilsol",
    title: "Ático Hilsol · boven de fairway, dicht bij het water",
    description: "Penthouse voor zes met twee buitenruimtes, zwembad en La Serena Golf voor de deur.",
    images: [{ url: "/images/og-cover.webp", width: 1200, height: 630, alt: "Terras van Ático Hilsol in Velapi Golf" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ático Hilsol · Los Alcázares",
    description: "Privé penthouse voor zes aan La Serena Golf en vlak bij de Mar Menor.",
    images: ["/images/og-cover.webp"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
