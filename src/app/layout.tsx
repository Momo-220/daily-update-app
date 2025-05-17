import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daily Updates",
  description: "Track your daily accomplishments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <Navbar />
          <main className="container mx-auto max-w-3xl p-4 md:p-6 pb-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
