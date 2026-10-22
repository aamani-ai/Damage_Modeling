"use client";

// What a curve covers, drawn on the Digital Twin's own reference model (DCD-D21, discussion 09 §2). The viewer and
// the models are vendored and pinned (public/twin/, scripts/dashboard/export_twin.mjs, checked by the data build);
// the colour of every part comes from the crosswalks (docs/contracts/twin_crosswalks/, DCD-D23) through the build.
// Every colour is repeated in words — in the legend, the hover label and the systems list — so nothing depends on
// colour alone, and the systems list is the keyboard way through the same picture.
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useUrlParam } from "@/lib/url-state";
import type { Coverage, CoverageHazard, CoverageState } from "@/lib/types";

export const STATE_ORDER: CoverageState[] = ["curve", "conditioner", "no_curve", "no_direct_damage", "outside"];
// Data colours, the same in both themes: the legend explains a picture whose scene is always lit the same way.
export const STATE_CSS: Record<CoverageState, string> = { curve: "#1b8a6b", conditioner: "#5b8bd6", no_curve: "#e9c47f", no_direct_damage: "#b9bec6", outside: "#efede7" };
const hex = (c: string) => parseInt(c.slice(1), 16);

export type Labels = Record<string, { name: string; sub?: string }>;
export interface ViewerEl extends HTMLElement {
  load(model: string, opts: { parents: Record<string, string>; labels: Labels }): unknown;
  setTint(map: Record<string, number> | null): void;
  select(id: string | null): void;
  frame(id?: string): void;
  reset(instant?: boolean): void;
}

let loading: Promise<void> | null = null;
/** The vendored scripts, once per page, in the manifest's order (three.js first, the viewer last). */
export function loadTwin(order: string[]): Promise<void> {
  if (loading) return loading;
  loading = order.reduce<Promise<void>>(
    (p, f) =>
      p.then(
        () =>
          new Promise<void>((ok, no) => {
            if (document.querySelector(`script[data-twin="${f}"]`)) return ok();
            const s = document.createElement("script");
            s.src = `/twin/${f}`;
            s.async = false;
            s.dataset.twin = f;
            s.onload = () => ok();
            s.onerror = () => no(new Error(`could not load /twin/${f}`));
            document.head.appendChild(s);
          }),
      ),
    Promise.resolve(),
  );
  loading.catch(() => { loading = null; });
  return loading;
}

