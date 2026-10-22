"""The plain layer (iteration 2, DCD-D19): every sentence a reader sees first is written here by the build, from the
same data the ledger shows — never typed in a component.

- tier words, with no code before a control (G16, DCD-D28): T1 field-calibrated · T2 published · T3 borrowed · T4 our judgment
- the main logic of a cell and its four steps (G15, DCD-D27)
- the three plain chips of the status rail
- the ✓ ◐ ✗ sentences of "what it can be used for"
- one caption per drawn curve: what it says · how sure · seen in the field · main references
- the ten station paragraphs of "how this was built", from fixed templates per station
"""
from __future__ import annotations

import re
from typing import Any, Callable

from .common import SENTENCES, fmt_pct, fmt_usd_compact, humanise

# G16 (DCD-D28): the catalogue's own words. "Published" fits all nine T2 rows (FEMA Hazus tables and lab tests are both
# published); "borrowed" is the catalogue's word for T3. The codes stay in the ledger, under "Show the numbers".
TIER_SHORT = {"T1": "field-calibrated", "T2": "published", "T3": "borrowed", "T4": "our judgment"}
TIER_PLAIN = dict(TIER_SHORT)
TIER_ADJ = {"T1": "field-calibrated", "T2": "published", "T3": "borrowed", "T4": "judgment-based"}  # inside a sentence
TIER_MEANING = {
    "T1": "field-calibrated: fitted to insurance claims or field damage surveys of the same kind of asset",
    "T2": "published: taken from a published standard, a public model such as FEMA Hazus, lab tests or physics",
    "T3": "borrowed: from a similar asset or a related study, with an engineering step to make it fit",
    "T4": "our judgment: no source gives the number; a placeholder until evidence replaces it",
}
STATION_NAMES = {
    "scope": ("Scope", "Which hazard, which asset, which parts; what is left out"),
    "units": ("What breaks", "The parts of the plant the hazard damages, each with its own curve"),
    "axis_form": ("How damage is measured", "The hazard intensity on the x-axis and the shape of the curve"),
    "evidence": ("Where the numbers come from", "The sources, what was taken from each, and how sure we are"),
    "value": ("What it is worth", "The share of the plant's value the curves cover"),
    "audit": ("The audit", "The seven checks a curve passes before release"),
    "artifact": ("The files", "The runtime file, the write-up and the workbook"),
    "capability": ("What it can output", "What a consumer may compute with this curve"),
    "proof": ("How it was tested", "The known answers this build reproduced"),
    "field_review": ("Seen in the field, and reviewed", "Field reports of this damage, and who has read the entry"),
}
FORM_WORDS = {
    "piecewise_linear": "a line through fixed points (piecewise linear)",
    "logistic": "an S-shaped curve: little damage, then a steep rise, then a plateau (logistic)",
    "thresholded_logistic": "nothing below a threshold, then an S-shaped rise to a plateau (thresholded logistic)",
    "binary_state": "an on/off step: nothing, then full replacement",
    "exact_state_table": "a table of damage ratios at exact classes, nothing in between",
    "ordered_damage_state_lognormal": "ordered damage states, each reached with a lognormal chance as demand rises",
    "thresholded_weibull_expected_damage": "nothing below a threshold, then a Weibull-shaped rise (thresholded Weibull)",
}


# ─── words for numbers and tiers ──────────────────────────────────────────────────────────────────────────────

def num(x: float | int | None) -> str:
    if x is None:
        return "—"
    a = abs(float(x))
    if a >= 100:
        return f"{round(float(x)):,}"
    if a >= 10:
        s = f"{float(x):.1f}"
    else:
        s = f"{float(x):.2f}"
    return s.rstrip("0").rstrip(".") if "." in s else s


def with_unit(x: float | int | None, unit: str | None) -> str:
    if unit and unit not in ("dimensionless", "class"):
        return f"{num(x)} {unit}"
    return num(x)


def tier_words(span: str | None) -> str:
    """'T3–4' → 'borrowed and our judgment'; 'T2' → 'published'; '–' → 'no tier stated'."""
    if not span or span == "–":
        return "no tier stated"
    m = re.match(r"T(\d)(?:–(\d))?", span)
    if not m:
        return span
    lo, hi = int(m.group(1)), int(m.group(2) or m.group(1))
    words = [TIER_SHORT[f"T{t}"] for t in range(lo, hi + 1) if f"T{t}" in TIER_SHORT]
    return " and ".join(words) if len(words) <= 2 else ", ".join(words[:-1]) + " and " + words[-1]


def tier_max(*spans: str | None) -> str | None:
    """The weaker grade across spans: ('T2', 'T3–4') → 'T4'; nothing stated → None."""
    nums = [int(d) for sp in spans if sp and sp != "–" for d in re.findall(r"\d", sp)]
    return f"T{max(nums)}" if nums else None


def one_word(shape: str | None, cost: str | None) -> str:
    """The one word a tile or chip carries (G16): the weaker half's."""
    t = tier_max(shape, cost)
    return TIER_SHORT[t] if t else "no tier stated"


def halves(shape: str | None, cost: str | None) -> str:
    """Both halves in words, for a tooltip or a caption: 'How damage rises: our judgment · how it becomes dollars: published'."""
    return f"How damage rises: {tier_words(shape)} · how it becomes dollars: {tier_words(cost)}"


def tier_phrase(code: str | None) -> str:
    """'T3' → 'borrowed' — the word only; the code stays in the ledger."""
    if not code:
        return "no tier stated"
    return TIER_SHORT.get(code, code)


def _join(items: list[str], last: str = "and") -> str:
    items = [i for i in items if i]
    if not items:
        return ""
    if len(items) == 1:
        return items[0]
    return ", ".join(items[:-1]) + f" {last} " + items[-1]


def _lower_first(s: str) -> str:
    return s[:1].lower() + s[1:] if s and not s[:2].isupper() else s


SINGULAR = {"batteries": "battery plant", "solar farms": "solar farm", "wind farms": "wind farm", "buildings": "building", "substations": "substation"}


def singular(noun: str) -> str:
    return SINGULAR.get(noun.lower(), noun[:-1] if noun.endswith("s") else noun)


def label_case(label: str) -> str:
    """'PV modules' stays; 'Mounting: trackers' → 'mounting: trackers' (only the first letter, and only when the word is not an acronym)."""
    if len(label) > 1 and label[1].islower():
        return label[:1].lower() + label[1:]
    return label


REG_ID = r"[A-Z]{2,4}\d?-[SCQPAD]\d{2,3}"


def plain_text(s: str | None) -> str | None:
    """The default view's form of a catalogue sentence: register IDs dropped (a note beside one is kept), and every tier
    code said in words (G16) — "reused as a T4 hypothesis" → "reused as a judgment-based hypothesis". The raw text
    stays in the ledger."""
    if not s:
        return s
    t = str(s)

    def paren(m: re.Match[str]) -> str:
        parts = [p.strip() for p in re.split(r"[;,]", m.group(1))]
        keep = [re.sub(rf"\s*\b{REG_ID}\b\s*", " ", p).strip() for p in parts if not re.fullmatch(REG_ID, p)]
        keep = [p for p in keep if p]
        return f" ({'; '.join(keep)})" if keep else ""

    t = re.sub(rf"\s*\(([^()]*\b{REG_ID}\b[^()]*)\)", paren, t)
    t = re.sub(rf"\s*\b{REG_ID}\b", "", t)
    t = re.sub(r"\s+([,;.)])", r"\1", t)
    t = re.sub(r"\(\s+", "(", t)
    t = re.sub(r"\s{2,}", " ", t).strip()
    return words_for_codes(t)


