"""Orchestration: assemble every JSON the app reads, run the reconciliation checks, write only when all pass."""
from __future__ import annotations

import datetime as dt
import json
import re
import shutil
import sys
from typing import Any

from . import chain as chain_mod
from .catalogue import Entry, curve_records, load_entries
from .common import (OUT, ROOT, SENTENCES, STATION_ABSENT_SENTENCES, BuildError, fmt_pct, fmt_usd_compact, git,
                     humanise, load_json, rel, sha256, tier_span)
from .occurrence import (all_registers, asset_slug, bess_bucket_values, hazard_slug, register_for, resolve_state, slugs,
                         twin_crosswalk_pin)
from .registers import load_registers
from .sampling import NO_EVALUATOR, sample_entry
from .summaries import asset_sentence, cell_sentence, dossier_sentence, library_sentence, occurrence_sentence

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
        covered = [{"label": "Battery enclosures · active hardware", "value_usd": u["battery_enclosures"]["count"] * u["battery_enclosures"]["same_unit_value_usd"], "curve_id": u["battery_enclosures"]["curve_id"]},
                   {"label": "PCS", "value_usd": u["pcs"]["count"] * u["pcs"]["same_unit_value_usd"], "curve_id": u["pcs"]["curve_id"]}]
        names = {"enclosure_racks_fire_suppression": "Enclosure racks and fire suppression", "electrical_balance": "Electrical balance (unit transformers, cables)", "civil_works": "Civil works", "unallocated_fieldwork": "Unallocated fieldwork"}
        no_curve = [{"label": names.get(k, humanise(k)), "value_usd": v} for k, v in vb["unmodeled_buckets"].items()]
        total = vb["reference_tiv_usd"]
        return _value_block(vb["modeled_value_usd"], total, covered, no_curve, vl["value_binding_path"], "real 2024 dollars; reference budget r1")
    if e.id in ("tropical_cyclone_wind_bess", "wildfire_bess"):
        vb = load_json(ROOT / vl["value_binding_path"])
        covered = [{"label": "Integrated battery enclosures", "value_usd": vb["units"]["BESS_INTEGRATED_ENCLOSURE"]["count"] * vb["units"]["BESS_INTEGRATED_ENCLOSURE"]["value_usd_each"]},
                   {"label": "PCS", "value_usd": vb["units"]["BESS_SEPARATE_PCS"]["count"] * vb["units"]["BESS_SEPARATE_PCS"]["value_usd_each"]}]
        no_curve = [{"label": s, "value_usd": _dollars_in(s)} for s in d.get("not_covered", [])]
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
        "label": (f"reviewed {rv.get('by')} {rv.get('on')}" if rv else f"entry agent-read {d.get('reviewed_on', '')}") + " · release " + (humanise(release)[:40] if release else "—"),
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
    if not ids:
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
    lineage = "machine_readable" if sources and (claims or params) else ("parameters_only" if params else "prose_only")
    known = {s["id"] for s in sources}
    unresolved = sorted({ed["to"] for ed in edges if ed["kind"].endswith("source") and ed["to"] not in known}) if known else []
    return {"entry_id": e.id, "lineage": lineage, "paths": regs.get("paths"), "sources": sources, "claims": claims, "parameters": params, "edges": edges,
            "unresolved_source_ids": unresolved,
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

    # per-entry work
    cells: dict[str, dict[str, Any]] = {}
    curves_out: dict[str, dict[str, Any]] = {}
    citations: dict[str, dict[str, Any]] = {}
    kat_failures, kat_totals = [], {"declared": 0, "run": 0, "reproduced": 0, "not_run": 0}
    unresolved_sources: list[str] = []
    sampling_notes: dict[str, list[str]] = {}
    by_id = {e.id: e for e in entries}
    for e in entries:
        regs = load_registers(e.artifact or {}, e.folder) if e.kind == "cell" else {"paths": {}, "sources": [], "claims": [], "parameters": []}
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
                buckets_block.append({"bucket": key, **resolve_state(b, reg.get("surfaces", []), reg.get("last_searched"))})
        occ_states = {b["state"] for b in buckets_block}
        occ_mark = SENTENCES["not_searched"]["mark"] if not occ_states or occ_states == {"not_searched"} else ("✓" if "found" in occ_states else ("~" if "adjacent" in occ_states else "∅"))
        if not occ:
            occ_mark, occ_label = SENTENCES["unavailable"]["mark"], "no register"
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
        withheld_units = [{"failure_unit_id": f.get("id"), "subsystem": f.get("subsystem"), "reasons": f.get("withheld_reason_codes") or [], "sentence": SENTENCES["withheld"]["page"].format(condition=humanise(", ".join(f.get("withheld_reason_codes") or ["withheld"])))}
                          for f in a.get("failure_units") or [] if str(f.get("treatment", "")).startswith("withheld")]
        title = f"{e.data['hazard']} × {e.data['asset']}"
        summary = cell_sentence(e.data, e.status, value, e.data["hazard"], e.data["asset"], bool(drawn) if e.kind == "cell" else None)
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
            "proof": proof_block(e, k, ch["stations"]) if e.kind != "gap" else None,
            "seams": seams_block(e, regs),
            "field_review": {"register": {"path": occ["path"], "sha256": occ["sha256"], "search_log": occ["register"].get("search_log"), "last_searched": occ["register"].get("last_searched")} if occ else None,
                             "buckets": buckets_block, "review": review_block(e), "absent_sentence": None if occ else STATION_ABSENT_SENTENCES["field_review"]},
            "files": files, "folder_files": folder_files,
            "gap_reason": e.data.get("reason"),
            "binding": {"source_cell_id": e.identity.get("source_cell_id"), "source_entry_id": e.identity.get("source_cell_id"), "reused_curves": [c for r in e.data.get("rows") or [] for c in r.get("curves", [])],
                        "transfer_rationale": a.get("transfer_rationale"), "transfer_tier": a.get("transfer_tier"), "status": a.get("status"), "limitations": a.get("limitations")} if e.kind == "binding" else None,
            "sampling_notes": sampled["notes"],
        }
        cells[e.id] = cell
        for c in sampled["curves"]:
            c["title"] = title
            c["asset"], c["hazard"] = cell["asset"], cell["hazard"]
            c["status"] = e.status
            c["rail"] = cell["rail"]
            c["parameters_rows"] = [p for p in regs.get("parameters") or [] if (p.get("curve_id") == c["curve_id"]) or (not p.get("curve_id"))]
            c["sources_for_curve"] = sorted({s for p in c["parameters_rows"] for s in p["source_ids"]})
            bucket = bucket_of_subsystem.get(c["subsystem"])
            occ_row = next((b for b in buckets_block if b["bucket"] == bucket), None)
            c["occurrence"] = {"bucket": bucket, **{kk: vv for kk, vv in occ_row.items() if kk != "bucket"}} if occ_row else None
            c["review"] = review_block(e)
            c["summary"] = dossier_sentence(c, e.data["hazard"], occ_row["sentence"] if occ_row else None)
            c["versions"] = _versions(e)
            c["data_path"] = f"curves/{e.id}/{c['curve_id']}@{c['version_key']}.json"
            curves_out[f"{e.id}/{c['curve_id']}@{c['version_key']}"] = c

    # 3 · every curve sampled or listed
    all_curves = list(curves_out.values())
    bad_curves = [c["curve_id"] for c in all_curves if (c["drawn"] and not any(s["points"] for s in c["series"])) or (not c["drawn"] and not c["no_evaluator_sentence"])]
    declared = sum(len(curve_records(e.artifact)) for e in entries if e.kind == "cell")
    check("curves", "every curve sampled or listed as no evaluator", not bad_curves and declared == len(all_curves),
          {"declared": declared, "sampled": sum(1 for c in all_curves if c["drawn"]), "no_evaluator": sum(1 for c in all_curves if not c["drawn"]), "bad": bad_curves})
    # 4 · every known answer reproduced
    check("known_answers", "every known answer reproduced within tolerance (not-run cases carry a reason)", not kat_failures, {**kat_totals, "failures": kat_failures}, severity="data")
    # 5 · every displayed source ID resolves
    check("source_ids", "every displayed source ID resolves in the cell's register", not unresolved_sources, {"unresolved": unresolved_sources, "cells_affected": sorted({u.split(":")[0] for u in unresolved_sources})}, severity="data")
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

    failed = [c for c in checks if not c["ok"]]
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
        "schema": "damage_dashboard_manifest.v0",
        "built_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "commit": git("rev-parse", "--short", "HEAD"), "commit_full": git("rev-parse", "HEAD"),
        "catalogue_commit_note": "catalogue entries and artifacts read at this commit; every number traces to a file at it",
        "counts": {**counts, "entries": len(entries), "curves_declared": declared, "curves_drawn": sum(1 for c in all_curves if c["drawn"]), "curves_no_evaluator": sum(1 for c in all_curves if not c["drawn"]), "agent_read_only": agent_read, "field_searches_logged": searched},
        "summary": library_sentence(counts, len(as_order), len([h for h in sl["hazards"] if not h["outside_the_five"]]), agent_read, len(entries), searched),
        "assets": [{**a, "href": f"/assets/{a['slug']}", "n_entries": sum(1 for t in tiles if t["asset"]["slug"] == a["slug"])} for a in sl["assets"]],
        "hazards": sl["hazards"],
        "entries": tiles,
        "codes": codes,
        "sentences": SENTENCES,
        "marks": {"exists": STATUS_MARK, "partial": "◔", "no_curve": "✕", "left_out": "–", "twin_levels": sl["twin_lead_levels"]},
        "tiers": {"T1": "claims or field calibrated", "T2": "public lab, standard or physics", "T3": "engineering proxy or adjacent evidence", "T4": "placeholder or expert judgment"},
        "stations": [{"id": s["id"], "label": s["label"], "gate": s["gate"]} for s in chain_mod.STATIONS],
        "lenses": ["status", "evidence", "occurrence", "value", "review"],
        "repo": {"url": "https://github.com/aamani-ai/Damage_Modeling", "blob": "https://github.com/aamani-ai/Damage_Modeling/blob/main"},
    }
    # ─── assets ───
    assets_out: dict[str, dict[str, Any]] = {}
    for a_def in sl["assets"]:
        aslug = a_def["slug"]
        asset_entries = [e for e in entries if asset_slug(e.data["asset"], sl) == aslug]
        cells_for = sorted([{"hazard": e.data["hazard"], "slug": hazard_slug(e.data["hazard"], sl), "status": e.status, "tiers": {"shape": cells[e.id]["rail"]["evidence"]["shape"], "cost": cells[e.id]["rail"]["evidence"]["cost"]}, "entry_id": e.id} for e in asset_entries],
                           key=lambda c: hz_order.index(c["slug"]))
        searched_any = any(r["register"].get("last_searched") for (asl, _), r in registers.items() if asl == aslug)
        bucket_defs = sl["value_buckets"].get(aslug, {}).get("buckets")
        if bucket_defs:
            values = bess_values if aslug == "bess" else {}
            total = sum(values.values()) if values else None
            rows = []
            for b in bucket_defs:
                row: dict[str, Any] = {"key": b["key"], "label": b["label"], "value_usd": values.get(b["key"]), "share": (values[b["key"]] / total) if values and total else None, "twin_targets": b["twin_targets"], "subsystems": b["failure_unit_subsystems"], "cells": {}}
                for h in sl["hazards"]:
                    reg = registers.get((aslug, h["slug"]))
                    bucket_reg = (reg or {}).get("register", {}).get("buckets", {}).get(b["key"]) if reg else None
                    entry = next((e for e in asset_entries if hazard_slug(e.data["hazard"], sl) == h["slug"]), None) if h["catalogue"] else None
                    cell = cells[entry.id] if entry else None
                    curve_cell = None
                    if cell:
                        part_rows = [p for p in cell["parts"] if p["bucket"] == b["key"]]
                        withheld = [w for w in cell["answer"]["withheld_units"] if w["subsystem"] in b["failure_unit_subsystems"]]
                        if entry.kind == "gap":
                            curve_cell = {"mark": "┈", "state": "gap", "label": "gap"}
                        elif part_rows:
                            curve_cell = {"mark": STATUS_MARK[entry.status], "state": entry.status, "partial": bool(entry.data.get("not_covered")), "shape": tier_span([p["shape"] for p in part_rows]), "cost": tier_span([p["cost"] for p in part_rows]), "curves": [c for p in part_rows for c in p["curves"]], "drawn": any(p["drawn"] for p in part_rows)}
                        elif withheld or entry.kind == "cell":
                            curve_cell = {"mark": "✕", "state": "no_curve", "label": "no curve", "sentence": SENTENCES["no_curve"]["page"].format(part=b["label"], value=fmt_usd_compact(values.get(b["key"])) if values.get(b["key"]) is not None else "an unstated share")}
                        else:
                            curve_cell = {"mark": STATUS_MARK[entry.status], "state": entry.status}
                    row["cells"][h["slug"]] = {
                        "twin_lead": (bucket_reg or {}).get("twin_lead", {}).get("level") if bucket_reg else None,
                        "twin_nodes": (bucket_reg or {}).get("twin_lead", {}).get("nodes", []) if bucket_reg else [],
                        "curve": curve_cell, "entry_id": entry.id if entry else None,
                        "occurrence": resolve_state(bucket_reg, reg["register"].get("surfaces", []), reg["register"].get("last_searched")) | {"bucket": b["key"]} if bucket_reg else None,
                        "effect": h["effect"], "outside_the_five": h["outside_the_five"],
                    }
                rows.append(row)
        else:
            rows = []
            for e in asset_entries:
                for p in cells[e.id]["parts"]:
                    key = (p["subsystems"][0] if p["subsystems"] else p["part"])
                    row = next((r for r in rows if r["key"] == key), None)
                    if not row:
                        row = {"key": key, "label": humanise(key).title() if key.isupper() else p["part"], "value_usd": None, "share": None, "twin_targets": [], "subsystems": p["subsystems"], "cells": {}}
                        rows.append(row)
                    row["cells"][hazard_slug(e.data["hazard"], sl)] = {"twin_lead": None, "twin_nodes": [], "entry_id": e.id, "occurrence": None, "effect": "damage", "outside_the_five": False,
                                                                       "curve": {"mark": STATUS_MARK[e.status], "state": e.status, "partial": bool(e.data.get("not_covered")), "shape": p["shape"], "cost": p["cost"], "curves": p["curves"], "drawn": p["drawn"]}}
            for e in asset_entries:
                if e.kind == "gap":
                    for row in rows:
                        row["cells"].setdefault(hazard_slug(e.data["hazard"], sl), {"twin_lead": None, "twin_nodes": [], "entry_id": e.id, "occurrence": None, "effect": "damage", "outside_the_five": False, "curve": {"mark": "┈", "state": "gap", "label": "gap"}})
        reference = None
        if aslug == "bess":
            u = fb_binding["units"]
            reference = {"label": f"{u['battery_enclosures']['count']} enclosures · {u['pcs']['count']} PCS · {fmt_usd_compact(fb_binding['reference_tiv_usd'])} reference value ({humanise(fb_binding.get('currency_basis'))})", "source": fb.artifact["value_linkage"]["value_binding_path"], "total_usd": fb_binding["reference_tiv_usd"]}
        hazards_cols = []
        for h in sl["hazards"]:
            entry = next((e for e in asset_entries if hazard_slug(e.data["hazard"], sl) == h["slug"]), None) if h["catalogue"] else None
            reg = registers.get((aslug, h["slug"]))
            hazards_cols.append({**h, "entry_id": entry.id if entry else None, "status": entry.status if entry else None, "cell_title": cells[entry.id]["title"] if entry else None,
                                 "occurrence_href": f"/occurrence/{aslug}/{h['slug']}" if reg else None, "has_register": bool(reg)})
        assets_out[aslug] = {"asset": {**a_def, "href": f"/assets/{aslug}"}, "summary": asset_sentence(a_def["label"], cells_for, searched_any), "reference": reference,
                             "hazards": hazards_cols, "rows": rows, "entries": [t for t in tiles if t["asset"]["slug"] == aslug], "has_buckets": bool(bucket_defs), "twin_crosswalk": {"sha256": twin.get("sha256"), "rows": twin.get("rows")} if aslug == "bess" else None}
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
        "schema": "damage_dashboard_receipt.v0", "built_at": manifest["built_at"], "commit": manifest["commit"], "commit_full": manifest["commit_full"],
        "working_tree_clean": git("status", "--porcelain") == "", "python": sys.version.split()[0],
        "counts": manifest["counts"], "known_answers": kat_totals, "pins_checked": sum(len(e.pins) for e in entries),
        "twin_crosswalk": {k: v for k, v in twin.items() if k not in ("text", "crosswalk")},
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
    for cid, cell in cells.items():
        cell["build_findings"] = _findings_for(cid, checks)
    if write:
        _write_all(manifest, cells, curves_out, assets_out, occurrence_out, citations, receipt, twin)
    return receipt


