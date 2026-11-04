"""How each curve is built, back to front: the formula with a key for every symbol, each parameter with where its
number came from (a published source, the files that constructed it, or the source a borrowed number stands in for),
the files that built the curve, and whether production can call it. Also the legend every page opens with, and the
path-hygiene guard for everything the dashboard displays.

The formulas are written from the repository evaluators (`scripts/reference_helpers/damage_curve_eval.py`,
`tropical_cyclone_wind_wind_curve_eval.py`, `pathway_damage_curve_eval.py`, `tropical_cyclone_wind_bess_curve_eval.py`)
and use the artifact's own parameter names, so the key and the parameter table line up one to one; the
`formula_keys` check fails when a curve carries a parameter its formula does not name.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from .common import HELPERS, LOCAL_PATH_RE, ROOT, SHOW_FIELD_REPORTS, humanise, parse_markdown_table, rel, tier_span
from .plain import TIER_MEANING, TIER_SHORT, tier_words
from .twin import STATE_MEANING as twin_meaning, STATE_WORDS as twin_words

# symbol → (meaning, the artifact parameter it reads, or None for an axis or a derived quantity)
Var = tuple[str, str, str | None]

FORMS: dict[str, dict[str, Any]] = {
    "logistic": {
        "formula": "D(x) = max_DR / (1 + exp(−k_per_mm × (x − D50_mm)))",
        "source": "scripts/reference_helpers/damage_curve_eval.py",
        "variables": [
            ("D(x)", "damage ratio: repair cost ÷ replacement value at intensity x", None),
            ("x", "hazard intensity on the curve's x-axis", None),
            ("max_DR", "the ceiling: the largest damage ratio the curve reaches", "max_DR"),
            ("D50_mm", "the midpoint: intensity at which damage reaches half of max_DR", "D50_mm"),
            ("k_per_mm", "steepness: how fast damage rises around the midpoint, per mm", "k_per_mm"),
        ],
    },
    "wind_tornado_logistic_ratio": {
        "formula": "D(R) = max_DR / (1 + exp(−k_ratio × (R − D50))), with D50 = D50_ratio_straight_line, plus tornado_D50_shift for the tornado variant",
        "source": "scripts/reference_helpers/damage_curve_eval.py",
        "variables": [
            ("D(R)", "damage ratio at demand ratio R", None),
            ("R", "the curve's x-axis: wind demand as a ratio of design capacity", None),
            ("max_DR", "the ceiling: the largest damage ratio the curve reaches", "max_DR"),
            ("k_ratio", "steepness: how fast damage rises around the midpoint, per unit of ratio", "k_ratio"),
            ("D50_ratio_straight_line", "the midpoint for straight-line wind: the ratio at which damage reaches half of max_DR", "D50_ratio_straight_line"),
            ("tornado_D50_shift", "added to the midpoint for the tornado variant", "tornado_D50_shift"),
        ],
    },
    "thresholded_logistic_demand": {
        "formula": "D(R) = 0 for R < R0; otherwise max_DR / (1 + exp(−k × (R − R50)))",
        "source": "scripts/reference_helpers/damage_curve_eval.py",
        "variables": [
            ("D(R)", "damage ratio at demand ratio R", None),
            ("R", "the curve's x-axis: wind demand as a ratio of design capacity", None),
            ("R0", "onset: below this ratio damage is zero", "R0"),
            ("R50", "the midpoint: the ratio at which damage reaches half of max_DR", "R50"),
            ("k", "steepness: how fast damage rises around the midpoint", "k"),
            ("max_DR", "the ceiling: the largest damage ratio the curve reaches", "max_DR"),
        ],
    },
    "thresholded_weibull_expected_damage": {
        "formula": "D(V) = 0 for V ≤ V_zero_kmh; otherwise max_dr × (1 − exp(−ln 2 × ((V − V_zero_kmh) / delta_V50_kmh)^rho))",
        "source": "scripts/reference_helpers/tropical_cyclone_wind_wind_curve_eval.py",
        "variables": [
            ("D(V)", "damage ratio at wind speed V", None),
            ("V", "the curve's x-axis: wind speed, km/h", None),
            ("V_zero_kmh", "onset: at or below this speed damage is zero", "V_zero_kmh"),
            ("delta_V50_kmh", "how far above onset damage reaches half of max_dr", "delta_V50_kmh"),
            ("rho", "shape: how sharply damage rises (Weibull exponent)", "rho"),
            ("max_dr", "the ceiling: the largest damage ratio the curve reaches", "max_dr"),
            ("V_at_DR50_kmh", "the midpoint speed; the evaluator checks it equals V_zero_kmh + delta_V50_kmh (a check, not a separate input)", "V_at_DR50_kmh"),
        ],
    },
    "ordered_damage_state_lognormal": {
        "formula": "P(state ≥ i | x) = Φ(ln(x / median_i) / beta_ln); D(x) = Σ_i P(exactly state i | x) × cost_ratio_i",
        "source": "scripts/reference_helpers/pathway_damage_curve_eval.py",
        "variables": [
            ("D(x)", "expected damage ratio at intensity x", None),
            ("x", "hazard intensity on the curve's x-axis", None),
            ("Φ", "the standard normal cumulative distribution", None),
            ("median_i", "intensity at which a structure has an even chance of reaching state i; one set per capacity scenario", "capacity_scenarios"),
            ("beta_ln", "spread: the lognormal dispersion around each median", "beta_ln"),
            ("cost_ratio_i", "the damage ratio charged when the structure is in state i", "damage_states"),
        ],
    },
    "piecewise_linear": {
        "formula": "D(x) is read off a straight line between neighbouring points (x_i, D_i); flat beyond the last point",
        "source": "scripts/reference_helpers/damage_curve_eval.py",
        "variables": [
            ("D(x)", "damage ratio at intensity x", None),
            ("(x_i, D_i)", "the listed points: intensity and damage ratio", "points"),
            ("O", "onset: the last intensity with zero damage before damage starts (read from the points)", None),
            ("F", "full: the first intensity at which damage reaches its highest value (read from the points)", None),
            ("D_max", "the highest damage ratio among the points", None),
        ],
    },
}

EXACT_STATE = {
    "formula": "D(class) = the listed damage ratio for that class; nothing is interpolated between classes",
    "source": "scripts/reference_helpers/damage_curve_eval.py",
    "variables": [
        ("D(class)", "damage ratio for one hazard class", None),
        ("(class_i, D_i)", "the listed classes and their damage ratios", "points"),
    ],
}

# Where a parameter's number came from, by its tier. The words are the build's; components lay them out.
WHERE_FROM = {
    "published": "From a published source.",
    "borrowed": "Borrowed: taken from a similar asset or a related study and adapted.",
    "our_judgment": "Our judgment: no source gives this number.",
    # a whole point list or table with no row of its own: the curve's sources are where those points come from
    "curve_level": "No source for this number alone: it rests on the curve's own sources.",
    # one number the register skips while citing the curve's other numbers (max_DR = 1 in hail × solar)
    "unsourced": "Set by the team; no source cited.",
}

# A label in a cell's own files that reads wider than what the curve covers. The label is kept as written; this note
# sits beside it. Each note names where it comes from.
SCOPE_NOTES: dict[tuple[str, str], dict[str, str]] = {
    ("flood_wind", "GSU / substation (whole facility)"): {
        "note": "“Whole facility” here means the whole GSU substation, not the whole wind farm: the curve is FEMA Hazus-MH 2.1 "
                "Table 7.9's whole-substation depth-damage table. Turbines, foundations, collection and civil works have no "
                "flood curve.",
        "basis": "docs/cells/catalogue/flood_wind.json",
    },
}



def scope_note(entry_id: str | None, part: str | None) -> dict[str, str] | None:
    return SCOPE_NOTES.get((entry_id or "", part or ""))


def _form_spec(c: dict[str, Any], curve_type: str) -> dict[str, Any] | None:
    if c.get("curve_form") == "piecewise_linear" and "exact-state" in curve_type:
        return EXACT_STATE
    return FORMS.get(c.get("curve_form") or "")


def _piecewise_marks(points: Any) -> dict[str, Any] | None:
    """O, F and D_max read from a piecewise curve's own points; None when the points are not numeric pairs."""
    try:
        pts = [(float(x), float(y)) for x, y in points]
    except (TypeError, ValueError):
        return None
    if not pts:
        return None
    d_max = max(y for _, y in pts)
    first_pos = next((i for i, (_, y) in enumerate(pts) if y > 0), None)
    onset = pts[first_pos - 1][0] if first_pos else None
    full = next(x for x, y in pts if y == d_max) if d_max > 0 else None
    return {"O": onset, "F": full, "D_max": d_max,
            "O_note": None if first_pos else ("damage starts at the first point" if first_pos == 0 else "no damage at any point")}