def words_for_codes(t: str) -> str:
    """Tier codes in a sentence become words (G16): '(T3)' → '(borrowed)', 'are T4' → 'are judgment-based',
    'Tier-4 points' → 'judgment-based points', 'judgment (T4)' → 'judgment'."""
    t = re.sub(r"(judge?ment)\s*\(T4\)", r"\1", t, flags=re.I)
    t = re.sub(r"\((T[1-4])\)", lambda m: f"({TIER_SHORT[m.group(1)]})", t)
    t = re.sub(r"\bTier[- ]([1-4])\b", lambda m: TIER_ADJ[f"T{m.group(1)}"], t, flags=re.I)
    t = re.sub(r"\bT([1-4])\s*[–-]\s*T?([1-4])\b", lambda m: f"{TIER_ADJ['T' + m.group(1)]} to {TIER_ADJ['T' + m.group(2)]}", t)
    t = re.sub(r"\b(T[1-4])\b(?![_\w])", lambda m: TIER_ADJ[m.group(1)], t)
    return t


def _strip_amount(s: str) -> str:
    return re.sub(r"\s*\(\$[\d.,]+\s*[MBk]?\)\s*$", "", s).strip()


# ─── the status rail, in words ────────────────────────────────────────────────────────────────────────────────

def plain_rail(status: str, qualifier: str | None, shape: str, cost: str, occ_state: str | None, occ_label: str, review: dict[str, Any]) -> dict[str, Any]:
    exists_words = {
        "live": "Live · " + ("a screening model" if (qualifier or "").startswith("screening") else "in the runtime index"),
        "proposal": "Proposal · not in the runtime index yet",
        "reused": "Reused · borrows another cell's curve",
        "gap": "Gap · no curve yet",
    }[status]
    worst = tier_max(shape, cost)
    tiers = [worst] if worst else []
    ev_words = "Evidence: " + (TIER_SHORT[worst] if worst else "no tier stated")
    occ_words = {
        "not_searched": "Field reports: nobody has looked yet",
        "found": "Field reports: found",
        "adjacent": "Field reports: adjacent evidence only",
        "none_after_search": "Field reports: none found after a search",
    }.get(occ_state or "not_searched", f"Field reports: {occ_label}")
    rv = review.get("review")
    review_words = f"Reviewed by {rv['by']} on {rv['on']}: {rv['verdict']}" if rv else "Not yet reviewed by a person"
    return {
        "exists": {"words": exists_words, "code": f"{status.upper()}{' · ' + qualifier if qualifier else ''}"},
        "evidence": {"words": ev_words, "code": halves(shape, cost) if worst else "no tier stated", "tiers": tiers, "codes": f"shape {shape} · cost {cost}"},
        "occurrence": {"words": occ_words, "code": occ_words},
        "review": {"words": review_words, "code": review.get("label", "")},
    }


# ─── what it can be used for ──────────────────────────────────────────────────────────────────────────────────

def _mark_of(text: str) -> str:
    t = (text or "").strip().lower()
    if t.startswith("allowed"):
        return "✓"
    if t.startswith("conditional"):
        return "◐"
    if t.startswith("withheld"):
        return "✗"
    return "◐"


def _after_colon(text: str) -> str:
    t = (text or "").strip()
    if ":" in t:
        t = t.split(":", 1)[1].strip()
    elif t.lower().startswith(("allowed with", "withheld until", "withheld before", "withheld for")):
        t = t
    return _lower_first(t) if t else ""


def _give(input_text: str | None) -> str:
    """'Water depth above local grade (m), finite …; water type must be stated' → 'give water depth above local grade and water type'."""
    if not input_text:
        return ""
    cleaned = re.sub(r"\s*\([^)]*\)", "", input_text)
    first = re.split(r"[;,]", cleaned)[0].strip()
    extras = []
    if re.search(r"water type", input_text, re.I):
        extras.append("the water type")
    if re.search(r"sub-peril", input_text, re.I):
        extras.append("the sub-peril")
    if re.search(r"resistance scenario", input_text, re.I):
        extras.append("a resistance scenario")
    if re.search(r"building", input_text, re.I) and re.search(r"storm|terrain|floor", input_text, re.I):
        extras.append("the building")
    words = label_case(first)
    return "give " + _join([words] + extras)


def capability_sentences(entry: dict[str, Any], artifact: dict[str, Any], hazard_label: str) -> list[dict[str, Any]]:
    """The catalogue's outputs and the capability declaration as ✓ ◐ ✗ sentences; the owner's own words stay as the detail."""
    hu = entry.get("how_to_use") or {}
    outputs = hu.get("outputs") or {}
    out: list[dict[str, Any]] = []
    labels = {"single_event": f"one {hazard_label.lower()} event", "scenario_dollars": "a dollar scenario", "yearly_loss": "yearly loss"}
    for key, label in labels.items():
        text = outputs.get(key)
        if text is None:
            continue
        mark = _mark_of(text)
        detail = _after_colon(text)
        if key == "single_event" and mark == "✓":
            give = _give(entry.get("input"))
            label = f"{label} ({give})" if give else label
        if key == "yearly_loss" and mark == "◐":
            label = "yearly loss — only through Hazard"
        if key == "scenario_dollars" and mark == "✓":
            label = "a dollar scenario (give the unit value)"
        out.append({"key": key, "mark": mark, "label": label, "short": {"single_event": f"one {hazard_label.lower()} event", "scenario_dollars": "a dollar scenario", "yearly_loss": "yearly loss"}[key], "detail": plain_text(detail)})
    cap = artifact.get("capability_declaration") or {}
    cam = cap.get("consumer_annual_metrics") or {}
    pml = cam.get("pml") or cam.get("status_after_promotion")
    if entry.get("kind") == "binding":
        out.append({"key": "pml", "mark": "◐", "label": "PML, VaR — only from Hazard's validated annual loss distribution, per the source cell", "short": "PML and VaR", "detail": ""})
    elif pml and "computable" in str(pml):
        out.append({"key": "pml", "mark": "◐", "label": "PML, VaR, TVaR — only from Hazard's validated annual loss distribution", "short": "PML, VaR and TVaR", "detail": humanise(str(pml))})
    else:
        out.append({"key": "pml", "mark": "✗", "label": "PML, VaR — not supported", "short": "PML and VaR", "detail": humanise(str(pml)) if pml else "the curve carries no spread, so no tail metric can be formed from it"})
    return out


# ─── one caption per curve ────────────────────────────────────────────────────────────────────────────────────

def _main_series(curve: dict[str, Any]) -> list[dict[str, Any]]:
    return [s for s in curve.get("series") or [] if not s.get("continuation") and s.get("points")]


