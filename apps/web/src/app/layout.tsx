import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SideCart from "../components/SideCart";
import { Toaster } from "react-hot-toast";
import TrackingPixels from "../components/TrackingPixels";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Love Me Clothing | E-Commerce",
  description: "Your favorite fashion destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <TrackingPixels />
      </head>
      <body className={`${inter.className} min-h-screen bg-brand-light font-sans antialiased`}>
        <Navbar />
        <SideCart />
        {children}
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
