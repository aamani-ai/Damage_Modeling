"use client";

// Where a cell sits on the spine: Category › Type › Hazard. A cell shared by several types (real estate) names the
// type its ?building= points at, or all of them.
import Link from "next/link";
import { useUrlParam } from "@/lib/url-state";

export interface Crumb { slug: string; label: string; href: string }

export function CellCrumbs({ category, types, hazard }: { category: { label: string; href: string | null }; types: Crumb[]; hazard: string }) {
  const [b] = useUrlParam("building");
  const t = types.find((x) => x.slug === b) ?? (types.length === 1 ? types[0] : null);
  const cls = "text-[11px] text-muted-foreground hover:text-foreground";
  return (
    <nav aria-label="Where this curve sits" className="flex items-baseline gap-1 text-[11px] text-muted-foreground">
      {category.href ? <Link href={category.href} className={cls}>{category.label}</Link> : <span>{category.label}</span>}
      <span aria-hidden>›</span>
      {t ? <Link href={t.href} className={cls}>{t.label}</Link> : <span>{types.map((x) => x.label).join(" · ")}</span>}
      <span aria-hidden>›</span>
      <span>{hazard}</span>
    </nav>
  );
}
