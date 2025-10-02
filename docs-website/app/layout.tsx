import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TypeScript ORM - Enterprise-Grade Multi-Database ORM",
  description: "A powerful TypeScript ORM supporting PostgreSQL, MySQL, SQLite, and MongoDB with connection pooling, transactions, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth h-full">
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 h-full`}>
        <Header />
        <div className="flex h-full pt-16">
          <Sidebar />
          <main className="flex-1 lg:ml-64 xl:ml-72 overflow-y-auto">
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
