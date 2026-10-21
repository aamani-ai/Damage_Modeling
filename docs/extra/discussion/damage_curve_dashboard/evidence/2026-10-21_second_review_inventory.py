#!/usr/bin/env python3
"""Every number quoted in 08_categories_and_construction.md (the owner's second review, 2026-10-21).

Read-only. Reads this repository (catalogue entries, dashboard/data and the dashboard's components), the
Digital Twin's taxonomy (aamani-ai/infrasure-digital-twin; set DIGITAL_TWIN to its checkout) and
Hazard_modeling through git only (cat-file, ls-tree, rev-list, log; every call with --no-optional-locks), so
neither sibling is written. Run from the repository root:

    .venv/bin/python docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-21_second_review_inventory.py \
        > docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-21_second_review_inventory.txt
"""
from __future__ import annotations

import collections
import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
DATA = ROOT / "dashboard" / "data"
CATALOGUE = ROOT / "docs" / "cells" / "catalogue"

# The proposal under test (08 §G13): the Digital Twin's category and type for each catalogue asset, and for
# each real-estate building the type its use gives it under the twin's rule ("use of the majority of floor area").
ASSET_TO_TWIN = {
    "Solar farm": ("Power plants", "Solar"),
    "Wind farm": ("Power plants", "Wind"),
    "Battery storage": ("Power plants", "BESS"),
    "Real estate": ("Real estate", "by building"),
    "Substation": ("Grid infrastructure", "Substation"),
}
BUILDING_TO_TYPE = {"House": "Residential", "Office": "Commercial", "Retail": "Commercial", "Warehouse": "Industrial"}
TIER = re.compile(r"\bT[1-4]\b")


def git(repo: Path, *args: str, check: bool = True) -> str:
    r = subprocess.run(["git", "--no-optional-locks", "-C", str(repo), *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)}: {r.stderr.strip()}")
    return r.stdout.strip()


def has(repo: Path, ref: str, path: str) -> bool:
    r = subprocess.run(["git", "--no-optional-locks", "-C", str(repo), "cat-file", "-e", f"{ref}:{path}"],
                       capture_output=True)
    return r.returncode == 0


def is_ancestor(repo: Path, a: str, b: str) -> bool:
    r = subprocess.run(["git", "--no-optional-locks", "-C", str(repo), "merge-base", "--is-ancestor", a, b],
                       capture_output=True)
    return r.returncode == 0


def find_hazard() -> Path | None:
    cands = [Path(os.environ["HAZARD_MODELING"])] if os.environ.get("HAZARD_MODELING") else []
    cands.append(ROOT / "Hazard_modeling")
    common = Path(git(ROOT, "rev-parse", "--git-common-dir"))
    common = (common if common.is_absolute() else ROOT / common).resolve()
    cands += [common.parent / "Hazard_modeling", common.parent.parent / "Hazard_modeling"]
    for c in cands:
        if (c / ".git").exists():
            return c.resolve()
    return None


def find_twin() -> Path | None:
    cands = [Path(os.environ["DIGITAL_TWIN"])] if os.environ.get("DIGITAL_TWIN") else []
    cands.append(Path.home() / "code" / "personal" / "Digital Twin")  # where 02_reference_audit.md found it
    for c in cands:
        if (c / "skills" / "reference" / "taxonomy.md").exists():
            return c
    return None


def section(title: str) -> None:
    print()
    print("=" * 100)
    print(title)
    print("=" * 100)


def load(p: Path):
    return json.loads(p.read_text())


