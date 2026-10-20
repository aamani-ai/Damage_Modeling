"""The occurrence register, the slug list, the twin crosswalk pin and the value buckets of an asset."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from .catalogue import Entry
from .common import OCCURRENCE, ROOT, SENTENCES, load_json, read_csv, rel, sha256

HAZARD_REPO = Path("/Users/divy/code/work/infrasure_git_codes/Hazard_modeling")
TWIN_CROSSWALK_BESS = HAZARD_REPO / "docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv"


def slugs() -> dict[str, Any]:
    return load_json(OCCURRENCE / "slugs.json")


def asset_slug(label: str, sl: dict[str, Any]) -> str:
    return next(a["slug"] for a in sl["assets"] if a["catalogue"] == label)


def hazard_slug(label: str, sl: dict[str, Any]) -> str:
    return next(h["slug"] for h in sl["hazards"] if h["catalogue"] == label)


def register_for(entry: Entry) -> dict[str, Any] | None:
    path = entry.data.get("occurrence_register")
    if not path:
        return None
    p = ROOT / path
    if not p.exists():
        raise AssertionError(f"{entry.id}: occurrence_register {path} does not exist")
    reg = load_json(p)
    if reg.get("catalogue_entry") != entry.id:
        raise AssertionError(f"{entry.id}: occurrence register names {reg.get('catalogue_entry')!r}")
    return {"path": path, "sha256": sha256(p), "register": reg}


def all_registers(sl: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    out: dict[tuple[str, str], dict[str, Any]] = {}
    for asset in sl["assets"]:
        d = OCCURRENCE / asset["slug"]
        if not d.is_dir():
            continue
        for p in sorted(d.glob("*.json")):
            reg = load_json(p)
            out[(asset["slug"], reg["hazard"])] = {"path": rel(p), "sha256": sha256(p), "register": reg}
    return out


def resolve_state(bucket: dict[str, Any], surfaces: list[dict[str, Any]], last_searched: str | None) -> dict[str, Any]:
    """The bucket's state with its fixed sentence resolved (06 §2.4)."""
    state = bucket.get("state", "not_searched")
    s = SENTENCES.get(state, SENTENCES["not_searched"])
    reports = bucket.get("reports") or []
    if state == "none_after_search":
        n = sum(1 for sf in surfaces if sf.get("can_see_hazard") is True and sf.get("searched"))
        page = s["page"].format(n=n, date=last_searched or "—")
    elif state == "adjacent":
        what = "; ".join(r.get("what_broke", "") for r in reports if r.get("kind") == "adjacent") or "see the search log"
        page = s["page"].format(what=what)
    elif state == "found":
        page = s["page"].format(n=sum(1 for r in reports if r.get("kind") == "direct"))
    else:
        page = s["page"]
    return {"state": state, "mark": s["mark"], "sentence": page, "reports": reports, "twin_lead": bucket.get("twin_lead")}


def twin_crosswalk_pin(expected_sha: str | None) -> dict[str, Any]:
    """Copy Hazard's twin crosswalk beside the data with its SHA; the build checks it against the value binding's pin."""
    if not TWIN_CROSSWALK_BESS.exists():
        return {"available": False, "path": str(TWIN_CROSSWALK_BESS), "sha256": None, "expected_sha256": expected_sha, "ok": None, "rows": None}
    actual = sha256(TWIN_CROSSWALK_BESS)
    rows = read_csv(TWIN_CROSSWALK_BESS)
    return {"available": True, "source": "Hazard_modeling/docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv", "sha256": actual,
            "expected_sha256": expected_sha, "ok": (actual == expected_sha) if expected_sha else None, "rows": len(rows),
            "text": TWIN_CROSSWALK_BESS.read_text(encoding="utf-8"), "crosswalk": rows}


def bess_bucket_values(value_binding: dict[str, Any]) -> dict[str, float]:
    """The battery value buckets from the pinned flood_bess value binding (reference budget r1).

    enclosures = 80 × active hardware + the unmodeled racks/fire-suppression row; PCS = 20 × PCS value;
    electrical balance, civil works and fieldwork are the unmodeled rows. The five sum to the reference TIV."""
    u = value_binding["units"]
    um = value_binding["unmodeled_buckets"]
    out = {
        "battery_enclosures": u["battery_enclosures"]["count"] * u["battery_enclosures"]["same_unit_value_usd"] + um["enclosure_racks_fire_suppression"],
        "pcs": u["pcs"]["count"] * u["pcs"]["same_unit_value_usd"],
        "electrical_balance": um["electrical_balance"],
        "civil_works": um["civil_works"],
        "fieldwork": um["unallocated_fieldwork"],
    }
    total = sum(out.values())
    if abs(total - value_binding["reference_tiv_usd"]) > 1.0:
        raise AssertionError(f"battery value buckets sum to {total}, not the reference TIV {value_binding['reference_tiv_usd']}")
    return out