def constructing_files(entry_id: str, version: str, files: dict[str, str | None]) -> list[dict[str, str]]:
    """The write-up and the build script(s) that set the curve's numbers. Scripts match the model version when one
    does; otherwise every build script for the cell is listed."""
    out = []
    if files.get("write_up"):
        out.append({"role": "write-up", "path": files["write_up"]})
    model = re.match(r"model_(v\d+(?:_\d+)*)", version or "")
    scripts = sorted(p for p in HELPERS.glob(f"build_{entry_id}_v*") if p.suffix in (".py", ".mjs"))
    if model:
        exact = [p for p in scripts if p.name.startswith(f"build_{entry_id}_{model.group(1)}_") or p.stem.startswith(f"build_{entry_id}_{model.group(1)}")]
        scripts = exact or scripts
    out += [{"role": "build script", "path": rel(p)} for p in scripts]
    if files.get("decisions"):
        out.append({"role": "decision record", "path": files["decisions"]})
    return out


def _where_kind(tier: str | None) -> str:
    return {"T1": "published", "T2": "published", "T3": "borrowed", "T4": "our_judgment"}.get(tier or "", "curve_level")


def construction_block(c: dict[str, Any], artifact_path: str | None, status: str, consumer_pin: str | None,
                       sources_by_id: dict[str, Any], aliases: dict[str, str], files: list[dict[str, str]], hazard_use: dict[str, Any] | None = None) -> dict[str, Any]:
    """A back-to-front curve recipe: runtime flag, form, formula and its key, parameters with where each came from,
    sources, and the constructing files."""
    rows = c.get("parameters_rows") or []
    construction_sources = c.get("construction_sources") or []

    def resolve(sid: str) -> dict[str, Any] | None:
        return sources_by_id.get(aliases.get(sid, sid)) or sources_by_id.get(sid)

    params = c.get("parameters") or {}
    if not isinstance(params, dict):
        params = {"parameters": params}
    curve_type = c.get("form_label") or humanise(c.get("curve_form") or "unspecified")
    spec = _form_spec(c, curve_type)
    meaning = {v[2]: v[1] for v in (spec or {}).get("variables", []) if v[2]}
    parameter_docs = []
    # the register cites this curve's numbers one by one when any of them has a row of its own
    cited_one_by_one = any(r.get("id") in params or r.get("name") in params for r in rows)
    for name, value in params.items():
        matched = [r for r in rows if r.get("id") == name or r.get("name") == name]
        source_ids = sorted({sid for r in matched for sid in r.get("source_ids") or []})
        resolved = [s for s in (resolve(sid) for sid in source_ids) if s]
        tier = tier_span([r.get("tier") for r in matched]) if matched else None
        tier = None if tier == "–" else tier
        kind = _where_kind(tier)
        # one number the register skips while citing the curve's other numbers one by one has no source: say so, not
        # borrow the curve's (where the register has no per-number rows, the curve's sources are the numbers' sources)
        unsourced = kind == "curve_level" and cited_one_by_one and not isinstance(value, (list, dict))
        if unsourced:
            kind = "unsourced"
        parameter_docs.append({
            "name": name, "definition": meaning.get(name) or humanise(name).lower(), "value": value,
            "value_path": f"{artifact_path}::curve_id={c.get('curve_id')}::parameters.{name}" if artifact_path else None,
            "tier": tier, "tier_word": tier_words(tier) if tier else None,
            "reasoning": [r.get("reasoning") for r in matched if r.get("reasoning")],
            "source_ids": source_ids or ([] if unsourced else [s.get("id") or s.get("source_id") for s in construction_sources if s.get("id") or s.get("source_id")]),
            "sources": resolved if matched else ([] if unsourced else construction_sources),
            "unresolved_source_ids": [sid for sid in source_ids if not resolve(sid)],
            "register_rows": [r.get("id") for r in matched], "source_scope": "parameter" if matched else "curve",
            "where_from": kind, "files": files if kind == "our_judgment" else [],
        })
    unmatched_rows = [r for r in rows if r.get("id") not in params and r.get("name") not in params]
    production_state = "runtime_indexed" if status == "live" and consumer_pin else ("reused_binding" if status == "reused" else "not_runtime_indexed")
    keyed = {v[2] for v in (spec or {}).get("variables", []) if v[2]}
    return {
        "curve_type": curve_type, "curve_form": c.get("curve_form"),
        "formula": spec["formula"] if spec else None, "formula_source": spec["source"] if spec else None,
        "variables": [{"symbol": s, "meaning": m_, "parameter": p} for s, m_, p in (spec or {}).get("variables", [])],
        "marks": _piecewise_marks(params.get("points")) if spec is FORMS.get("piecewise_linear") else None,
        "unkeyed_parameters": sorted(set(params) - keyed),
        "curve_tiers": {half: {"tier": (c.get("tiers") or {}).get(half), "word": tier_words((c.get("tiers") or {}).get(half))} for half in ("shape", "cost")},
        "axis": c.get("axis"), "parameters": parameter_docs, "additional_parameter_rows": unmatched_rows,
        "sources": construction_sources, "source_ids": c.get("sources_for_curve") or [s.get("id") or s.get("source_id") for s in construction_sources if s.get("id") or s.get("source_id")],
        "artifact": artifact_path, "evaluator": c.get("evaluator"), "constructing_files": files,
        "scope_note": scope_note(c.get("entry_id"), c.get("part")),
        "production_use": {
            "state": production_state, "consumer_pin": consumer_pin, "hazard": hazard_use,
            "sentence": ("Released for Hazard: Hazard's loss calculations may load this curve. Whether Hazard's maps already use it is shown under “Used by Hazard”."
                         if production_state == "runtime_indexed" else
                         "Released as a borrowed curve: the platform prices this asset with a curve built for another asset; it has no curve of its own."
                         if production_state == "reused_binding" else
                         "Not released yet: Hazard's loss calculations cannot load this curve."),
        },
    }


