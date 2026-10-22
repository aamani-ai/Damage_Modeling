"use client";

// "How this curve was made" (G15, DCD-D27): the ten steps of discussion 07 folded into four, in the reader's order —
// what it covers · how damage is worked out · where the numbers come from · has it been checked. No marks: a step
// with nothing behind it says "not written yet". Each opens a side panel holding its old steps, each with its
// paragraph, its words and its Details, so nothing V0 or iteration 2 showed is removed (DCD-D19). The open step lives
// in the URL (?step=), so a panel is a link; arrow keys move along the strip.
import { useCallback, useRef } from "react";
import { useUrlParam } from "@/lib/url-state";
import type { CellV2, Citations, CurveV2, ManifestV3 } from "@/lib/types";
import { Drawer } from "./drawer";
import { StationPanel } from "./station-panel";
import { FileLink } from "./ui";

export function StepsStrip({ cell, cites, curves, m }: { cell: CellV2; cites: Citations["cells"][string] | null; curves: CurveV2[]; m: ManifestV3 }) {
  const [selected, setStep] = useUrlParam("step");
  const steps = cell.plain.steps;
  const open = steps.find((s) => s.id === selected) ?? null;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useCallback(() => {
    const idx = steps.findIndex((s) => s.id === selected);
    setStep(null);
    requestAnimationFrame(() => buttons.current[idx]?.focus());
  }, [steps, selected, setStep]);
  if (!steps.length) return null;
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = steps.length;
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next == null) return;
    e.preventDefault();
    buttons.current[(next + n) % n]?.focus();
  };
  const blob = (p: string) => `${m.repo.url}/blob/${m.commit_full}/${p.replace(/^\/+/, "")}`;
  return (
    <section aria-label="How this curve was made" className="mt-3">
      <div className="mb-1 flex items-baseline gap-2 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        How this curve was made
        <span className="font-normal normal-case tracking-normal text-muted-foreground/80">four steps · open one for the detail</span>
      </div>
      <div role="group" aria-label="How this curve was made — four steps" className="grid overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => { buttons.current[i] = el; }}
            type="button"
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => setStep(s.id)}
            aria-pressed={selected === s.id}
            aria-label={`${i + 1}. ${s.name}: ${s.fact}`}
            title={s.meaning}
            className={`flex min-w-0 flex-col items-start gap-0.5 border-b border-r border-border px-3 py-2 text-left hover:bg-muted xl:border-b-0 ${selected === s.id ? "bg-accent/10" : ""}`}
          >
            <span className="flex w-full items-baseline gap-1.5 text-[12px] font-medium leading-tight">
              <span className="tabular text-muted-foreground">{i + 1}</span>
              <span>{s.name}</span>
            </span>
            <span className={`line-clamp-2 text-[11px] leading-snug ${s.written ? "text-muted-foreground" : "italic text-muted-foreground/80"}`}>{s.fact}</span>
          </button>
        ))}
      </div>
      <Drawer open={!!open} title={open ? open.name : ""} onClose={close} width={660}>
        {open ? (
          <div className="space-y-4">
            <p className="text-[11px] text-muted-foreground">{open.meaning}.</p>
            {open.id === "checked" ? (
              <section className="space-y-1.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Outside checks</h3>
                <p className="text-[12.5px] leading-snug">{open.paragraphs[0]}</p>
                {cell.proof?.outside_checks.length ? (
                  <ul className="space-y-0.5 text-[11.5px]">
                    {cell.proof.outside_checks.map((c) => (
                      <li key={c.name}>
                        {c.link ? <a href={/^https?:/.test(c.link) ? c.link : blob(c.link)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{c.name} ↗</a> : <span>{c.name}</span>}
                        {c.hazard?.words ? <span className="italic text-muted-foreground"> · {c.hazard.words}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {cell.proof?.validation ? <p className="text-[11px] text-muted-foreground">validation record: <FileLink href={blob(cell.proof.validation.path)}>{cell.proof.validation.path.split("/").slice(-1)[0]}</FileLink></p> : null}
              </section>
            ) : null}
            {open.holds.map((sid) => {
              const st = cell.plain.stations.find((x) => x.id === sid);
              if (!st) return null;
              return (
                <section key={sid} className="space-y-1.5 border-t border-border pt-3 first:border-t-0 first:pt-0">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{st.name}</h3>
                  <StationPanel station={st} cell={cell} cites={cites} curves={curves} m={m} />
                </section>
              );
            })}
          </div>
        ) : null}
      </Drawer>
    </section>
  );
}
