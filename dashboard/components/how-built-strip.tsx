"use client";

// "How this was built" (brief §3.3): the same ten stations of discussion 07, in plain names — one line of meaning on
// hover, a short fact in words under each — and a side panel per station that explains first (the build's
// paragraph), then lists sources and parameters in words, then keeps the ledger under Details. The open station
// lives in the URL (?station=), so a panel is a link; arrow keys move along the strip.
import { useCallback, useRef } from "react";
import { useUrlParam } from "@/lib/url-state";
import type { CellV2, Citations, CurveV2, ManifestV2 } from "@/lib/types";
import { Drawer } from "./drawer";
import { StationMark, STATION_WORD } from "./marks";
import { StationPanel } from "./station-panel";

export function HowBuiltStrip({ cell, cites, curves, m }: { cell: CellV2; cites: Citations["cells"][string] | null; curves: CurveV2[]; m: ManifestV2 }) {
  const [selected, setStation] = useUrlParam("station");
  const stations = cell.plain.stations;
  const chainOf = (id: string) => cell.chain.stations.find((s) => s.id === id)!;
  const open = stations.find((s) => s.id === selected) ?? null;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useCallback(() => {
    const idx = stations.findIndex((s) => s.id === selected);
    setStation(null);
    requestAnimationFrame(() => buttons.current[idx]?.focus()); // focus returns to the station that opened the panel
  }, [stations, selected, setStation]);
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = stations.length;
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next == null) return;
    e.preventDefault();
    (e.currentTarget.parentElement?.children[(next + n) % n] as HTMLElement | undefined)?.focus();
  };
  return (
    <section aria-label="How this was built" className="mt-3">
      <div className="mb-1 flex items-baseline gap-2 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        How this was built
        <span className="font-normal normal-case tracking-normal text-muted-foreground/80">ten steps, in order · hover for the meaning · click to open</span>
      </div>
      <div role="group" aria-label="How this was built — ten steps from scope to field and review" className="grid grid-cols-5 overflow-hidden rounded-lg border border-border bg-card xl:grid-cols-10">
        {stations.map((s, i) => {
          const ch = chainOf(s.id);
          return (
            <button
              key={s.id}
              ref={(el) => { buttons.current[i] = el; }}
              type="button"
              onKeyDown={(e) => onKey(e, i)}
              onClick={() => setStation(s.id)}
              aria-pressed={selected === s.id}
              aria-label={`${s.name}: ${s.meaning} — ${s.plain_fact}`}
              title={`${s.meaning} · ${STATION_WORD[ch.state]}`}
              className={`flex min-w-0 flex-col items-start justify-center gap-0.5 border-b border-r border-border px-2 py-2 text-left hover:bg-muted xl:border-b-0 ${selected === s.id ? "bg-accent/10" : ""}`}
            >
              <span className="flex w-full items-center gap-1.5 text-[11px] font-medium leading-tight">
                <StationMark state={ch.state} className="!text-[11px] shrink-0" />
                <span className="truncate">{s.name}</span>
              </span>
              <span className={`line-clamp-1 text-[10.5px] leading-tight ${ch.state === "absent" ? "text-muted-foreground" : "text-muted-foreground"}`}>{s.plain_fact}</span>
            </button>
          );
        })}
      </div>
      <Drawer open={!!open} title={open ? open.name : ""} onClose={close} width={640}>
        {open ? <StationPanel station={open} cell={cell} cites={cites} curves={curves} m={m} /> : null}
      </Drawer>
    </section>
  );
}
