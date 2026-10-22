"""Orchestration: assemble every JSON the app reads, run the reconciliation checks, write only when all pass."""
from __future__ import annotations

import datetime as dt
import json
import re
import shutil
import sys
from typing import Any

from . import chain as chain_mod
from . import hazard_main
from . import twin as twin_mod
from .catalogue import Entry, curve_records, load_entries
from .common import (OUT, ROOT, SENTENCES, SOURCE, STATION_ABSENT_SENTENCES, BuildError, fmt_pct, fmt_usd_compact, git,
                     humanise, load_json, rel, sha256, tier_span)
from .faq import build_faq
from .occurrence import (all_registers, asset_slug, bess_bucket_values, hazard_slug, register_for, resolve_state, slugs,
                         twin_crosswalk_pin)
from .parts import asset_plain_sentence, asset_view, substation_budget, substation_crosswalk
from .plain import (FOR_HAZARD, STATION_NAMES, STEPS, TIER_MEANING, TIER_PLAIN, TIER_SHORT, capability_sentences, curve_caption, halves, main_logic,
                    one_word, parameters_plain, plain_rail, plain_text, resolve_key_sources, station_plain, steps4, tier_words)
from .registers import load_registers
from .sampling import NO_EVALUATOR, sample_entry
from .sources import NO_LINK, NOT_YET_EXTRACTED, extract_for_entry, link_counts, resolve_link
from .summaries import asset_sentence, cell_sentence, dossier_sentence, library_sentence, occurrence_sentence

REPO_URL = "https://github.com/aamani-ai/Damage_Modeling"
HAZARD_BLOB_MAIN = "https://github.com/aamani-ai/Hazard_Modeling/blob/main/"
SUBSTATION_BUDGET_SOURCE = "Hazard_modeling/docs/plans/_cross_cutting/substation_conus/reference_budget.csv"

STATUS_MARK = {"live": "■", "proposal": "▢", "reused": "▨", "gap": "┈"}
STATUS_LABEL = {"live": "LIVE", "proposal": "PROPOSAL", "reused": "REUSED", "gap": "GAP"}
SOURCE_ID_RE = re.compile(r"\(([A-Z]{1,4}-S\d{1,3})\)")


# ─── per-entry facts ──────────────────────────────────────────────────────────────────────────────────────────

def value_facts(e: Entry) -> dict[str, Any] | None:
    """Covered value, total, share and the no-curve buckets, from the pinned value files — or None."""
    a = e.artifact or {}
    vl = a.get("value_linkage") or {}
    d = e.data
    if e.id == "flood_bess":
        vb = load_json(ROOT / vl["value_binding_path"])
        u = vb["units"]
        covered = [{"label": "Battery enclosures · active hardware", "value_usd": u["battery_enclosures"]["count"] * u["battery_enclosures"]["same_unit_value_usd"], "curve_id": u["battery_enclosures"]["curve_id"], "bucket": "battery_enclosures"},
                   {"label": "PCS", "value_usd": u["pcs"]["count"] * u["pcs"]["same_unit_value_usd"], "curve_id": u["pcs"]["curve_id"], "bucket": "pcs"}]
        names = {"enclosure_racks_fire_suppression": "Enclosure racks and fire suppression", "electrical_balance": "Electrical balance (unit transformers, cables)", "civil_works": "Civil works", "unallocated_fieldwork": "Unallocated fieldwork"}
        no_curve = [{"label": names.get(k, humanise(k)), "value_usd": v} for k, v in vb["unmodeled_buckets"].items()]
        total = vb["reference_tiv_usd"]
        return _value_block(vb["modeled_value_usd"], total, covered, no_curve, vl["value_binding_path"], "real 2024 dollars; reference budget r1")
    if e.id in ("tropical_cyclone_wind_bess", "wildfire_bess"):
        vb = load_json(ROOT / vl["value_binding_path"])
        covered = [{"label": "Integrated battery enclosures", "value_usd": vb["units"]["BESS_INTEGRATED_ENCLOSURE"]["count"] * vb["units"]["BESS_INTEGRATED_ENCLOSURE"]["value_usd_each"], "bucket": "battery_enclosures"},
                   {"label": "PCS", "value_usd": vb["units"]["BESS_SEPARATE_PCS"]["count"] * vb["units"]["BESS_SEPARATE_PCS"]["value_usd_each"], "bucket": "pcs"}]
        # the catalogue writes "Civil works ($1.6M)"; the amount goes into the fixed sentence once, not twice
        no_curve = [{"label": re.sub(r"\s*\(\$[\d.]+\s*[MBk]\)\s*$", "", s), "value_usd": _dollars_in(s)} for s in d.get("not_covered", [])]
        return _value_block(vl["candidate_hardware_usd"], vl["full_tiv_usd"], covered, no_curve, vl["value_binding_path"], "fixed 2024 dollars; reference budget r1")
    if e.id == "tropical_cyclone_wind_wind":
        basis = vl.get("owner_approved_proxy_value_basis") or {}
        share = basis.get("covered_value_share") or basis.get("covered_value_share_of_project_tiv")
        if share is None:
            share = 0.16 if "16" in json.dumps(basis) else None
        if share is not None:
            return _value_block(share, 1.0, [{"label": "Tower (owner-approved proxy basis)", "value_usd": None, "share": share}],
                                [{"label": s, "value_usd": None} for s in d.get("not_covered", [])], e.artifact_path, "share of project TIV; dollars are the consumer's")
    if e.id == "flood_substation":
        v, outside = vl.get("value_usd"), vl.get("outside_response_value_usd")
        if isinstance(v, (int, float)) and isinstance(outside, (int, float)):
            return _value_block(v, v + outside, [{"label": "Hazus substation assembly", "value_usd": v}], [{"label": "Outside the Hazus assembly", "value_usd": outside}], vl.get("value_binding_path") or e.artifact_path, "value basis " + str(vl.get("value_basis_id")))
    return None


def _dollars_in(text: str) -> float | None:
    m = re.search(r"\$([\d.]+)\s*([MBk])", text)
    if not m:
        return None
    mult = {"M": 1e6, "B": 1e9, "k": 1e3}[m.group(2)]
    return float(m.group(1)) * mult


def _value_block(covered_usd: float, total_usd: float, covered: list, no_curve: list, source: str, basis: str) -> dict[str, Any]:
    share = covered_usd / total_usd if total_usd else None
    for item in no_curve:
        item["sentence"] = SENTENCES["no_curve"]["page"].format(part=item["label"], value=fmt_usd_compact(item["value_usd"]) if item.get("value_usd") is not None else "an unstated share")
    return {"covered_usd": covered_usd if total_usd != 1.0 else None, "total_usd": total_usd if total_usd != 1.0 else None, "share_covered": share,
            "covered_label": f"{fmt_usd_compact(covered_usd)} of {fmt_usd_compact(total_usd)}" if total_usd != 1.0 else f"{fmt_pct(share)} of project value",
            "covered": covered, "no_curve": no_curve, "left_out": [], "source": source, "basis": basis}


