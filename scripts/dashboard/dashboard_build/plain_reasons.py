"""Why a subsystem has no curve, in plain words.

The cells state their reasons in their own vocabulary: reason codes (`NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`), short
bracketed qualifiers ("Racking structure (secondary, open; no curve)"), or a catalogue sentence written for modelers.
`plain()` turns each into sentences a reader without that vocabulary can follow, and returns the cell's own words
beside it, so the page can keep them one click away. A code or qualifier this module does not know is shown humanised
rather than dropped.
"""
from __future__ import annotations

import re

CODES = {
    "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT": "The cell has no curve for this part.",
    "CONTENTS_DEFERRED_SEPARATE_FAILURE_UNIT": "Contents are set aside to be modeled separately later.",
    "VALUE_ALLOCATION_OR_RESPONSE_UNQUALIFIED": "Neither its share of the asset's value nor how this hazard damages it has been worked out yet.",
    "GEOMETRY_SCREENED_NOT_UNIVERSAL_ZERO": "The cell judged it unlikely to be reached in most layouts, which is not the same as no damage.",
    "FULL_TURBINE_ECONOMIC_RESPONSE_NOT_CALIBRATED": "What a whole turbine costs to repair after this hazard has not been worked out.",
    "MIXED_CIVIL_BUCKET_REQUIRES_SPLIT": "Its value mixes roads, pads, buildings and fences, which would need separating first.",
    "NO_QUALIFIED_WIND_RESPONSE_OR_ALLOCATION": "No checked damage response or value share exists for it yet.",
    "SOURCE_NATIVE_ATOM_NOT_HARMONIZED_TO_STANDARD_EQUIPMENT_ASSEMBLY": "The published source treats it as one block, which has not been split into the standard parts.",
    "OMITTED_NON_TOWER_FAILURE_MODES": "The source covers only the tower, so other ways it can fail are left out.",
    "SUPPORT_COST_ALLOCATE_ONCE_AFTER_DISPOSITION": "Its cost (crews, cranes, transport) is added once, after the other parts' damage is known.",
    "NO_INDEPENDENT_FRAGILITY": "It does not break on its own; its cost follows the damage to other parts.",
    "SEPARATE_FLOOD_SCOUR_EROSION_PATHWAY_REQUIRED": "Damage by scour and erosion needs its own treatment, which has not been built.",
    "DIRECT_THERMAL_RESPONSE_NOT_CALIBRATED": "How heat directly damages it has not been worked out.",
    "WIND_SPECIFIC_EQUIPMENT_DECOMPOSITION_REQUIRED": "The wind farm's equipment would first need splitting into its own parts.",
    "PAD_TRANSFORMER_CONSTRUCTION_AND_VALUE_REQUIRED": "How the pad transformer is built and what it is worth need defining first.",
    "ELECTRICAL_VALUE_SPLIT_REQUIRED": "The electrical value would first need splitting by part.",
    "LINE_NETWORK_EXPOSURE_AND_VALUE_REQUIRED": "Where the cable network runs, how exposed it is and what it is worth need defining first.",
    "LINE_NETWORK_EXPOSURE_REQUIRED": "Where the cable network runs and how exposed it is need defining first.",
    "LINE_EXPOSURE_AND_CONSTRUCTION_STATE_REQUIRED": "How the lines are built and how exposed they are need defining first.",
    "FACILITY_LEVEL_EXPOSURE_REQUIRED": "How exposed the whole facility is needs defining first.",
    "MIXED_BUILDING_AND_INSTRUMENT_INVENTORY_REQUIRES_SPLIT": "Its value mixes buildings and instruments, which would need separating first.",
}

# a bracketed qualifier in a catalogue part list, and what it means
QUALIFIERS = [
    (r"^no curve$", None),
    (r"^secondary$", "it is a secondary part for this hazard"),
    (r"^open$", "the question is still open"),
    (r"^optional secondary$", "it is an optional, secondary part"),
    (r"^reviewed secondary units$", "they were reviewed and judged secondary"),
    (r"^treated as no direct hail damage by coverage decision$", "the cell decided hail does not damage them directly, so they count as having no hail damage"),
    (r"^debris and velocity load is a candidate mechanism$", "floating debris and fast-moving water might damage it, but this has not been modeled"),
    (r"^treated as protection state, not a damaged part$", "it is treated as something that protects the site, not as a part that gets damaged"),
    (r"^reviewed in the write-up$", "it was looked at in the write-up"),
    (r"^withheld$", "left out for now"),
    (r"^not zero$", "which is not the same as no damage"),
]