def _describe_line(points: list[list[float]], part: str, axis_label: str, unit: str | None, rise_word: str = "damage then rises") -> str:
    ys = [y for _, y in points]
    ymax = max(ys)
    if ymax <= 1e-9:
        return f"{part}: the damage ratio is zero everywhere in the sampled range of {axis_label}."
    onset = next((x for x, y in points if y > 0.005), None)
    half = next((x for x, y in points if y >= 0.5 * ymax - 1e-12), None)
    full = next((x for x, y in points if y >= 0.99 * ymax - 1e-12), None)
    reach = "full replacement" if ymax >= 0.995 else f"a damage ratio of {num(ymax)} ({fmt_pct(ymax)} of the part's value)"
    x0 = points[0][0]
    if onset is None or onset <= x0 + 1e-12:
        start = f"{part}: loss begins at {with_unit(x0, unit)} of {axis_label}"
    else:
        start = f"{part}: no loss until {axis_label} reaches about {with_unit(onset, unit)}"
    tail = f"reaches {reach} by {with_unit(full, unit)}" if full is not None and full < points[-1][0] - 1e-9 else \
        (f"reaches {reach} at the end of the sampled range, {with_unit(points[-1][0], unit)}" if full is not None else f"is still rising at {with_unit(points[-1][0], unit)} (damage ratio {num(ys[-1])} there)")
    mid = f", passing half of {'full loss' if ymax >= 0.995 else 'its maximum'} near {with_unit(half, unit)}" if half is not None and half != full else ""
    return f"{start}; {rise_word}{mid}, and {tail}."


def _describe_step(points: list[list[float]], part: str, axis_label: str, unit: str | None) -> str:
    jump = None
    for (x1, y1), (x2, y2) in zip(points, points[1:]):
        if abs(x2 - x1) < 1e-9 and abs(y2 - y1) > 1e-9:
            jump = (x1, y2)
            break
    if jump is None:
        return _describe_line(points, part, axis_label, unit)
    x, y = jump
    what = "is written off (damage ratio 1)" if y >= 0.995 else f"loses {fmt_pct(y)} of its value"
    return f"Nothing happens until {axis_label} rises above {with_unit(x, unit)}; then the {_lower_first(part)} {what} in one step."


def _describe_classes(points: list[list[float]], part: str, classes: dict[str, str] | None) -> str:
    bits = []
    for x, y in points:
        cls = int(x)
        name = f"class {cls}" + (" (no event)" if cls == 0 else "")
        bits.append(f"{num(y)} at {name}")
    return f"{part}: the damage ratio is {_join(bits)}; nothing is drawn between classes because the model only answers at exact classes."


def what_it_says(curve: dict[str, Any]) -> str:
    part = curve.get("part") or humanise(curve.get("failure_unit_id") or curve.get("curve_id"))
    axis = curve.get("axis") or {}
    label, unit = axis.get("label") or "the hazard axis", axis.get("unit")
    main = _main_series(curve)
    if not curve.get("drawn") or not main:
        return f"{part}: not drawn here — {curve.get('no_evaluator_sentence') or 'no sampled points'}"
    sentences: list[str] = []
    if axis.get("kind") == "categorical" or main[0].get("kind") == "categorical":
        sentences.append(_describe_classes(main[0]["points"], part, axis.get("classes")))
        if len(main) > 1:
            sentences.append(f"{len(main)} records are drawn for this part ({_join([s['label'] for s in main])}); the first is described.")
    elif any(s.get("scenario") for s in main):
        central = next((s for s in main if "central" in (s.get("scenario") or "")), main[0])
        sentences.append(_describe_line(central["points"], part, label, unit, rise_word=f"under the {humanise(central.get('scenario') or 'central')} scenario damage rises"))
        others = [s for s in main if s is not central]
        if others:
            halves = []
            for s in others:
                ys = [y for _, y in s["points"]]
                ymax = max(ys) if ys else 0
                half = next((x for x, y in s["points"] if y >= 0.5 * ymax - 1e-12), None) if ymax > 0 else None
                if half is not None:
                    halves.append(f"the {humanise(s.get('scenario') or s['label'])} scenario near {with_unit(half, unit)}")
            if halves:
                sentences.append(f"The other scenarios reach half of their maximum at different demands: {_join(halves)}. They are alternatives, never averaged.")
    else:
        first = main[0]
        if first.get("kind") == "step":
            sentences.append(_describe_step(first["points"], part, label, unit))
        else:
            sentences.append(_describe_line(first["points"], part, label, unit))
        for s in main[1:]:
            if s.get("variant"):
                ys = [y for _, y in s["points"]]
                ymax = max(ys) if ys else 0
                half = next((x for x, y in s["points"] if y >= 0.5 * ymax - 1e-12), None) if ymax > 0 else None
                if s.get("kind") == "step":
                    sentences.append(f"The {humanise(s['variant'])} variant: " + _lower_first(_describe_step(s["points"], part, label, unit)))
                elif half is not None:
                    sentences.append(f"The {humanise(s['variant'])} variant reaches half of its maximum near {with_unit(half, unit)}.")
    for s in curve.get("series") or []:
        if s.get("continuation") and s.get("points"):
            frm = s["points"][0][0]
            y = s["points"][-1][1]
            sentences.append(f"Beyond {with_unit(frm, unit)} the line is continued at a damage ratio of {num(y)} — our judgment, no data that far.")
    for z in curve.get("withheld_zones") or []:
        reason = str(z.get("reason") or "")
        if "flag" in reason.lower() and "zero" in reason.lower():
            sentences.append(f"Between {with_unit(z['from'], unit)} and {with_unit(z['to'], unit)} the model assigns zero and flags it.")
        elif z.get("to") is None:
            sentences.append(f"Above {with_unit(z['from'], unit)} the model withholds an answer instead of guessing.")
        else:
            sentences.append(f"Between {with_unit(z['from'], unit)} and {with_unit(z['to'], unit)} the model withholds an answer.")
    return " ".join(sentences)


def how_sure(curve: dict[str, Any], params: list[dict[str, Any]]) -> dict[str, Any]:
    """Two halves in words (G16): how damage rises and how it becomes dollars, each with where it comes from."""
    t = curve.get("tiers") or {}
    shape = {"tier": t.get("shape"), "word": TIER_SHORT.get(t.get("shape") or "", "no tier stated"), "basis": plain_text(t.get("shape_basis"))}
    cost = {"tier": t.get("cost"), "word": TIER_SHORT.get(t.get("cost") or "", "no tier stated"), "basis": plain_text(t.get("cost_basis"))}
    by_tier: dict[str, int] = {}
    for p in params:
        if p.get("tier"):
            by_tier[p["tier"]] = by_tier.get(p["tier"], 0) + 1
    counts = _join([f"{n} {TIER_SHORT.get(k, k)}" for k, n in sorted(by_tier.items())])
    return {"shape": shape, "cost": cost, "parameters": f"{len(params)} parameter{'s' if len(params) != 1 else ''}" + (f": {counts}" if counts else "") if params else "no parameter rows for this curve",
            "weakest": max(by_tier) if by_tier else (t.get("cost") or t.get("shape")), "word": one_word(t.get("shape"), t.get("cost"))}


