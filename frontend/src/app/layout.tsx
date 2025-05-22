import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonymous Chat",
  description: "Send and receive anonymous messages securely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="layout-container">
          <aside className="sidebar">
            <nav className="nav-links">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/send" className="nav-link">Send</Link>
              <Link href="/view" className="nav-link">View</Link>
            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
