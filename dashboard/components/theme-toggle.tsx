"use client";

import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/use-hydrated";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-6 w-14" />;
  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="rounded border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
      title={`Switch to the ${dark ? "light" : "dark"} theme`}
      aria-label={`Switch to the ${dark ? "light" : "dark"} theme`}
    >
      {dark ? "☀ light" : "☾ dark"}
    </button>
  );
}