def resolve_key_sources(key_sources: list[str], sources_by_id: dict[str, dict[str, Any]], aliases: dict[str, str]) -> list[dict[str, Any]]:
    """'NEMA GD 1-2016, Evaluating … (BF-S02)' → the register row BF-S02 with its link; an ID with no row keeps its text."""
    out = []
    for ks in key_sources:
        m = re.search(r"\(([A-Za-z][A-Za-z0-9_\-]{1,60}(?:\s*[,/]\s*[A-Za-z][A-Za-z0-9_\-]{1,60})*)(?:;\s*([^)]*))?\)\s*$", ks)
        id_list = [i.strip() for i in re.split(r"[,/]", m.group(1))] if m else []
        note = (m.group(2) or "").strip() if m else ""
        text = (ks[: m.start()].strip() + (f" ({note})" if note else "")) if m else ks
        rows = [sources_by_id.get(aliases.get(i, i)) for i in id_list]
        row = next((r for r in rows if r), None)
        out.append({"text": text, "ids": id_list, "title": row.get("title") if row else text, "link": row.get("link") if row else None,
                    "link_kind": row.get("link_kind") if row else "none", "locator": row.get("locator") if row else None,
                    "no_link_sentence": (row.get("no_link_sentence") if row else ("not in the register" if id_list else None)), "source_id": row.get("id") if row else None})
    return out


def curve_caption(curve: dict[str, Any], params: list[dict[str, Any]], sources_by_id: dict[str, dict[str, Any]], aliases: dict[str, str],
                  key_sources: list[str], occurrence: dict[str, Any] | None, search_log_href: str | None) -> dict[str, Any]:
    cited = sorted({aliases.get(s, s) for p in params for s in p.get("source_ids", [])})
    refs = [sources_by_id[s] for s in cited if s in sources_by_id]
    main_refs = resolve_key_sources(key_sources, sources_by_id, aliases)[:5]
    named = {r.get("source_id") for r in main_refs}
    for r in refs:
        if len(main_refs) >= 6:
            break
        if r["id"] not in named:
            main_refs.append({"text": r.get("title"), "ids": [r["id"]], "title": r.get("title"), "link": r.get("link"), "link_kind": r.get("link_kind"), "locator": r.get("locator"),
                              "no_link_sentence": r.get("no_link_sentence"), "source_id": r["id"]})
            named.add(r["id"])
    if not main_refs:
        main_refs = []
    if occurrence:
        seen = {"sentence": occurrence["sentence"], "state": occurrence["state"], "href": search_log_href, "words": ("nobody has looked yet" if occurrence["state"] == "not_searched" else occurrence["sentence"])}
    else:
        seen = {"sentence": SENTENCES["not_searched"]["page"], "state": "not_searched", "href": None, "words": "nobody has looked yet; no search log exists for this asset and hazard"}
    return {"what_it_says": what_it_says(curve), "how_sure": how_sure(curve, params), "seen_in_field": seen, "main_references": main_refs,
            "references_from": "the entry's key sources" + (", then the parameters' own" if any(r.get("source_id") and r.get("source_id") not in {x.get("source_id") for x in resolve_key_sources(key_sources, sources_by_id, aliases)} for r in main_refs) else "")}


# ─── the ten station paragraphs ───────────────────────────────────────────────────────────────────────────────

def _form_sentence(curves: list[dict[str, Any]]) -> str:
    forms: list[str] = []
    for c in curves:
        f = c.get("form_label") or c.get("curve_form") or ""
        x = str(c.get("x_axis_id") or "")
        if "binary" in x:
            key = "binary_state"
        elif "exact" in f or "exact_integer" in x:
            key = "exact_state_table"
        elif "thresholded_logistic" in f or ("logistic" in f and any(k in str(c.get("parameters") or {}) for k in ("R0", "threshold"))):
            key = "thresholded_logistic"
        elif "logistic" in f:
            key = "logistic"
        elif "weibull" in f:
            key = "thresholded_weibull_expected_damage"
        elif "ordered" in f:
            key = "ordered_damage_state_lognormal"
        elif "piecewise" in f:
            key = "piecewise_linear"
        else:
            key = f
        w = FORM_WORDS.get(key, humanise(key))
        if w and w not in forms:
            forms.append(w)
    if not forms:
        return ""
    if len(forms) == 1:
        return f"The curve is {forms[0]}."
    return "The curves take " + str(len(forms)) + " forms: " + "; ".join(forms) + "."


def _form_keys(curves: list[dict[str, Any]]) -> list[str]:
    keys: list[str] = []
    for c in curves:
        f = c.get("form_label") or c.get("curve_form") or ""
        x = str(c.get("x_axis_id") or "")
        if "binary" in x:
            key = "binary_state"
        elif "exact" in f or "exact_integer" in x:
            key = "exact_state_table"
        elif "thresholded_logistic" in f or ("logistic" in f and any(k in str(c.get("parameters") or {}) for k in ("R0", "threshold"))):
            key = "thresholded_logistic"
        elif "logistic" in f:
            key = "logistic"
        elif "weibull" in f:
            key = "thresholded_weibull_expected_damage"
        elif "ordered" in f:
            key = "ordered_damage_state_lognormal"
        elif "piecewise" in f:
            key = "piecewise_linear"
        else:
            key = f
        if key and key not in keys:
            keys.append(key)
    return keys


def parameters_plain(params: list[dict[str, Any]], sources_by_id: dict[str, dict[str, Any]], aliases: dict[str, str]) -> list[dict[str, Any]]:
    """Each parameter in words: its value, its tier word and the documents behind it, with links."""
    out = []
    for p in params:
        v = p.get("value")
        if isinstance(v, (int, float)) and not isinstance(v, bool):
            vt = num(v)
        elif isinstance(v, list):
            vt = f"{len(v)} points" if v and isinstance(v[0], list) else _join([str(x) for x in v[:6]])
        elif isinstance(v, dict):
            vt = _join([f"{k_} {num(x) if isinstance(x, (int, float)) else x}" for k_, x in list(v.items())[:4]])
        else:
            vt = str(v) if v not in (None, "") else ""
        srcs = []
        for sid in p.get("source_ids") or []:
            row = sources_by_id.get(aliases.get(sid, sid))
            srcs.append({"id": sid, "title": row.get("title") if row else sid, "link": row.get("link") if row else None, "link_kind": row.get("link_kind") if row else "none", "resolved": bool(row)})
        name = str(p.get("name") or "")
        words = humanise(name) if re.fullmatch(r"[A-Za-z0-9_]+", name) and "_" in name else name
        out.append({"id": p.get("id"), "name": words, "raw_name": name, "value_text": vt[:120], "tier": p.get("tier"), "tier_word": TIER_SHORT.get(p.get("tier") or "", "no tier stated"),
                    "sources": srcs, "claim_ids": p.get("claim_ids") or [], "curve_id": p.get("curve_id"), "reasoning": plain_text(p.get("reasoning")), "update_trigger": p.get("update_trigger"), "role": p.get("role")})
    return out