# whole sentences the catalogue and the build write for modelers
SENTENCES = [
    (r"^No catalogue entry or curve has been built for this asset × hazard\.$",
     "No curve has been built for this hazard on this asset yet."),
    (r"^This expected subsystem is not named by the cell\.$",
     "The work on this hazard does not mention this part, so it has no curve."),
    (r"^This expected subsystem has no curve\.$", "This part has no curve yet."),
    (r"^A curve covers only part of this expected subsystem\.$",
     "A curve covers some of this part's pieces; the rest have none yet."),
    (r"^This subsystem takes another part's damage ratio and has no curve of its own\.$",
     "It has no curve of its own; it is given the same damage as another part."),
    (r"^The cell declares contents as their own failure unit and withholds them",
     "Contents (furniture, equipment and stock) are left out of this curve and will be modeled separately; that is not the same as no damage."),
    (r"^withheld by the binding$", "Left out by the reused curve: it prices only some of this asset's parts."),
    (r"^(\w[\w ]*?) changes how this asset performs rather than destroying it",
     r"\1 makes this asset work less well but is not known to break it, and a damage curve covers physical damage only, so there is no curve. Whether it has ever physically damaged one is still being researched (below)."),
    (r"^Model v0\.1 is a fail-closed research scaffold with no curve records",
     "A first research version exists but has no curve yet: no evidence so far links a hailstorm's impact on a blade to the damage found on inspection and its repair cost, and no hail measure for blades has been chosen."),
    (r"^No curve and no documented plan yet \(the BESS plan only lists other hazards as later work",
     "No curve yet, and no plan to build one: the battery plan lists other hazards only as later work."),
    (r"^No curve yet: the BESS hurricane wind cell leaves convective wind and tornado as a separate scope",
     "No curve yet: the battery hurricane work leaves convective wind and tornadoes for separate work, which the battery plan lists as later."),
    (r"^Hail was excluded from the first substation delivery",
     "No curve yet: hail was left out of the first substation work, and no published hail damage data for substations was found. Not finding data does not mean there is no risk."),
    (r"^Replacement support and fieldwork: no own curve; allocated once at the aggregate direct-and-civil damage ratio",
     "Replacement support and fieldwork has no curve of its own: its cost is added once, in proportion to the damage to the equipment and civil works (a judgment rule)."),
]


def _humanise_code(code: str) -> str:
    return code.lower().replace("_", " ").capitalize() + "."


def plain(text: str | None) -> tuple[str | None, str | None]:
    """(plain reason, the cell's own words when they differ)."""
    if not text:
        return text, None
    t = text.strip()
    codes = [c.strip() for c in t.split(";") if c.strip()]
    if codes and all(re.fullmatch(r"[A-Z][A-Z0-9_]+", c) for c in codes):
        out = list(dict.fromkeys(CODES.get(c) or _humanise_code(c) for c in codes))
        return " ".join(out), t
    for pattern, repl in SENTENCES:
        if re.search(pattern, t):
            return (re.sub(pattern + ".*$", repl, t, flags=re.S) if "\\1" in repl else repl), t
    m = re.fullmatch(r"(.+?)\s*\(([^()]*)\)\s*", t)
    if m:
        name, quals = m.group(1), [q.strip() for q in re.split(r"[;,]", m.group(2)) if q.strip()]
        said = []
        for q in quals:
            hit = next(((p, r) for p, r in QUALIFIERS if re.match(p, q, re.I)), None)
            if hit is None:
                said.append(q)
            elif hit[1]:
                said.append(hit[1])
        body = ", ".join(dict.fromkeys(said))
        return (f"{name}: no curve yet" + (f" — {body}." if body else ".")), t
    if re.fullmatch(r"[A-Z][\w ,/&-]*", t) and not t.endswith("."):  # a bare part name from a cell's "no curve yet" list
        return f"The cell lists {t if t[:2].isupper() else t[0].lower() + t[1:]} among the parts with no curve yet.", t
    return t, None
