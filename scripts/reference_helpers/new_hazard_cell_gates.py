"""Gate checks (build brief 2026-11-16 §3) shared by the new-hazard real-estate proposals.

Checks the ten gates mechanically where a file can show them, and runs the cell's reference evaluator over its
known-answer tests. A pass here means the evidence for each gate is present and internally consistent; it does not
replace a reviewer's trace of the methodology files.

Used by validate_snow_load_real_estate_v0_1_package.py and validate_freeze_pipes_real_estate_v0_1_package.py.
"""
from __future__ import annotations

import csv
import importlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TIERS = {"T1_claims_or_field_calibrated", "T2_public_lab_standard_or_physics",
         "T3_engineering_proxy_or_adjacent_empirical", "T4_placeholder_or_expert_judgment"}


def _rows(p: Path) -> list[dict]:
    with open(p, newline="") as fh:
        return list(csv.DictReader(fh))


def check(cell_id: str, tag: str, evaluator_module: str, methodology_files: list[str], phrases: dict[str, list[str]]) -> int:
    cell = ROOT / "docs/cells" / cell_id
    prop = cell / "proposed"
    results: list[tuple[str, bool, str]] = []

    def gate(name, ok, note=""):
        results.append((name, bool(ok), note))

    # 1 search log
    log = prop / f"BOUNDED_EVIDENCE_SEARCH_LOG_{tag}.md"
    txt = log.read_text() if log.exists() else ""
    gate("1 bounded evidence search log", all(s in txt for s in ("## Claim boundary", "## Protocol", "## Query families",
                                                                 "## Inclusion and exclusion", "## Results and disposition")),
         str(log.relative_to(ROOT)))
    # 2 registers
    src = _rows(prop / f"SOURCE_REGISTER_{tag}.csv")
    clm = _rows(prop / f"CLAIM_PARAMETER_REGISTER_{tag}.csv")
    sids = {r["source_id"] for r in src}
    bad_claim_src = [c["claim_id"] for c in clm for s in c["source_ids"].split(";") if s and s not in sids]
    gate("2 source and claim registers", src and clm and not bad_claim_src and all(r["exact_locator"] for r in src),
         f"{len(src)} sources, {len(clm)} claims; unknown source refs: {bad_claim_src}")
    # 3 tier table
    tier = _rows(prop / f"PARAMETER_TIER_TABLE_{tag}.csv")
    bad_tier = [t["parameter"] for t in tier if t["tier"] not in TIERS]
    bad_tsrc = [t["parameter"] for t in tier for s in t["source_ids"].split(";") if s and s not in sids]
    counts = {k[:2]: sum(1 for t in tier if t["tier"] == k) for k in sorted(TIERS)}
    gate("3 parameter tier table", tier and not bad_tier and not bad_tsrc,
         f"{len(tier)} parameters {counts}; bad tiers {bad_tier}; unknown sources {bad_tsrc}")
    # 4 artifact, capability, KATs, evidence chain
    art = json.loads((prop / f"{tag}__curve_artifact.json").read_text())
    cap = json.loads((prop / f"{tag}__capability.json").read_text())
    recs = [r for p in art["pathways"] for r in p["curve_records"]]
    ref_ok = all(ref.split("#")[0] in sids for r in recs for ref in r["source_parameter_refs"])
    withheld_ok = all(u.get("withheld_reason_codes") for u in art["failure_units"] if u["treatment"] == "withheld")
    chain_ok = bool(recs) and art.get("value_linkage", {}).get("curve_denominator")
    sys.path.insert(0, str(ROOT / "scripts/reference_helpers"))
    ev = importlib.import_module(evaluator_module)
    fails = ev.run_kats()
    gate("4 artifact + capability + KATs + evidence chain",
         cap == art["capability_declaration"] and ref_ok and withheld_ok and chain_ok and fails == 0,
         f"{len(recs)} records; capability identical {cap == art['capability_declaration']}; refs resolve {ref_ok}; "
         f"withheld coded {withheld_ok}; KAT failures {fails}")
    # 5 dossier with assumption register, decision log
    dossier = (prop / f"{cell_id}_curve_derivation_dossier__model_v0_1__docs_r1.md").read_text()
    dlog = prop / f"DECISION_LOG_{tag}.md"
    gate("5 dossier + assumption register + decision log", "Assumption register" in dossier and dlog.exists(), "")
    # 6 methodology per curve
    mfiles = [cell / "methodology" / f for f in methodology_files]
    m_ok = all(p.exists() and "Where every number comes from" in p.read_text() and "step by step" in p.read_text() for p in mfiles)
    gate("6 methodology file per curve", m_ok, ", ".join(str(p.relative_to(ROOT)) for p in mfiles))
    # 7 uncertainty
    sens = prop / f"SENSITIVITY_{tag}.csv"
    gate("7 uncertainty (bands, sensitivity, not propagated)",
         sens.exists() and any(re.search(p, dossier, re.I) for p in phrases["not_propagated"]), str(sens.name))
    # 8 cross-asset proxy
    gate("8 no cross-asset proxy (stated and checked)", "Cross-asset proxy check" in dossier, "")
    # 9 coverage
    gate("9 coverage stated", "coverage" in dossier.lower() and "withheld" in dossier, "")
    # 10 folder state
    index = json.loads((ROOT / "docs/contracts/machine_readable_artifact_index.json").read_text())
    in_index = cell_id in json.dumps(index)
    no_current = not (cell / "current").exists()
    letters = [q.name for q in cell.rglob("*") if q.is_file() and ("REQUEST_" in q.name or "DRAFT_" in q.name)]
    gate("10 folder state matches claim", no_current and not in_index and art["promotion_status"] == "proposed"
         and art["canonical_runtime_artifact"] is False and not letters,
         f"current/ absent {no_current}; in artifact index {in_index}; letters in docs/cells {letters}")

    for name, ok, note in results:
        print(f"{'PASS' if ok else 'FAIL'}  gate {name}  {note}")
    return sum(1 for _, ok, _ in results if not ok)
