import type { Metadata } from "next";
import "./globals.css";
import { Instrument_Serif } from "next/font/google";
import StoreProvider from "./StoreProvider";
import Link from "next/link";
import Image from "next/image";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "BPT Fulfillment - 3PL Pricing Calculator | Instant Quotes",
  description: "Get instant, accurate pricing for BPT Fulfillment services. Calculate costs for receiving, storage, pick & pack, shipping and more.",
  metadataBase: new URL("https://calculator.bptfulfillment.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable}`}>
        <StoreProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border shadow-sm">
              <div className="container mx-auto py-5 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link href="/" className="flex items-center">
                    <div className="font-serif text-2xl font-bold text-primary">BPT Fulfillment</div>
                  </Link>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Beta
                  </span>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
                  <Link href="/calculators" className="text-sm font-medium hover:text-primary transition-colors">Calculators</Link>
                  <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-border py-6">
              <div className="container mx-auto px-4 text-center text-sm text-foreground/70">
                <p>© {new Date().getFullYear()} BPT Fulfillment. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