def station_plain(sid: str, ctx: dict[str, Any]) -> dict[str, Any]:
    """One station's plain name, meaning, paragraph and plain fact, from the context the build already holds."""
    name, meaning = STATION_NAMES[sid]
    e, a = ctx["entry"], ctx["artifact"]
    hazard, noun = ctx["hazard"], ctx["noun"]
    parts, withheld = ctx["parts"], ctx["withheld_units"]
    value = ctx.get("value")
    st = ctx["station"]
    p = ""
    fact = ""
    if e.get("kind") == "gap":
        p = f"{hazard} on {noun} has no curve yet. {e.get('reason', '').rstrip('.')}." if sid == "scope" else "Not applicable: this is a gap entry with no artifact."
        return {"id": sid, "name": name, "meaning": meaning, "paragraph": p, "plain_fact": "gap" if sid == "scope" else "—"}
    if sid == "scope":
        method = plain_text((e.get("method") or {}).get("summary", "").rstrip("."))
        names = [pt["part"] for pt in parts]
        p = f"{hazard} on {noun}: {_lower_first(method)}." if method else f"{hazard} on {noun}."
        if names:
            p += f" It names {len(names)} part{'s' if len(names) != 1 else ''}: {_join(names)}."
        if e.get("out_of_scope"):
            p += f" Outside its scope: {_join([_lower_first(plain_text(x)) for x in e['out_of_scope']], 'and')}."
        if e.get("missing_mechanisms"):
            p += f" Kinds of damage it does not include: {_join([_lower_first(plain_text(x)) for x in e['missing_mechanisms']])}."
        fact = f"{len(names)} part{'s' if len(names) != 1 else ''}" + (f" · {len(e.get('out_of_scope') or [])} left out" if e.get("out_of_scope") else "")
    elif sid == "units":
        names = [pt["part"] for pt in parts]
        p = f"For this hazard the {singular(noun)} is split into {len(names)} part{'s' if len(names) != 1 else ''}: {_join(names)}." if names else "No part rows are listed in the catalogue entry."
        if withheld:
            p += f" {len(withheld)} further unit{'s are' if len(withheld) != 1 else ' is'} named but withheld — {_join([humanise(w['failure_unit_id']).lower() for w in withheld])} — a stated 'not zero', not a curve."
        nc = [plain_text(_strip_amount(x)) for x in e.get("not_covered") or []]
        if nc:
            p += f" Parts of the plant's value with no curve yet: {_join([_lower_first(x) for x in nc])}."
        fact = f"{len(names)} part{'s' if len(names) != 1 else ''}" + (f" · {len(withheld)} withheld" if withheld else "")
    elif sid == "axis_form":
        curves = ctx["curves"]
        axes = []
        for c in curves:
            ax = c.get("axis") or {}
            lab = f"{ax.get('label')}" + (f" ({ax['unit']})" if ax.get("unit") and ax["unit"] not in ("dimensionless", "class") else "")
            if lab not in axes:
                axes.append(lab)
        p = f"Damage is read against {_join(axes)}." if axes else "No hazard axis is declared."
        form = _form_sentence(curves)
        if form:
            p += " " + form
        if e.get("input"):
            p += f" The input, in the catalogue's words: {_lower_first(plain_text(e['input'].rstrip('.')))}."
        short = {"binary_state": "a step", "piecewise_linear": "a line through points", "logistic": "an S-curve", "thresholded_logistic": "a threshold, then an S-curve",
                 "exact_state_table": "exact classes", "ordered_damage_state_lognormal": "damage states", "thresholded_weibull_expected_damage": "a threshold, then a rise"}
        fact = " + ".join(dict.fromkeys(short.get(k_, k_.replace("_", " ")) for k_ in _form_keys(curves))) or "—"
    elif sid == "evidence":
        src = ctx["sources"]
        docs = [s for s in src if s.get("kind") not in ("marker", "placeholder")]
        params = ctx["parameters"]
        prov = ctx["evidence_provenance"]
        top = [r["text"] for r in ctx.get("key_references") or [] if r.get("text")] or [s.get("title") or s["id"] for s in docs[:5]]
        if docs:
            p = f"{len(docs)} source{'s' if len(docs) != 1 else ''} set this cell" + (f": {_join(top[:4])}" + (f" and {len(docs) - 4} more" if len(docs) > 4 else "") if top else "") + "."
        else:
            p = "No source list could be read for this cell."
        by_tier: dict[str, int] = {}
        for pr in params:
            if pr.get("tier"):
                by_tier[pr["tier"]] = by_tier.get(pr["tier"], 0) + 1
        if params:
            p += f" Of the {len(params)} parameter{'s' if len(params) != 1 else ''}, " + _join([f"{n} {'are' if n != 1 else 'is'} {TIER_SHORT.get(k, k)}" for k, n in sorted(by_tier.items())]) + "."
        if prov["kind"] == "register":
            p += " The source and claim registers are machine-readable files in the cell folder."
        elif prov["kind"] == "extracted":
            p += f" The sources were read from the workbook's {_join(prov['sheets'])} sheet{'s' if len(prov['sheets']) != 1 else ''}" + (f" and the dossier's {_join(prov['sections'])}" if prov.get("sections") else "") + ", because this older cell keeps them there rather than in register files."
        elif prov["kind"] == "not_yet_extracted":
            p += " " + prov["sentence"]
        if prov.get("unmatched"):
            p += f" {len(prov['unmatched'])} source ID{'s' if len(prov['unmatched']) != 1 else ''} in the tier table ({_join(prov['unmatched'])}) {'match' if len(prov['unmatched']) != 1 else 'matches'} no document in the workbook or dossier."
        lc = ctx["link_counts"]
        if lc["locator_only"] or lc["neither"]:
            p += f" {lc['locator_only'] + lc['neither']} source{'s have' if lc['locator_only'] + lc['neither'] != 1 else ' has'} no link in the register" + (f" ({lc['locator_only']} with a locator)" if lc["locator_only"] else "") + "."
        fact = f"{len(docs)} source{'s' if len(docs) != 1 else ''}" + (f" · {tier_words(ctx['tier_span'])}" if ctx.get("tier_span") and ctx["tier_span"] != "–" else "")
    elif sid == "value":
        hu = e.get("how_to_use") or {}
        if value and value.get("share_covered") is not None:
            nc = [n["label"] for n in value.get("no_curve") or []]
            if value.get("covered_usd") is not None:
                p = f"{value['covered_label']} of the reference plant has a curve ({fmt_pct(value['share_covered'])})."
            else:
                p = f"{fmt_pct(value['share_covered'])} of the project's value has a curve."
            if nc:
                p += f" No curve yet for {_join([_lower_first(x) for x in nc])} ({fmt_pct(1 - value['share_covered'])} of the value)."
            fact = f"{fmt_pct(value['share_covered'])} of value"
        else:
            p = f"The damage ratio is a share of {_lower_first(hu.get('share_of', 'the part\'s replacement value').rstrip('.'))}." if hu.get("share_of") else "The files state what the damage ratio is a share of only in the write-up."
            p += " The files state no plant-level dollar figure for this asset."
            if ctx.get("fu_shares"):
                known = [f"{pt['part']} {fmt_pct(sh)}" for pt, sh in ctx["fu_shares"]]
                if known:
                    p += f" Shares of the plant's physical value, as the cell states them: {_join(known)}."
            fact = "shares per part" if ctx.get("fu_shares") else "no plant value stated"
    elif sid == "audit":
        t = ctx["audit_table"]
        if t:
            scol = next((i_ for i_, c_ in enumerate(t["columns"]) if re.search(r"status|outcome|verdict", c_, re.I)), None)
            statuses = [r[scol] for r in t["rows"] if scol is not None and len(r) > scol and r[scol]]
            p = f"The seven-step audit is {'a file in the cell folder' if t['kind'] == 'file' else 'written in the dossier'} with {len(t['rows'])} rows" + (f"; the statuses it records: {_join(sorted(set(statuses)))}" if statuses else "") + "."
            fact = "7-step audit as a file" if t["kind"] == "file" else "7 steps in the write-up"
        elif st.get("state") == "prose":
            p = "The adjustments — which selectors and conditioners change the curve — are written in the dossier; no seven-step audit table exists as a file."
            fact = "adjustments in the write-up"
        else:
            p = "No seven-step audit was found as a file or as a section of the dossier. That is a finding, not an omission of the page."
            fact = "no audit found"
        p += " A site-condition adapter " + ("exists as a file." if ctx.get("site_adapter") else "has not been written for this cell.")
    elif sid == "artifact":
        ident = ctx["identity"]
        n = len(ctx["curves"])
        p = f"The runtime file is the curve artifact with {n} curve record{'s' if n != 1 else ''} ({ident.get('model')}, {ident.get('docs')})." if ident.get("model") else f"The runtime file carries {n} curve record{'s' if n != 1 else ''}."
        if ctx.get("dossier"):
            p += f" The write-up is {ctx['dossier'].split('/')[-1]}."
        if ctx.get("workbook"):
            p += f" The workbook is {ctx['workbook'].split('/')[-1]}."
        p += f" The cell folder holds {ctx['n_files']} files, each with its SHA under Details."
        fact = f"{n} curve record{'s' if n != 1 else ''}"
    elif sid == "capability":
        caps = ctx["capabilities"]
        ok = [c["short"] for c in caps if c["mark"] == "✓"]
        cond = [c["short"] for c in caps if c["mark"] == "◐"]
        no = [c["short"] for c in caps if c["mark"] == "✗"]
        bits = []
        if ok:
            bits.append(f"It can give {_join(ok)}.")
        if cond:
            bits.append(f"{_join(cond)[:1].upper() + _join(cond)[1:]} {'are' if len(cond) != 1 else 'is'} available only under conditions the consumer (Hazard) checks.")
        if no:
            bits.append(f"{_join(no)[:1].upper() + _join(no)[1:]} {'are' if len(no) != 1 else 'is'} not supported.")
        p = " ".join(bits) if bits else "No capability declaration is carried."
        p += " Annual metrics belong to the consumer; nothing here is an expected annual loss."
        fact = f"{len(ok)} of {len(caps)} outputs allowed"
    elif sid == "proof":
        k = ctx["kats"]
        if k.get("run"):
            p = f"This build reproduced {k['reproduced']} of {k['run']} known answers through the cell's evaluator" + (f" (within {k['tolerance']:g} on the damage ratio)" if k.get("tolerance") else "") + "."
            nr = sum(x["n"] for x in k.get("not_run") or [])
            if nr:
                p += f" {nr} {'were' if nr != 1 else 'was'} not run: {_join(sorted({x['reason'] for x in k['not_run']}))}."
            if k.get("failed"):
                p += f" {len(k['failed'])} did not reproduce."
            fact = f"{k['reproduced']} of {k['run']} reproduced"
        elif k.get("declared"):
            p = f"{k['declared']} known answers are declared but none was run by this build."
            fact = f"{k['declared']} declared, not run"
        else:
            p = "The artifact declares no known-answer tests, so this build reproduced none."
            fact = "no known answers"
        v = ctx.get("validation")
        p += f" The validation record says {humanise(v['status'] or 'report')}" + (f" ({v['date']})" if v and v.get("date") else "") + "." if v else " No validation record was found."
        oc = ctx.get("outside_checks") or []
        p += f" {len(oc)} outside check{'s' if len(oc) != 1 else ''}: {_join([c['name'] for c in oc])}." if oc else " No outside check has been made yet."
    elif sid == "field_review":
        occ = ctx.get("occurrence_sentence")
        p = occ or SENTENCES["not_searched"]["page"]
        rv = ctx["review"]
        if rv.get("review"):
            p += f" The entry was reviewed by {rv['review']['by']} on {rv['review']['on']} ({rv['review']['verdict']})."
        else:
            p += f" The catalogue entry has been read by an agent only ({rv.get('entry_read_on') or 'no date'}); no person has reviewed it yet."
        if rv.get("release_review"):
            p += f" The curve release carries its own review state: {rv['release_review']}."
        fact = ("not searched" if (ctx.get("occurrence_state") or "not_searched") == "not_searched" else "searched") + " · " + ("reviewed" if rv.get("review") else "agent-read")
    return {"id": sid, "name": name, "meaning": meaning, "paragraph": p, "plain_fact": fact}