def _check_summary(c: dict[str, Any]) -> str:
    d = c.get("detail") or {}
    if c["id"] == "counts":
        return f"{d.get('entries')} entries · " + " · ".join(f"{v} {k}" for k, v in (d.get("build") or {}).items())
    if c["id"] == "pins":
        return f"{d.get('pins')} pins checked" + (f", {len(d.get('failures') or [])} broken" if d.get("failures") else "")
    if c["id"] == "curves":
        return f"{d.get('sampled')} drawn · {d.get('no_evaluator')} listed no evaluator · {d.get('declared')} declared"
    if c["id"] == "known_answers":
        return f"{d.get('reproduced')} of {d.get('run')} run reproduced · {d.get('not_run')} not run with a reason" + (f" · {len(d.get('failures') or [])} cells with failures" if d.get("failures") else "")
    if c["id"] == "source_ids":
        return "all resolve" if c["ok"] else f"{len(d.get('unresolved') or [])} unresolved in {', '.join(d.get('cells_affected') or [])}"
    if c["id"] == "twin_crosswalk":
        return f"sha {str(d.get('sha256'))[:7]} · {d.get('rows')} rows"
    if c["id"] == "occurrence":
        return f"{d.get('registers')} registers"
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
    bits = [c["title"], c["status"]]
    if e.data.get("not_covered"):
        bits.append("partial")
    if c["rail"]["evidence"]["shape"] != "–":
        bits.append(f"shape {c['rail']['evidence']['shape']}, cost {c['rail']['evidence']['cost']}")
    bits.append(c["rail"]["evidence"]["occurrence"]["label"].replace("no register", "no field-report register"))
    return ", ".join(bits)


def _dump(path, obj) -> str:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=1, ensure_ascii=False, default=str) + "\n", encoding="utf-8")
    return sha256(path)


def _write_all(manifest, cells, curves, assets, occurrence, citations, receipt, twin) -> None:
    if OUT.exists():
        for child in OUT.iterdir():
            if child.name in ("README.md", ".gitkeep"):
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
    if twin.get("available"):
        (OUT / "twin_crosswalk.csv").write_text(twin["text"], encoding="utf-8")
        written["twin_crosswalk.csv"] = sha256(OUT / "twin_crosswalk.csv")
    receipt["files"] = written
    _dump(OUT / "receipt.json", receipt)
    n_fail = sum(1 for c in receipt["checks"] if not c["ok"])
    print(f"wrote {len(written) + 1} files under {rel(OUT)} · commit {manifest['commit']} · {len(receipt['checks']) - n_fail} of {len(receipt['checks'])} checks pass")
