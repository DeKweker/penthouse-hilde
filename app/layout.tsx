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
    default: "Casa Filou | Penthouse in Los Alcázares",
    template: "%s | Casa Filou",
  },
  description: "Casa Filou is een licht penthouse voor zes in Los Alcázares, met drie slaapkamers, hoekterras, privésolarium en zwembad.",
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/casa-filou-mark.png", type: "image/png" }], apple: "/casa-filou-mark.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "nl_BE",
    url: "/",
    siteName: "Casa Filou",
    title: "Casa Filou · tussen de fairway en de Mar Menor",
    description: "Penthouse voor zes met twee buitenruimtes, zwembad en La Serena Golf voor de deur.",
    images: [{ url: "/images/og-cover.webp", width: 1200, height: 630, alt: "Terras van Casa Filou in Velapi Golf" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Filou · Los Alcázares",
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
