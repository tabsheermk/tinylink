import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TinyLink",
  description: "Shorten URLs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
        {/* Header */}
        <header className="bg-white shadow sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-blue-700">TinyLink</h1>
            <nav className="space-x-4 text-gray-700">
              <Link href="/" className="hover:text-blue-700 transition">
                Dashboard
              </Link>
              <Link href="/healthz" className="hover:text-blue-700 transition">
                Health Check
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TinyLink. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