# ─── the cell page's first view (G15, DCD-D27): the main logic and the four steps ─────────────────────────────────

def _first_clause(s: str) -> str:
    """Text up to the first ';' that is not inside parentheses."""
    depth = 0
    for i, ch in enumerate(s):
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth = max(0, depth - 1)
        elif ch == ";" and depth == 0:
            return s[:i].strip()
    return s.strip()


def _axis_phrase(ax: dict[str, Any]) -> str:
    label = (ax.get("label") or "").strip()
    unit = ax.get("unit")
    if label and unit and unit not in ("dimensionless", "class") and f"({unit})" not in label:
        label += f", in {unit}"
    return label


def axis_short(ax: dict[str, Any]) -> str:
    """'hail diameter, MESH equivalent' → 'hail diameter'; 'FSim conditional flame-length class (0 = no event)' → 'FSim conditional flame-length class'."""
    label = (ax.get("label") or "").strip()
    return re.split(r" \(|, | = ", label)[0].strip()


def _sentence(text: str | None) -> str:
    t = (text or "").strip()
    if not t:
        return ""
    t = t[:1].upper() + t[1:]
    return t if t.endswith((".", "!", "?")) else t + "."


# the rationale keys of an artifact's derivation_rationale that speak to the curve's shape (not to release or scope)
_SHAPE_WORDS = ("smooth", "curve", "fit", "form", "continuous", "logistic", "table", "linear", "step", "shape")
# the parameter that sets the curve's shape, best first: the one that is the form (its role or name says form or shape),
# one fitted for the shape, one whose value names a form ("binary strict greater-than"), one that holds the curve's points
_FORM_ROLE = ("curve_form",)
_FIT_ROLES = ("curve_fit_shape", "curve_shape_and_level")
_FORM_NAME = re.compile(r"(?<![a-z])form(?![a-z])|shape", re.I)  # not "platform", "transform", "lifeform"
_POINTS_NAME = re.compile(r"knots|ordinates|points|response", re.I)
_FORM_VALUE = re.compile(r"\b(binary|step|linear|logistic|lognormal|interpolat\w*)\b", re.I)
# resolves the cell a curve builds on: (its name, its artifact), or None
ShapeSource = Callable[[dict[str, Any]], "tuple[str, dict[str, Any]] | None"]