def resolve_checks(checks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """The catalogue's outside checks with every Hazard link looked up on Hazard's origin/main (G18): kept when there,
    pointed at the new place when moved, and no link with the words when it is only on a Hazard branch."""
    out = []
    for c in checks:
        link = c.get("link") or ""
        if link.startswith(HAZARD_BLOB_MAIN):
            h = hazard_main.lookup(link[len(HAZARD_BLOB_MAIN):])
            out.append({**c, "link": h["link"], "hazard": h})
        else:
            out.append(dict(c))
    return out


def review_block(e: Entry) -> dict[str, Any]:
    a = e.artifact or {}
    d = e.data
    rv = d.get("review") or {}
    release = a.get("review_status") or ((a.get("validation") or {}).get("review_scope") if isinstance(a.get("validation"), dict) else None)
    return {
        "entry_read_on": d.get("reviewed_on"),
        "entry_read_by": d.get("read_by"),
        "entry_read_kind": "agent" if str(d.get("read_by", "")).lower().startswith("agent") else "person",
        "release_review": humanise(release) if release else None,
        "release_review_code": release,
        "review": {"by": rv.get("by"), "on": rv.get("on"), "verdict": rv.get("verdict")} if rv else None,
        "tone": "ok" if rv.get("verdict") in ("approved", "accepted") else "neutral",
        "label": (f"reviewed {rv.get('by')} {rv.get('on')}" if rv else f"entry agent-read {d.get('reviewed_on', '')}") + " · release " + (humanise(release) if release else "—"),
    }


def exists_chip(e: Entry) -> dict[str, Any]:
    a = e.artifact or {}
    qual = None
    text = " ".join(str(a.get(k, "")) for k in ("promotion_status", "lifecycle_state", "model_grade"))
    if "screening" in text:
        qual = "screening"
    elif e.status == "proposal":
        qual = humanise(a.get("lifecycle_state", ""))[:28] or None
    return {"status": e.status, "mark": STATUS_MARK[e.status], "label": STATUS_LABEL[e.status], "qualifier": qual}


def source_id_check(e: Entry, regs: dict[str, Any]) -> list[str]:
    """Every source ID the cell displays must resolve in its register (only for register-backed cells)."""
    ids = {s["id"] for s in regs.get("sources") or []}
    if not ids or regs.get("extraction"):
        return []
    unresolved = []
    for p in regs.get("parameters") or []:
        unresolved += [f"parameter {p['id']} → {s}" for s in p["source_ids"] if s not in ids]
    for c in regs.get("claims") or []:
        unresolved += [f"claim {c['id']} → {s}" for s in c["source_ids"] if s not in ids]
    for ks in e.data.get("key_sources") or []:
        unresolved += [f"key source → {s}" for s in SOURCE_ID_RE.findall(ks) if s not in ids]
    return unresolved


def citations_for(e: Entry, regs: dict[str, Any]) -> dict[str, Any]:
    sources, claims, params = regs.get("sources") or [], regs.get("claims") or [], regs.get("parameters") or []
    edges = []
    claim_ids = {c["id"] for c in claims}
    for p in params:
        for cid in p["claim_ids"]:
            if cid in claim_ids:
                edges.append({"from": p["id"], "to": cid, "kind": "parameter→claim"})
        for sid in p["source_ids"]:
            edges.append({"from": p["id"], "to": sid, "kind": "parameter→source"})
    for c in claims:
        for sid in c["source_ids"]:
            edges.append({"from": c["id"], "to": sid, "kind": "claim→source"})
    lineage = "extracted" if regs.get("extraction") and sources else ("machine_readable" if sources and (claims or params) else ("parameters_only" if params else "prose_only"))
    known = {s["id"] for s in sources}
    unresolved = sorted({ed["to"] for ed in edges if ed["kind"].endswith("source") and ed["to"] not in known}) if known else []
    ex = regs.get("extraction") or {}
    return {"entry_id": e.id, "lineage": lineage, "paths": regs.get("paths"), "sources": sources, "claims": claims, "parameters": params, "edges": edges,
            "unresolved_source_ids": unresolved, "aliases": ex.get("matched") or {}, "unmatched_source_ids": ex.get("unmatched") or [],
            "provenance": ("extracted" if ex.get("status") == "extracted" else "not_yet_extracted" if ex else "register"),
            "extraction": {k: ex.get(k) for k in ("status", "sentence", "dossier", "workbook", "sheets_read", "dossier_sections", "files", "assumptions", "open_seams")} if ex else None,
            "link_counts": link_counts(sources),
            "prose_sentence": SENTENCES["lineage_prose"]["page"] if lineage == "prose_only" else None}


def proof_block(e: Entry, kats: dict[str, Any], stations: list[dict[str, Any]]) -> dict[str, Any]:
    a = e.artifact or {}
    validation = None
    for f in next(s for s in stations if s["id"] == "proof")["files"]:
        if "validation" in f["path"].lower() and f["path"].endswith(".json"):
            v = load_json(ROOT / f["path"])
            validation = {"path": f["path"], "status": v.get("status"), "date": v.get("date"), "classification": v.get("classification"), "review_scope": v.get("review_scope") or (v.get("qualification") or {}).get("review_scope")}
            break
        if "validation" in f["path"].lower() and f["path"].endswith(".md"):
            validation = {"path": f["path"], "status": "report", "date": None}
    cap = a.get("capability_declaration") or {}
    ve = cap.get("vulnerability_emit") or ((cap.get("pathway_capabilities") or [{}])[0] if cap.get("pathway_capabilities") else {})
    cam = cap.get("consumer_annual_metrics") or {}
    return {
        "known_answers": {k: v for k, v in kats.items() if k != "failed"} | {"failed": kats["failed"]},
        "validation": validation,
        "outside_checks": e.data.get("checks") or [],
        "capability": {
            "failure_unit_scalar_dr": ve.get("failure_unit_scalar_dr"),
            "scenario_loss_given_value_basis": ve.get("scenario_loss_given_value_basis"),
            "curve_intrinsic_spread": ve.get("curve_intrinsic_spread"),
            "populated_emit_modes": ve.get("populated_emit_modes") or (a.get("emit_contract") or {}).get("populated_emit_modes_for_this_cell"),
            "eal": cam.get("eal") or cam.get("status_after_promotion"),
            "pml": cam.get("pml"), "var": cam.get("var"), "tvar": cam.get("tvar"),
            "limitation_flags": cam.get("limitation_flags") or ve.get("limitation_flags") or [],
            "computation_owner": cam.get("computation_owner"),
        },
    }


def seams_block(e: Entry, regs: dict[str, Any]) -> dict[str, Any]:
    d = e.data
    triggers = [{"parameter": p["name"], "tier": p["tier"], "update_trigger": p["update_trigger"]} for p in regs.get("parameters") or [] if p.get("update_trigger") and p.get("tier") in ("T3", "T4")]
    return {"open_items": d.get("open_items") or [], "missing_mechanisms": d.get("missing_mechanisms") or [], "out_of_scope": d.get("out_of_scope") or [],
            "next_version": d.get("next_version"), "update_triggers": triggers}


# ─── the build ────────────────────────────────────────────────────────────────────────────────────────────────

def build(write: bool = True) -> dict[str, Any]:
    entries, index, index_doc = load_entries()
    sl = slugs()
    registers = all_registers(sl)
    checks: list[dict[str, Any]] = []

    def check(cid: str, name: str, ok: bool, detail: Any = None, severity: str = "hard") -> None:
        """severity 'hard' stops the build and writes nothing; 'data' is a data reality the receipt and the
        pages report (a source ID that does not resolve, a known answer that does not reproduce) — the check is
        not loosened, the data is still written so the finding is visible, and the exit code stays 1."""
        checks.append({"id": cid, "name": name, "ok": bool(ok), "severity": severity, "detail": detail})

    # 1 · counts equal the catalogue's
    counts = {s: sum(1 for e in entries if e.status == s) for s in ("live", "proposal", "reused", "gap")}
    cat_text = (ROOT / "docs/cells/CATALOGUE.md").read_text(encoding="utf-8")
    m = re.search(r"(\d+) live cells, (\d+) proposals, (\d+) reused bindings and (\d+) gaps", cat_text)
    cat_counts = {"live": int(m.group(1)), "proposal": int(m.group(2)), "reused": int(m.group(3)), "gap": int(m.group(4))} if m else None
    check("counts", "headline counts equal the catalogue's", cat_counts == counts and len(entries) == 25, {"build": counts, "catalogue": cat_counts, "entries": len(entries)})

    # 2 · every SHA equals its pin
    pin_failures = [(e.id, p) for e in entries for p in e.pins if not p["ok"]]
    check("pins", "every artifact SHA equals its pin", not pin_failures, {"pins": sum(len(e.pins) for e in entries), "failures": pin_failures})

    # the twin crosswalk, pinned by flood_bess's value binding
    fb = next(e for e in entries if e.id == "flood_bess")
    fb_binding = load_json(ROOT / fb.artifact["value_linkage"]["value_binding_path"])
    twin = twin_crosswalk_pin(fb_binding.get("reference_sha256", {}).get("twin_crosswalk.csv"))
    check("twin_crosswalk", "Hazard's twin crosswalk SHA equals the value binding's pin", twin.get("ok") is True, {k: v for k, v in twin.items() if k not in ("text", "crosswalk")})
    bess_values = bess_bucket_values(fb_binding)
    commit_full = SOURCE["commit_full"] or git("rev-parse", "HEAD")
    # the vendored 3D viewer equals its manifest (DCD-D21); the twin trees and the spine are read below
    viewer = twin_mod.viewer_check()
    check("twin_viewer", "the vendored Digital Twin viewer files equal the SHA-256 their manifest records", viewer.get("ok") is True,
          {k: v for k, v in viewer.items() if k != "load_order"})
    # Hazard's substation reference budget, pinned by the substation flood binding; its twin crosswalk, read and unpinned
    sub_bind = load_json(ROOT / "docs/contracts/hazard_handoff/substation_flood_screening_v1/binding.json")
    sub_budget = substation_budget(((sub_bind.get("source_inputs") or {}).get("hazard_budget") or {}).get("sha256"), OUT)
    check("substation_budget", "Hazard's substation reference budget SHA equals the substation flood binding's pin", sub_budget.get("ok") is True,
          {k: v for k, v in sub_budget.items() if k not in ("text", "rows")} | {"rows": len(sub_budget.get("rows") or [])})
    sub_xwalk = substation_crosswalk(OUT)

    # per-entry work
    cells: dict[str, dict[str, Any]] = {}
    curves_out: dict[str, dict[str, Any]] = {}
    citations: dict[str, dict[str, Any]] = {}
    kat_failures, kat_totals = [], {"declared": 0, "run": 0, "reproduced": 0, "not_run": 0}
    unresolved_sources: list[str] = []
    sampling_notes: dict[str, list[str]] = {}
    by_id = {e.id: e for e in entries}
    link_findings: list[str] = []
    extraction_findings: list[str] = []
    for e in entries:
        regs = load_registers(e.artifact or {}, e.folder) if e.kind == "cell" else {"paths": {}, "sources": [], "claims": [], "parameters": []}
        if e.kind == "cell":
            base_dir = (ROOT / regs["paths"]["sources"]).parent if regs["paths"].get("sources") else e.folder
            for src in regs["sources"]:
                src["provenance"] = "register"
                resolve_link(src, REPO_URL, commit_full, base_dir)
            ex = extract_for_entry(e, regs, REPO_URL, commit_full)
            if ex:
                regs["extraction"] = ex
                if ex["status"] == "extracted":
                    regs["sources"] = ex["sources"]
                    regs["claims"] = regs["claims"] or ex["claims"]
                extraction_findings += [f"{e.id}: tier-table source ID {u} matches no document in the workbook or dossier" for u in ex["unmatched"]]
            link_findings += [f"{e.id}: {src['id']} — {src.get('title') or src.get('citation') or ''}".rstrip(" —") for src in regs["sources"]
                              if src.get("kind") not in ("marker", "placeholder") and not src.get("link") and not src.get("locator")]
        sampled = sample_entry(e)
        k = sampled["kats"]
        kat_totals["declared"] += k["declared"]; kat_totals["run"] += k["run"]; kat_totals["reproduced"] += k["reproduced"]
        kat_totals["not_run"] += sum(n["n"] for n in k["not_run"])
        if k["failed"]:
            kat_failures.append({"entry": e.id, "failed": k["failed"]})
        if sampled["notes"]:
            sampling_notes[e.id] = sampled["notes"]
        unresolved = source_id_check(e, regs)
        unresolved_sources += [f"{e.id}: {u}" for u in unresolved]
        occ = register_for(e)
        value = value_facts(e)
        index_ok = bool(e.index_row) and all(p["ok"] for p in e.pins if p["what"].startswith("runtime"))
        ch = chain_mod.detect(e, regs, k, occ, value, index_ok)
        audit_table = chain_mod.seven_step_table(e, ch["stations"])
        a = e.artifact or {}
        aslug, hslug = asset_slug(e.data["asset"], sl), hazard_slug(e.data["hazard"], sl)
        rows_tiers = {"shape": tier_span([r.get("shape") for r in e.data.get("rows") or []]), "cost": tier_span([r.get("cost") for r in e.data.get("rows") or []])}
        drawn = [c for c in sampled["curves"] if c["drawn"]]
        # occurrence per bucket
        buckets_block = []
        if occ:
            reg = occ["register"]
            for key, b in reg.get("buckets", {}).items():
                label = next((vb["label"] for vb in sl["value_buckets"].get(aslug, {}).get("buckets", []) if vb["key"] == key), key)
                buckets_block.append({"bucket": key, "label": label, **resolve_state(b, reg.get("surfaces", []), reg.get("last_searched"))})
        occ_states = {b["state"] for b in buckets_block}
        occ_mark = SENTENCES["not_searched"]["mark"] if not occ_states or occ_states == {"not_searched"} else ("✓" if "found" in occ_states else ("~" if "adjacent" in occ_states else "∅"))
        if not occ:
            occ_mark, occ_label = SENTENCES["not_searched"]["mark"], "not searched"  # no register yet: nobody has looked
        else:
            occ_label = "not searched" if occ_states == {"not_searched"} else "mixed"
        # parts
        bucket_of_subsystem = {}
        for b in sl["value_buckets"].get(aslug, {}).get("buckets", []):
            for s in b["failure_unit_subsystems"]:
                bucket_of_subsystem[s] = b["key"]
        parts = []
        for r in e.data.get("rows") or []:
            fus = sorted({c["failure_unit_id"] for c in sampled["curves"] if c["part"] == r["part"]})
            subsystems = sorted({c["subsystem"] for c in sampled["curves"] if c["part"] == r["part"] and c["subsystem"]})
            bucket = next((bucket_of_subsystem.get(s) for s in subsystems if s in bucket_of_subsystem), None)
            occ_row = next((b for b in buckets_block if b["bucket"] == bucket), None)
            parts.append({"part": r["part"], "curves": [c["curve_id"] for c in sampled["curves"] if c["part"] == r["part"]] or r.get("curves", []),
                          "failure_units": fus, "subsystems": subsystems, "bucket": bucket, "variants": r.get("variants"),
                          "shape": r.get("shape"), "shape_basis": r.get("shape_basis"), "cost": r.get("cost"), "cost_basis": r.get("cost_basis"),
                          "notes": r.get("notes") or [], "occurrence": {"mark": occ_row["mark"], "state": occ_row["state"], "sentence": occ_row["sentence"]} if occ_row else None,
                          "drawn": any(c["drawn"] for c in sampled["curves"] if c["part"] == r["part"])})
        withheld_units = [{"failure_unit_id": f.get("id"), "subsystem": f.get("subsystem"), "reasons": f.get("withheld_reason_codes") or [], "sentence": SENTENCES["withheld"]["page"].format(condition="; ".join(humanise(r).lower() for r in (f.get("withheld_reason_codes") or ["no reason code in the artifact"])))}
                          for f in a.get("failure_units") or [] if str(f.get("treatment", "")).startswith("withheld")]
        title = f"{e.data['hazard']} × {e.data['asset']}"
        noun = next((a.get("noun") for a in sl["assets"] if a["slug"] == aslug), e.data["asset"])
        summary = cell_sentence(e.data, e.status, value, e.data["hazard"], noun, bool(drawn) if e.kind == "cell" else None)
        # axis groups: one plot per native axis
        groups: list[dict[str, Any]] = []
        for c in drawn:
            key = c["axis"]["id"]
            g = next((g for g in groups if g["axis"]["id"] == key), None)
            if not g:
                g = {"axis": c["axis"], "curve_ids": []}
                groups.append(g)
            g["curve_ids"].append(c["curve_id"])
        cite = citations_for(e, regs) if e.kind == "cell" else None
        if cite:
            citations[e.id] = cite
        folder_files = [{"path": rel(p), "sha256": sha256(p)} for p in sorted(e.folder.iterdir()) if p.is_file()] if e.folder and e.folder.is_dir() else []
        files = dict(e.data.get("files") or {})
        # ── the plain layer (DCD-D19): chips, ✓ ◐ ✗ sentences, captions and station paragraphs, written here
        review = review_block(e)
        sources_by_id = {s_["id"]: s_ for s_ in regs.get("sources") or []}
        for s_ in regs.get("sources") or []:
            for al in s_.get("aliases") or []:
                sources_by_id.setdefault(al, s_)
        aliases = (regs.get("extraction") or {}).get("matched") or {}
        occ_state_overall = None if not occ else ("not_searched" if occ_states == {"not_searched"} else ("found" if "found" in occ_states else ("adjacent" if "adjacent" in occ_states else "none_after_search")))
        rail_plain = plain_rail(e.status, exists_chip(e).get("qualifier"), rows_tiers["shape"], rows_tiers["cost"], occ_state_overall, occ_label, review)
        capabilities = capability_sentences(e.data, a, e.data["hazard"]) if e.kind != "gap" else []
        search_href = f"/occurrence/{aslug}/{hslug}" if occ else None
        for c in sampled["curves"]:
            prow = [p for p in regs.get("parameters") or [] if (p.get("curve_id") == c["curve_id"]) or (p.get("curve_id") in (None, "all", "all_three"))]
            bucket = bucket_of_subsystem.get(c["subsystem"])
            occ_row = next((b for b in buckets_block if b["bucket"] == bucket), None)
            c["caption"] = curve_caption(c, prow, sources_by_id, aliases, e.data.get("key_sources") or [], occ_row, search_href)
        ex = regs.get("extraction") or {}
        prov = {"kind": "extracted" if ex.get("status") == "extracted" else ("not_yet_extracted" if ex else "register"), "sheets": ex.get("sheets_read") or [],
                "sections": ex.get("dossier_sections") or [], "unmatched": ex.get("unmatched") or [], "sentence": ex.get("sentence"), "dossier": ex.get("dossier"), "workbook": ex.get("workbook")}
        lc = link_counts(regs.get("sources") or [])
        fu_shares = []
        for pt in parts:
            fus_here = [f for f in a.get("failure_units") or [] if f.get("id") in pt["failure_units"]]
            share = next((f.get(k_) for f in fus_here for k_ in ("default_value_share_physical_base", "direct_hardware_value_share_physical_base") if f.get(k_) is not None), None)
            if share is not None:
                fu_shares.append((pt, float(share)))
        checks_resolved = resolve_checks(e.data.get("checks") or [])
        station_ctx = {"entry": e.data, "artifact": a, "hazard": e.data["hazard"], "noun": noun, "parts": parts, "withheld_units": withheld_units, "value": value, "rows_tiers": rows_tiers,
                       "curves": sampled["curves"], "sources": regs.get("sources") or [], "parameters": regs.get("parameters") or [], "evidence_provenance": prov,
                       "link_counts": lc, "tier_span": tier_span([rows_tiers["shape"], rows_tiers["cost"]]) if rows_tiers["shape"] != "–" else "–",
                       "audit_table": audit_table, "site_adapter": next((f for f in next(s_ for s_ in ch["stations"] if s_["id"] == "audit")["files"] if "site" in f["path"].lower()), None),
                       "identity": e.identity, "dossier": (ch.get("dossier") or {}).get("path"), "workbook": (ch.get("workbook") or {}).get("path"), "n_files": len(folder_files),
                       "capabilities": capabilities, "kats": k, "validation": None, "outside_checks": checks_resolved, "review": review,
                       "occurrence_sentence": (buckets_block[0]["sentence"] if buckets_block and len({b_["state"] for b_ in buckets_block}) == 1 else None) if occ else None,
                       "occurrence_state": occ_state_overall, "fu_shares": fu_shares}
        proof_tmp = proof_block(e, k, ch["stations"]) if e.kind != "gap" else None
        station_ctx["validation"] = (proof_tmp or {}).get("validation")
        station_ctx["key_references"] = resolve_key_sources(e.data.get("key_sources") or [], sources_by_id, aliases)
        stations_plain = []
        for st_ in ch["stations"]:
            stations_plain.append(station_plain(st_["id"], {**station_ctx, "station": st_}))
        key_refs = resolve_key_sources(e.data.get("key_sources") or [], sources_by_id, aliases)
        plain = {
            "rail": rail_plain,
            "main_logic": main_logic(e.data, sampled["curves"], e.data["hazard"]) if e.kind != "gap" else [],
            "steps": steps4(station_ctx, stations_plain, ch["stations"]) if e.kind != "gap" else [],
            "for_hazard": list(FOR_HAZARD),
            "word": one_word(rows_tiers["shape"], rows_tiers["cost"]) if e.kind != "gap" else None,
            "halves": halves(rows_tiers["shape"], rows_tiers["cost"]) if e.kind != "gap" else None,
            "hazard_paths": [{"id": s_["id"], "title": s_.get("title"), **(s_.get("hazard") or {})} for s_ in regs.get("sources") or [] if (s_.get("hazard") or {}).get("state") in ("moved", "on_branch")]
                            + [{"id": None, "title": c_["name"], **c_["hazard"]} for c_ in checks_resolved if (c_.get("hazard") or {}).get("state") in ("moved", "on_branch")],
            "capabilities": capabilities,
            "blocks": {
                "covered": {"value": value, "not_covered": [plain_text(re.sub(r"\s*\(\$[\d.,]+\s*[MBk]?\)\s*$", "", x)) for x in e.data.get("not_covered") or []], "withheld": withheld_units},
                "assumed": [plain_text(j) for j in e.data.get("judgment") or []],  # the IDs stay in the evidence ledger (cell.evidence.judgment)
                "missing": {"mechanisms": [plain_text(x) for x in e.data.get("missing_mechanisms") or []], "out_of_scope": [plain_text(x) for x in e.data.get("out_of_scope") or []]},
                "open_questions": [plain_text(x) for x in e.data.get("open_items") or []],
                "next_version": plain_text(e.data.get("next_version")),
            },
            "stations": stations_plain,
            "key_references": key_refs,
            "sources": [{k_: v_ for k_, v_ in s_.items() if k_ != "_extra"} for s_ in regs.get("sources") or []],
            "claims": regs.get("claims") or [],
            "parameters": regs.get("parameters") or [],
            "parameters_plain": parameters_plain(regs.get("parameters") or [], sources_by_id, aliases),
            "evidence_provenance": prov,
            "link_counts": lc,
            "extraction": {k_: ex.get(k_) for k_ in ("status", "sentence", "dossier", "workbook", "sheets_read", "dossier_sections", "files", "assumptions", "open_seams", "matched", "unmatched")} if ex else None,
            "tier_words": {"shape": tier_words(rows_tiers["shape"]), "cost": tier_words(rows_tiers["cost"])},
        }
        cell = {
            "entry_id": e.id, "kind": e.kind, "status": e.status, "title": title,
            "asset": {"slug": aslug, "label": e.data["asset"]}, "hazard": {"slug": hslug, "label": e.data["hazard"]},
            "identity": e.identity, "pins": e.pins,
            "rail": {"exists": exists_chip(e), "evidence": {"shape": rows_tiers["shape"], "cost": rows_tiers["cost"], "occurrence": {"mark": occ_mark, "label": occ_label}}, "review": review_block(e)},
            "summary": summary,
            "chain": ch,
            "no_evaluator": e.id in NO_EVALUATOR,
            "no_evaluator_sentence": SENTENCES["no_evaluator"]["page"] if e.id in NO_EVALUATOR else None,
            "answer": {"axis_groups": groups, "curve_ids": [c["curve_id"] for c in sampled["curves"]], "input": e.data.get("input"), "how_to_use": e.data.get("how_to_use"),
                       "value": value, "not_covered": e.data.get("not_covered") or [], "withheld_units": withheld_units,
                       "hazard_axis": a.get("hazard_axis") or [pw.get("hazard_axis") for pw in a.get("pathways") or []]},
            "parts": parts,
            "evidence": {"lineage": cite["lineage"] if cite else None, "prose_sentence": cite["prose_sentence"] if cite else None, "paths": regs.get("paths"),
                         "n_sources": len(regs.get("sources") or []), "n_claims": len(regs.get("claims") or []), "n_parameters": len(regs.get("parameters") or []),
                         "key_sources": e.data.get("key_sources") or [], "sources_from": e.data.get("sources_from"), "judgment": e.data.get("judgment") or [],
                         "weakest_tier": max([p["tier"] for p in regs.get("parameters") or [] if p.get("tier")] or ["–"]),
                         "pressure_test": next((f for f in next(s for s in ch["stations"] if s["id"] == "evidence")["files"] if "pressure_test" in f["path"].lower()), None),
                         "method": e.data.get("method")},
            "audit": {"table": audit_table, "state": next(s["state"] for s in ch["stations"] if s["id"] == "audit"),
                      "absent_sentence": STATION_ABSENT_SENTENCES["audit"] if next(s["state"] for s in ch["stations"] if s["id"] == "audit") in ("absent", "not_yet_detected") else None,
                      "site_adapter": next((f for f in next(s for s in ch["stations"] if s["id"] == "audit")["files"] if "site" in f["path"].lower()), None)},
            "proof": ({**proof_tmp, "outside_checks": checks_resolved} if proof_tmp else None),
            "seams": seams_block(e, regs),
            "field_review": {"register": {"path": occ["path"], "sha256": occ["sha256"], "search_log": occ["register"].get("search_log"), "last_searched": occ["register"].get("last_searched")} if occ else None,
                             "buckets": buckets_block, "review": review_block(e), "absent_sentence": None if occ else STATION_ABSENT_SENTENCES["field_review"]},
            "files": files, "folder_files": folder_files,
            "gap_reason": e.data.get("reason"),
            "binding": {"source_cell_id": e.identity.get("source_cell_id"), "source_entry_id": e.identity.get("source_cell_id"), "reused_curves": [c for r in e.data.get("rows") or [] for c in r.get("curves", [])],
                        "transfer_rationale": plain_text(a.get("transfer_rationale")), "transfer_rationale_raw": a.get("transfer_rationale"), "transfer_tier": a.get("transfer_tier"), "status": a.get("status"), "limitations": a.get("limitations")} if e.kind == "binding" else None,
            "sampling_notes": sampled["notes"],
            "plain": plain,
        }
        cells[e.id] = cell
        for c in sampled["curves"]:
            c["title"] = title
            c["asset"], c["hazard"] = cell["asset"], cell["hazard"]
            c["status"] = e.status
            c["rail"] = cell["rail"]
            c["parameters_rows"] = [p for p in regs.get("parameters") or [] if (p.get("curve_id") == c["curve_id"]) or (not p.get("curve_id"))]
            c["sources_for_curve"] = sorted({s for p in c["parameters_rows"] for s in p["source_ids"]})
            c["row_notes"] = [{**n, "text": plain_text(n.get("text")), "raw": n.get("text")} for n in c.get("row_notes") or []]
            c["sources_resolved"] = [sources_by_id[aliases.get(s, s)] for s in c["sources_for_curve"] if aliases.get(s, s) in sources_by_id]
            c["plain_tiers"] = {"shape": tier_words(c["tiers"].get("shape")), "cost": tier_words(c["tiers"].get("cost"))}
            bucket = bucket_of_subsystem.get(c["subsystem"])
            occ_row = next((b for b in buckets_block if b["bucket"] == bucket), None)
            c["occurrence"] = {"bucket": bucket, **{kk: vv for kk, vv in occ_row.items() if kk != "bucket"}} if occ_row else None
            c["review"] = review_block(e)
            c["summary"] = dossier_sentence(c, e.data["hazard"], occ_row["sentence"] if occ_row else None)
            c["rail_plain"] = plain_rail(e.status, exists_chip(e).get("qualifier"), c["tiers"].get("shape") or "–", c["tiers"].get("cost") or "–", occ_row["state"] if occ_row else occ_state_overall, occ_row["state"].replace("_", " ") if occ_row else occ_label, review_block(e))
            c["versions"] = _versions(e)
            c["data_path"] = f"curves/{e.id}/{c['curve_id']}@{c['version_key']}.json"
            curves_out[f"{e.id}/{c['curve_id']}@{c['version_key']}"] = c

    # 3 · every curve sampled or listed
    all_curves = list(curves_out.values())
    bad_curves = [c["curve_id"] for c in all_curves if (c["drawn"] and not any(s["points"] for s in c["series"])) or (not c["drawn"] and not c["no_evaluator_sentence"])]
    declared = sum(len(curve_records(e.artifact)) for e in entries if e.kind == "cell")
    # The fixed sentence says "no reference evaluator for this form in this repository". It must stay true: once
    # a `<entry>…_curve_eval.py` lands in scripts/reference_helpers/, the build stops (hard) until the sampler
    # draws that cell through it (DCD-A06's trigger) — the page never keeps saying "none" beside an evaluator.
    helpers = ROOT / "scripts/reference_helpers"
    evaluator_now_present = {eid: sorted(p.name for p in helpers.glob(f"{eid}*_curve_eval.py")) for eid in sorted(NO_EVALUATOR)}
    evaluator_now_present = {eid: names for eid, names in evaluator_now_present.items() if names}
    check("curves", "every curve sampled or listed as no evaluator", not bad_curves and declared == len(all_curves) and not evaluator_now_present,
          {"declared": declared, "sampled": sum(1 for c in all_curves if c["drawn"]), "no_evaluator": sum(1 for c in all_curves if not c["drawn"]), "bad": bad_curves,
           "listed_no_evaluator": sorted(NO_EVALUATOR), "evaluator_now_present": evaluator_now_present})
    # 4 · every known answer reproduced
    check("known_answers", "every known answer reproduced within tolerance (not-run cases carry a reason)", not kat_failures, {**kat_totals, "failures": kat_failures}, severity="data")
    # 5 · every displayed source ID resolves
    check("source_ids", "every displayed source ID resolves in the cell's register", not unresolved_sources, {"unresolved": unresolved_sources, "cells_affected": sorted({u.split(":")[0] for u in unresolved_sources})}, severity="data")
    # 5b · every source has a link or a locator (iteration 2); markers and placeholders are listed apart
    check("source_links", "every source has either a link or a locator", not link_findings, {"neither": link_findings, "cells_affected": sorted({u.split(":")[0] for u in link_findings})}, severity="data")
    # 5c · an older cell's tier-table source IDs match the sources extracted from its workbook and dossier
    check("extracted_sources", "every tier-table source ID of an older cell matches an extracted source", not extraction_findings, {"unmatched": extraction_findings, "cells_affected": sorted({u.split(":")[0] for u in extraction_findings})}, severity="data")
    # 5d · the plain layer is complete: a caption with its four parts for every drawn curve, ten paragraphs for every cell (structural: the build's own completeness)
    missing_plain = []
    for c in all_curves:
        cap = c.get("caption") or {}
        if c["drawn"] and not all(cap.get(k_) for k_ in ("what_it_says", "how_sure", "seen_in_field", "main_references")):
            missing_plain.append(f"{c['entry_id']}/{c['curve_id']}: caption incomplete")
    for cid_, cell_ in cells.items():
        sts = (cell_.get("plain") or {}).get("stations") or []
        if len(sts) != 10 or any(not st_.get("paragraph") for st_ in sts):
            missing_plain.append(f"{cid_}: {len(sts)} station paragraphs")
        if cell_["kind"] != "gap" and not cell_["plain"]["capabilities"]:
            missing_plain.append(f"{cid_}: no capability sentences")
    check("plain_layer", "every drawn curve has a four-part caption and every cell its ten station paragraphs", not missing_plain, {"missing": missing_plain})
    # 6 · nothing sampled outside its declared valid domain (asserted while sampling)
    check("domain", "nothing sampled outside its declared valid domain", True, {"asserted_per_curve": len(all_curves)})
    # 7 · chain: no station marked artifact without a file (asserted in the detector)
    check("chain_files", "no station marked artifact without a file behind it", True, {"stations": sum(len(c["chain"]["stations"]) for c in cells.values())})
    # 8 · occurrence registers consistent
    occ_problems = []
    for (aslug, hslug), r in registers.items():
        reg = r["register"]
        if reg.get("catalogue_entry") and reg["catalogue_entry"] not in by_id:
            occ_problems.append(f"{aslug}/{hslug}: catalogue_entry {reg['catalogue_entry']} not in the catalogue")
        keys = {b["key"] for b in sl["value_buckets"].get(aslug, {}).get("buckets", [])}
        extra = set(reg.get("buckets", {})) - keys
        if extra:
            occ_problems.append(f"{aslug}/{hslug}: buckets not in the slug list: {sorted(extra)}")
    for e in entries:
        if e.data.get("occurrence_register") and (asset_slug(e.data["asset"], sl), hazard_slug(e.data["hazard"], sl)) not in registers:
            occ_problems.append(f"{e.id}: pointer to a register the build did not find")
    check("occurrence", "occurrence registers name their entries and use the shared bucket keys", not occ_problems, {"registers": len(registers), "problems": occ_problems})

    hz_off = sorted({f"{eid}: {h_['path']} — {h_['words']}" for eid, c_ in cells.items() for h_ in (c_.get("plain") or {}).get("hazard_paths") or []})
    if (twin.get("hazard") or {}).get("state") in ("moved", "on_branch"):
        hz_off.append(f"flood_bess value binding: {twin['hazard']['path']} — {twin['hazard']['words']} (the committed copy is checked against the pin)")
    check("hazard_links", "every Hazard file the pages name is on Hazard's main", not hz_off, {"off_main": hz_off, "hazard": hazard_main.state().get("sentence")}, severity="data")
    faq = build_faq(f"{REPO_URL}/blob/{commit_full}")
    check("faq", "every FAQ question has its date, owner, a short answer and a Read more link that resolves", not faq["errors"], {"errors": faq["errors"], "questions": faq["n_questions"]}, severity="data")
    failed = [c for c in checks if not c["ok"]]
    for cid, cell in cells.items():
        cell["build_findings"] = _findings_for(cid, checks)
    # ─── manifest ───
    hz_order = [h["slug"] for h in sl["hazards"]]
    as_order = [a["slug"] for a in sl["assets"]]
    tiles = []
    for e in entries:
        c = cells[e.id]
        tiles.append({
            "entry_id": e.id, "kind": e.kind, "status": e.status, "title": c["title"], "asset": c["asset"], "hazard": c["hazard"],
            "exists": c["rail"]["exists"], "partial": bool(e.data.get("not_covered")), "tiers": c["rail"]["evidence"], "occurrence": c["rail"]["evidence"]["occurrence"],
            "review": c["rail"]["review"], "identity": c["identity"], "summary": c["summary"], "no_evaluator": c["no_evaluator"],
            "share_covered": (c["answer"]["value"] or {}).get("share_covered"), "n_curves": len(c["answer"]["curve_ids"]),
            "n_drawn": sum(1 for cid in c["answer"]["curve_ids"] if curves_out[f"{e.id}/{cid}@{c['identity']['version_key']}"]["drawn"]),
            "outside_checks": len(e.data.get("checks") or []), "chain_core_as_files": c["chain"]["core_as_files"], "generation": c["chain"]["generation"],
            "aria_label": _aria(c, e),
            "href": f"/cells/{e.id}",
            "word": c["plain"]["word"], "halves": c["plain"]["halves"],
        })
    codes: dict[str, list[dict[str, Any]]] = {}
    for e in entries:
        ident = e.identity
        key = ident.get("damage_code_id") or ident.get("binding_id")
        if key:
            codes.setdefault(key, []).append({"entry_id": e.id, "version_key": ident.get("version_key"), "status": e.status, "sha256": ident.get("sha256"), "model": ident.get("model"), "docs": ident.get("docs")})
    agent_read = sum(1 for e in entries if str(e.data.get("read_by", "")).lower().startswith("agent"))
    searched = sum(1 for r in registers.values() for b in r["register"].get("buckets", {}).values() if b.get("state") != "not_searched")
    manifest = {
        "schema": "damage_dashboard_manifest.v1",
        "commit": commit_full[:7], "commit_full": commit_full,
        "source": source_block(commit_full),
        "hazard_main": {k: v for k, v in hazard_main.state().items() if k in ("available", "ref", "commit", "behind", "sentence")},
        "catalogue_commit_note": "catalogue entries and artifacts read at this commit; every number traces to a file at it",
        "counts": {**counts, "entries": len(entries), "curves_declared": declared, "curves_drawn": sum(1 for c in all_curves if c["drawn"]), "curves_no_evaluator": sum(1 for c in all_curves if not c["drawn"]), "agent_read_only": agent_read, "field_searches_logged": searched,
                   "known_answers_run": kat_totals["run"], "known_answers_reproduced": kat_totals["reproduced"], "known_answers_not_run": kat_totals["not_run"], "occurrence_registers": len(registers),
                   "owner_reviews": sum(1 for e in entries if e.data.get("review")), "outside_checks": sum(1 for e in entries if e.data.get("checks")), "cells_with_rows": sum(1 for e in entries if e.data.get("rows"))},
        "summary": library_sentence(counts, len(as_order), len([h for h in sl["hazards"] if not h["outside_the_five"]]), agent_read, len(entries), searched),
        "assets": [{**a, "href": f"/assets/{a['slug']}", "n_entries": sum(1 for t in tiles if t["asset"]["slug"] == a["slug"])} for a in sl["assets"]],
        "hazards": sl["hazards"],
        "entries": tiles,
        "codes": codes,
        "sentences": SENTENCES,
        "marks": {"exists": STATUS_MARK, "partial": "◔", "no_curve": "✕", "left_out": "–", "twin_levels": sl["twin_lead_levels"]},
        "tiers": {"T1": "claims or field calibrated", "T2": "public lab, standard or physics", "T3": "engineering proxy or adjacent evidence", "T4": "placeholder or expert judgment"},
        "tier_words": TIER_SHORT, "tier_plain": TIER_PLAIN, "tier_meaning": TIER_MEANING,
        "stations": [{"id": s["id"], "label": s["label"], "gate": s["gate"], "name": STATION_NAMES[s["id"]][0], "meaning": STATION_NAMES[s["id"]][1]} for s in chain_mod.STATIONS],
        "no_link_words": NO_LINK, "not_yet_extracted_sentence": NOT_YET_EXTRACTED,
        "lenses": ["status", "evidence", "occurrence", "value", "review"],
        "repo": {"url": REPO_URL, "blob": f"{REPO_URL}/blob/main"},
    }
    # ─── the spine (G13/G14): coverage per asset type, the nav, the library rows ───
    hz_label = {h["slug"]: h["label"] for h in sl["hazards"]}
    sp = twin_mod.spine()
    coverage = twin_mod.build_coverage(entries, sl, lambda lbl: hazard_slug(lbl, sl), lambda e_: f"/cells/{e_.id}")
    check("twin_crosswalks", "every crosswalk row names a twin node, a catalogue entry and, for a curve, one of its parts", not coverage["errors"],
          {"errors": coverage["errors"], "types": sorted(coverage["types"]), "twin_commit": coverage["twin_commit"]})
    check("twin_coverage", "every part of each twin reference model is mapped for every hazard with a curve", not coverage["findings"],
          {"unmapped": coverage["findings"]}, severity="data")
    for t_def in twin_mod.types(sp):
        cov = coverage["types"].get(t_def["slug"])
        if cov and t_def.get("building"):
            for hz in cov["hazards"]:
                if hz["href"]:
                    hz["href"] = f"{hz['href']}?building={t_def['slug']}"
    manifest["spine"] = twin_mod.nav_spine(sp, entries, lambda lbl: hazard_slug(lbl, sl))
    tiles_by_id = {t["entry_id"]: t for t in tiles}
    five = [h for h in sl["hazards"] if not h.get("outside_the_five")]
    library_rows = []
    for c_def in sp["categories"]:
        rows_out = []
        for t_def in c_def["types"]:
            if t_def.get("planned"):
                continue
            row = {"slug": t_def["slug"], "label": t_def["label"], "building": t_def.get("building"), "profile": t_def.get("profile"),
                   "picture_note": t_def.get("picture_note"), "href": f"/assets/{t_def['slug']}", "tiles": {}}
            for h in five:
                e_ = next((x for x in entries if x.data["asset"] == t_def["catalogue_asset"] and hazard_slug(x.data["hazard"], sl) == h["slug"]), None)
                if not e_:
                    continue
                tile = dict(tiles_by_id[e_.id])
                if t_def.get("building") and e_.kind != "gap":
                    b_rows = [r for r in e_.data.get("rows") or [] if r["part"].startswith(t_def["building"])]
                    sh, co = tier_span([r.get("shape") for r in b_rows]), tier_span([r.get("cost") for r in b_rows])
                    tile["tiers"] = {**tile["tiers"], "shape": sh, "cost": co}
                    tile["word"], tile["halves"] = one_word(sh, co), halves(sh, co)
                    tile["building"] = t_def["building"]
                    tile["building_parts"] = [r["part"] for r in b_rows]
                    tile["href"] = f"/cells/{e_.id}?building={t_def['slug']}"
                    tile["aria_label"] = f"{tile['aria_label']}, {t_def['building'].lower()} rows"
                row["tiles"][h["slug"]] = tile
            rows_out.append(row)
        library_rows.append({"slug": c_def["slug"], "label": c_def["label"], "rule": c_def.get("rule"), "planned": bool(c_def.get("planned")),
                             "planned_types": [t_["label"] for t_ in c_def["types"] if t_.get("planned")], "types": rows_out})
    manifest["library"] = library_rows
    n_types = sum(len(c_["types"]) for c_ in library_rows)
    n_cats = sum(1 for c_ in library_rows if c_["types"])
    manifest["summary"] = library_sentence(counts, f"{n_types} asset types in {n_cats} categories", len(five), agent_read, len(entries), searched)
    manifest["state_words"] = twin_mod.STATE_WORDS
    # ─── the Review page (G17): about curves only, one card per cell — who has read it, field reports, what is open
    review_cells = []
    type_of = {}
    for t_def in twin_mod.types(sp):
        if t_def.get("catalogue_asset"):
            type_of.setdefault(t_def["catalogue_asset"], []).append(t_def)
    for e in entries:
        cell = cells[e.id]
        pl = cell.get("plain") or {}
        lc = pl.get("link_counts") or {}
        prov = pl.get("evidence_provenance") or {}
        tasks: list[dict[str, Any]] = []
        mine = [u.split(": ", 1)[1] for u in link_findings if u.startswith(e.id + ":")]
        if mine:
            tasks.append({"kind": "source_without_link", "text": f"Give {len(mine)} source{'s' if len(mine) != 1 else ''} a link or a locator", "items": mine, "href": f"/cells/{e.id}?step=numbers"})
        if lc.get("locator_only"):
            tasks.append({"kind": "sources_locator_only", "text": f"Add a link to {lc['locator_only']} source{'s' if lc['locator_only'] != 1 else ''} that only {'have' if lc['locator_only'] != 1 else 'has'} a locator", "items": [], "href": f"/cells/{e.id}?step=numbers"})
        if prov.get("kind") == "not_yet_extracted":
            tasks.append({"kind": "not_yet_extracted", "text": "Extract the sources from the write-up into register files", "items": [], "href": f"/cells/{e.id}?step=numbers"})
        if prov.get("unmatched"):
            tasks.append({"kind": "tier_id_unmatched", "text": f"Match {len(prov['unmatched'])} tier-table source ID{'s' if len(prov['unmatched']) != 1 else ''} to a document", "items": prov["unmatched"], "href": f"/cells/{e.id}?step=numbers"})
        for f_ in cell.get("build_findings") or []:
            if f_["check"] == "source_ids":
                tasks.append({"kind": "source_ids", "text": f"Fix {len(f_['items'])} source-ID reference{'s' if len(f_['items']) != 1 else ''} that point at nothing in the register", "items": f_["items"], "href": f"/cells/{e.id}?step=numbers"})
            elif f_["check"] == "known_answers":
                tasks.append({"kind": "known_answers", "text": f_["sentence"], "items": f_["items"], "href": f"/cells/{e.id}"})
        moved = [h_ for h_ in pl.get("hazard_paths") or [] if h_["state"] == "moved"]
        branch = [h_ for h_ in pl.get("hazard_paths") or [] if h_["state"] == "on_branch"]
        if moved:
            tasks.append({"kind": "hazard_moved", "text": f"Update {len(moved)} Hazard path{'s' if len(moved) != 1 else ''}: moved on Hazard's main", "items": [f"{h_['path']} → {h_['moved_to']}" for h_ in moved], "href": f"/cells/{e.id}?step=numbers"})
        if branch:
            tasks.append({"kind": "hazard_branch", "text": f"{len(branch)} Hazard file{'s are' if len(branch) != 1 else ' is'} on a Hazard branch, not on its main yet", "items": sorted({h_["path"] for h_ in branch}), "href": f"/cells/{e.id}?step=numbers"})
        to_confirm = coverage.get("to_confirm", {}).get(e.id) or []
        if to_confirm:
            tasks.append({"kind": "crosswalk_confirm", "text": f"Confirm {len(to_confirm)} part{'s' if len(to_confirm) != 1 else ''} of the coverage picture the cell does not name", "items": [f"{q['type']}: {q['name']} — {q['note']}" for q in to_confirm], "href": f"/cells/{e.id}?step=covers"})
        rv = cell["rail"]["review"]
        occ = cell["rail"]["evidence"]["occurrence"]["label"]
        review_cells.append({
            "entry_id": e.id, "title": cell["title"], "status": e.status, "href": f"/cells/{e.id}",
            "types": [t_["label"] for t_ in type_of.get(e.data["asset"], [])], "category": next((c_["label"] for c_ in sp["categories"] for t_ in c_["types"] if t_.get("catalogue_asset") == e.data["asset"]), None),
            "read": {"kind": rv["entry_read_kind"], "by": rv["entry_read_by"], "on": rv["entry_read_on"]}, "review": rv["review"], "release_review": rv["release_review"],
            "field": "not searched" if occ in ("not searched", "no register") else occ, "words": cell["plain"]["rail"]["review"]["words"],
            "tasks": tasks,
        })
    cat_order = {c_["label"]: i for i, c_ in enumerate(sp["categories"])}
    review_cells.sort(key=lambda r: (cat_order.get(r["category"], 99), -len(r["tasks"]), r["title"]))
    manifest["review"] = {"cells": review_cells, "n_tasks": sum(len(r["tasks"]) for r in review_cells), "n_cells_with_tasks": sum(1 for r in review_cells if r["tasks"]),
                          "n_person_reviews": sum(1 for r in review_cells if r["review"]), "kinds": sorted({t_["kind"] for r in review_cells for t_ in r["tasks"]})}
    # ─── assets: every asset through the same parts view (iteration 2) ───
    assets_out: dict[str, dict[str, Any]] = {}
    for a_def in sl["assets"]:
        aslug = a_def["slug"]
        asset_entries = [e for e in entries if asset_slug(e.data["asset"], sl) == aslug]
        for e in asset_entries:
            cells[e.id]["_curves"] = [c for c in curves_out.values() if c["entry_id"] == e.id]
        view = asset_view(aslug, a_def, asset_entries, cells, sl, registers, bess_values if aslug == "bess" else None, fb_binding if aslug == "bess" else None, twin,
                          sub_budget if aslug == "substation" else None, sub_xwalk if aslug == "substation" else None, resolve_state)
        for e in asset_entries:
            cells[e.id].pop("_curves", None)
        status_by_hz = {hazard_slug(e.data["hazard"], sl): e.status for e in asset_entries}
        reference = None
        if aslug == "bess":
            u = fb_binding["units"]
            reference = {"label": f"{u['battery_enclosures']['count']} enclosures · {u['pcs']['count']} PCS · {fmt_usd_compact(fb_binding['reference_tiv_usd'])} reference value ({humanise(fb_binding.get('currency_basis'))})", "source": fb.artifact["value_linkage"]["value_binding_path"], "total_usd": fb_binding["reference_tiv_usd"]}
        elif aslug == "substation" and sub_budget.get("available"):
            total = sum(float(r["amount_usd"]) for r in sub_budget["rows"] if r.get("amount_usd"))
            reference = {"label": f"one 345/138 kV station · {fmt_usd_compact(total)} reference budget (Hazard, MISO MTEP24 rates)", "source": SUBSTATION_BUDGET_SOURCE, "total_usd": total,
                         "link": hazard_main.lookup(SUBSTATION_BUDGET_SOURCE[len("Hazard_modeling/"):])["link"],
                         "note": "the bindings price the fenced station at $27.4M; the budget also carries the external access road outside the fence"}
        hazards_cols = []
        for h in sl["hazards"]:
            entry = next((e for e in asset_entries if hazard_slug(e.data["hazard"], sl) == h["slug"]), None) if h["catalogue"] else None
            reg = registers.get((aslug, h["slug"]))
            hazards_cols.append({**h, "entry_id": entry.id if entry else None, "status": entry.status if entry else None, "cell_title": cells[entry.id]["title"] if entry else None,
                                 "occurrence_href": f"/occurrence/{aslug}/{h['slug']}" if reg else None, "has_register": bool(reg)})
        searched_any = any(r["register"].get("last_searched") for (asl, _), r in registers.items() if asl == aslug)
        assets_out[aslug] = {"asset": {**a_def, "href": f"/assets/{aslug}"}, "summary": asset_plain_sentence(a_def, view["rows"], sl["hazards"], status_by_hz),
                             "summary_v0": asset_sentence(a_def.get("noun", a_def["label"]), sorted([{"hazard": e.data["hazard"], "slug": hazard_slug(e.data["hazard"], sl), "status": e.status, "tiers": {"shape": cells[e.id]["rail"]["evidence"]["shape"], "cost": cells[e.id]["rail"]["evidence"]["cost"]}, "entry_id": e.id} for e in asset_entries], key=lambda c: hz_order.index(c["slug"])), searched_any),
                             "reference": reference, "hazards": hazards_cols, "rows": view["rows"], "parts_by_cell": view["parts_by_cell"], "split": view["split"], "twin": view["twin"],
                             "value_source": view["value_source"], "entries": [t for t in tiles if t["asset"]["slug"] == aslug], "has_buckets": aslug in ("bess", "substation"),
                             "twin_crosswalk": {"sha256": twin.get("sha256"), "rows": twin.get("rows")} if aslug == "bess" else ({"sha256": sub_xwalk.get("sha256"), "rows": len(sub_xwalk.get("rows") or [])} if aslug == "substation" and sub_xwalk.get("available") else None)}
    # ─── occurrence pages ───
    occurrence_out: dict[tuple[str, str], dict[str, Any]] = {}
    for (aslug, hslug), r in registers.items():
        reg = r["register"]
        h = next(h for h in sl["hazards"] if h["slug"] == hslug)
        a_def = next(a for a in sl["assets"] if a["slug"] == aslug)
        buckets = {k: resolve_state(b, reg.get("surfaces", []), reg.get("last_searched")) for k, b in reg.get("buckets", {}).items()}
        bucket_labels = {b["key"]: b["label"] for b in sl["value_buckets"].get(aslug, {}).get("buckets", [])}
        entry = by_id.get(reg.get("catalogue_entry")) if reg.get("catalogue_entry") else None
        occurrence_out[(aslug, hslug)] = {
            "asset": {**a_def}, "hazard": h, "title": f"{h['label']} × {a_def['label']}", "register": {"path": r["path"], "sha256": r["sha256"]},
            "question": reg.get("question"), "effect": reg.get("effect"), "search_log": reg.get("search_log"), "last_searched": reg.get("last_searched"), "rule": reg.get("rule"),
            "summary": occurrence_sentence(h["label"], a_def["label"], buckets, reg.get("effect", "damage")),
            "surfaces": reg.get("surfaces", []), "buckets": [{"key": k, "label": bucket_labels.get(k, humanise(k)), "value_usd": (bess_values.get(k) if aslug == "bess" else None), **v} for k, v in buckets.items()],
            "left_out": reg.get("left_out", []), "provenance": reg.get("provenance"),
            "entry": {"entry_id": entry.id, "status": entry.status, "title": cells[entry.id]["title"], "rail": cells[entry.id]["rail"]} if entry else None,
            "state_overall": "not_searched" if all(v["state"] == "not_searched" for v in buckets.values()) else "mixed",
            "suggested_next": "search first" if all(v["state"] == "not_searched" for v in buckets.values()) and reg.get("effect") == "damage" else None,
        }

    receipt = {
        "schema": "damage_dashboard_receipt.v1", "built_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"), "commit": manifest["commit"], "commit_full": manifest["commit_full"],
        "source": manifest["source"], "hazard_main": hazard_main.state(), "checkout_head": git("rev-parse", "HEAD"),
        "working_tree_clean": git("status", "--porcelain") == "", "python": sys.version.split()[0],
        "twin": {"viewer": {k: v for k, v in viewer.items() if k != "load_order"}, "trees_commit": coverage["twin_commit"], "trees_dirty": coverage["twin_dirty"],
                 "types": sorted(coverage["types"]), "unmapped": coverage["findings"], "to_confirm": {k: len(v) for k, v in (coverage.get("to_confirm") or {}).items()}},
        "counts": manifest["counts"], "known_answers": kat_totals, "pins_checked": sum(len(e.pins) for e in entries),
        "twin_crosswalk": {k: v for k, v in twin.items() if k not in ("text", "crosswalk")},
        "substation_budget": {k: v for k, v in sub_budget.items() if k not in ("text", "rows")} | {"rows": len(sub_budget.get("rows") or [])},
        "substation_twin_crosswalk": {k: v for k, v in sub_xwalk.items() if k not in ("text", "rows")} | {"rows": len(sub_xwalk.get("rows") or [])},
        "source_links": {"neither": len(link_findings), "cells": sorted({u.split(":")[0] for u in link_findings})},
        "extraction": {eid: {"status": (c_.get("plain") or {}).get("evidence_provenance", {}).get("kind"), "sources": (c_.get("plain") or {}).get("link_counts", {}).get("total"), "unmatched": (c_.get("plain") or {}).get("evidence_provenance", {}).get("unmatched")}
                       for eid, c_ in cells.items() if (c_.get("plain") or {}).get("evidence_provenance", {}).get("kind") in ("extracted", "not_yet_extracted")},
        "checks": checks, "all_checks_pass": not failed, "sampling_notes": sampling_notes,
        "known_answers_not_run": {e.id: cells[e.id]["proof"]["known_answers"]["not_run"] for e in entries if e.kind == "cell" and cells[e.id]["proof"]["known_answers"]["not_run"]},
        "artifacts": [{"entry_id": e.id, "path": e.artifact_path, "sha256": e.artifact_sha, "status": e.status} for e in entries if e.artifact_path],
        "registers": {f"{a}/{h}": {"path": r["path"], "sha256": r["sha256"]} for (a, h), r in registers.items()},
    }
    hard = [c for c in failed if c["severity"] == "hard"]
    if failed:
        print("checks that did not pass:", file=sys.stderr)
        for c in failed:
            print(f"  ✗ [{c['severity']}] {c['id']}: {c['name']}\n    {json.dumps(c['detail'], default=str)[:1500]}", file=sys.stderr)
    if hard:
        raise BuildError(f"{len(hard)} structural check(s) failed; nothing written")
    manifest["build_checks"] = [{k: v for k, v in c.items() if k != "detail"} | {"summary": _check_summary(c)} for c in checks]
    manifest["all_checks_pass"] = not failed
    if write:
        _write_all(manifest, cells, curves_out, assets_out, occurrence_out, citations, receipt, twin, sub_budget, sub_xwalk, coverage["types"], faq)
    return receipt


