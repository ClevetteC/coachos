import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const monoFont = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://coach-os-web-pink.vercel.app'),
  title: "CoachOS",
  description: "Your AI operating system for sales, coaching, and consulting. Build your foundation once. Run every workflow from here.",
  openGraph: {
    title: "CoachOS",
    description: "Your AI operating system for sales, coaching, and consulting.",
    siteName: "CoachOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoachOS",
    description: "Your AI operating system for sales, coaching, and consulting.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
