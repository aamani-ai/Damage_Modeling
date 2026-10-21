"use client";

// Library and the assets, from the manifest — no asset is named in UI code (P17).
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Slug } from "@/lib/types";

export function Nav({ assets }: { assets: (Slug & { href?: string })[] }) {
  const pathname = usePathname();
  const onLibrary = pathname === "/";
  const tab = (active: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${active ? "border-accent/40 bg-accent/10 text-accent" : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"}`;
  return (
    <nav className="ml-1 flex flex-wrap items-center gap-1.5" aria-label="Dashboard surfaces">
      <Link href="/" aria-current={onLibrary ? "page" : undefined} className={tab(onLibrary)}>
        Library
      </Link>
      {assets.map((a) => {
        const href = a.href ?? `/assets/${a.slug}`;
        const active = pathname === href || pathname.startsWith(`/occurrence/${a.slug}/`);
        return (
          <Link key={a.slug} href={href} aria-current={active ? "page" : undefined} className={tab(active)}>
            {a.label}
          </Link>
        );
      })}
      <span aria-hidden className="mx-1 h-4 w-px bg-border" />
      <Link href="/v0" aria-current={pathname === "/v0" ? "page" : undefined} className={tab(pathname === "/v0")} title="Review the V0 slice on the live screens">
        Review V0
      </Link>
    </nav>
  );
}
