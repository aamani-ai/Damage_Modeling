"use client";

// What a curve covers, drawn on the Digital Twin's own reference model (DCD-D21, discussion 09 §2). The viewer and
// the models are vendored and pinned (public/twin/, scripts/dashboard/export_twin.mjs, checked by the data build);
// the colour of every part comes from the crosswalks (docs/contracts/twin_crosswalks/, DCD-D23) through the build.
// Every colour is repeated in words — in the legend, the hover label and the systems list — so nothing depends on
// colour alone, and the systems list is the keyboard way through the same picture. The twin's own tools sit on the
// picture (focus, isolate, fade, explode, see inside, reset) with a full-screen view (DCD-D34), and each part with a
// curve carries that curve in miniature beside it.
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useUrlParam } from "@/lib/url-state";
import type { Coverage, CoverageHazard, CoverageState, Spark } from "@/lib/types";
import { Sparkline } from "./sparkline";

export const STATE_ORDER: CoverageState[] = ["curve", "conditioner", "no_curve", "no_direct_damage", "outside"];
// Data colours, the same in both themes: the legend explains a picture whose scene is always lit the same way.
export const STATE_CSS: Record<CoverageState, string> = { curve: "#1b8a6b", conditioner: "#5b8bd6", no_curve: "#e9c47f", no_direct_damage: "#b9bec6", outside: "#efede7" };
const hex = (c: string) => parseInt(c.slice(1), 16);

export type Labels = Record<string, { name: string; sub?: string }>;
interface Modes { isolate: boolean; fade: boolean; internals: boolean; explode: number }
export interface ViewerEl extends HTMLElement {
  load(model: string, opts: { parents: Record<string, string>; labels: Labels }): unknown;
  setTint(map: Record<string, number> | null): void;
  setModes(m: Partial<Modes>): void;
  select(id: string | null): void;
  frame(id?: string | null): void;
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

export function hazardOf(cov: Coverage, slug: string | null): CoverageHazard {
  return cov.hazards.find((h) => h.hazard.slug === slug) ?? cov.hazards.find((h) => !h.gap) ?? cov.hazards[0];
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

function rowFor(hz: CoverageHazard, treeKey: string, nid: string) {
  const rid = hz.states[treeKey]?.[nid];
  return rid ? hz.rows[rid] : undefined;
}

function partsOf(r: CoverageHazard["rows"][string] | undefined): string[] {
  return r?.parts ?? (r?.part ? [r.part] : []);
}

/** A group's parts by state (a system, or any node with children), so a click or a hover on it is never "not mapped". */
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

/** The curves inside a group: the catalogue parts its mapped parts carry, once each. */
function groupCurveParts(tree: Coverage["trees"][string], hz: CoverageHazard, treeKey: string, id: string): string[] {
  const sys = hz.systems[treeKey]?.find((r) => r.node === id);
  if (sys) return [...new Set(sys.by_state.filter((b) => b.state === "curve").flatMap((b) => b.parts.flatMap((p) => p.parts ?? (p.part ? [p.part] : []))))];
  const kids: Record<string, string[]> = {};
  for (const [nid, n] of Object.entries(tree.nodes)) if (n.p) (kids[n.p] ??= []).push(nid);
  const out = new Set<string>();
  const walk = (x: string) => {
    if (kids[x]?.length) return kids[x].forEach(walk);
    const r = rowFor(hz, treeKey, x);
    if (r?.s === "curve") partsOf(r).forEach((p) => out.add(p));
  };
  walk(id);
  return [...out];
}

function subFor(tree: Coverage["trees"][string], hz: CoverageHazard, treeKey: string, id: string, words: Record<CoverageState, string>): string {
  const r = rowFor(hz, treeKey, id);
  if (r) return `${words[r.s]}${r.part ? ` · ${r.part}` : ""}`;
  const g = groupSummary(tree, hz, treeKey, id);
  if (!g.length) return "";
  return g.length === 1 ? words[g[0].state] : `${words[g[0].state]}, and parts in other states`;
}

/** The wheel zooms the model only after a click into the picture (or always, full screen); otherwise it scrolls the page past it. */
export function useWheelGate(ref: React.RefObject<HTMLElement | null>, always = false) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let engaged = false;
    const onDown = () => { engaged = true; };
    const onLeave = () => { engaged = false; };
    const onWheel = (e: WheelEvent) => { if (!engaged && !always) e.stopPropagation(); };
    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointerleave", onLeave);
    node.addEventListener("wheel", onWheel, { capture: true });
    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointerleave", onLeave);
      node.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, [ref, always]);
}