def _reason(text: str) -> str:
    """A reason in the default view's words: register, claim and decision IDs, ALL_CAPS decision keys and lists of cell
    IDs dropped, tier codes in words."""
    t = plain_text(re.sub(r"\s*\([A-Z0-9_]{6,}\)", "", str(text))) or ""
    t = re.sub(r"\s*\((?:to |see |per )?[SCQPAD]\d{2,3}(?:\s*(?:[;,]|to|and)\s*[SCQPAD]\d{2,3})*\)", "", t)
    t = re.sub(r"[;,]?\s*\bD-[A-Z]{2,6}-\d{2}\b", "", t)
    t = re.sub(r"\s*\([a-z]+(?:_[a-z]+)+(?:,\s*[a-z]+(?:_[a-z]+)+)*\)", "", t)
    t = re.sub(r"\(\s*\)", "", t)
    t = re.sub(r"\s+([,;.)])", r"\1", t)
    t = re.sub(r"[;,]+(\.?)\s*$", r"\1", re.sub(r"\s{2,}", " ", t).strip())
    return _sentence(t)


def _shape_rank(r: dict[str, Any]) -> int | None:
    role = str(r.get("param_role") or r.get("role") or "")
    name = str(r.get("parameter") or r.get("scope") or "")
    if role in _FORM_ROLE or _FORM_NAME.search(name):
        return 0
    if role in _FIT_ROLES:
        return 1
    if _FORM_VALUE.search(str(r.get("value") or r.get("value_or_rule") or "")):
        return 2
    if _POINTS_NAME.search(name):
        return 3
    return None


def _own_shape_reasons(artifact: dict[str, Any]) -> list[dict[str, str]]:
    dr = artifact.get("derivation_rationale")
    dr = dr if isinstance(dr, dict) else {}
    out: list[dict[str, str]] = []
    if isinstance(dr.get("form_reasoning"), str) and dr["form_reasoning"].strip():
        out.append({"label": "Why this shape", "text": _reason(dr["form_reasoning"])})
    if isinstance(dr.get("adopted_form"), str) and dr["adopted_form"].strip():
        out.append({"label": "The form adopted", "text": _reason(dr["adopted_form"])})
    for k, v in dr.items():
        if k.startswith("why_") and isinstance(v, str) and v.strip() and any(w in k.lower() for w in _SHAPE_WORDS):
            out.append({"label": _sentence(humanise(k)).rstrip("."), "text": _reason(v)})
    # the parameter that sets the shape, with its reasoning: how the points were fitted, or why they are judgment; a
    # reason of fewer than three words once its IDs are dropped ("Categorical axis.") says nothing about why
    ranked = sorted((rank, i, r) for i, r in enumerate(artifact.get("parameter_tier_table") or []) if (rank := _shape_rank(r)) is not None)
    for _, _, r in ranked:
        why = r.get("reasoning") or r.get("reason")
        text = _reason(why) if isinstance(why, str) else ""
        if len(re.findall(r"[A-Za-z]{2,}", text)) < 3 or text in {w["text"] for w in out}:
            continue
        out.append({"label": "How the shape was set" if any(w["label"] == "Why this shape" for w in out) else "Why this shape", "text": text})
        break
    if not out:
        for k in ("summary", "decision"):
            v = dr.get(k)
            if isinstance(v, str) and v.strip():
                out.append({"label": "The choice", "text": _reason(humanise(v) if " " not in v else v)})
                break
    out.sort(key=lambda w: w["label"] != "Why this shape")
    return out


def shape_why(artifact: dict[str, Any] | None, source: ShapeSource | None = None) -> list[dict[str, str]]:
    """Why the curve has its shape, in the cell's own files: its form reasoning, the form it adopted, the alternatives
    it turned down ("why not a smooth fit"), and the reasoning of the parameter that sets the shape. A cell that builds
    on another cell's curve (its derivation_rationale names the source artifact, or a binding pins it) also gets that
    cell's reason, labelled with the cell's name; `source` resolves it. Empty only when none of these files says why."""
    if not artifact:
        return []
    out = _own_shape_reasons(artifact)
    src = source(artifact) if source else None
    if src:
        title, theirs = src[0], _own_shape_reasons(src[1] or {})
        first = next((w for w in theirs if w["label"] == "Why this shape"), theirs[0] if theirs else None)
        if first and first["text"] not in {w["text"] for w in out}:
            out.append({"label": f"From {title}, which it builds on", "text": first["text"], "source": title, "source_label": first["label"]})
    return out[:4]


def main_logic(entry: dict[str, Any], curves: list[dict[str, Any]], hazard_label: str, artifact: dict[str, Any] | None = None,
               source: ShapeSource | None = None) -> list[str]:
    """Two to four sentences a first-time reader needs: how the hazard is measured, how damage rises, how it becomes
    dollars, and — where the cell says so — why the curve has its shape. Written from the axis, the cell's own method
    summary, its value basis and its derivation rationale; never typed in a component."""
    out: list[str] = []
    axes: list[str] = []
    for c in curves:
        ph = _axis_phrase(c.get("axis") or {})
        if ph and ph not in axes:
            axes.append(ph)
    if axes:
        out.append(f"{hazard_label} is measured as {_join([_lower_first(a) for a in axes])}.")
    elif entry.get("input"):
        out.append(f"{hazard_label} is read as {_lower_first(plain_text(_first_clause(entry['input'])))}.")
    method = re.sub(r"\s*\(see [^)]*\)", "", (entry.get("method") or {}).get("summary") or "").strip().rstrip(".")
    if method:
        m = plain_text(method) or ""
        out.append(m[:1].upper() + m[1:] + ".")
    reasons = shape_why(artifact, source)
    why = next((w for w in reasons if w["label"] == "Why this shape"), None)
    theirs = next((w for w in reasons if w.get("source_label") == "Why this shape"), None)
    if why:
        out.append(f"Why this shape: {_lower_first(why['text'])}")
    elif theirs:
        out.append(f"Why this shape: as in {theirs['source']}, {_lower_first(theirs['text'])}")
    share = (entry.get("how_to_use") or {}).get("share_of")
    if share:
        ph = _lower_first((plain_text(_first_clause(share)) or "").rstrip("."))
        if not re.match(r"(the|each|a|an)\b", ph):
            ph = "the " + ph
        out.append(f"The damage ratio is a share of {ph}.")
    return out[:4]


STEPS = (
    ("covers", "What it covers", "The parts that have a curve, their share of the value, and what has none yet", ("scope", "units", "value")),
    ("derived", "How it was derived", "How the hazard is measured, the shape of the curve and why that shape, and the site adjustments", ("axis_form", "audit")),
    ("numbers", "Where the numbers come from", "The sources, what each one gave, and how sure we are", ("evidence",)),
    ("checked", "Has it been checked", "Outside checks, field reports of this damage, and who has read the entry", ("field_review",)),
)
FOR_HAZARD = ("artifact", "capability", "proof")


def _short(text: str | None, n: int = 34) -> str:
    t = re.sub(r"\s+", " ", (text or "").strip())
    if len(t) <= n:
        return t
    cut = t[:n].rsplit(" ", 1)[0].rstrip(",;:·-")
    return cut + "…"


