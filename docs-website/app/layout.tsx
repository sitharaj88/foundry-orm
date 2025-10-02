import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoundryORM - Enterprise-Grade Multi-Database ORM",
  description: "A powerful TypeScript ORM supporting PostgreSQL, MySQL, SQLite, and MongoDB with connection pooling, transactions, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 h-full`}>
        <Header />
        <div className="flex h-full pt-16 bg-white dark:bg-gray-950">
          <Sidebar />
          <main className="flex-1 lg:ml-64 xl:ml-72 overflow-y-auto bg-white dark:bg-gray-950">
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
