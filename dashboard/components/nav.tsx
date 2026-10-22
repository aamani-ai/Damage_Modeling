"use client";

// The top bar (G14, DCD-D26): Library · one menu per category with its types · Review. Categories and types come from
// the manifest's spine (the Digital Twin's taxonomy, DCD-D20), so no asset is named in UI code (P17).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SpineCategory } from "@/lib/types";

const tab = (active: boolean) =>
  `rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${active ? "border-accent/40 bg-accent/10 text-accent" : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"}`;

function CategoryMenu({ c, pathname }: { c: SpineCategory; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const live = c.types.filter((t) => !t.planned && t.href);
  const active = live.some((t) => pathname === t.href) || pathname === `/assets/${c.slug}`;
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)} className={tab(active)}>
        {c.label} <span aria-hidden className="ml-0.5 text-[9px] opacity-70">▾</span>
      </button>
      {open ? (
        <div role="menu" aria-label={c.label} className="absolute left-0 z-50 mt-1 w-64 rounded-md border border-border bg-card p-1 shadow-lg">
          {c.rule ? <div className="px-2 pb-1 pt-1 text-[10px] text-muted-foreground">grouped by {c.rule}</div> : null}
          {c.types.map((t) =>
            t.planned || !t.href ? (
              <div key={t.slug} role="menuitem" aria-disabled className="flex items-baseline justify-between px-2 py-1 text-[12px] text-muted-foreground/70">
                {t.label} <span className="text-[10px]">planned</span>
              </div>
            ) : (
              <Link key={t.slug} role="menuitem" href={t.href} onClick={() => setOpen(false)} aria-current={pathname === t.href ? "page" : undefined}
                className={`flex items-baseline justify-between gap-2 rounded px-2 py-1 text-[12px] hover:bg-muted ${pathname === t.href ? "text-accent" : ""}`}>
                <span>{t.label}</span>
                {t.building ? <span className="text-[10.5px] text-muted-foreground">{t.building.toLowerCase()}</span> : null}
              </Link>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

export function Nav({ categories }: { categories: SpineCategory[] }) {
  const pathname = usePathname();
  const shown = categories.filter((c) => c.types.some((t) => !t.planned));
  return (
    <nav className="ml-1 flex flex-wrap items-center gap-1" aria-label="Dashboard surfaces">
      <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={tab(pathname === "/")}>
        Library
      </Link>
      {shown.map((c) => <CategoryMenu key={`${c.slug}:${pathname}`} c={c} pathname={pathname} />)}
      <Link href="/review" aria-current={pathname === "/review" ? "page" : undefined} className={tab(pathname === "/review")} title="Who has read each curve, and what is open for its owner">
        Review
      </Link>
    </nav>
  );
}