UNITS_SOURCE = "docs/method/standards/13_end_to_end_damage_work_architecture.md"


def _units() -> list[dict[str, str]]:
    """The method's four units, read from standard 13 §6's table: cell, failure unit, subsystem/component, value bucket."""
    text = (ROOT / UNITS_SOURCE).read_text(encoding="utf-8")
    start = text.find("## 6. The core unit hierarchy")
    table = parse_markdown_table(text[start:]) if start >= 0 else None
    if not table:
        raise ValueError(f"{UNITS_SOURCE} has no unit table under §6")
    out = []
    for row in table[1]:
        word = row[0].replace("*", "").replace("-", " ").strip()
        example = row[2].replace("`", "").strip()
        out.append({"key": re.sub(r"[^a-z]+", "_", word.lower()).strip("_"), "word": word[0].upper() + word[1:].lower(),
                    "meaning": f"{row[1].rstrip('.')}; e.g. {example}"})
    return out


PLAIN_STATUS = {
    "live": "Finished and in use: the platform's loss calculations can use this curve today.",
    "proposal": "Built and checked, but not in use yet: it waits for an owner's review before the platform can use it.",
    "reused": "No curve of its own: it borrows a live curve built for another asset, which its page names (for example, "
              "a substation borrows the substation part of a solar farm's curve).",
    "gap": "Nothing has been built for this asset and hazard yet; its page says why and lists the research so far.",
}


