import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SponsorTile from "@/components/shared/SponsorTile";
import TopStrip from "@/components/shared/TopStrip";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore: side-effect import of global CSS may not have type declarations in this environment
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yug Abhiyaan Foundation",
  description:
    "A foundation dedicated to social causes and community development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <TopStrip />
        <Navbar /> */}
        {children}
        <Toaster />
        {/* <SponsorTile /> */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
