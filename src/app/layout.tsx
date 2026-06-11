import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Crypto Analyst",
  description:
    "Moteur personnel de due diligence crypto : pipeline déterministe, scoring par piliers, red flags et vetos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} min-h-dvh antialiased`}
      >
        <header className="border-b border-border">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
            <Link
              href="/"
              className="font-serif text-lg italic tracking-tight text-ink"
            >
              Crypto Analyst
            </Link>
            <span className="hidden font-mono text-xs text-faint sm:block">
              due diligence · pipeline déterministe
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">{children}</main>
      </body>
    </html>
  );
}
