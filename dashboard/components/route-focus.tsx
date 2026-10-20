"use client";

// After a client-side page change, start keyboard focus at the top of the new page (its main region) instead of
// wherever the old link sat; the first load is left alone.
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}