export function webglOk(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Swatch({ state, className = "" }: { state: CoverageState; className?: string }) {
  return <span aria-hidden className={`inline-block h-2.5 w-2.5 shrink-0 rounded-[3px] border border-black/15 ${className}`} style={{ background: STATE_CSS[state] }} />;
}

export function CoverageLegend({ words, counts }: { words: Record<CoverageState, string>; counts?: Partial<Record<CoverageState, number>> }) {
  return (
    <ul className="space-y-1 text-[11.5px]" aria-label="What the colours mean">
      {STATE_ORDER.map((s) => {
        const n = counts?.[s];
        return (
          <li key={s} className={`flex items-center gap-2 ${counts && !n ? "opacity-45" : ""}`}>
            <Swatch state={s} />
            <span className="leading-tight">{words[s]}</span>
            {counts ? <span className="tabular ml-auto text-[10.5px] text-muted-foreground">{n ?? 0}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

function withParam(href: string, key: string, value: string): string {
  const [path, q = ""] = href.split("?");
  const sp = new URLSearchParams(q);
  sp.set(key, value);
  return `${path}?${sp.toString()}`;
}

const noSubscribe = () => () => {};

function parentsOf(tree: Coverage["trees"][string]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, n] of Object.entries(tree.nodes)) if (n.p) out[id] = n.p;
  return out;
}

function tintOf(tree: Coverage["trees"][string], hz: CoverageHazard, treeKey: string): Record<string, number> {
  const t: Record<string, number> = {};
  for (const id of Object.keys(tree.nodes)) {
    const r = rowFor(hz, treeKey, id);
    if (r) t[id] = hex(STATE_CSS[r.s]);
  }
  return t;
}

/** A selected group (a system, or any node with children): its parts by state, so a click on it is never "not mapped". */
function groupSummary(tree: Coverage["trees"][string], hz: CoverageHazard, treeKey: string, id: string): { state: CoverageState; names: string[] }[] {
  const sys = hz.systems[treeKey]?.find((r) => r.node === id);
  if (sys) return sys.by_state.map((b) => ({ state: b.state, names: b.parts.map((x) => x.name) }));
  const kids: Record<string, string[]> = {};
  for (const [nid, n] of Object.entries(tree.nodes)) if (n.p) (kids[n.p] ??= []).push(nid);
  const by = new Map<CoverageState, string[]>();
  const walk = (x: string) => {
    if (kids[x]?.length) return kids[x].forEach(walk);
    const r = rowFor(hz, treeKey, x);
    if (r) by.set(r.s, [...(by.get(r.s) ?? []), tree.nodes[x].n]);
  };
  walk(id);
  return STATE_ORDER.filter((st) => by.has(st)).map((st) => ({ state: st, names: by.get(st)! }));
}

/** The wheel zooms the model only after a click into the picture; otherwise it scrolls the page past it. */
export function useWheelGate(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let engaged = false;
    const onDown = () => { engaged = true; };
    const onLeave = () => { engaged = false; };
    const onWheel = (e: WheelEvent) => { if (!engaged) e.stopPropagation(); };
    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointerleave", onLeave);
    node.addEventListener("wheel", onWheel, { capture: true });
    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointerleave", onLeave);
      node.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, [ref]);
}

function rowFor(hz: CoverageHazard, treeKey: string, nid: string) {
  const rid = hz.states[treeKey]?.[nid];
  return rid ? hz.rows[rid] : undefined;
}

function subFor(r: CoverageHazard["rows"][string] | undefined, words: Record<CoverageState, string>): string {
  return r ? `${words[r.s]}${r.part ? ` · ${r.part}` : ""}` : "not mapped";
}

export function hazardOf(cov: Coverage, slug: string | null): CoverageHazard {
  return cov.hazards.find((h) => h.hazard.slug === slug) ?? cov.hazards.find((h) => !h.gap) ?? cov.hazards[0];
}

export function TwinCoverage({
  cov, loadOrder, hazardSlug, height = 460, mode, title, hazardPicker,
}: {
  cov: Coverage; loadOrder: string[]; hazardSlug: string | null; height?: number; mode: "asset" | "cell";
  title?: React.ReactNode; hazardPicker?: React.ReactNode;
}) {
  const [viewParam, setView] = useUrlParam("view");
  const [, setPart] = useUrlParam("part");
  const treeKeys = Object.keys(cov.trees);
  const treeKey = viewParam && cov.trees[viewParam] ? viewParam : treeKeys[0];
  const tree = cov.trees[treeKey];
  const model = treeKey === "plant" ? cov.twin.plant_model! : cov.twin.model;
  const hz = hazardOf(cov, hazardSlug);
  const [selected, setSelected] = useState<string | null>(null);
  const canDraw = useSyncExternalStore(noSubscribe, webglOk, () => true);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useWheelGate(stage);
  const viewer = useRef<ViewerEl | null>(null);
  const loadedModel = useRef<string | null>(null);
  // the viewer keeps the labels object it was loaded with, so a hazard change rewrites the hover words in place
  const labelsRef = useRef<Labels>({});

  const parents = parentsOf(tree);
  const tint = tintOf(tree, hz, treeKey);
  const tintRef = useRef(tint);
  useEffect(() => {
    tintRef.current = tint;
    const lab = labelsRef.current;
    for (const id of Object.keys(lab)) lab[id].sub = subFor(rowFor(hz, treeKey, id), cov.state_words);
    if (status === "ready" && loadedModel.current === model) viewer.current?.setTint(tint);
  }, [tint, hz, treeKey, cov.state_words, status, model]);

  // the viewer: scripts once per page, one element per component
  useEffect(() => {
    if (!canDraw) return;
    let alive = true;
    let el: ViewerEl | null = null;
    const onLoaded = () => {
      el?.setTint(tintRef.current);
    };
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<{ id: string | null }>).detail.id;
      setSelected(id);
      el?.select(id);
    };
    loadTwin(loadOrder)
      .then(() => {
        if (!alive || !host.current) return;
        el = document.createElement("subsystem-viewer") as ViewerEl;
        el.addEventListener("sv-loaded", onLoaded);
        el.addEventListener("sv-select", onSelect);
        host.current.appendChild(el);
        viewer.current = el;
        setStatus("ready");
      })
      .catch(() => {
        if (alive) setStatus("failed");
      });
    return () => {
      alive = false;
      el?.removeEventListener("sv-loaded", onLoaded);
      el?.removeEventListener("sv-select", onSelect);
      el?.remove();
      viewer.current = null;
      loadedModel.current = null;
    };
  }, [loadOrder, canDraw]);

  useEffect(() => {
    if (status !== "ready" || !viewer.current || loadedModel.current === model) return;
    loadedModel.current = model;
    const lab: Labels = Object.fromEntries(Object.entries(tree.nodes).map(([id, n]) => [id, { name: n.n, sub: subFor(rowFor(hz, treeKey, id), cov.state_words) }]));
    labelsRef.current = lab;
    viewer.current.load(model, { parents, labels: lab });
  }, [status, model, parents, tree, hz, treeKey, cov.state_words]);

  const pick = (id: string) => {
    setSelected(id);
    viewer.current?.select(id);
    viewer.current?.frame(id);
  };
  const systems = hz.systems[treeKey] ?? [];
  const counts: Partial<Record<CoverageState, number>> = {};
  for (const row of systems) for (const b of row.by_state) counts[b.state] = (counts[b.state] ?? 0) + b.parts.length;
  const shown = canDraw ? status : "no_webgl";
  const sel = selected && tree.nodes[selected] ? { id: selected, name: tree.nodes[selected].n, row: rowFor(hz, treeKey, selected), group: rowFor(hz, treeKey, selected) ? null : groupSummary(tree, hz, treeKey, selected) } : null;
  const treeName = (k: string) => cov.trees[k].nodes[cov.trees[k].root]?.n ?? k;
  const curveHref = (part?: string) => (hz.href && part ? withParam(hz.href, "part", part) : hz.href);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 pb-2 pt-2.5">
        {title ? <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</span> : null}
        {hazardPicker}
        {treeKeys.length > 1 ? (
          <div role="radiogroup" aria-label="Which reference model" className="ml-auto inline-flex rounded-md border border-border bg-card p-0.5 text-[11px]">
            {treeKeys.map((k) => (
              <button key={k} type="button" role="radio" aria-checked={k === treeKey} onClick={() => { setView(k === treeKeys[0] ? null : k); setSelected(null); }}
                className={`rounded px-2 py-0.5 ${k === treeKey ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
                {treeName(k)}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="grid gap-3 px-3 pb-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div ref={stage} className="relative overflow-hidden rounded-md border border-border bg-[#dde4e8]" style={{ height }}>
            <div ref={host} className="absolute inset-0" />
            {shown === "loading" ? <div className="absolute inset-0 grid place-items-center text-[12px] text-slate-600">Loading the Digital Twin&apos;s model…</div> : null}
            {shown === "failed" || shown === "no_webgl" ? (
              <div className="absolute inset-0 grid place-items-center px-6 text-center text-[12px] text-slate-700">
                {shown === "no_webgl" ? "This browser cannot draw 3D here." : "The 3D model could not be loaded."} The list beside it says the same in words.
              </div>
            ) : null}
            <div className="pointer-events-none absolute bottom-2 left-2 rounded border border-black/10 bg-white/85 px-2 py-1 text-[10.5px] text-slate-600">
              drag to turn · click, then scroll to zoom · click a part · the Digital Twin&apos;s reference {treeKey === "plant" ? "site" : "model"}
            </div>
          </div>
          <div className="mt-1.5 min-h-[34px] rounded-md border border-border bg-card px-2.5 py-1.5 text-[11.5px]" aria-live="polite">
            {sel ? (
              <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {sel.row ? <Swatch state={sel.row.s} /> : sel.group?.length ? <Swatch state={sel.group[0].state} /> : null}
                <span className="font-medium">{sel.name}</span>
                {sel.row ? (
                  <span className="text-muted-foreground">{cov.state_words[sel.row.s]}{sel.row.part ? ` · ${sel.row.part}` : ""}</span>
                ) : sel.group?.length ? (
                  <span className="text-muted-foreground">{sel.group.map((g) => `${cov.state_short[g.state]}: ${g.names.slice(0, 6).join(", ")}${g.names.length > 6 ? ` and ${g.names.length - 6} more` : ""}`).join(" · ")}</span>
                ) : (
                  <span className="text-muted-foreground">not mapped in the crosswalk</span>
                )}
                {sel.row?.note ? <span className="text-muted-foreground">— {sel.row.note}</span> : null}
                {sel.row?.s === "curve" && hz.href ? (
                  mode === "asset" ? (
                    <Link href={curveHref(sel.row.parts?.[0] ?? sel.row.part)!} className="ml-auto text-accent hover:underline">open its curve ▸</Link>
                  ) : (
                    <button type="button" className="ml-auto text-accent hover:underline" onClick={() => { setPart(sel.row?.parts?.[0] ?? sel.row?.part ?? null); document.getElementById("card-curve")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>show its curve ▲</button>
                  )
                ) : null}
              </span>
            ) : (
              <span className="text-muted-foreground">Click a part in the picture, or a system in the list, to see what {hz.gap ? "this hazard" : "the curve"} does with it.</span>
            )}
          </div>
          {cov.type.picture_note ? <p className="mt-1 px-0.5 text-[10.5px] text-muted-foreground">{cov.type.picture_note}</p> : null}
        </div>
        <div className="min-w-0 space-y-3">
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">What the colours mean <span className="font-normal normal-case tracking-normal">· parts counted</span></div>
            <CoverageLegend words={cov.state_words} counts={counts} />
          </div>
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{treeName(treeKey)}, as the twin breaks it down</div>
            {hz.gap ? <p className="mb-1 text-[11px] text-muted-foreground">No curve for {hz.hazard.label.toLowerCase()} yet: every part is in the value with no curve.</p> : null}
            <ul className="thin-scroll max-h-[340px] space-y-0.5 overflow-y-auto pr-1">
              {systems.map((row) => (
                <li key={row.node}>
                  <button type="button" onClick={() => pick(row.node)} aria-pressed={selected === row.node}
                    className={`w-full rounded px-1.5 py-1 text-left text-[11.5px] hover:bg-muted ${selected === row.node ? "bg-muted" : ""}`}>
                    <span className="flex items-center gap-1.5 font-medium"><Swatch state={row.state} />{row.name}</span>
                    {row.by_state.map((b) => (
                      <span key={b.state} className="block pl-4 text-[10.5px] leading-snug text-muted-foreground">
                        <span className="font-medium text-foreground/80">{cov.state_short[b.state]}</span> — {b.parts.map((p) => p.name).join(", ")}
                      </span>
                    ))}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
