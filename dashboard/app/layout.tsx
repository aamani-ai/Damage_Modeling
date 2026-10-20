import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/components/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { manifest } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Damage curves",
  description: "InfraSure damage-curve library — every curve cell, part and curve with its derivation chain, evidence tiers, field-report state and review state",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const m = manifest();
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="relative z-30 border-b border-border bg-card no-print">
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-4 py-2.5">
              <h1 className="shrink-0 text-[15px] font-semibold tracking-tight">
                <Link href="/" className="transition-opacity hover:opacity-70" title="Open the library">
                  Damage curves
                </Link>
              </h1>
              <Nav assets={m.assets} />
              <div className="ml-auto flex items-center gap-2">
                <a href={`${m.repo.url}/tree/${m.commit_full}`} target="_blank" rel="noreferrer" title="The repository at the build commit" className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">
                  GitHub ↗
                </a>
                <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[9.5px] text-muted-foreground/90" title={`built ${m.built_at} at commit ${m.commit_full}`}>
                  built {m.commit}
                </span>
                <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/80">internal</span>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-[1440px] px-4 py-3">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
