import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SideCart from "../components/SideCart";
import { Toaster } from "react-hot-toast";
import TrackingPixels from "../components/TrackingPixels";

export const metadata: Metadata = {
  title: "Love Me Clothing | Official Store",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <TrackingPixels />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-accent selection:text-black font-sans antialiased">
        <Navbar />
        <SideCart />
        {children}
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