def _chip(text: str, tone: str = "key", title: str | None = None) -> dict[str, str]:
    return {"text": text, "tone": tone, **({"title": title} if title else {})}


def _variant_chip(variants: str | None) -> str | None:
    """'module type: fragile … / default … / hardened …; optional stow' → '3 module types'."""
    m = re.match(r"\s*([A-Za-z][A-Za-z \-]{2,30}):\s*([^;]+)", variants or "")
    if not m:
        return None
    options = [o for o in re.split(r"\s+/\s+", m.group(2)) if o.strip()]
    if len(options) < 2:
        return None
    name = m.group(1).strip().lower()
    return f"{len(options)} {name if name.endswith('s') else name + 's'}"


def steps4(ctx: dict[str, Any], stations_plain: list[dict[str, Any]], chain_stations: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Today's ten steps folded into four, in the reader's order (08 §G15, renamed on the owner's review: DCD-D33). Each
    carries a fact line and its key items as chips, so a reviewer sees the summary without opening a panel. A step none
    of whose files or write-up sections exist says so in words; no marks."""
    e, parts, value = ctx["entry"], ctx["parts"], ctx.get("value")
    nc = e.get("not_covered") or []
    by_id = {s["id"]: s for s in stations_plain}
    state = {s["id"]: s["state"] for s in chain_stations}
    why = shape_why(ctx.get("artifact"), ctx.get("shape_source"))
    out = []
    for sid, name, meaning, holds in STEPS:
        written = any(state.get(h) in ("artifact", "prose") for h in holds)
        paras = [by_id[h]["paragraph"] for h in holds if h in by_id and by_id[h].get("paragraph")]
        chips: list[dict[str, str]] = []
        extra: dict[str, Any] = {}
        if sid == "covers":
            n = len(parts)
            fact = f"{n} part{'s' if n != 1 else ''} with a curve"
            if value and value.get("share_covered") is not None:
                fact += f" · {fmt_pct(value['share_covered'])} of the value"
            if nc:
                fact += f" · {len(nc)} without one yet"
            elif ctx.get("withheld_units"):
                fact += f" · {len(ctx['withheld_units'])} withheld"
            names = [pt["part"] for pt in parts]
            chips += [_chip(_short(x, 30), "key", x) for x in names[:3]]
            if len(names) > 3:
                chips.append(_chip(f"+{len(names) - 3} more", "muted", ", ".join(names[3:])))
            vchips = [v for v in (_variant_chip(pt.get("variants")) for pt in parts) if v]
            chips += [_chip(v) for v in dict.fromkeys(vchips)]
            if value and value.get("share_covered") is not None:
                chips.append(_chip(f"{fmt_pct(value['share_covered'])} of the value"))
            if nc:
                chips.append(_chip(f"{len(nc)} without a curve yet", "muted", "; ".join(_strip_amount(plain_text(x) or "") for x in nc)))
            if ctx.get("withheld_units"):
                chips.append(_chip(f"{len(ctx['withheld_units'])} withheld", "muted"))
        elif sid == "derived":
            axes = list(dict.fromkeys(axis_short(c.get("axis") or {}) for c in ctx["curves"] if (c.get("axis") or {}).get("label")))
            units = {axis_short(c.get("axis") or {}): (c.get("axis") or {}).get("unit") for c in ctx["curves"] if (c.get("axis") or {}).get("label")}
            form = (by_id.get("axis_form") or {}).get("plain_fact") or ""
            lead = axes[0] if len(axes) == 1 else (f"{len(axes)} hazard measures" if axes else "")
            fact = f"{lead} → {form}" if lead and form and form != "—" else (form if form and form != "—" else "see the write-up")
            for a in axes[:2]:
                u = units.get(a)
                chips.append(_chip(_short(a, 30) + (f", {u}" if u and u not in ("dimensionless", "class") else ""), "key", a))
            if len(axes) > 2:
                chips.append(_chip(f"+{len(axes) - 2} more measures", "muted"))
            for f_ in (form.split(" + ") if form and form != "—" else []):
                chips.append(_chip(re.sub(r"^(an?|the) ", "", f_)))
            n_curves = len(ctx["curves"])
            if n_curves > len(parts) and n_curves > 1:
                chips.append(_chip(f"{n_curves} curves"))
            if why:
                chips.append(_chip("why this shape", "muted", why[0]["text"]))
                extra["why"] = why
            else:
                extra["why_note"] = "The cell's files give no reason for the shape beyond its form, which the next section describes."
        elif sid == "numbers":
            lc = ctx["link_counts"]
            fact = (f"{lc['total']} source{'s' if lc['total'] != 1 else ''}, {lc['linked']} linked" if lc["total"] else "sources in the write-up")
            word = one_word(ctx["rows_tiers"]["shape"], ctx["rows_tiers"]["cost"])
            fact += f" · {word}"
            chips.append(_chip(word, "key", halves(ctx["rows_tiers"]["shape"], ctx["rows_tiers"]["cost"])))
            refs = [r for r in ctx.get("key_references") or [] if r.get("text")]
            chips += [_chip(_short(r["text"], 30), "key", r["text"]) for r in refs[:2]]
            if len(refs) > 2:
                chips.append(_chip(f"+{len(refs) - 2} more references", "muted"))
            if lc["total"]:
                chips.append(_chip(f"{lc['total']} sources, {lc['linked']} linked", "muted"))
        else:
            oc = ctx.get("outside_checks") or []
            occ = ctx.get("occurrence_state") or "not_searched"
            rv = ctx["review"]
            fact = " · ".join([
                f"{len(oc)} outside check{'s' if len(oc) != 1 else ''}" if oc else "no outside check yet",
                "field reports not searched" if occ == "not_searched" else f"field reports: {occ.replace('_', ' ')}",
                f"reviewed by {rv['review']['by']}" if rv.get("review") else "read by an agent only",
            ])
            chips += [_chip(_short(c["name"], 30), "key", c["name"]) for c in oc[:2]]
            if len(oc) > 2:
                chips.append(_chip(f"+{len(oc) - 2} more checks", "muted"))
            if not oc:
                chips.append(_chip("no outside check yet", "muted"))
            chips.append(_chip("field reports: not searched" if occ == "not_searched" else f"field reports: {occ.replace('_', ' ')}", "muted"))
            chips.append(_chip(f"reviewed by {rv['review']['by']}" if rv.get("review") else "read by an agent only", "key" if rv.get("review") else "muted"))
            first = (f"{len(oc)} outside check{'s' if len(oc) != 1 else ''} compare{'' if len(oc) != 1 else 's'} this curve with an independent result: {_join([c['name'] for c in oc])}."
                     if oc else "No outside check has been made yet: nothing independent has been compared with this curve.")
            v = ctx.get("validation")
            if v:
                first += f" The validation record says {humanise(v.get('status') or 'report')}" + (f" ({v['date']})" if v.get("date") else "") + "."
            paras = [first] + paras
            written = True
        out.append({"id": sid, "name": name, "meaning": meaning, "fact": fact if written else "not written yet", "paragraphs": paras,
                    "holds": list(holds), "written": written, "chips": chips, **extra})
    return out
