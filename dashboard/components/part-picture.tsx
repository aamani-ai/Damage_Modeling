"use client";

// Where one curve's part sits on the Digital Twin's reference model (09 §3, row 3): the model with only the twin parts
// the crosswalk maps to this curve coloured, the rest left plain. Built on the same vendored viewer as the coverage
// picture; the parts are named in words beside it.
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Coverage } from "@/lib/types";
import { type Labels, type ViewerEl, STATE_CSS, Swatch, loadTwin, useWheelGate, webglOk } from "./twin-coverage";

const noSubscribe = () => () => {};

export function PartPicture({ cov, loadOrder, part, typeLabel, typeHref }: { cov: Coverage; loadOrder: string[]; part: string; typeLabel: string; typeHref: string | null }) {
  const hz = cov.hazards[0];
  // the tree whose crosswalk rows name this part (the block, else the plant)
  const names = (rid: string) => hz.rows[rid]?.parts ?? (hz.rows[rid]?.part ? [hz.rows[rid].part!] : []);
  const treeKey = Object.keys(cov.trees).find((k) => Object.entries(hz?.states[k] ?? {}).some(([, rid]) => names(rid).includes(part))) ?? Object.keys(cov.trees)[0];
  const tree = cov.trees[treeKey];
  const model = treeKey === "plant" ? cov.twin.plant_model! : cov.twin.model;
  const nodes = Object.keys(tree.nodes).filter((id) => {
    const rid = hz?.states[treeKey]?.[id];
    return !!rid && hz.rows[rid]?.s === "curve" && names(rid).includes(part);
  });
  const named = nodes.filter((id) => !nodes.includes(tree.nodes[id].p ?? "")).map((id) => tree.nodes[id].n);
  const key = nodes.join(",");
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useWheelGate(stage);
  const canDraw = useSyncExternalStore(noSubscribe, webglOk, () => true);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  useEffect(() => {
    if (!nodes.length || !canDraw) return;
    let alive = true;
    let el: ViewerEl | null = null;
    const tint = Object.fromEntries(nodes.map((id) => [id, parseInt(STATE_CSS.curve.slice(1), 16)]));
    const parents: Record<string, string> = {};
    for (const [id, n] of Object.entries(tree.nodes)) if (n.p) parents[id] = n.p;
    const labels: Labels = Object.fromEntries(Object.entries(tree.nodes).map(([id, n]) => [id, { name: n.n, sub: nodes.includes(id) ? `this curve: ${part}` : undefined }]));
    const onLoaded = () => el?.setTint(tint);
    loadTwin(loadOrder).then(() => {
      if (!alive || !host.current) return;
      el = document.createElement("subsystem-viewer") as ViewerEl;
      el.addEventListener("sv-loaded", onLoaded);
      host.current.appendChild(el);
      el.load(model, { parents, labels });
      setStatus("ready");
    }).catch(() => {
      if (alive) setStatus("failed");
    });
    return () => { alive = false; el?.removeEventListener("sv-loaded", onLoaded); el?.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands for the node list; the effect reads the latest list
  }, [key, tree, model, part, loadOrder, canDraw]);
  if (!hz || !nodes.length) return null;
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Where this part sits</div>
      <div ref={stage} className="relative mt-1 overflow-hidden rounded-md border border-border bg-[#dde4e8]" style={{ height: 210 }}>
        <div ref={host} className="absolute inset-0" />
        {status !== "ready" || !canDraw ? <div className="absolute inset-0 grid place-items-center text-[11px] text-slate-600">{status === "failed" || !canDraw ? "The 3D model could not be drawn here." : "Loading the Digital Twin's model…"}</div> : null}
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        <Swatch state="curve" /> this curve, on the twin: {named.join(", ")}
        {typeHref ? <Link href={typeHref} className="ml-auto text-accent hover:underline">all of the {typeLabel.toLowerCase()} ▸</Link> : null}
      </p>
    </div>
  );
}
