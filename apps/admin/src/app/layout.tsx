import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import RouteGuard from "../components/RouteGuard";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMC Admin Dashboard",
  description: "Internal dashboard for Love Me Clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 font-sans antialiased flex`}>
        <RouteGuard>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </RouteGuard>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