def source_block(commit_full: str) -> dict[str, Any]:
    """What the dashboard was built from (G18): main, or a labelled preview of a branch whose data is never main's."""
    mode = SOURCE["mode"]
    branch = SOURCE["ref"] or git("rev-parse", "--abbrev-ref", "HEAD")
    if mode == "main":
        label = f"main at {commit_full[:7]}"
    else:
        label = f"preview of branch {branch} at {commit_full[:7]}" + (" with uncommitted changes" if SOURCE["dirty"] else "") + " — not main"
    return {"mode": mode, "ref": "origin/main" if mode == "main" else branch, "commit": commit_full[:7], "commit_full": commit_full, "dirty": SOURCE["dirty"], "label": label}


def _check_summary(c: dict[str, Any]) -> str:
    d = c.get("detail") or {}
    if c["id"] == "counts":
        return f"{d.get('entries')} entries · " + " · ".join(f"{v} {k}" for k, v in (d.get("build") or {}).items())
    if c["id"] == "pins":
        return f"{d.get('pins')} pins checked" + (f", {len(d.get('failures') or [])} broken" if d.get("failures") else "")
    if c["id"] == "curves":
        if d.get("evaluator_now_present"):
            return "an evaluator now exists for " + ", ".join(d["evaluator_now_present"]) + " — draw it through the sampler"
        return f"{d.get('sampled')} drawn · {d.get('no_evaluator')} listed no evaluator · {d.get('declared')} declared"
    if c["id"] == "known_answers":
        return f"{d.get('reproduced')} of {d.get('run')} run reproduced · {d.get('not_run')} not run with a reason" + (f" · {len(d.get('failures') or [])} cells with failures" if d.get("failures") else "")
    if c["id"] == "source_ids":
        return "all resolve" if c["ok"] else f"{len(d.get('unresolved') or [])} unresolved in {', '.join(d.get('cells_affected') or [])}"
    if c["id"] == "twin_crosswalk":
        return f"{d.get('rows')} rows, {'equal to the pin' if c['ok'] else 'NOT equal to the pin'}"
    if c["id"] == "substation_budget":
        return f"{d.get('rows')} rows, {'equal to the pin' if c['ok'] else 'NOT equal to the pin'}" if d.get("available") else "Hazard's budget not found"
    if c["id"] == "source_links":
        return "every source linked or located" if c["ok"] else f"{len(d.get('neither') or [])} sources with neither, in {', '.join(d.get('cells_affected') or [])}"
    if c["id"] == "extracted_sources":
        return "every tier-table ID matched" if c["ok"] else f"{len(d.get('unmatched') or [])} unmatched in {', '.join(d.get('cells_affected') or [])}"
    if c["id"] == "plain_layer":
        return "captions and paragraphs complete" if c["ok"] else f"{len(d.get('missing') or [])} missing"
    if c["id"] == "occurrence":
        return f"{d.get('registers')} registers"
    if c["id"] == "twin_viewer":
        return f"{d.get('files')} files equal their manifest, twin {str(d.get('twin_commit'))[:7]}" if c["ok"] else (d.get("reason") or f"{len(d.get('mismatched') or [])} files differ")
    if c["id"] == "twin_crosswalks":
        return f"{len(d.get('types') or [])} asset types mapped" if c["ok"] else f"{len(d.get('errors') or [])} rows do not resolve"
    if c["id"] == "twin_coverage":
        return "every twin part mapped" if c["ok"] else f"{len(d.get('unmapped') or [])} type × hazard pairs leave parts unmapped"
    if c["id"] == "hazard_links":
        return "every Hazard file on its main" if c["ok"] else f"{len(d.get('off_main') or [])} Hazard paths not on Hazard's main ({d.get('hazard')})"
    if c["id"] == "faq":
        return f"{d.get('questions')} questions, every link resolves" if c["ok"] else f"{len(d.get('errors') or [])} problems"
    return "ok" if c["ok"] else "failed"


