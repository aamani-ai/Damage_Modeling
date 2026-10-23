import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/components/nav";
import { RouteFocus } from "@/components/route-focus";
import { ThemeToggle } from "@/components/theme-toggle";
import { manifest } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Damage curves",
  description: "InfraSure damage-curve library — every curve cell by asset category and hazard, what each curve covers on the Digital Twin's reference model, where its numbers come from and who has read it",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const m = manifest();
  const preview = m.source.mode !== "main";
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
              <Nav categories={m.spine.categories} />
              <div className="ml-auto flex items-center gap-2">
                <Link href="/faq" className="rounded px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground" title="What the words and colours mean, and how a curve is made">
                  FAQ
                </Link>
                <a href={`${m.repo.url}/tree/${m.commit_full}`} target="_blank" rel="noreferrer" title="The repository at the commit this dashboard was built from" className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">
                  GitHub ↗
                </a>
                <ThemeToggle />
              </div>
            </div>
            {preview ? (
              <div className="border-t border-warn/30 bg-warn-bg/60 px-4 py-1 text-center text-[11px] text-warn" role="note">
                Preview of branch <span className="font-mono">{m.source.ref}</span> at <span className="font-mono">{m.source.commit}</span>{m.source.dirty ? ", with uncommitted changes" : ""} — not main. The dashboard shows main once this branch merges.
              </div>
            ) : null}
          </header>
          <main id="main" tabIndex={-1} className="mx-auto max-w-[1440px] px-4 py-3 outline-none">{children}</main>
          {/* G19 (DCD-D32): builder information lives behind this one link, never in a page's default view */}
          <footer className="no-print mx-auto max-w-[1440px] px-4 pb-6 pt-1 text-[10.5px]">
            <Link href="/about" className="text-muted-foreground hover:text-foreground hover:underline">About this data</Link>
          </footer>
          <RouteFocus />
        </ThemeProvider>
      </body>
    </html>
  );
}
