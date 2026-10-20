"""Source, claim and parameter registers, normalised across the header variants the cells use."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from .common import ROOT, read_csv, split_ids, tier_code


def _first(row: dict[str, Any], *keys: str) -> str | None:
    for k in keys:
        v = row.get(k)
        if v not in (None, ""):
            return str(v)
    return None


def normalise_sources(rows: list[dict[str, str]]) -> list[dict[str, Any]]:
    out = []
    for r in rows:
        sid = _first(r, "source_id")
        if not sid:
            continue
        out.append({
            "id": sid,
            "citation": _first(r, "citation", "full_citation", "location", "use") or "",
            "url": _first(r, "url", "url_or_repo_path", "primary_url"),
            "locator": _first(r, "exact_locator", "locator"),
            "role": _first(r, "source_role", "role", "evidence_role", "source_class"),
            "tier": tier_code(_first(r, "evidence_tier", "claim_support_tier", "tier")),
            "permitted": _first(r, "permitted_inference", "direct_support", "measured_endpoint"),
            "prohibited": _first(r, "prohibited_inference", "prohibited_support", "limit", "limits"),
            "decision": _first(r, "decision", "disposition", "status"),
            "accessed_on": _first(r, "accessed_on"),
        })
    return out


def normalise_claims(rows: list[dict[str, str]]) -> list[dict[str, Any]]:
    out = []
    for r in rows:
        cid = _first(r, "claim_id")
        if not cid:
            continue
        out.append({
            "id": cid,
            "text": _first(r, "claim_text", "adopted_statement", "statement", "claim", "claim_or_parameter", "parameter_or_rule") or "",
            "type": _first(r, "claim_type", "type"),
            "source_ids": split_ids(_first(r, "source_ids", "source_id")),
            "locator": _first(r, "exact_locator", "locator"),
            "tier": tier_code(_first(r, "evidence_tier", "tier")),
            "parameter_or_rule": _first(r, "parameter_or_rule", "adopted_rule"),
            "status": _first(r, "adoption_status", "status", "numerical_parameter_status", "decision"),
            "update_trigger": _first(r, "update_trigger", "revisit_trigger"),
        })
    return out


def normalise_parameters(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Parameter tier rows from an artifact's `parameter_tier_table` or a PARAMETER_TIER_TABLE csv."""
    out = []
    for i, r in enumerate(rows):
        name = _first(r, "parameter", "scope", "parameter_or_rule") or f"parameter {i + 1}"
        pid = _first(r, "parameter_id") or name
        value = r.get("value", r.get("value_or_rule", r.get("value_or_status")))
        out.append({
            "id": pid,
            "name": name,
            "value": value if isinstance(value, (str, int, float)) or value is None else value,
            "tier": tier_code(_first(r, "tier")),
            "source_ids": split_ids(r.get("source_ids") if r.get("source_ids") is not None else r.get("source")),
            "claim_ids": split_ids(r.get("claim_ids")),
            "curve_id": _first(r, "curve_id"),
            "pathway_id": _first(r, "pathway_id"),
            "role": _first(r, "param_role", "role"),
            "status": _first(r, "status", "runtime_status"),
            "reasoning": _first(r, "reasoning", "reason", "meaning"),
            "update_trigger": _first(r, "update_trigger"),
        })
    return out


def load_registers(artifact: dict[str, Any], folder: Path | None) -> dict[str, Any]:
    """The cell's registers: paths from the artifact first, then well-known file names in the folder."""
    paths: dict[str, str | None] = {"sources": None, "claims": None, "parameters": None}
    src = artifact.get("source_register") or ((artifact.get("derivation_rationale") or {}).get("evidence_sources"))
    clm = artifact.get("claim_parameter_register") or ((artifact.get("derivation_rationale") or {}).get("evidence_claims"))
    if isinstance(artifact.get("source_registers"), list) and not src:
        src = next((s for s in artifact["source_registers"] if str(s).endswith(".csv")), None)
    if isinstance(artifact.get("claim_registers"), list) and not clm:
        clm = next((s for s in artifact["claim_registers"] if str(s).endswith(".csv")), None)
    if folder is not None:
        if not src:
            src = next((str(p.relative_to(ROOT)) for p in sorted(folder.glob("SOURCE_REGISTER_*.csv"))), None)
        if not clm:
            clm = next((str(p.relative_to(ROOT)) for p in sorted(folder.glob("CLAIM_PARAMETER_REGISTER_*.csv"))), None)
        ptt = next((str(p.relative_to(ROOT)) for p in sorted(folder.glob("PARAMETER_TIER_TABLE_*.csv"))), None)
        if not ptt and (folder / "parameter_register.csv").exists():
            ptt = str((folder / "parameter_register.csv").relative_to(ROOT))
        paths["parameters"] = ptt
    paths["sources"], paths["claims"] = src, clm
    out: dict[str, Any] = {"paths": paths, "sources": [], "claims": [], "parameters": []}
    if src and (ROOT / src).exists():
        out["sources"] = normalise_sources(read_csv(ROOT / src))
    if clm and (ROOT / clm).exists():
        out["claims"] = normalise_claims(read_csv(ROOT / clm))
    table = artifact.get("parameter_tier_table")
    if isinstance(table, list) and table:
        out["parameters"] = normalise_parameters(table)
    elif paths["parameters"] and (ROOT / paths["parameters"]).exists():
        out["parameters"] = normalise_parameters(read_csv(ROOT / paths["parameters"]))
    return out