def main() -> None:
    manifest = load(DATA / "manifest.json")
    receipt = load(DATA / "receipt.json")
    entries = {p.stem: load(p) for p in sorted(CATALOGUE.glob("*.json"))}
    status = {e["entry_id"]: e["status"] for e in manifest["entries"]}

    # ------------------------------------------------------------------------------------------------ §0
    section("§0 · Where the numbers come from")
    head = git(ROOT, "rev-parse", "--short", "HEAD")
    print(f"this repository: HEAD {head} on {git(ROOT, 'rev-parse', '--abbrev-ref', 'HEAD')}; "
          f"origin/main {git(ROOT, 'rev-parse', '--short', 'origin/main')}; "
          f"HEAD contained in origin/main: {'yes' if is_ancestor(ROOT, 'HEAD', 'origin/main') else 'no'}")
    rc = receipt["commit_full"]
    print(f"dashboard data: built {receipt['built_at']} at {receipt['commit']}; working tree clean then: "
          f"{receipt.get('working_tree_clean')}; that commit contained in origin/main: "
          f"{'yes' if is_ancestor(ROOT, rc, 'origin/main') else 'no'}")
    hz = find_hazard()
    twin = find_twin()
    print(f"Hazard_modeling: {hz if hz else 'not found on this machine'}")
    print(f"Digital Twin: {twin if twin else 'not found on this machine (set DIGITAL_TWIN)'}")

    # ------------------------------------------------------------------------------------------------ §1
    section("§1 · The Digital Twin's taxonomy (skills/reference/taxonomy.md), verbatim tree")
    if twin:
        rel = "skills/reference/taxonomy.md"
        print(f"twin HEAD {git(twin, 'rev-parse', '--short', 'HEAD')} · remote "
              f"{git(twin, 'remote', 'get-url', 'origin', check=False) or '—'} · file last changed "
              f"{git(twin, 'log', '-1', '--format=%h %ad', '--date=short', '--', rel)} · on the twin's origin/main: "
              f"{'yes' if has(twin, 'origin/main', rel) else 'no'}")
        text = (twin / rel).read_text()
        block = text.split("```")[1].strip("\n").splitlines()
        for line in block:
            print("  | " + line)
        cats: dict[str, list[str]] = collections.OrderedDict()
        current = None
        depth_t2 = 0
        for line in block:
            if re.match(r"^ [A-Za-z]", line):  # a category line starts with a letter; types start with ├─ or └─
                current = re.split(r"\s{2,}", line.strip())[0]
                cats[current] = []
            elif re.match(r"^ [├└]─ ", line) and current:
                cats[current].append(re.split(r"\s{2,}", line[4:].strip())[0])
            if re.search(r"\bT2\s*$", line):
                depth_t2 += 1
        print()
        for c, types in cats.items():
            print(f"category {c!r}: {len(types)} types — {', '.join(types)}")
        print(f"lines of the tree ending in the depth tier 'T2': {depth_t2}")
    else:
        print("not read")

    # ------------------------------------------------------------------------------------------------ §2
    section("§2 · The catalogue under the twin's categories (proposed mapping ASSET_TO_TWIN)")
    by_cat: dict[str, collections.Counter] = collections.defaultdict(collections.Counter)
    by_asset: dict[str, collections.Counter] = collections.defaultdict(collections.Counter)
    for eid, e in entries.items():
        cat, typ = ASSET_TO_TWIN[e["asset"]]
        by_cat[cat][status[eid]] += 1
        by_asset[e["asset"]][status[eid]] += 1
    for asset, (cat, typ) in ASSET_TO_TWIN.items():
        c = by_asset[asset]
        print(f"{cat:<20} {typ:<12} catalogue asset {asset!r:<18} {sum(c.values())} entries: "
              + " · ".join(f"{k} {v}" for k, v in sorted(c.items())))
    for cat, c in by_cat.items():
        print(f"  {cat}: {sum(c.values())} entries — " + " · ".join(f"{k} {v}" for k, v in sorted(c.items())))
    print(f"top bar today: Library + {len(manifest['assets'])} assets in this order: "
          + ", ".join(a["label"] for a in manifest["assets"]))

    section("§2b · Real estate: the buildings inside each cell, by the type their use gives them")
    per_type: dict[str, dict[str, list[str]]] = collections.defaultdict(lambda: collections.defaultdict(list))
    for eid, e in entries.items():
        if e["asset"] != "Real estate":
            continue
        print(f"{eid} ({status[eid]}):")
        for row in e["rows"]:
            building = row["part"].split()[0]
            typ = BUILDING_TO_TYPE.get(building, "unmapped")
            per_type[typ][e["hazard"]].append(row["part"])
            print(f"    {row['part']:<45} → {typ:<12} curves {len(row.get('curves') or [])} · shape "
                  f"{row.get('shape')} · cost {row.get('cost')}")
    for typ in ("Residential", "Commercial", "Industrial"):
        hz_ = per_type[typ]
        print(f"{typ}: {len(hz_)} of 5 hazards — " + "; ".join(f"{h}: {', '.join(p)}" for h, p in hz_.items()))
    asset_view = load(DATA / "assets" / "real_estate.json")
    print("the real-estate asset page lists these as its 'parts' (canonical rows): "
          + " · ".join(r["label"] for r in asset_view["rows"]))

    # ------------------------------------------------------------------------------------------------ §3
    section("§3 · 'How this was built': the ten steps, the marks behind them, the checks")
    names = [s["name"] for s in manifest["stations"]]
    print("the ten labels and their lengths: " + " · ".join(f"{n} ({len(n)})" for n in names))
    marks: dict[str, collections.Counter] = collections.defaultdict(collections.Counter)
    n_cells = 0
    for p in sorted((DATA / "cells").glob("*.json")):
        c = load(p)
        stations = (c.get("chain") or {}).get("stations") or []
        if not stations:
            continue
        n_cells += 1
        for s in stations:
            marks[s["id"]][s.get("state") or "none"] += 1
    print(f"cells and bindings with a chain: {n_cells}")
    for s in manifest["stations"]:
        c = marks[s["id"]]
        print(f"  {s['name']:<34} " + " · ".join(f"{k} {v}" for k, v in sorted(c.items())))
    hs_cell = load(DATA / "cells" / "hail_solar.json")
    state = {s["id"]: s.get("state") for s in hs_cell["chain"]["stations"]}
    print("hail × solar, as its page shows the ten steps (state · fact):")
    for s in hs_cell["plain"]["stations"]:
        print(f"    {s['name']:<34} {state.get(s['id']) or '—':<16} {s.get('plain_fact')}")
    hs_entry = next(e for e in manifest["entries"] if e["entry_id"] == "hail_solar")
    print(f"    outside checks: {hs_entry.get('outside_checks')} · sources: "
          f"{json.dumps(hs_cell['plain']['link_counts'])}")
    hs_curve = load(DATA / "curves" / "hail_solar" / "HAIL_SOLAR_DEFAULT_3P2_GBS@model_v1_0__docs_r7.json")
    print(f"    the default module curve says: {hs_curve['caption']['what_it_says']}")
    print(f"    the cell's sentence: {hs_cell['summary'] if isinstance(hs_cell['summary'], str) else json.dumps(hs_cell['summary'])[:300]}")
    ka = receipt["known_answers"]
    print(f"known answers: {json.dumps(ka)[:300]}")
    with_checks = [e["entry_id"] for e in manifest["entries"] if e.get("outside_checks")]
    curve_entries = [e for e in manifest["entries"] if e["status"] != "gap"]
    print(f"entries with a curve or binding: {len(curve_entries)}; with at least one outside check: {len(with_checks)}")

    # ------------------------------------------------------------------------------------------------ §4
    section("§4 · Evidence tiers: what the catalogue holds and what the default view prints")
    shape = collections.Counter()
    cost = collections.Counter()
    t1_rows = 0
    rows = 0
    t2_shape_rows = []
    for eid, e in entries.items():
        for row in e.get("rows") or []:
            rows += 1
            shape[row.get("shape")] += 1
            cost[row.get("cost")] += 1
            if "T1" in f"{row.get('shape')} {row.get('cost')}":
                t1_rows += 1
            if row.get("shape") == "T2":
                t2_shape_rows.append((eid, row["part"], row.get("shape_basis") or ""))
    print(f"part rows: {rows}; rows with T1 in shape or cost: {t1_rows}")
    print("shape tiers: " + " · ".join(f"{k} {v}" for k, v in sorted(shape.items(), key=lambda kv: str(kv[0]))))
    print("cost tiers:  " + " · ".join(f"{k} {v}" for k, v in sorted(cost.items(), key=lambda kv: str(kv[0]))))
    lab = re.compile(r"lab|test|PVEL|Kiwa|IEC", re.I)
    model = re.compile(r"Hazus|FEMA|USACE|NACCS|standard|ASCE", re.I)
    kinds = collections.Counter()
    print(f"rows graded T2 for shape ({len(t2_shape_rows)}), and what the basis rests on:")
    for eid, part, basis in t2_shape_rows:
        k = "published model or standard" if model.search(basis) and not lab.search(basis) else (
            "lab test" if lab.search(basis) and not model.search(basis) else "both or neither")
        kinds[k] += 1
        print(f"    {eid:<36} {part[:34]:<34} [{k}] {basis[:90]}")
    print("  → " + " · ".join(f"{k} {v}" for k, v in kinds.items()))
    print(f"the word the dashboard gives T2: {manifest['tier_words']['T2']!r} (legend: {manifest['tier_plain']['T2']!r})")

    n_curves = 0
    with_code = 0
    codes_total = 0
    example = None
    for p in sorted((DATA / "curves").glob("*/*.json")):
        d = load(p)
        hs = (d.get("caption") or {}).get("how_sure")
        if not hs:
            continue
        n_curves += 1
        shown = []
        for side in ("shape", "cost"):
            if hs.get(side):
                shown += [hs[side].get("tier") or "", hs[side].get("basis") or ""]
        shown.append(hs.get("parameters") or "")
        n = sum(len(TIER.findall(s)) for s in shown)
        codes_total += n
        with_code += 1 if n else 0
        if d["curve_id"] == "HAIL_SOLAR_DEFAULT_3P2_GBS":
            example = (n, shown)
    print(f"curves with a caption: {n_curves}; whose 'how sure' block prints a tier code: {with_code}; "
          f"tier codes printed across them: {codes_total}")
    if example:
        print(f"hail × solar default module curve: {example[0]} tier codes in its 'how sure' block:")
        for s in example[1]:
            if s:
                print(f"    {s}")
    tiles = [e for e in manifest["entries"] if e["status"] != "gap"]
    print(f"library tiles printing 'shape/cost' codes: {len(tiles)} of {len(manifest['entries'])}")
    # G16 (a): one word per tile, the weaker half's (the highest tier number in shape or cost)
    words = {1: "field-calibrated", 2: "published", 3: "borrowed", 4: "our judgment"}
    weaker = collections.Counter()
    split = []
    for e in tiles:
        s, c = e["tiers"]["shape"], e["tiers"]["cost"]
        ds = [int(x) for x in re.findall(r"[1-4]", f"{s}")]
        dc = [int(x) for x in re.findall(r"[1-4]", f"{c}")]
        if not ds and not dc:
            continue
        w = max(ds + dc)
        weaker[words[w]] += 1
        if ds and dc and max(ds) != max(dc):
            split.append(f"{e['entry_id']} ({s}/{c})")
        print(f"    {e['entry_id']:<40} {s}/{c:<8} → {words[w]}")
    print("tiles by the weaker half's word: " + " · ".join(f"{k} {v}" for k, v in weaker.items()))
    print(f"tiles whose two halves differ (the word hides a stronger half): {len(split)} — {', '.join(split)}")

    # ------------------------------------------------------------------------------------------------ §5
    section("§5 · Where the word 'review' reaches a reader before any control is opened")
    nav = (ROOT / "dashboard" / "components" / "nav.tsx").read_text()
    tabs = [t.strip() for t in re.findall(r">\s*\n?\s*([^<>{}\n]*[Rr]eview[^<>{}\n]*)\n?\s*</Link>", nav)]
    print(f"top-bar tabs with 'review': {len(tabs)} — {tabs}")
    for t in re.findall(r'href="(/[a-z0-9]+)"[^>]*title="([^"]+)"', nav):
        print(f"    {t[0]} — its tooltip: {t[1]!r}")
    kpi = (ROOT / "dashboard" / "components" / "kpi-row.tsx").read_text()
    print(f"library KPI tile 'REVIEW' present: {'yes' if re.search(r'owner reviews', kpi) else 'no'}")
    print(f"library lens 'review' present: {'yes' if 'review' in manifest['lenses'] else 'no'} (lenses: {', '.join(manifest['lenses'])})")
    chips = collections.Counter()
    for p in sorted((DATA / "cells").glob("*.json")):
        rail = (load(p).get("plain") or {}).get("rail") or {}
        if rail.get("review"):
            chips[rail["review"]["words"]] += 1
    print("cell-page chip about review (words · cells): " + " · ".join(f"{k!r} {v}" for k, v in chips.items()))
    v0 = (ROOT / "dashboard" / "app" / "v0" / "page.tsx").read_text()
    h1 = re.search(r"<h1[^>]*>([^<]+)<", v0)
    print(f"the /v0 page's heading: {h1.group(1).strip() if h1 else '—'!r}")
    rq = manifest["review_queue"]["items"]
    print(f"review queue items: {len(rq)} — " + " · ".join(f"{k} {v}" for k, v in collections.Counter(i['kind'] for i in rq).items()))
    for it in rq:
        print(f"    {it['kind']:<22} {it.get('entry_id') or '—':<30} {it['text'][:110]}")

    # ------------------------------------------------------------------------------------------------ §6
    section("§6 · Builder information on the default view")
    layout = (ROOT / "dashboard" / "app" / "layout.tsx").read_text()
    for label, pat in (("the build date chip", r"built \{m\.built_at"), ("the 'internal' chip", r">internal<"),
                       ("the GitHub link", r"GitHub")):
        print(f"  header, {label}: {'present' if re.search(pat, layout, re.I) else 'absent'}")
    lib = (ROOT / "dashboard" / "app" / "page.tsx").read_text()
    for label, pat in (("'built from the catalogue on <date>'", r"built from the catalogue on"),
                       ("'built at <commit> · <timestamp>'", r"built at")):
        print(f"  library, {label}: {'present' if re.search(pat, lib) else 'absent'}")
    checks = manifest["build_checks"]
    print(f"build checks shown as chips on the library: {len(checks)}; failing: "
          + ", ".join(c["id"] for c in checks if not c["ok"]))

    # ------------------------------------------------------------------------------------------------ §7
    section("§7 · Main only: branches, and the Hazard files the pages link to")
    for ref in git(ROOT, "for-each-ref", "--format=%(refname:short)", "refs/remotes/origin").splitlines():
        if ref in ("origin/main", "origin/HEAD", "origin"):
            continue
        ahead = git(ROOT, "rev-list", "--count", f"origin/main..{ref}")
        if ahead == "0":
            continue
        last = git(ROOT, "log", "-1", "--format=%an %ad", "--date=short", ref)
        print(f"  {ref:<45} {ahead:>3} commits not on main · last {last}")
    if not hz:
        print("Hazard_modeling not found; the link check is skipped")
        return
    print(f"Hazard checkout on {git(hz, 'rev-parse', '--abbrev-ref', 'HEAD')}; origin/main "
          f"{git(hz, 'log', '-1', '--format=%h %ad', '--date=short', 'origin/main')}; uncommitted paths "
          f"{len(git(hz, 'status', '--porcelain').splitlines())}")
    paths = set()
    for p in DATA.glob("**/*.json"):
        paths.update(re.findall(r"Hazard_Modeling/blob/main/([^\"#)\s]+)", p.read_text()))
    paths = sorted(paths)
    missing = [q for q in paths if not has(hz, "origin/main", q)]
    print(f"distinct Hazard paths linked from the dashboard: {len(paths)}; not on Hazard's main: {len(missing)}")
    main_tree = git(hz, "ls-tree", "-r", "--name-only", "origin/main").splitlines()
    for q in missing:
        where = "on the checked-out branch" if has(hz, "HEAD", q) else "not on the checked-out branch either"
        parts = q.split("/")
        tail = "/".join(parts[-3:])  # the last three parts, to find where the cells name it
        # the same file moved on main: same peril folder, same asset folder, same last two parts
        moved = [t for t in main_tree if len(parts) > 3 and t != q and t.count("/") >= 2
                 and t.split("/")[1] == parts[1] and f"/{parts[2]}/" in f"/{t}" and t.endswith("/".join(parts[-2:]))]
        cited = git(ROOT, "grep", "-l", "--fixed-strings", tail, "--", "docs/cells", check=False).splitlines()
        folders = sorted({c.split("/")[2] for c in cited})
        print(f"  {q}\n      {where}; the same file elsewhere on main: {moved[:2] if moved else 'none'}\n"
              f"      named (by its last three parts) in {len(cited)} file(s) under docs/cells: {', '.join(folders) or '—'}")


if __name__ == "__main__":
    main()
