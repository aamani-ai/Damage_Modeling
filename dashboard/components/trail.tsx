"use client";

// The derivation trail (07 §3): ten stations in one row, each a button that scrolls to its card and opens the
// files behind it. The mark is the presence state; colour is not used. State lives in the URL (?station=).
import { useCallback, useRef } from "react";
import { useUrlParam } from "@/lib/url-state";
import type { Chain, Station } from "@/lib/types";
import { shortSha } from "@/lib/format";
import { Drawer } from "./drawer";
import { GateWord, STATION_WORD, StationMark } from "./marks";
import { FileLink, Kv } from "./ui";

const CARD_FOR: Record<string, string> = {
  scope: "seams", units: "parts", axis_form: "answer", evidence: "evidence", value: "answer", audit: "audit",
  artifact: "answer", capability: "proof", proof: "proof", field_review: "field",
};

export function Trail({ chain, blobBase }: { chain: Chain; blobBase: string }) {
  const blob = (p: string) => `${blobBase}/${p.replace(/^\/+/, "")}`;
  const [selected, setStation] = useUrlParam("station");
  const open = chain.stations.find((s) => s.id === selected) ?? null;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useCallback(() => {
    const idx = chain.stations.findIndex((s) => s.id === selected);
    setStation(null);
    requestAnimationFrame(() => buttons.current[idx]?.focus()); // focus returns to the station that opened the drawer
  }, [chain.stations, selected, setStation]);
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = chain.stations.length;
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next == null) return;
    e.preventDefault();
    const el = (e.currentTarget.parentElement?.children[(next + n) % n] as HTMLElement | undefined);
    el?.focus();
  };
  return (
    <>
      <div role="group" aria-label="Derivation trail — ten stations, scope to field and review" className="mt-2 grid min-h-[56px] grid-cols-10 overflow-hidden rounded-lg border border-border bg-card">
        {chain.stations.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => {
              setStation(s.id);
              document.getElementById(`card-${CARD_FOR[s.id]}`)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
            }}
            aria-pressed={selected === s.id}
            aria-label={`${s.full_label ?? s.label}: ${STATION_WORD[s.state]} — ${s.fact}`}
            title={`${s.full_label ?? s.label} · gate ${s.gate} · ${STATION_WORD[s.state]} — ${s.fact}${s.absent_sentence ? ` — ${s.absent_sentence}` : ""}`}
            className={`flex min-w-0 flex-col items-start justify-center gap-0.5 border-r border-border px-2 py-1.5 text-left last:border-r-0 hover:bg-muted ${selected === s.id ? "bg-accent/10" : ""}`}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <StationMark state={s.state} /> {s.label}
            </span>
            <span className={`line-clamp-2 font-mono text-[10px] leading-tight ${s.state === "absent" ? "text-muted-foreground" : ""}`}>{s.fact}</span>
          </button>
        ))}
      </div>
      <Drawer open={!!open} title={open ? `${open.full_label ?? open.label} · station ${chain.stations.indexOf(open) + 1} · gate ${open.gate}` : ""} onClose={close}>
        {open ? <StationDetail s={open} chain={chain} blob={blob} /> : null}
      </Drawer>
    </>
  );
}

function StationDetail({ s, chain, blob }: { s: Station; chain: Chain; blob: (p: string) => string }) {
  const gate = chain.gates.find((g) => g.gate === s.gate.split(" ")[0]);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <StationMark state={s.state} />
        <span className="text-[11px]">{STATION_WORD[s.state]}</span>
        <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{s.fact}</span>
      </div>
      {s.absent_sentence ? <p className="rounded-md border border-dashed border-border px-2.5 py-2 text-[11px] text-muted-foreground">{s.absent_sentence}</p> : null}
      {s.state === "not_yet_detected" ? <p className="rounded-md border border-dashed border-border px-2.5 py-2 text-[11px] text-muted-foreground">Not yet detected — there is no dossier or workbook for the detector to read in this cell.</p> : null}
      {s.files.length ? (
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Files behind this station</div>
          {s.files.map((f) => (
            <Kv key={f.path + (f.note ?? "")} label={<FileLink href={blob(f.path)}>{f.path.split("/").slice(-2).join("/")}</FileLink>} value={<span className="font-mono text-[10px]">{f.note ? `${f.note} · ` : ""}sha {shortSha(f.sha256)}{f.pin_ok === false ? " ✗" : ""}</span>} />
          ))}
        </div>
      ) : null}
      {s.evidence.length ? (
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Detected in prose</div>
          {s.evidence.map((ev) => (
            <div key={ev.kind + ev.file.path} className="border-t border-border/60 py-1 text-[11px]">
              <FileLink href={blob(ev.file.path)}>{ev.file.path.split("/").slice(-1)[0]}</FileLink>
              <span className="text-muted-foreground"> · {ev.kind.replace("_", " ")}</span>
              <ul className="mt-0.5 list-disc pl-4 text-muted-foreground">{ev.matched.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
          ))}
        </div>
      ) : null}
      {gate ? (
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Gate {gate.gate} · {gate.label}</div>
          {gate.items.map((it) => (
            <div key={it.item} className="flex items-start justify-between gap-2 border-t border-border/60 py-1 text-[11px]">
              <span>{it.item}{it.basis ? <span className="block font-mono text-[9.5px] text-muted-foreground">{it.basis}</span> : null}</span>
              <GateWord status={it.status} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