function Tool({ label, onClick, active = false, disabled = false, title }: { label: string; onClick: () => void; active?: boolean; disabled?: boolean; title: string }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={active} title={title}
      className={`rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors ${active ? "bg-[#1b8a6b] text-white" : "text-slate-700 hover:bg-black/5"} disabled:cursor-not-allowed disabled:opacity-40`}>
      {label}
    </button>
  );
}

function CurveLink({ part, spark, href, onShow }: { part: string; spark?: Spark; href: string | null; onShow?: (part: string) => void }) {
  const inner = (
    <>
      {spark ? <Sparkline spark={spark} /> : null}
      <span className="truncate">{part}</span>
      <span aria-hidden className="text-accent">{onShow ? "▲" : "▸"}</span>
    </>
  );
  const cls = "inline-flex max-w-full items-center gap-1 rounded border border-border bg-card px-1 py-px text-[10.5px] text-foreground hover:border-accent/60";
  if (onShow) return <button type="button" onClick={() => onShow(part)} className={cls} title={`show the curve for ${part}`}>{inner}</button>;
  if (href) return <Link href={href} className={cls} title={`open the curve for ${part}`}>{inner}</Link>;
  return <span className={cls}>{inner}</span>;
}

export function TwinCoverage({
  cov, loadOrder, hazardSlug, height = 460, mode, title, hazardPicker,
}: {
  cov: Coverage; loadOrder: string[]; hazardSlug: string | null; height?: number; mode: "asset" | "cell";
  title?: React.ReactNode; hazardPicker?: React.ReactNode;
}) {
  const [viewParam, setView] = useUrlParam("view");
  const [selParam, setSelParam] = useUrlParam("sel");
  const [, setPart] = useUrlParam("part");
  const treeKeys = Object.keys(cov.trees);
  const treeKey = viewParam && cov.trees[viewParam] ? viewParam : treeKeys[0];
  const tree = cov.trees[treeKey];
  const model = treeKey === "plant" ? cov.twin.plant_model! : cov.twin.model;
  const hz = hazardOf(cov, hazardSlug);
  const [selected, setSelected] = useState<string | null>(null);
  const canDraw = useSyncExternalStore(noSubscribe, webglOk, () => true);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  // the twin's own default: see through covers on a plant, not on a building
  const [modes, setModes] = useState<Modes>({ isolate: false, fade: false, internals: cov.type.category !== "real_estate", explode: 0 });
  const [full, setFull] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useWheelGate(stage, full);
  const viewer = useRef<ViewerEl | null>(null);
  const loadedModel = useRef<string | null>(null);
  // the viewer keeps the labels object it was loaded with, so a hazard change rewrites the hover words in place
  const labelsRef = useRef<Labels>({});

  const parents = parentsOf(tree);
  const tint = tintOf(tree, hz, treeKey);
  const tintRef = useRef(tint);
  const modesRef = useRef(modes);
  useEffect(() => {
    tintRef.current = tint;
    const lab = labelsRef.current;
    for (const id of Object.keys(lab)) lab[id].sub = subFor(tree, hz, treeKey, id, cov.state_words);
    if (status === "ready" && loadedModel.current === model) viewer.current?.setTint(tint);
  }, [tint, tree, hz, treeKey, cov.state_words, status, model]);
  useEffect(() => {
    modesRef.current = modes;
    viewer.current?.setModes(modes);
  }, [modes]);

  // the viewer: scripts once per page, one element per component
  useEffect(() => {
    if (!canDraw) return;
    let alive = true;
    let el: ViewerEl | null = null;
    const onLoaded = (e: Event) => {
      el?.setTint(tintRef.current);
      el?.setModes(modesRef.current);
      setLoadedFor((e as CustomEvent<{ modelId: string }>).detail.modelId);
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
    const lab: Labels = Object.fromEntries(Object.entries(tree.nodes).map(([id, n]) => [id, { name: n.n, sub: subFor(tree, hz, treeKey, id, cov.state_words) }]));
    labelsRef.current = lab;
    viewer.current.load(model, { parents, labels: lab });
  }, [status, model, parents, tree, hz, treeKey, cov.state_words]);

  // a part asked for through the URL (the systems × hazards table): select and frame it once its model is loaded
  useEffect(() => {
    if (!selParam || loadedFor !== model || !tree.nodes[selParam] || !viewer.current) return;
    viewer.current.select(selParam);
    viewer.current.reset();
    const t = setTimeout(() => setSelected(selParam), 0);
    return () => clearTimeout(t);
  }, [selParam, loadedFor, model, tree]);

  // full screen: Escape leaves it
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFull(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [full]);

  // picking a system keeps the whole model in view with the system lit, so a part spread across a plant is seen in
  // place rather than zoomed onto one instance; Focus frames it on request
  const pick = (id: string) => {
    setSelected(id);
    setSelParam(null);
    viewer.current?.select(id);
    viewer.current?.reset();
  };
  const clearSel = () => {
    setSelected(null);
    setSelParam(null);
    viewer.current?.select(null);
    setModes((m) => ({ ...m, isolate: false, fade: false }));
  };
  const resetView = () => {
    viewer.current?.reset();
    setModes((m) => ({ ...m, isolate: false, fade: false, explode: 0 }));
  };
  const showCurve = (part: string) => {
    setPart(part);
    setFull(false);
    document.getElementById("card-curve")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const systems = hz.systems[treeKey] ?? [];
  const counts: Partial<Record<CoverageState, number>> = {};
  for (const row of systems) for (const b of row.by_state) counts[b.state] = (counts[b.state] ?? 0) + b.parts.length;
  const selRow = selected ? rowFor(hz, treeKey, selected) : undefined;
  const sel = selected && tree.nodes[selected] ? { id: selected, name: tree.nodes[selected].n, row: selRow, group: selRow ? null : groupSummary(tree, hz, treeKey, selected) } : null;
  const treeName = (k: string) => cov.trees[k].nodes[cov.trees[k].root]?.n ?? k;
  const curveHref = (part: string) => (hz.href ? withParam(hz.href, "part", part) : null);
  const shown = canDraw ? status : "no_webgl";
  const link = (p: string) => <CurveLink key={p} part={p} spark={hz.sparks?.[p]} href={curveHref(p)} onShow={mode === "cell" && hz.href ? showCurve : undefined} />;

  return (
    <div className={full ? "fixed inset-0 z-50 overflow-auto bg-background p-3" : ""} role={full ? "dialog" : undefined} aria-modal={full || undefined} aria-label={full ? "What the curve covers, full screen" : undefined}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 pb-2 pt-2.5">
        {title ? <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</span> : null}
        {hazardPicker}
        <div className="ml-auto flex items-center gap-2">
          {treeKeys.length > 1 ? (
            <div role="radiogroup" aria-label="Which reference model" className="inline-flex rounded-md border border-border bg-card p-0.5 text-[11px]">
              {treeKeys.map((k) => (
                <button key={k} type="button" role="radio" aria-checked={k === treeKey} onClick={() => { setView(k === treeKeys[0] ? null : k); clearSel(); }}
                  className={`rounded px-2 py-0.5 ${k === treeKey ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
                  {treeName(k)}
                </button>
              ))}
            </div>
          ) : null}
          <button type="button" onClick={() => setFull((f) => !f)} aria-pressed={full} className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground" title={full ? "Leave full screen (Esc)" : "Show the picture full screen"}>
            {full ? "✕ Close full screen" : "⤢ Full screen"}
          </button>
        </div>
      </div>
      <div className="grid items-stretch gap-3 px-3 pb-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div ref={stage} className="relative overflow-hidden rounded-md border border-border bg-[#dde4e8]" style={{ height: full ? "calc(100vh - 170px)" : height }}>
            <div ref={host} className="absolute inset-0" />
            {shown === "loading" ? <div className="absolute inset-0 grid place-items-center text-[12px] text-slate-600">Loading the Digital Twin&apos;s model…</div> : null}
            {shown === "failed" || shown === "no_webgl" ? (
              <div className="absolute inset-0 grid place-items-center px-6 text-center text-[12px] text-slate-700">
                {shown === "no_webgl" ? "This browser cannot draw 3D here." : "The 3D model could not be loaded."} The list beside it says the same in words.
              </div>
            ) : null}
            {shown === "ready" ? (
              <div className="absolute left-2 top-2 flex flex-wrap items-center gap-0.5 rounded-md border border-black/10 bg-white/90 p-0.5 shadow-sm" role="toolbar" aria-label="The Digital Twin's tools">
                <Tool label="Focus" title={selected ? "Frame the selection" : "Select a part first"} disabled={!selected} onClick={() => viewer.current?.frame(selected)} />
                <Tool label="Isolate" title={selected ? "Show only the selection" : "Select a part first"} disabled={!selected} active={modes.isolate} onClick={() => setModes((m) => ({ ...m, isolate: !m.isolate }))} />
                <Tool label="Fade others" title={selected ? "Ghost everything else" : "Select a part first"} disabled={!selected} active={modes.fade} onClick={() => setModes((m) => ({ ...m, fade: !m.fade }))} />
                <Tool label="Explode" title="Separate the parts along their assembly paths" active={modes.explode > 0} onClick={() => setModes((m) => ({ ...m, explode: m.explode > 0 ? 0 : 1 }))} />
                <Tool label="See inside" title="See through covers and castings" active={modes.internals} onClick={() => setModes((m) => ({ ...m, internals: !m.internals }))} />
                <Tool label="Reset" title="Reset the camera and the tools" onClick={resetView} />
              </div>
            ) : null}
            <div className="pointer-events-none absolute bottom-2 left-2 rounded border border-black/10 bg-white/85 px-2 py-1 text-[10.5px] text-slate-600">
              drag to turn · {full ? "scroll" : "click, then scroll"} to zoom · click a part · the Digital Twin&apos;s reference {treeKey === "plant" ? "site" : "model"}
            </div>
          </div>
          <div className="mt-1.5 min-h-[34px] rounded-md border border-border bg-card px-2.5 py-1.5 text-[11.5px]" aria-live="polite">
            {sel ? (
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {sel.row ? <Swatch state={sel.row.s} /> : sel.group?.length ? <Swatch state={sel.group[0].state} /> : null}
                <span className="font-medium">{sel.name}</span>
                {sel.row ? (
                  <span className="text-muted-foreground">{cov.state_words[sel.row.s]}{sel.row.note ? ` — ${sel.row.note}` : ""}</span>
                ) : sel.group?.length ? (
                  <span className="text-muted-foreground">{sel.group.map((g) => `${cov.state_short[g.state]}: ${g.names.slice(0, 6).join(", ")}${g.names.length > 6 ? ` and ${g.names.length - 6} more` : ""}`).join(" · ")}</span>
                ) : (
                  <span className="text-muted-foreground">not mapped in the crosswalk</span>
                )}
                {sel.row?.s === "curve" ? <span className="ml-auto flex flex-wrap gap-1">{partsOf(sel.row).map(link)}</span> : null}
                {!sel.row && groupCurveParts(tree, hz, treeKey, sel.id).length ? <span className="ml-auto flex flex-wrap gap-1">{groupCurveParts(tree, hz, treeKey, sel.id).map(link)}</span> : null}
                <button type="button" onClick={clearSel} className="text-[10.5px] text-muted-foreground hover:text-foreground" title="Clear the selection">clear</button>
              </span>
            ) : (
              <span className="text-muted-foreground">Click a part in the picture, or a system in the list, to see what {hz.gap ? "this hazard" : "the curve"} does with it.</span>
            )}
          </div>
          {cov.type.picture_note ? <p className="mt-1 px-0.5 text-[10.5px] text-muted-foreground">{cov.type.picture_note}</p> : null}
        </div>
        {/* the list takes the picture's height on a wide screen, so the two columns end together */}
        <div className="min-w-0 lg:relative">
          <div className="flex flex-col gap-3 lg:absolute lg:inset-0">
            <div className="shrink-0">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">What the colours mean <span className="font-normal normal-case tracking-normal">· parts counted</span></div>
              <CoverageLegend words={cov.state_words} counts={counts} />
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="mb-1 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{treeName(treeKey)}, as the twin breaks it down</div>
              {hz.gap ? <p className="mb-1 shrink-0 text-[11px] text-muted-foreground">No curve for {hz.hazard.label.toLowerCase()} yet: every part is in the value with no curve.</p> : null}
              <ul className="thin-scroll max-h-[360px] min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1 lg:max-h-none">
                {systems.map((row) => (
                  <li key={row.node} className={`rounded px-1.5 py-1 ${selected === row.node ? "bg-muted" : "hover:bg-muted/60"}`}>
                    <button type="button" onClick={() => pick(row.node)} aria-pressed={selected === row.node} className="flex w-full items-center gap-1.5 text-left text-[11.5px] font-medium">
                      <Swatch state={row.state} />{row.name}
                    </button>
                    {row.by_state.map((b) => {
                      const curveParts = b.state === "curve" ? [...new Set(b.parts.flatMap((p) => p.parts ?? (p.part ? [p.part] : [])))] : [];
                      return (
                        <div key={b.state} className="pl-4 text-[10.5px] leading-snug text-muted-foreground">
                          <span className="font-medium text-foreground/80">{cov.state_short[b.state]}</span> — {b.parts.map((p) => p.name).join(", ")}
                          {curveParts.length ? <div className="mt-0.5 flex flex-wrap gap-1">{curveParts.map(link)}</div> : null}
                        </div>
                      );
                    })}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
