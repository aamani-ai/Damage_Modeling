"""The hand-edited team event log and its curve/call roll-up for the library."""
from __future__ import annotations

from collections import defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile

from .common import OUT, ROOT, BuildError, load_json

REVIEW = OUT / "team_review.json"
HAIL_BOOK = "docs/cells/hail_solar/current/damage_curve_records_v1_3_hail_solar_derivation_audit.xlsx"
HAIL_DOSSIER = "docs/cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


def rollup(colors: list[str]) -> str:
    if "red" in colors:
        return "red"
    if colors and all(c == "green" for c in colors):
        return "green"
    if not colors or all(c == "white" for c in colors):
        return "white"
    return "yellow"


def _sheet_rows(path: Path, name: str) -> dict[int, dict[str, str]]:
    """Read literal workbook cells without recalculating or changing the source workbook."""
    with ZipFile(path) as book:
        wb = ET.fromstring(book.read("xl/workbook.xml"))
        relationships = ET.fromstring(book.read("xl/_rels/workbook.xml.rels"))
        targets = {r.attrib["Id"]: r.attrib["Target"] for r in relationships}
        shared = []
        if "xl/sharedStrings.xml" in book.namelist():
            shared = ["".join(t.text or "" for t in si.findall(".//m:t", NS))
                      for si in ET.fromstring(book.read("xl/sharedStrings.xml")).findall("m:si", NS)]
        sheet = next(s for s in wb.find("m:sheets", NS) if s.attrib["name"] == name)
        target = targets[sheet.attrib[f"{{{NS['r']}}}id"]].lstrip("/")
        target = target if target.startswith("xl/") else "xl/" + target
        result = {}
        for row in ET.fromstring(book.read(target)).findall(".//m:sheetData/m:row", NS):
            cells = {}
            for cell in row.findall("m:c", NS):
                value = cell.find("m:v", NS)
                inline = cell.find("m:is", NS)
                if value is not None:
                    content = shared[int(value.text)] if cell.attrib.get("t") == "s" else value.text or ""
                else:
                    content = "".join(t.text or "" for t in inline.findall(".//m:t", NS)) if inline is not None else ""
                cells["".join(ch for ch in cell.attrib["r"] if ch.isalpha())] = content
            result[int(row.attrib["r"])] = cells
        return result


def _hail_calls() -> dict[str, tuple[str, str]]:
    rows = _sheet_rows(ROOT / HAIL_BOOK, "Hail_Solar_Coverage")
    expected = {15: "inverters", 18: "collection"}
    for number, key in expected.items():
        row = rows[number]
        term = "COMBINER_BOX" if key == "inverters" else "CABLE_DC"
        if term not in row.get("B", "") or "DR≈0" not in row.get("C", ""):
            raise BuildError(f"Hail workbook coverage row {number} changed; check Team view mapping")
    return {"inverters": (rows[15]["C"], HAIL_BOOK + " · Hail_Solar_Coverage!C15"),
            "collection": (rows[18]["C"], HAIL_BOOK + " · Hail_Solar_Coverage!C18")}


def _catalogue_source(cell: str, wording: str) -> str | None:
    """Link to the catalogue line only when it contains the displayed wording."""
    path = f"docs/cells/catalogue/{cell}.json"
    file = ROOT / path
    if file.is_file():
        for line, content in enumerate(file.read_text(encoding="utf-8").splitlines(), 1):
            if wording in content:
                return f"{path}#L{line}"
    return None


def _color(events: list[dict], has_curve: bool) -> str:
    if not events:
        return "white"
    latest = {}
    for event in sorted(events, key=lambda x: x["date"]):
        latest[event["team"]] = event["event"]
    states = set(latest.values())
    if states == {"accepted"} and len(latest) == 2:
        return "green" if has_curve or all(e.get("call") == "no_direct_damage" for e in events) else "yellow"
    if states == {"wrong"} and len(latest) == 2:
        return "red"
    return "yellow"


def _summary(rows: list[dict]) -> dict:
    counted = [r for r in rows if r["color"] != "not_counted"]
    denominator = sum(r["share"] or 0 for r in counted)
    green = sum(r["share"] or 0 for r in counted if r["color"] == "green")
    return {"color": rollup([r["color"] for r in counted]), "rows": rows,
            "agreed": sum(r["color"] == "green" for r in counted), "total": len(counted),
            "agreed_value": green / denominator if denominator else None,
            "problem": next((r["label"] for r in counted if r["color"] == "red"), None)}


