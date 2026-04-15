import type { Metadata } from "next";
import { Raleway, Playfair_Display } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ALAKA Media — Hikâyesi olmayan hiçbir şeyle alakamız yok.",
  description:
    "Bazı hikâyeler tamamlanmaz. ALAKA Media — sinematik görsel hikâyeler ve yapımlar.",
  openGraph: {
    title: "ALAKA Media",
    description: "Hikâyesi olmayan hiçbir şeyle alakamız yok.",
    url: "https://alaka.pro",
    siteName: "ALAKA Media",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ALAKA Media",
    description: "Hikâyesi olmayan hiçbir şeyle alakamız yok.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${raleway.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-primary" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