def legend(cat_text: str) -> dict[str, Any]:
    """The words every page opens with. Catalogue statuses are read from CATALOGUE.md's own status table."""
    start = cat_text.find("**Status.**")
    table = parse_markdown_table(cat_text[start:]) if start >= 0 else None
    status_rows = {r[0].strip().lower(): r[1].replace("`", "").strip() for r in (table[1] if table else []) if len(r) >= 2}
    for s in ("live", "proposal", "reused", "gap"):
        if s not in status_rows:
            raise ValueError(f"CATALOGUE.md status table has no row for {s!r}")
    return {
        "source": "docs/cells/CATALOGUE.md",
        # the catalogue's own definitions are for modelers (runtime index, consumer binding); the page says the same in
        # plain words and links the catalogue for the exact ones
        "status": [*({"key": s, "word": {"gap": "no curve yet"}.get(s, s), "meaning": PLAIN_STATUS[s], "catalogue": status_rows[s]}
                     for s in ("live", "proposal", "reused", "gap")),
                   {"key": "partial", "word": "partial", "meaning": "Part of the asset's value has no curve yet."}],
        "coverage": [
            {"key": "curve", "word": "has a curve", "meaning": "A curve covers the whole of this subsystem."},
            {"key": "partial", "word": "partial", "meaning": "A curve covers only part of this subsystem; the rest has none."},
            {"key": "whole", "word": "in the whole-building curve", "meaning": "No curve of its own: a curve for the whole building prices it with the rest of the structure."},
            {"key": "gap", "word": "no curve yet", "meaning": "No curve covers this subsystem; the row says why and links the research."},
            # the picture's other states (twin.STATE_MEANING), in the same words
            *({"key": k, "word": twin_words[k], "meaning": twin_meaning[k]} for k in ("conditioner", "no_direct_damage", "outside")),
        ],
        "completeness": [
            {"key": "value_share", "word": "Value share", "meaning": "This part's share of the asset's value: of its reference value where the asset has one, else the share the cell's own units declare (hover for the basis)."},
        ],
        "evidence": [{"key": k, "word": TIER_SHORT[k], "meaning": TIER_MEANING[k].removeprefix(f"{TIER_SHORT[k]}: ")} for k in ("T1", "T2", "T3", "T4")],
        "production": [
            {"key": "runtime_indexed", "word": "released for Hazard", "meaning": "Released: this repository's index lists it as a curve Hazard's loss calculations may load. Whether Hazard's maps already use it is shown under Used by Hazard."},
            {"key": "reused_binding", "word": "released, borrowed curve", "meaning": "Released, but as another asset's curve: the platform prices this asset with a curve built for something else."},
            {"key": "not_runtime_indexed", "word": "not released yet", "meaning": "Not in this repository's index of released curves, so Hazard's loss calculations cannot load it yet."},
        ],
        "hazard_use": [
            {"key": "used", "word": "Used by Hazard's dashboard", "meaning": "A layer on Hazard's internal dashboard was computed with this file, or one identical to it in everything that can change a loss (curves, value shares, unit treatments)."},
            {"key": "differs", "word": "Differs in Hazard's dashboard", "meaning": "A layer on Hazard's dashboard was computed with something that differs in a way that can change a loss: a newer model, a changed revision, or a different value share. The note says what."},
            {"key": "not_on", "word": "Not on Hazard's dashboard", "meaning": "No layer on Hazard's dashboard uses this cell; the row says whether any Hazard branch holds it."},
        ],
        "where_from": WHERE_FROM,
        "units": _units(), "units_source": UNITS_SOURCE,
        # the library's five views of a tile, and what its borders and fills mean
        "lenses": [
            {"key": "status", "word": "Status", "meaning": "The first line of every tile, and its shade (see a curve's status): what exists for this asset and hazard."},
            {"key": "evidence", "word": "Evidence", "meaning": "How well supported the curve's numbers are, in one word: the weaker of how damage rises with the hazard and how that damage becomes dollars (hover a tile for both)."},
            # field reports are hidden for now (SHOW_FIELD_REPORTS); the entry returns with them
            *([{"key": "occurrence", "word": "Field reports", "meaning": "Whether anyone has searched for real-world reports of this hazard damaging this asset, and what was found."}]
              if SHOW_FIELD_REPORTS else []),
            {"key": "value", "word": "Value covered", "meaning": "Of everything the asset is worth, the share that has a damage curve for this hazard: 75% means a quarter of its value has none. \"No total stated\" means the cell gives each part's share but never their total, so none is shown."},
            {"key": "review", "word": "Read by", "meaning": "Whether a person has reviewed this entry, or only an agent has read it."},
        ],
        "marks": [
            {"key": "solid", "word": "Solid border, filled", "meaning": "A live curve: the platform can use it."},
            {"key": "dashed_dark", "word": "Dashed dark border, no fill", "meaning": "A proposal: built and checked, not in use yet."},
            {"key": "hatched", "word": "Diagonal hatching", "meaning": "Reused: priced with another cell's curve, not one of its own."},
            {"key": "dashed_light", "word": "Dashed light border, grey text", "meaning": "No curve yet for this asset and hazard."},
            {"key": "partial", "word": "· partial", "meaning": "The curves cover only part of the asset's value."},
            {"key": "not_drawn", "word": "not drawn", "meaning": "The curve exists but this repository's code cannot draw it."},
            {"key": "shade_evidence", "word": "Grey shading (Evidence)", "meaning": "Darker grey means weaker evidence: clear for field-calibrated or published, darkest for our judgment."},
            {"key": "shade_review", "word": "Grey fill (Read by)", "meaning": "Only an agent has read the entry; no person has reviewed it yet."},
        ],
    }


def path_leaks(obj: Any, where: str = "") -> list[str]:
    """Every displayed string that still carries a machine path."""
    found: list[str] = []
    if isinstance(obj, str):
        found += [f"{where}: {m[:80]}" for m in LOCAL_PATH_RE.findall(obj)]
    elif isinstance(obj, dict):
        for k, v in obj.items():
            found += path_leaks(v, f"{where}.{k}" if where else str(k))
    elif isinstance(obj, list):
        for v in obj:
            found += path_leaks(v, where)
    return found