def build(assets: dict, tiles: list[dict], library: list[dict]) -> None:
    log = load_json(REVIEW)
    events = defaultdict(list)
    for event in log["events"]:
        if event["team"] not in ("Damage", "Hazard") or event["kind"] not in ("curve", "call") or event["event"] not in ("accepted", "wrong", "review_started", "question", "problem", "fix_posted"):
            raise BuildError("Invalid Team view event")
        events[(event["cell"], event["kind"], event["id"])].append(event)
    hail = _hail_calls()
    by_cell = defaultdict(list)
    for asset in assets.values():
        for sub in asset["subcomponents"]:
            by_cell[sub["entry_id"]].append(sub)
    for tile in tiles:
        if tile["status"] == "gap":
            continue
        rows = []
        for sub in by_cell[tile["entry_id"]]:
            curves = [{"id": cid, "color": _color(events[(tile["entry_id"], "curve", cid)], True),
                       "source": next((c["artifact"] for c in sub.get("construction", []) if c["curve_id"] == cid), None)}
                      for cid in sub["curve_ids"]]
            gap = sub.get("gap") or {}
            if sub["entry_id"] == "hail_solar" and sub["key"] in hail:
                wording, source = hail[sub["key"]]
            elif curves:
                wording = next((c["part"] for c in sub.get("construction", []) if c.get("part")), sub["label"])
                source = curves[0]["source"]
            elif sub["entry_id"] == "hail_solar" and sub["key"] == "grounding":
                wording, source = "not mentioned", None
            elif sub["entry_id"] == "hail_solar" and sub["key"] == "support":
                wording, source = "Module hardware plus all general replacement fieldwork", HAIL_DOSSIER + "#L842"
            elif sub["entry_id"] == "hail_solar" and sub["key"] in ("mounting", "foundations", "substation", "scada", "civil"):
                wording = gap.get("own_words") or "unknown"
                source = _catalogue_source(sub["entry_id"], wording)
            elif sub["cell_state"] == "not_named":
                cell_dir = ROOT / "docs" / "cells" / sub["entry_id"]
                wording = "not checked against the cell's workbook" if list(cell_dir.glob("current/*.xlsx")) else "not mentioned"
                source = None
            else:
                wording = gap.get("own_words") or "unknown"
                source = _catalogue_source(sub["entry_id"], wording) or (gap.get("source") or {}).get("path")
            if sub.get("cost_follows"):
                color = "not_counted"
            else:
                color = rollup([c["color"] for c in curves]) if curves else _color(events[(tile["entry_id"], "call", sub["key"])], False)
            if curves:
                damage_call = "has_curve"
            elif sub.get("cost_follows"):
                damage_call = "cost_follows"
            elif gap.get("no_direct_damage") or (sub["entry_id"] == "hail_solar" and sub["key"] == "collection"):
                damage_call = "no_direct_damage"
            elif "not a damaged part" in (gap.get("own_words") or ""):
                damage_call = "not_damage_unit"
            elif sub["cell_state"] == "partial":
                damage_call = "partly_covered"
            elif sub["cell_state"] == "not_named":
                damage_call = "unknown"
            else:
                damage_call = "possible_no_curve"
            rows.append({"key": sub["key"], "label": sub["label"], "share": sub["share"], "wording": wording,
                         "source": source, "damage_call": damage_call, "color": color, "curves": curves})
        tile["team"] = _summary(rows)
    by_id = {t["entry_id"]: t.get("team") for t in tiles}
    for cat in library:
        for row in cat["types"]:
            for t in row["tiles"].values():
                if t["entry_id"] in by_id:
                    team = by_id[t["entry_id"]]
                    if team and t.get("building"):
                        building = t["building"].lower()
                        scoped = [r for r in team["rows"] if r["key"].split(":", 1)[0] == building]
                        if not scoped:
                            raise BuildError(f"No Team rows for {t['entry_id']} building {building}")
                        team = _summary(scoped)
                    t["team"] = team
    for tile in tiles:
        tile.pop("team", None)
