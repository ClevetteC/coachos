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
  title: "CoachOS — The OS for Coaches, Consultants & Solopreneurs",
  description: "The AI operating system built for coaches, consultants, and solopreneurs. Build your foundation once — voice profile, ideal client, offer stack — and run every sales, content, and delivery workflow from there.",
  openGraph: {
    title: "CoachOS — The OS for Coaches, Consultants & Solopreneurs",
    description: "Build your foundation once. Run every sales, content, and delivery workflow in your voice.",
    siteName: "CoachOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoachOS — The OS for Coaches, Consultants & Solopreneurs",
    description: "Build your foundation once. Run every sales, content, and delivery workflow in your voice.",
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