def _findings_for(entry_id: str, checks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out = []
    for c in checks:
        if c["ok"]:
            continue
        d = c.get("detail") or {}
        if c["id"] == "source_ids":
            mine = [u.split(": ", 1)[1] for u in d.get("unresolved", []) if u.startswith(entry_id + ":")]
            if mine:
                out.append({"check": c["id"], "severity": c["severity"], "items": mine, "sentence": f"{len(mine)} source ID reference{'s' if len(mine) != 1 else ''} in this cell do not resolve in its current source register."})
        if c["id"] == "known_answers":
            mine = [f for f in d.get("failures", []) if f["entry"] == entry_id]
            if mine:
                out.append({"check": c["id"], "severity": c["severity"], "items": mine[0]["failed"], "sentence": f"{len(mine[0]['failed'])} known answer{'s' if len(mine[0]['failed']) != 1 else ''} did not reproduce."})
        if c["id"] == "source_links":
            mine = [u.split(": ", 1)[1] for u in d.get("neither", []) if u.startswith(entry_id + ":")]
            if mine:
                out.append({"check": c["id"], "severity": c["severity"], "items": mine, "sentence": f"{len(mine)} source{'s' if len(mine) != 1 else ''} in this cell's register {'have' if len(mine) != 1 else 'has'} neither a link nor a locator."})
        if c["id"] == "extracted_sources":
            mine = [u.split(": ", 1)[1] for u in d.get("unmatched", []) if u.startswith(entry_id + ":")]
            if mine:
                out.append({"check": c["id"], "severity": c["severity"], "items": mine, "sentence": f"{len(mine)} source ID{'s' if len(mine) != 1 else ''} in this cell's tier table {'match' if len(mine) != 1 else 'matches'} no document in the workbook or dossier."})
    return out


def _versions(e: Entry) -> list[dict[str, Any]]:
    root = e.cell_root
    out = []
    if root and (root / "CHANGELOG.json").exists():
        for row in load_json(root / "CHANGELOG.json").get("entries", []):
            out.append({"pin": row.get("consumer_pin"), "model": row.get("semantic_damage_model_version"), "docs": row.get("documentation_revision"), "published_on": row.get("published_on"), "change_class": row.get("change_class"), "summary": row.get("summary"), "artifact_path": row.get("artifact_path"), "source": "CHANGELOG.json"})
    if root and (root / "VERSION_REGISTRY.md").exists() and not out:
        from .common import parse_markdown_table
        parsed = parse_markdown_table((root / "VERSION_REGISTRY.md").read_text(encoding="utf-8"))
        if parsed:
            cols, rows = parsed
            for r in rows:
                out.append({"columns": cols, "row": r, "source": "VERSION_REGISTRY.md"})
    return out


def _aria(c: dict[str, Any], e: Entry) -> str:
    """A tile's accessible name, in words like the tile (G16): no tier code."""
    bits = [c["title"], c["status"]]
    if e.data.get("not_covered"):
        bits.append("partial")
    if (c.get("plain") or {}).get("word"):
        bits.append(f"evidence: {c['plain']['word']}")
    occ = c["rail"]["evidence"]["occurrence"]["label"]
    bits.append("field reports not searched" if occ in ("not searched", "no register") else f"field reports: {occ}")
    return ", ".join(bits)


def _dump(path, obj) -> str:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=1, ensure_ascii=False, default=str) + "\n", encoding="utf-8")
    return sha256(path)


