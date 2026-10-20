"""The derivation chain (discussion 07): ten stations, four presence states, gates A–E, a generation tag.

A station is `artifact` only with a file behind it; `prose` only when a dossier heading or a workbook sheet name
matches; `absent` when the cell has a dossier or workbook the detector read and nothing matched;
`not_yet_detected` when there was nothing to read; `not_applicable` for a binding or a gap entry.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from .catalogue import Entry
from .common import INDEX, ROOT, STATION_ABSENT_SENTENCES, rel, sha256

try:
    import openpyxl  # type: ignore
except ImportError:  # pragma: no cover — the venv has it; a bare python3 may not
    openpyxl = None

# id, label, gate, file-name substrings (lower-case), dossier heading regex, workbook sheet regex
STATIONS: list[dict[str, Any]] = [
    {"id": "scope", "label": "Scope", "gate": "A",
     "files": ["readme", "scope", "change_classification", "release_decision"],
     "headings": r"\bscope\b|why this dossier|what is being derived|derivation thesis|decision and evidence grade|why flood|modeling decision",
     "sheets": r"scope|cell_snapshot|readme"},
    {"id": "units", "label": "Units", "gate": "A · B2",
     "files": ["failure_unit", "coverage_note", "coverage"],
     "headings": r"failure[- ]unit|coverage|decompos",
     "sheets": r"failure_units|coverage"},
    {"id": "axis_form", "label": "Axis · form", "gate": "C",
     "files": ["curve_form_decision", "form_comparison", "x_axis", "axis_decision"],
     "headings": r"x-axis|x axis|axis decision|curve[- ]form|form decision|hazard axis|curve architecture",
     "sheets": r"x_axis|axis_bridge|architecture_axes|curve_form|state_definitions|axis"},
    {"id": "evidence", "label": "Evidence", "gate": "B",
     "files": ["source_register", "sources.csv", "claim_parameter_register", "claims.csv", "parameter_tier",
               "parameter_register", "pressure_test", "legacy_audit", "search_log", "source_verification", "evidence"],
     "headings": r"evidence|sources used|parameter set|evidence-to-parameter|tier|what exactly is derived|anchors",
     "sheets": r"evidence|sources|claims|parameter_tiers|^tiers$|pressure_test|legacy_audit|source_register|claim_register|assumption"},
    {"id": "value", "label": "Value", "gate": "B2",
     "files": ["value_crosswalk", "value_binding", "value_linkage", "profile_binding", "value_audit"],
     "headings": r"\bvalue\b",
     "sheets": r"value"},
    {"id": "audit", "label": "Audit", "gate": "B2",
     "files": ["seven_step", "site_condition", "site_adapter"],
     "headings": r"seven[- ]step|adjustment rules|selectors?,? conditioners|selector / conditioner|site controls|site adapter|site-condition",
     "sheets": r"seven_steps|site_adapter|adjustment_rules|conditioners_selectors|selectors_conditioners|site_inputs|site_condition"},
    {"id": "artifact", "label": "Artifact", "gate": "C",
     "files": ["curve_artifact.json", "binding.json", "derivation_dossier", "derivation.md", "metadata_spec", "metadata.md", ".xlsx"],
     "headings": None, "sheets": r"curve_records|curve records|curves|curve_data"},
    {"id": "capability", "label": "Capability", "gate": "D",
     "files": ["capability"],
     "headings": r"capability declaration|consumer contract|damage-code output|runtime contract",
     "sheets": r"damage_code_interface|emit_metrics|cap_binding"},
    {"id": "proof", "label": "Proof · release", "gate": "E",
     "files": ["known_answer", "known_answers.json", "validation", "release", "manifest.json", "changelog", "version_registry", "old_vs_new", "kats"],
     "headings": r"qa status|validation|reviewer checklist|version call",
     "sheets": r"^qa|qa_checks|kats|known_answer|old_vs_new"},
    {"id": "field_review", "label": "Field · review", "gate": "—",
     "files": [], "headings": None, "sheets": None},
]
CORE = ["evidence", "value", "audit", "artifact", "capability", "proof"]
# the basics set names the stations by its own step words (standard 02 §7: QUESTION → EVIDENCE → GRAIN → AXIS → FORM → ADJUSTMENTS → EMIT → SHIP)
BASICS_EXTRA = {"scope": r"|modeling question|stage 0", "units": r"|grain|stage 2", "axis_form": r"|stage 3|stage 4|\baxis\b|curve form",
                "evidence": r"|stage 1", "audit": r"|adjustments|stage 5", "capability": r"|\bemit\b|stage 6", "proof": r"|\bship\b|stage 7"}
SKILL_NAME = re.compile(r"__model_v\d+_\d+__docs_r\d+")


def _file_entry(path: Path) -> dict[str, Any]:
    return {"path": rel(path), "sha256": sha256(path) if path.is_file() else None}


def _folder_files(entry: Entry) -> list[Path]:
    files: list[Path] = []
    if entry.folder and entry.folder.is_dir():
        files += sorted(p for p in entry.folder.iterdir() if p.is_file())
    root = entry.cell_root
    if root:
        files += sorted(p for p in root.iterdir() if p.is_file())
        for sub in ("basics", "previews"):
            d = root / sub
            if d.is_dir():
                files += sorted(p for p in d.iterdir() if p.is_file())
    return files


def _dossier_headings(entry: Entry) -> tuple[Path | None, list[str]]:
    a = entry.artifact or {}
    cand = a.get("source_dossier")
    path = ROOT / cand if cand else None
    if not (path and path.exists()) and entry.folder:
        path = next((p for p in sorted(entry.folder.glob("*derivation*.md"))), None)
    if not (path and path.exists()):
        return None, []
    heads = [ln.lstrip("#").strip() for ln in path.read_text(encoding="utf-8").splitlines() if ln.startswith("#")]
    return path, heads


def _basics_headings(entry: Entry) -> tuple[Path | None, list[str]]:
    """The cell-owned basics set (standard 02 §7) walks QUESTION → … → SHIP; its headings are prose evidence too."""
    root = entry.cell_root
    path = root / "basics" / "HOW_THE_MODEL_IS_BUILT.md" if root else None
    if not (path and path.exists()):
        return None, []
    heads = [ln.lstrip("#").strip() for ln in path.read_text(encoding="utf-8").splitlines() if ln.startswith("#")]
    return path, heads


def _workbook_sheets(entry: Entry) -> tuple[Path | None, list[str]]:
    if not entry.folder:
        return None, []
    books = sorted(entry.folder.glob("*.xlsx"))
    if not books or openpyxl is None:
        return None, []
    wb_path = books[-1]
    try:
        wb = openpyxl.load_workbook(wb_path, read_only=True)
        return wb_path, list(wb.sheetnames)
    except Exception:  # noqa: BLE001 — an unreadable workbook is "nothing to read", not a crash
        return wb_path, []


def generation(entry: Entry, files: list[Path], registers: dict[str, Any]) -> str:
    if entry.kind == "gap":
        return "gap"
    if entry.kind == "binding":
        return "binding"
    names = [p.name for p in files]
    if any(SKILL_NAME.search(n) for n in names):
        return "skill" if (registers.get("sources") and registers.get("claims")) else "prose"
    return "plain"


def detect(entry: Entry, registers: dict[str, Any], kat_summary: dict[str, Any], occurrence: dict[str, Any] | None,
           value_facts: dict[str, Any] | None, index_sha_ok: bool) -> dict[str, Any]:
    files = _folder_files(entry)
    lower = {p: p.name.lower() for p in files}
    dossier_path, headings = _dossier_headings(entry)
    basics_path, basics_heads = _basics_headings(entry)
    wb_path, sheets = _workbook_sheets(entry)
    a = entry.artifact or {}
    stations: list[dict[str, Any]] = []
    for st in STATIONS:
        sid = st["id"]
        hit_files = [p for p, n in lower.items() if any(tok in n for tok in st["files"])]
        if sid == "artifact" and entry.artifact_path:
            hit_files = sorted(set(hit_files) | {ROOT / entry.artifact_path})
        if sid == "units" and entry.artifact_path and any(f.get("treatment") for f in a.get("failure_units") or []):
            hit_files = sorted(set(hit_files) | {ROOT / entry.artifact_path})  # the failure-unit table with roles lives in the artifact JSON
        if sid == "proof" and entry.index_row:
            pass  # the index pin is added below as its own file
        if sid == "field_review":
            hit_files = []
        state, evidence = None, []
        if entry.kind == "gap":
            state = "not_applicable"
        elif entry.kind == "binding" and sid in ("units", "axis_form", "evidence", "capability") and not hit_files:
            state = "not_applicable"
        elif hit_files:
            state = "artifact"
        else:
            matched_heads = [h for h in headings if st["headings"] and re.search(st["headings"], h, re.I)]
            matched_basics = [h for h in basics_heads if st["headings"] and re.search(st["headings"] + BASICS_EXTRA.get(sid, ""), h, re.I)]
            matched_sheets = [s for s in sheets if st["sheets"] and re.search(st["sheets"], s, re.I)]
            if matched_heads or matched_sheets or matched_basics:
                state = "prose"
                if matched_heads:
                    evidence.append({"kind": "dossier_headings", "file": _file_entry(dossier_path), "matched": matched_heads[:6]})
                if matched_basics:
                    evidence.append({"kind": "basics_headings", "file": _file_entry(basics_path), "matched": matched_basics[:6]})
                if matched_sheets:
                    evidence.append({"kind": "workbook_sheets", "file": _file_entry(wb_path), "matched": matched_sheets[:6]})
            elif headings or sheets or basics_heads:
                state = "absent"
            else:
                state = "not_yet_detected"
        if sid == "field_review":
            if occurrence:
                state = "artifact"
                hit_files = [ROOT / occurrence["path"]]
            elif entry.kind in ("gap", "binding"):
                state = "not_applicable" if entry.kind == "binding" else "absent"
            else:
                state = "absent"
        file_entries = [_file_entry(p) for p in hit_files]
        if sid == "proof" and entry.index_row:
            file_entries.append({"path": rel(INDEX), "sha256": sha256(INDEX), "note": "artifact index pin",
                                 "pinned_sha256": entry.index_row.get("sha256"), "pin_ok": index_sha_ok})
        if state == "artifact" and not file_entries:
            raise AssertionError(f"{entry.id}: station {sid} marked artifact without a file")
        stations.append({
            "id": sid, "label": st["label"], "gate": st["gate"], "state": state,
            "files": file_entries, "evidence": evidence,
            "fact": _fact(sid, entry, a, registers, kat_summary, occurrence, value_facts, file_entries, state),
            "absent_sentence": STATION_ABSENT_SENTENCES[sid] if state == "absent" else None,
        })
    gen = generation(entry, files, registers)
    return {
        "stations": stations,
        "generation": gen,
        "core_as_files": sum(1 for s in stations if s["id"] in CORE and s["state"] == "artifact"),
        "core_total": len(CORE),
        "dossier": _file_entry(dossier_path) if dossier_path else None,
        "basics": _file_entry(basics_path) if basics_path else None,
        "workbook": _file_entry(wb_path) if wb_path else None,
        "gates": gates(entry, a, registers, stations, kat_summary, index_sha_ok),
    }


def _fact(sid: str, e: Entry, a: dict[str, Any], regs: dict[str, Any], kats: dict[str, Any],
          occ: dict[str, Any] | None, value: dict[str, Any] | None, files: list[dict[str, Any]], state: str) -> str:
    d = e.data
    if e.kind == "gap":
        return {"scope": "gap entry", "field_review": "not searched" if occ else "no register"}.get(sid, "–")
    fus = a.get("failure_units") or []
    if sid == "scope":
        deferred = []
        for pw in a.get("pathways") or []:
            deferred += (pw.get("hazard_scope") or {}).get("deferred") or []
        deferred = deferred or (d.get("missing_mechanisms") or [])
        return f"{len(deferred)} deferred" if deferred else ("README" if files else "—")
    if sid == "units":
        withheld = sum(1 for f in fus if str(f.get("treatment", "")).startswith("withheld"))
        return f"{len(fus)} units" + (f" · {withheld} withheld" if withheld else "") if fus else ("source cell" if e.kind == "binding" else "—")
    if sid == "axis_form":
        forms = sorted({r.get("curve_form", "") for r in (a.get("curve_records") or []) + [r for pw in a.get("pathways") or [] for r in pw.get("curve_records") or []]})
        forms = [f.replace("_", " ") for f in forms if f]
        if any("binary" in str(r.get("x_axis", "")) for r in a.get("curve_records") or []):
            forms = ["binary state"] + [f for f in forms if f != "piecewise linear"] or forms
        return " · ".join(forms)[:40] if forms else "—"
    if sid == "evidence":
        n = len(regs.get("sources") or [])
        tiers = sorted({p["tier"] for p in regs.get("parameters") or [] if p.get("tier")})
        span = (tiers[0] if len(tiers) == 1 else f"{tiers[0]}–{tiers[-1][1]}") if tiers else ""
        return (f"{n} src · " if n else "") + (span or "no register")
    if sid == "value":
        if value and value.get("share_covered") is not None:
            return f"{value['share_covered'] * 100:.0f} % · {value['covered_label']}"
        return "crosswalk" if state == "artifact" else "—"
    if sid == "audit":
        return "7 steps" if state in ("artifact", "prose") else "no file · no prose"
    if sid == "artifact":
        ident = e.identity
        return f"{(ident.get('model') or '').replace('model ', '')} · {ident.get('docs') or ''}".strip(" ·") if ident.get("model") else ("binding" if e.kind == "binding" else "—")
    if sid == "capability":
        cap = a.get("capability_declaration") or {}
        ve = cap.get("vulnerability_emit") or {}
        pc = (cap.get("pathway_capabilities") or [{}])[0] if cap.get("pathway_capabilities") else {}
        dr = ve.get("failure_unit_scalar_dr") or pc.get("failure_unit_scalar_dr")
        eal = (cap.get("consumer_annual_metrics") or {}).get("eal") or (cap.get("consumer_annual_metrics") or {}).get("status_after_promotion")
        parts = []
        if dr:
            parts.append(f"DR {dr.replace('_', ' ')[:18]}")
        if eal:
            parts.append("EAL conditional" if "conditional" in str(eal) or "computable" in str(eal) else f"EAL {str(eal)[:12]}")
        return " · ".join(parts) if parts else ("declared" if state == "artifact" else "—")
    if sid == "proof":
        if kats.get("declared"):
            return f"{kats['reproduced']} of {kats['declared']} KAT" + (" reproduced" if kats["reproduced"] == kats["run"] else "")
        return "no KAT declared" if e.kind == "cell" else "validation" if files else "—"
    if sid == "field_review":
        read = d.get("reviewed_on", "")
        who = "agent-read" if str(d.get("read_by", "")).lower().startswith("agent") else "read"
        occ_state = "not searched"
        if occ:
            states = {b.get("state") for b in occ["register"].get("buckets", {}).values()}
            occ_state = "not searched" if states == {"not_searched"} else "mixed"
        return f"{occ_state} · {who} {read[5:] if read else ''}".strip()
    return "—"


def gates(e: Entry, a: dict[str, Any], regs: dict[str, Any], stations: list[dict[str, Any]],
          kats: dict[str, Any], index_sha_ok: bool) -> list[dict[str, Any]]:
    """The skill's review gates A–E (docs/extra/damage_curve_skill/00_governance/REVIEW_GATES.md), each item
    proven by a file fact where one exists, otherwise human; n/a where the item does not apply."""
    st = {s["id"]: s for s in stations}
    has = lambda sid: st[sid]["state"] in ("artifact", "prose")  # noqa: E731
    pathways = a.get("pathways") or []
    cap = a.get("capability_declaration") or {}
    cam = cap.get("consumer_annual_metrics") or {}
    ve = cap.get("vulnerability_emit") or {}
    pc = (cap.get("pathway_capabilities") or [{}])[0] if cap.get("pathway_capabilities") else {}
    withheld_units = [f for f in a.get("failure_units") or [] if str(f.get("treatment", "")).startswith("withheld")]
    is_cell = e.kind == "cell"
    params = regs.get("parameters") or []

    def item(text: str, status: str, basis: str | None = None) -> dict[str, Any]:
        return {"item": text, "status": status, "basis": basis}

    if e.kind == "gap":
        return [{"gate": g, "label": lab, "items": []} for g, lab in (("A", "scope"), ("B", "evidence"), ("B2", "seven-step, site and value"), ("C", "runtime contract"), ("D", "reportability"), ("E", "release"))]

    A = [
        item("hazard and asset are named", "proven" if a.get("cell_id") or e.kind == "binding" else "human", "cell_id in the artifact"),
        item("in-scope and out-of-scope mechanisms listed", "proven" if (e.data.get("out_of_scope") or any((pw.get("hazard_scope") or {}).get("deferred") for pw in pathways)) else "human", "hazard_scope.deferred or the entry's out_of_scope"),
        item("related hazards that should split are named", "human"),
        item("multi-pathway cells declare stable pathway IDs", "proven" if pathways and all(pw.get("pathway_id") for pw in pathways) else ("n/a" if is_cell and not pathways else "human"), "pathways[].pathway_id"),
        item("neighbouring or compound mechanisms have an include / defer / split decision", "human"),
        item("no downstream M4 metric is hidden in the damage cell", "proven" if cam.get("computation_owner") == "downstream_consumer" else "human", "consumer_annual_metrics.computation_owner"),
    ]
    B = [
        item("source register with stable IDs, locators, roles, tiers and decisions", "proven" if regs.get("sources") else ("n/a" if e.kind == "binding" else "human"), regs["paths"].get("sources")),
        item("load-bearing claims carry claim-level provenance", "proven" if regs.get("claims") else ("n/a" if e.kind == "binding" else "human"), regs["paths"].get("claims")),
        item("the chosen spine is explained", "human"),
        item("rejected or demoted sources are explained", "human"),
        item("parameter tier table populated", "proven" if params else ("n/a" if e.kind == "binding" else "human"), "parameter_tier_table"),
        item("T3/T4 update triggers listed", "proven" if params and all(p.get("update_trigger") for p in params if p.get("tier") in ("T3", "T4")) else ("n/a" if not params else "human"), "update_trigger per T3/T4 row"),
        item("legacy equations and tables reproduced where legacy material is used", "human"),
        item("proposed numbers pressure-tested at boundaries and on explicit denominators", "proven" if any("pressure_test" in f["path"].lower() for f in st["evidence"]["files"]) else "human", "PRESSURE_TEST file"),
        item("evidence, parameters and transfer limits resolved independently by pathway", "proven" if pathways and any(p.get("pathway_id") for p in params) else ("n/a" if not pathways else "human"), "pathway_id on tier rows"),
    ]
    B2 = [
        item("seven-step audit records a status and blocking seam for every step", "proven" if any("seven_step" in f["path"].lower() for f in st["audit"]["files"]) else "human", "SEVEN_STEP_AUDIT file"),
        item("row-level value crosswalk reconciles direct, mixed, support and excluded rows", "proven" if has("value") else "human", "value crosswalk or binding"),
        item("support and logistics are allocated once, not given an independent DR", "human"),
        item("site-conditioned hazards have a site adapter", "proven" if any("site" in f["path"].lower() for f in st["audit"]["files"]) else "human", "SITE_CONDITION_ADAPTER file"),
        item("fences, walls, barriers and bypass pathways receive no blanket credit", "human"),
        item("the adapter includes a double-counting matrix", "human"),
        item("unknown at-risk, exposure or mitigation states do not silently become full credit", "human"),
    ]
    C = [
        item("the JSON artifact is canonical", "proven" if a.get("canonical_runtime_artifact") is True else ("n/a" if e.kind == "binding" else "human"), "canonical_runtime_artifact"),
        item("workbooks are derivation or audit views, not the runtime", "n/a" if not any(f["path"].endswith(".xlsx") for f in st["artifact"]["files"]) else "human"),
        item("damage_code_id and model version are stable", "proven" if a.get("damage_code_id") and a.get("semantic_damage_model_version") else ("proven" if a.get("binding_id") else "human"), "damage_code_id · semantic_damage_model_version"),
        item("field names and aliases are explicit", "proven" if (a.get("hazard_axis") or {}).get("input_field") or any((pw.get("hazard_axis") or {}).get("preferred_input_field") for pw in pathways) else "human", "hazard_axis input field"),
        item("pathway_id is first-class in request, record, output, capability and KAT surfaces", "proven" if pathways and cap.get("pathway_capabilities") else ("n/a" if not pathways else "human"), "pathway_capabilities"),
        item("pathway-specific axes and bridges are explicit", "proven" if all((pw.get("hazard_axis") or {}).get("id") for pw in pathways) and pathways else ("n/a" if not pathways else "human"), "pathways[].hazard_axis.id"),
        item("the emit contract is distribution-ready", "proven" if a.get("emit_contract") else "human", "emit_contract"),
    ]
    D = [
        item("failure-unit DR support stated", "proven" if ve.get("failure_unit_scalar_dr") or pc.get("failure_unit_scalar_dr") else "human", "capability_declaration"),
        item("scenario loss support requires a value basis", "proven" if ve.get("scenario_loss_given_value_basis") or pc.get("scenario_loss_given_value_basis") else "human", "scenario_loss_given_value_basis"),
        item("scalar EAL requires downstream frequency, value basis and a cap-binding pass", "proven" if cam.get("eal") or cam.get("status_after_promotion") else "human", "consumer_annual_metrics"),
        item("PML / VaR / TVaR withheld unless spread exists", "proven" if cam.get("pml") or (ve.get("curve_intrinsic_spread") or pc.get("curve_intrinsic_spread")) else "human", "curve_intrinsic_spread"),
        item("a no-curve scaffold emits no numeric DR", "n/a"),
        item("unsupported pathway × failure-unit pairs withhold with a stable reason", "proven" if withheld_units and all(f.get("withheld_reason_codes") for f in withheld_units) else ("n/a" if not withheld_units else "human"), "withheld_reason_codes"),
    ]
    E = [
        item("registry, index, changelog and manifest updated", "proven" if e.index_row and any("changelog" in f["path"].lower() for f in st["proof"]["files"]) else ("n/a" if e.status == "proposal" else "human"), "artifact index row · CHANGELOG"),
        item("validation report produced", "proven" if any("validation" in f["path"].lower() for f in st["proof"]["files"]) else "human", "validation file"),
        item("old-vs-new and cross-pathway negative tests pass", "proven" if kats.get("negative_run") else "human", "negative contract tests run by the build"),
        item("consumer migration and the exact model / docs / schema / SHA pin verified", "proven" if index_sha_ok else ("n/a" if not e.index_row else "human"), "SHA equals the index pin"),
        item("package zip integrity checked", "n/a", "no portable package for repository-canonical artifacts"),
    ]
    return [{"gate": "A", "label": "scope", "items": A}, {"gate": "B", "label": "evidence", "items": B},
            {"gate": "B2", "label": "seven-step, site and value", "items": B2}, {"gate": "C", "label": "runtime contract", "items": C},
            {"gate": "D", "label": "reportability", "items": D}, {"gate": "E", "label": "release", "items": E}]


def seven_step_table(entry: Entry, stations: list[dict[str, Any]]) -> dict[str, Any] | None:
    """The seven-step outcome table as written — from the SEVEN_STEP_AUDIT file or the dossier section."""
    from .common import parse_markdown_table, section
    audit = next(s for s in stations if s["id"] == "audit")
    for f in audit["files"]:
        if "seven_step" in f["path"].lower():
            text = (ROOT / f["path"]).read_text(encoding="utf-8")
            body = section(text, r"audit outcome") or text
            parsed = parse_markdown_table(body)
            if parsed:
                return {"source": f["path"], "columns": parsed[0], "rows": parsed[1], "kind": "file"}
    for ev in audit["evidence"]:
        if ev["kind"] == "dossier_headings":
            text = (ROOT / ev["file"]["path"]).read_text(encoding="utf-8")
            body = section(text, r"seven[- ]step")
            if body:
                parsed = parse_markdown_table(body)
                if parsed:
                    return {"source": ev["file"]["path"], "columns": parsed[0], "rows": parsed[1], "kind": "dossier_section"}
    return None
