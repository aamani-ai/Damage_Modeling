"""The one plain sentence per screen (DCD-D12), written by the build from the same data the screen shows."""
from __future__ import annotations

from typing import Any

from .common import fmt_pct, fmt_usd_compact


def _join(items: list[str]) -> str:
    items = [i for i in items if i]
    if not items:
        return ""
    if len(items) == 1:
        return items[0]
    return ", ".join(items[:-1]) + " and " + items[-1]


def library_sentence(counts: dict[str, int], n_assets: int, n_hazards: int, agent_read: int, n_entries: int, searched: int) -> str:
    return (f"{counts['live']} live curve cells, {counts['proposal']} proposals, {counts['reused']} reused bindings and {counts['gap']} gaps "
            f"across {n_assets} assets and {n_hazards} hazards; {agent_read} of {n_entries} catalogue entries have been read by an agent only; "
            + ("no field-report search has been logged yet." if searched == 0 else f"{searched} field-report searches have been logged."))


def _tier_phrase(tiers: set[str]) -> str:
    if not tiers:
        return ""
    if tiers <= {"T3", "T4"}:
        return "all from transferred or policy evidence (T3–T4)"
    if tiers <= {"T1", "T2"}:
        return "from public or calibrated evidence (T1–T2)"
    return f"with evidence from {'–'.join(sorted(tiers)[0:1] + sorted(tiers)[-1:])}"


def asset_sentence(noun: str, cells: list[dict[str, Any]], searched_any: bool) -> str:
    live = [c for c in cells if c["status"] == "live"]
    proposals = [c for c in cells if c["status"] == "proposal"]
    reused = [c for c in cells if c["status"] == "reused"]
    gaps = [c for c in cells if c["status"] == "gap"]
    plural = noun.lower()
    for group in (live, proposals, reused, gaps):
        for c in group:
            c["hazard"] = c["hazard"].lower()
    parts = []
    if live:
        tiers: set[str] = set()
        for c in live:
            for span in (c["tiers"]["shape"], c["tiers"]["cost"]):
                if span and span != "–":
                    lo, hi = (span.split("–") + [None])[:2]
                    tiers.add(lo)
                    if hi:
                        tiers.add("T" + hi)
        parts.append(f"{_join([c['hazard'] for c in live])} {'have curves' if len(live) > 1 else 'has a curve'} for {plural}, {_tier_phrase(tiers)}")
    if proposals:
        parts.append(f"{_join([c['hazard'] for c in proposals])} {'are proposals' if len(proposals) > 1 else 'is a proposal'} not yet in the runtime index")
    if reused:
        parts.append(f"{_join([c['hazard'] for c in reused])} {'reuse' if len(reused) > 1 else 'reuses'} another cell's curve")
    if gaps:
        parts.append(f"{_join([c['hazard'] for c in gaps])} {'have' if len(gaps) > 1 else 'has'} none")
    tail = "nobody has yet searched for field reports." if not searched_any else "field-report searches have begun."
    s = "; ".join(parts)
    return (s[0].upper() + s[1:] + "; " + tail) if s else f"No curves for {plural} yet; {tail}"


def cell_sentence(entry: dict[str, Any], status: str, value: dict[str, Any] | None, hazard_label: str, asset_label: str, drawn: bool | None) -> str:
    if entry["kind"] == "gap":
        reason = entry.get("reason", "").rstrip(".")
        for prefix in ("No curve and ", "No curve yet: ", "No curve yet, ", "No curve: "):
            if reason.startswith(prefix):
                reason = reason[len(prefix):]
                break
        return f"{hazard_label} on {asset_label.lower()} has no curve yet — {reason[:1].lower() + reason[1:]}."
    method = (entry.get("method") or {}).get("summary", "").rstrip(".").split(";")[0].strip()
    lead = f"{hazard_label} on {asset_label.lower()}"
    if entry["kind"] == "binding":
        lead = f"{hazard_label} on {asset_label.lower()} reuses another cell's curve"
    s = f"{lead}: {method[0].lower() + method[1:] if method else 'see the cell files'}"
    if value and value.get("share_covered") is not None:
        s += f"; {fmt_pct(value['share_covered'])} of the reference value has a curve and {fmt_pct(1 - value['share_covered'])} has none"
    elif entry.get("not_covered"):
        s += f"; {len(entry['not_covered'])} part{'s' if len(entry['not_covered']) != 1 else ''} of the asset's value {'have' if len(entry['not_covered']) != 1 else 'has'} no curve"
    if status == "proposal":
        s = "Proposal, not in the runtime index — " + s
    s += "."
    return s


def occurrence_sentence(hazard_label: str, asset_label: str, buckets: dict[str, Any], effect: str) -> str:
    states = [b["state"] for b in buckets.values()]
    n = len(states)
    if effect == "performance":
        return f"{hazard_label} works on {asset_label.lower()} through performance (ageing, derating), not physical damage; no damage curve is planned and no field-report search applies."
    if all(s == "not_searched" for s in states):
        return f"Has {hazard_label.lower()} physically damaged a {asset_label.lower()} subsystem in the field? Not searched — nobody has looked for field reports yet, for any of the {n} value buckets."
    counts = {s: states.count(s) for s in ("found", "adjacent", "none_after_search", "not_searched") if s in states}
    words = {"found": "found", "adjacent": "adjacent only", "none_after_search": "none after a logged search", "not_searched": "not searched"}
    return f"{hazard_label} × {asset_label.lower()}: " + ", ".join(f"{v} of {n} buckets {words[k]}" for k, v in counts.items()) + "."


def dossier_sentence(curve: dict[str, Any], hazard_label: str, occurrence_state_sentence: str | None) -> str:
    part = curve.get("part") or curve.get("failure_unit_id")
    form = (curve.get("curve_form") or "").replace("_", " ")
    tiers = curve.get("tiers") or {}
    s = f"{part}: {form} on {curve['axis'].get('label', 'its native axis')}"
    if tiers.get("shape") or tiers.get("cost"):
        s += f"; shape {tiers.get('shape') or '–'}, cost {tiers.get('cost') or '–'}"
    if not curve.get("drawn"):
        s += "; not drawn here"
    if occurrence_state_sentence:
        s += f". {occurrence_state_sentence}"
    return s + ("" if s.endswith(".") else ".")