def _write_all(manifest, cells, curves, assets, occurrence, citations, receipt, twin, sub_budget=None, sub_xwalk=None, coverage=None, faq=None) -> None:
    if OUT.exists():
        for child in OUT.iterdir():
            if child.name in ("README.md", ".gitkeep", "twin"):  # twin/ is an input: the twin export (scripts/dashboard/export_twin.mjs)
                continue
            shutil.rmtree(child) if child.is_dir() else child.unlink()
    written: dict[str, str] = {}
    written["manifest.json"] = _dump(OUT / "manifest.json", manifest)
    for eid, c in cells.items():
        written[f"cells/{eid}.json"] = _dump(OUT / "cells" / f"{eid}.json", c)
    for key, c in curves.items():
        written[f"curves/{key}.json"] = _dump(OUT / "curves" / f"{key}.json", c)  # curves/<entry_id>/<curve_id>@<version>.json
    for slug, a in assets.items():
        written[f"assets/{slug}.json"] = _dump(OUT / "assets" / f"{slug}.json", a)
    for (aslug, hslug), o in occurrence.items():
        written[f"occurrence/{aslug}/{hslug}.json"] = _dump(OUT / "occurrence" / aslug / f"{hslug}.json", o)
    written["citations.json"] = _dump(OUT / "citations.json", {"schema": "damage_dashboard_citations.v0", "cells": citations})
    for slug, cov in (coverage or {}).items():
        written[f"coverage/{slug}.json"] = _dump(OUT / "coverage" / f"{slug}.json", {"schema": "damage_dashboard_coverage.v1", **cov})
    if faq is not None:
        written["faq.json"] = _dump(OUT / "faq.json", {k: v for k, v in faq.items() if k != "errors"} | {"errors": faq["errors"]})
    if twin.get("available"):
        (OUT / "twin_crosswalk.csv").write_text(twin["text"], encoding="utf-8")
        written["twin_crosswalk.csv"] = sha256(OUT / "twin_crosswalk.csv")
    for name, blk in (("substation_reference_budget.csv", sub_budget), ("substation_twin_crosswalk.csv", sub_xwalk)):
        if blk and blk.get("available") and blk.get("text"):
            (OUT / name).write_text(blk["text"], encoding="utf-8")
            written[name] = sha256(OUT / name)
    receipt["files"] = written
    _dump(OUT / "receipt.json", receipt)
    n_fail = sum(1 for c in receipt["checks"] if not c["ok"])
    print(f"wrote {len(written) + 1} files under {rel(OUT)} · commit {manifest['commit']} · {len(receipt['checks']) - n_fail} of {len(receipt['checks'])} checks pass")
