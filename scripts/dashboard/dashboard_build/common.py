"""Shared helpers: paths, hashing, CSV/JSON reading, tier codes, the fixed honest-state sentences."""
from __future__ import annotations

import csv
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[3]
HELPERS = ROOT / "scripts" / "reference_helpers"
CATALOGUE_DIR = ROOT / "docs" / "cells" / "catalogue"
INDEX = ROOT / "docs" / "contracts" / "machine_readable_artifact_index.json"
OCCURRENCE = ROOT / "docs" / "evidence" / "occurrence"
OUT = ROOT / "dashboard" / "data"

if str(HELPERS) not in sys.path:
    sys.path.insert(0, str(HELPERS))


class BuildError(Exception):
    """A reconciliation failure. The build stops; nothing is written."""


def load_json(path: Path | str) -> Any:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def read_csv(path: Path | str) -> list[dict[str, str]]:
    with Path(path).open(encoding="utf-8", newline="") as fh:
        return [{(k or "").strip(): (v or "").strip() for k, v in row.items()} for row in csv.DictReader(fh)]


def sha256(path: Path | str) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def rel(path: Path | str) -> str:
    p = Path(path)
    try:
        return str(p.resolve().relative_to(ROOT.resolve()))
    except ValueError:
        return str(p)


def git(*args: str) -> str:
    return subprocess.run(["git", "-C", str(ROOT), *args], capture_output=True, text=True, check=True).stdout.strip()


def tier_code(label: str | None) -> str | None:
    """'T4_placeholder_or_expert_judgment' → 'T4'; 'T3' → 'T3'; '' → None."""
    if not label:
        return None
    m = re.match(r"\s*(T[1-4])", str(label))
    return m.group(1) if m else None


TIER_WORDS = {
    "T1": "claims or field calibrated",
    "T2": "public lab, standard or physics",
    "T3": "engineering proxy or adjacent evidence",
    "T4": "placeholder or expert judgment",
}


def version_key(model: str | None, docs: str | None) -> str:
    """'model v1.0' + 'docs r1' → 'model_v1_0__docs_r1' (the key model-gpr's trace records)."""
    m = (model or "").replace("model ", "").replace("v", "").replace(".", "_")
    d = (docs or "").replace("docs ", "")
    return f"model_v{m}__docs_{d}" if m and d else (model or docs or "")


def humanise(code: str | None) -> str:
    return (code or "").replace("_", " ").strip()


def split_ids(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    return [v.strip() for v in re.split(r"[;,]", str(value)) if v.strip()]


def tier_span(codes: list[str | None]) -> str:
    """['T3','T4'] → 'T3–4'; ['T4'] → 'T4'; [] → '–'."""
    tiers = sorted({c for c in codes if c})
    if not tiers:
        return "–"
    return tiers[0] if len(tiers) == 1 else f"{tiers[0]}–{tiers[-1][1]}"


# The honest-state sentences of discussion 06 §2.4 — fixed strings, never paraphrased in a component. The build
# writes resolved copies into the data; the UI renders them and never types them.
SENTENCES = {
    "not_searched": {"mark": "?", "page": "Not searched — nobody has looked for field reports yet."},
    "none_after_search": {"mark": "∅", "page": "None found in {n} sources that could see it, searched {date}. Not a proof of absence."},
    "adjacent": {"mark": "~", "page": "Adjacent evidence only: {what}. No direct report."},
    "found": {"mark": "✓", "page": "Field reports found: {n} direct report(s)."},
    "no_curve": {"mark": "✕", "page": "No curve — {part}, {value} of the reference value, has no damage response yet."},
    "left_out": {"mark": "–", "page": "Left out on purpose: {reason}, {decision}."},
    "no_evaluator": {"mark": "—", "page": "Not drawn — no reference evaluator for this form in this repository (G9)."},
    "withheld": {"mark": "", "page": "Withheld: {condition}."},
    "unavailable": {"mark": "—", "page": "—"},
    "lineage_prose": {"mark": "", "page": "Lineage not machine-readable in this cell — see the dossier."},
}

STATION_ABSENT_SENTENCES = {
    "scope": "No scope note or README found for this cell.",
    "units": "No failure-unit table or coverage note found as a file or a dossier section.",
    "axis_form": "No x-axis or curve-form decision found as a file or a dossier section.",
    "evidence": "No source register, claim register or tier table found as a file or a dossier section.",
    "value": "No value crosswalk or value binding found as a file or a dossier section.",
    "audit": "No seven-step audit or site-condition adapter found as a file or a dossier section.",
    "artifact": "No curve artifact found.",
    "capability": "No capability declaration found.",
    "proof": "No known-answer tests, validation report or release record found.",
    "field_review": "No occurrence register for this asset × hazard; the catalogue entry has been read by an agent only.",
}


def fmt_usd_compact(v: float | None) -> str:
    if v is None:
        return "—"
    a = abs(v)
    if a >= 1e9:
        return f"${v / 1e9:.1f}B"
    if a >= 1e6:
        return f"${v / 1e6:.1f}M"
    if a >= 1e3:
        return f"${v / 1e3:.0f}k"
    return f"${v:.0f}"


def fmt_pct(share: float | None, digits: int = 0) -> str:
    return "—" if share is None else f"{share * 100:.{digits}f} %"


def parse_markdown_table(text: str) -> tuple[list[str], list[list[str]]] | None:
    """The first pipe table in `text`: (header, rows)."""
    lines = [ln.rstrip() for ln in text.splitlines()]
    for i, ln in enumerate(lines):
        if ln.strip().startswith("|") and i + 1 < len(lines) and re.match(r"^\s*\|[\s:\-|]+\|\s*$", lines[i + 1]):
            header = [c.strip() for c in ln.strip().strip("|").split("|")]
            rows = []
            for row in lines[i + 2:]:
                if not row.strip().startswith("|"):
                    break
                rows.append([c.strip() for c in row.strip().strip("|").split("|")])
            return header, rows
    return None


def section(text: str, heading_regex: str) -> str | None:
    """The body of the first markdown section whose heading matches `heading_regex` (case-insensitive)."""
    lines = text.splitlines()
    for i, ln in enumerate(lines):
        if ln.startswith("#") and re.search(heading_regex, ln, re.I):
            level = len(ln) - len(ln.lstrip("#"))
            body = []
            for nxt in lines[i + 1:]:
                if nxt.startswith("#") and (len(nxt) - len(nxt.lstrip("#"))) <= level:
                    break
                body.append(nxt)
            return "\n".join(body)
    return None
