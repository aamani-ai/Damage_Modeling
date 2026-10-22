"""The asset spine and the twin coverage (plan DCD-D20, DCD-D21, DCD-D23).

Reads docs/contracts/twin_crosswalks/ (spine.json and one crosswalk CSV per twin asset), the twin's trees exported by
scripts/dashboard/export_twin.mjs (dashboard/data/twin/trees.json, pinned to a twin commit) and the vendored 3D viewer's
manifest (dashboard/public/twin/manifest.json). Writes, per asset type, which twin part each cell's curves cover — the
state of every node of the reference model, hazard by hazard — and the spine the nav and the library draw.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

from .common import OUT, ROOT, load_json, read_csv, sha256

XWALK = ROOT / "docs" / "contracts" / "twin_crosswalks"
TREES = OUT / "twin" / "trees.json"
VIEWER = OUT.parent / "public" / "twin"

STATES = ("curve", "conditioner", "no_curve", "no_direct_damage", "outside")
BASES = ("part", "not_covered", "out_of_scope", "coverage_decision", "not_named", "inferred")
# The fixed words for each state (06 §2.4): shown in the legend, the systems list and every tooltip; never typed in a component.
STATE_WORDS = {
    "curve": "Has a damage curve",
    "conditioner": "Changes the curve, no curve of its own",
    "no_curve": "In the value, no curve yet",
    "no_direct_damage": "Reviewed: no direct damage",
    "outside": "Outside the value this curve prices",
}
STATE_SHORT = {"curve": "curve", "conditioner": "changes the curve", "no_curve": "no curve yet", "no_direct_damage": "no direct damage", "outside": "outside"}
ORDER = {s: i for i, s in enumerate(STATES)}
GAP_NOTE = "No curve for this hazard yet: the catalogue lists it as a gap."


def _parts(cell: str | None) -> list[str]:
    """A crosswalk `part` may name alternatives for the same twin part, separated by ' | ' (two curve routes for one module)."""
    return [x.strip() for x in (cell or "").split("|") if x.strip()]


def _children(nodes: dict[str, dict[str, Any]]) -> dict[str, list[str]]:
    kids: dict[str, list[str]] = {}
    for nid, n in nodes.items():
        if n.get("p"):
            kids.setdefault(n["p"], []).append(nid)
    return kids


def _root(nodes: dict[str, dict[str, Any]]) -> str:
    return next(nid for nid, n in nodes.items() if not n.get("p"))


def spine() -> dict[str, Any]:
    return load_json(XWALK / "spine.json")


def types(sp: dict[str, Any]) -> list[dict[str, Any]]:
    return [{**t, "category": c["slug"], "category_label": c["label"]} for c in sp["categories"] for t in c["types"]]


def viewer_check() -> dict[str, Any]:
    """The vendored viewer files equal the SHA-256 their manifest records (they are copied unchanged from the twin)."""
    man_p = VIEWER / "manifest.json"
    if not man_p.exists():
        return {"ok": False, "reason": "dashboard/public/twin/manifest.json is missing — run scripts/dashboard/export_twin.mjs"}
    man = load_json(man_p)
    bad = [f for f, h in man["files"].items() if not (VIEWER / f).exists() or sha256(VIEWER / f) != h]
    return {"ok": not bad, "twin_commit": man["twin_commit"], "files": len(man["files"]), "mismatched": bad, "load_order": man["load_order"], "three": man.get("three")}


def build_coverage(entries: list[Any], sl: dict[str, Any], hazard_slug_of, cell_href) -> dict[str, Any]:
    """Coverage per asset type with a twin asset: every node's state per hazard, the systems list and the matrix.

    `entries` are catalogue Entry objects; `hazard_slug_of(label)` maps a catalogue hazard label to its slug;
    `cell_href(entry)` gives the cell page link. Returns {"types": {slug: coverage}, "findings": [...], "errors": [...]}.
    """
    sp = spine()
    trees = load_json(TREES)
    hazards = [h for h in sl["hazards"] if not h.get("outside_the_five")]
    errors: list[str] = []
    findings: list[str] = []
    to_confirm: dict[str, list[dict[str, Any]]] = {}  # rows read from the mechanism or not named by the cell: questions for its owner
    out: dict[str, Any] = {}
    by_asset_hazard: dict[tuple[str, str], Any] = {}
    for e in entries:
        by_asset_hazard[(e.data["asset"], hazard_slug_of(e.data["hazard"]))] = e
    for t in types(sp):
        if not t.get("twin"):
            continue
        tw_id = t["twin"]["asset"]
        tw = trees["assets"].get(tw_id)
        if not tw:
            errors.append(f"spine type {t['slug']}: the twin export has no asset {tw_id}")
            continue
        tree_sets = {"asset": tw["nodes"], **({"plant": tw["plant_nodes"]} if tw.get("plant_nodes") else {})}
        node_tree = {nid: k for k, ns in tree_sets.items() for nid in ns}
        all_nodes = {nid: n for ns in tree_sets.values() for nid, n in ns.items()}
        rows = read_csv(XWALK / t["twin"]["crosswalk"])
        # validate the rows
        for i, r in enumerate(rows, start=2):
            where = f"{t['twin']['crosswalk']}:{i}"
            if r["twin_node"] not in all_nodes:
                errors.append(f"{where}: twin node {r['twin_node']} is not in the pinned twin tree of {tw_id}")
            if r["state"] not in STATES:
                errors.append(f"{where}: unknown state {r['state']!r}")
            if r["basis"] not in BASES:
                errors.append(f"{where}: unknown basis {r['basis']!r}")
            e = next((x for x in entries if x.id == r["entry_id"]), None)
            if not e:
                errors.append(f"{where}: no catalogue entry {r['entry_id']}")
                continue
            if e.data["asset"] != t["catalogue_asset"] or hazard_slug_of(e.data["hazard"]) != r["hazard"]:
                errors.append(f"{where}: {r['entry_id']} is {e.data['hazard']} × {e.data['asset']}, not {r['hazard']} × {t['catalogue_asset']}")
            if r["state"] == "curve":
                for part in _parts(r["part"]):
                    if part not in {row["part"] for row in e.data.get("rows") or []}:
                        errors.append(f"{where}: part {part!r} is not a row of {r['entry_id']}")
            if r["basis"] in ("inferred", "not_named"):
                to_confirm.setdefault(r["entry_id"], []).append({"type": t["label"], "node": r["twin_node"], "name": all_nodes.get(r["twin_node"], {}).get("n", r["twin_node"]),
                                                                 "state": r["state"], "basis": r["basis"], "note": r["note"]})
        cov_h: list[dict[str, Any]] = []
        for h in hazards:
            e = by_asset_hazard.get((t["catalogue_asset"], h["slug"]))
            gap = e is None or e.kind == "gap"
            hz_rows = [r for r in rows if r["hazard"] == h["slug"] and e is not None and r["entry_id"] == e.id]
            if e is not None and not gap and not hz_rows:
                errors.append(f"{t['twin']['crosswalk']}: no rows for {e.id} ({h['slug']})")
            by_node = {r["twin_node"]: r for r in hz_rows}
            states: dict[str, dict[str, dict[str, Any]]] = {}
            unmapped: list[str] = []
            # each crosswalk row once; every node points at the row it inherits from (compact: pages embed this)
            rows_used: dict[str, dict[str, Any]] = {"_gap": {"s": "no_curve", "note": GAP_NOTE, "basis": "gap"}} if gap else {}
            pointers: dict[str, dict[str, str]] = {}
            for tree_key, nodes in tree_sets.items():
                kids = _children(nodes)
                st: dict[str, dict[str, Any]] = {}
                ptr: dict[str, str] = {}
                for nid, n in nodes.items():
                    if gap:
                        st[nid] = rows_used["_gap"]
                        ptr[nid] = "_gap"
                        continue
                    c, hit = nid, None
                    while c and not hit:
                        hit = by_node.get(c)
                        c = all_nodes.get(c, {}).get("p")
                    if hit:
                        rid = hit["twin_node"]
                        ps = _parts(hit["part"])
                        rows_used.setdefault(rid, {"s": hit["state"], **({"part": " or ".join(ps)} if ps else {}), **({"parts": ps} if len(ps) > 1 else {}),
                                                   **({"note": hit["note"]} if hit["note"] else {}), "basis": hit["basis"]})
                        st[nid] = rows_used[rid]
                        ptr[nid] = rid
                    elif not kids.get(nid):
                        unmapped.append(nid)
                pointers[tree_key] = ptr
                # a group node (one with children) shows the strongest state among its leaves for the list; the 3D tint uses leaves
                states[tree_key] = st
            if unmapped:
                findings.append(f"{t['slug']} × {h['slug']}: {len(unmapped)} part(s) of the twin not mapped in {t['twin']['crosswalk']} ({', '.join(sorted(unmapped)[:6])}{'…' if len(unmapped) > 6 else ''})")
            systems = {}
            for tree_key, nodes in tree_sets.items():
                kids = _children(nodes)
                root = _root(nodes)

                def leaves(nid: str) -> list[str]:
                    return [nid] if not kids.get(nid) else [x for k in kids[nid] for x in leaves(k)]
                rows_out = []
                for sys_id in kids.get(root, []):
                    groups = kids.get(sys_id) or [sys_id]
                    by_state: dict[str, list[dict[str, Any]]] = {}
                    for g in groups:
                        ls = [states[tree_key].get(x, {}).get("s") for x in leaves(g)]
                        s = min((x for x in ls if x), key=lambda x: ORDER[x], default=None) or "no_curve"
                        info = states[tree_key].get(g) or states[tree_key].get(leaves(g)[0]) or {}
                        by_state.setdefault(s, []).append({"node": g, "name": nodes[g]["n"], **({"part": info.get("part")} if info.get("part") else {}), **({"note": info.get("note")} if info.get("note") else {})})
                    main = min(by_state, key=lambda x: ORDER[x])
                    rows_out.append({"node": sys_id, "name": nodes[sys_id]["n"], "state": main, "by_state": [{"state": s, "words": STATE_SHORT[s], "parts": by_state[s]} for s in sorted(by_state, key=lambda x: ORDER[x])]})
                systems[tree_key] = rows_out
            counts = {s: 0 for s in STATES}
            for tree_key, nodes in tree_sets.items():
                for row in systems[tree_key]:
                    for b in row["by_state"]:
                        counts[b["state"]] += len(b["parts"])
            curve_parts = sorted({p for st in states.values() for v in st.values() if v["s"] == "curve" for p in (v.get("parts") or ([v["part"]] if v.get("part") else []))})
            cov_h.append({
                "hazard": {"slug": h["slug"], "label": h["label"]},
                "entry_id": e.id if e else None, "status": e.status if e else None, "gap": gap,
                "href": cell_href(e) if e else None,
                "rows": rows_used, "states": pointers,
                "systems": systems, "counts": counts, "curve_parts": curve_parts,
                "unmapped": sorted(unmapped),
            })
        # the matrix: the twin's systems (asset tree, then plant tree) × hazards
        matrix = []
        for tree_key, nodes in tree_sets.items():
            kids = _children(nodes)
            for sys_id in kids.get(_root(nodes), []):
                cells = {}
                for ch in cov_h:
                    row = next(r for r in ch["systems"][tree_key] if r["node"] == sys_id)
                    parts = sorted({p.get("part") or p["name"] for b in row["by_state"] if b["state"] == "curve" for p in b["parts"]})
                    cells[ch["hazard"]["slug"]] = {"state": row["state"], "words": STATE_SHORT[row["state"]], "curve_parts": parts,
                                                   "mixed": len(row["by_state"]) > 1, "states": [b["state"] for b in row["by_state"]]}
                matrix.append({"tree": tree_key, "node": sys_id, "name": nodes[sys_id]["n"], "cells": cells})
        out[t["slug"]] = {
            "type": {k: t.get(k) for k in ("slug", "label", "category", "category_label", "profile", "building", "also_buildings", "picture_note", "catalogue_asset")},
            "twin": {"asset": tw_id, "name": tw["name"], "model": tw["model"], "root": tw["root"], "plant_model": tw.get("plant_model"), "plant_root": tw.get("plant_root"),
                     "plant_name": tw.get("plant_name"), "commit": trees["twin_commit"], "crosswalk": f"docs/contracts/twin_crosswalks/{t['twin']['crosswalk']}"},
            "trees": {k: {"root": _root(ns), "nodes": ns} for k, ns in tree_sets.items()},
            "hazards": cov_h, "matrix": matrix,
            "state_words": STATE_WORDS, "state_short": STATE_SHORT,
        }
    return {"types": out, "findings": findings, "errors": errors, "to_confirm": to_confirm, "twin_commit": trees["twin_commit"], "twin_dirty": trees.get("twin_dirty", False)}


def nav_spine(sp: dict[str, Any], entries: list[Any], hazard_slug_of) -> dict[str, Any]:
    """The categories and types for the nav and the library, with each type's entries by hazard."""
    cats = []
    for c in sp["categories"]:
        ts = []
        for t in c["types"]:
            item = {k: t.get(k) for k in ("slug", "label", "profile", "building", "also_buildings", "picture_note", "planned", "catalogue_asset")}
            item["href"] = None if t.get("planned") else f"/assets/{t['slug']}"
            item["entries"] = {hazard_slug_of(e.data["hazard"]): e.id for e in entries if not t.get("planned") and e.data["asset"] == t.get("catalogue_asset")}
            ts.append(item)
        cats.append({"slug": c["slug"], "label": c["label"], "rule": c.get("rule"), "planned": bool(c.get("planned")), "types": ts})
    return {"categories": cats, "source": "docs/contracts/twin_crosswalks/spine.json"}


def building_of(type_def: dict[str, Any]) -> list[str]:
    return [b for b in [type_def.get("building"), *(type_def.get("also_buildings") or [])] if b]


def rel_out(p: Path) -> str:
    return str(p.relative_to(OUT))
