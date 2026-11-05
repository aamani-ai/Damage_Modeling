"""Which of this repository's curve artifacts Hazard uses, judged against what Hazard's dashboard serves.

The answer per cell comes from the snapshot of Hazard's internal dashboard (scripts/dashboard/snapshots/
hazard_dashboard.json, written by hazard_dashboard_snapshot.py while signed in to GCS): which Damage artifact each of
its layers was computed with. Hazard's git (below) adds what the snapshot cannot: the value shares Hazard's pins
multiply a curve by, and, for a cell with no layer, whether any Hazard branch holds it. It reads Hazard's references
three ways (main and branches): a copy of our artifact (any `*artifact.json`) beside a pin; a SHA-256 literal in
Hazard's source; a `damage_modeling/docs/cells/...` path its source loads. An artifact a layer used is compared with
the one this page shows by SHA-256, and by model version and documentation revision apart (standard 17); a differing
one has its curves and loss-relevant unit facts compared, and is looked for in Damage (this tree, then its branches).
"""
from __future__ import annotations

import functools
import hashlib
import json
import re
import subprocess
from pathlib import Path, PurePosixPath
from typing import Any

from . import hazard_main
from .common import CHECKOUT, ROOT, rel

ARTIFACT_NAME = re.compile(r"(^|/)[\w.@-]*artifact\.json$")
CODE_FILES = re.compile(r"^(perils|drivers|shared|pipelines)/[^/]+/src/.+\.py$")
CODE_PATH = re.compile(r"damage_modeling/(docs/cells/([a-z0-9_]+)/[\w/.@-]*?curve_artifact\.json)")
HEX64 = re.compile(r"\b[0-9a-f]{64}\b")
# the share fields an artifact declares, by the basis they are a share of
INSTALLED_SHARE = "direct_hardware_value_share_installed_capex"
SHARE_WORDS = {"direct_hardware_value_share_installed_capex": "value share of installed capex",
               "direct_hardware_value_share_physical_base": "value share of the physical base",
               "default_value_share_physical_base": "default value share of the physical base"}


def _git(repo: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True)


def _model(v: str | None) -> tuple[int, ...]:
    return tuple(int(x) for x in re.findall(r"\d+", v or "")) or (0,)


def _refs(repo: Path) -> list[str]:
    out = _git(repo, "for-each-ref", "--format=%(refname:short)", "refs/remotes/origin").stdout.decode().split()
    return [r for r in out if r not in ("origin/HEAD", "origin")]


def _records(d: dict[str, Any]) -> dict[str, Any]:
    out = {r["curve_id"]: r.get("parameters") for r in d.get("curve_records") or [] if r.get("curve_id")}
    for p in d.get("pathways") or []:
        out.update({r["curve_id"]: r.get("parameters") for r in p.get("curve_records") or [] if r.get("curve_id")})
    return out


def _units(d: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """What of each failure unit can change a loss: its treatment and its numeric value shares (wording does not)."""
    return {u["id"]: {"treatment": u.get("treatment"), **{k: v for k, v in u.items() if "share" in k and isinstance(v, (int, float))}}
            for u in d.get("failure_units") or [] if u.get("id")}


def _pin_values(d: Any) -> list[dict[str, Any]]:
    """The value shares a Hazard pin multiplies a curve by: a `value_assembly` block, or an `installed_shares` map."""
    out: list[dict[str, Any]] = []
    if not isinstance(d, dict):
        return out
    va = d.get("value_assembly")
    if isinstance(va, dict) and va.get("failure_unit_id") and isinstance(va.get("value_bucket_fraction"), (int, float)):
        out.append({"unit": va["failure_unit_id"], "share": float(va["value_bucket_fraction"]), "basis": str(va.get("value_basis") or ""),
                    "note": va.get("source")})
    shares = d.get("installed_shares")
    if isinstance(shares, dict):
        out += [{"unit": u, "share": float(s), "basis": str(d.get("value_basis") or "installed"), "note": None}
                for u, s in shares.items() if isinstance(s, (int, float))]
    return out


@functools.lru_cache(maxsize=1)
def _trees() -> dict[str, list[tuple[str, str]]]:
    """Every Hazard ref's files: (blob, path)."""
    repo = hazard_main.repo()
    out: dict[str, list[tuple[str, str]]] = {}
    for ref in _refs(repo) if repo else []:
        rows = []
        for line in _git(repo, "ls-tree", "-r", ref).stdout.decode().splitlines():
            meta, path = line.split("\t", 1)
            rows.append((meta.split()[2], path))
        out[ref.removeprefix("origin/")] = rows
    return out


@functools.lru_cache(maxsize=None)
def _blob(oid: str) -> bytes:
    return _git(hazard_main.repo(), "cat-file", "blob", oid).stdout  # type: ignore[arg-type]


@functools.lru_cache(maxsize=1)
def copies() -> tuple[dict[str, Any], ...]:
    """Every distinct Damage artifact copy on Hazard's refs: its cell, versions, SHA-256, curves, where it sits, and
    the value shares of the pins beside it."""
    places: dict[str, list[tuple[str, str]]] = {}
    pins_by_dir: dict[tuple[str, str], list[tuple[str, str]]] = {}
    for ref, rows in _trees().items():
        for oid, path in rows:
            if ARTIFACT_NAME.search(path):
                places.setdefault(oid, []).append((ref, path))
            elif path.endswith(".json") and ("pin" in path.rsplit("/", 1)[-1] or "binding" in path.rsplit("/", 1)[-1]):
                pins_by_dir.setdefault((ref, str(PurePosixPath(path).parent)), []).append((oid, path))
    out = []
    for oid, where in places.items():
        raw = _blob(oid)
        try:
            d = json.loads(raw)
        except ValueError:
            continue
        if not isinstance(d, dict) or not d.get("cell_id"):
            continue
        merged: dict[tuple[Any, ...], dict[str, Any]] = {}
        for ref, path in where:
            for pin_oid, pin_path in pins_by_dir.get((ref, str(PurePosixPath(path).parent)), []):
                try:
                    found = _pin_values(json.loads(_blob(pin_oid)))
                except ValueError:
                    continue
                for v in found:  # one entry per distinct share, with every ref that holds it
                    merged.setdefault((v["unit"], v["share"], v["basis"], pin_path), {**v, "pin": pin_path, "refs": []})["refs"].append(ref)
        values = list(merged.values())
        main = sorted({p for r, p in where if r == "main"})
        out.append({"cell_id": d["cell_id"], "model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision"),
                    "sha256": hashlib.sha256(raw).hexdigest(), "on_main": bool(main), "main_paths": main,
                    "branches": sorted({r for r, _ in where if r != "main"}), "records": _records(d), "units": _units(d), "values": values})
    return tuple(sorted(out, key=lambda c: (c["cell_id"], _model(c["model"]), _model(c["docs"]))))


@functools.lru_cache(maxsize=None)
def _ours(cell_id: str) -> dict[str, dict[str, Any]]:
    """This tree's artifacts of a cell, by SHA-256."""
    out = {}
    for f in sorted((ROOT / "docs" / "cells" / cell_id).rglob("*curve_artifact.json")):
        raw = f.read_bytes()
        d = json.loads(raw)
        out[hashlib.sha256(raw).hexdigest()] = {"path": rel(f), "model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision"),
                                                "records": _records(d), "units": _units(d)}
    return out


@functools.lru_cache(maxsize=None)
def _damage_where(cell_id: str, sha: str) -> str:
    """Where an artifact with this SHA-256 is in Damage: this tree, else the Damage branches that hold it."""
    if sha in _ours(cell_id):
        return f"in this repository at {_ours(cell_id)[sha]['path']}"
    held: list[str] = []
    for ref in _refs(CHECKOUT):
        for line in _git(CHECKOUT, "ls-tree", "-r", ref, f"docs/cells/{cell_id}/").stdout.decode().splitlines():
            meta, path = line.split("\t", 1)
            if path.endswith("curve_artifact.json") and hashlib.sha256(_git(CHECKOUT, "cat-file", "blob", meta.split()[2]).stdout).hexdigest() == sha:
                held.append(ref.removeprefix("origin/"))
                break
    if "main" in held:
        return "on Damage's main"
    return f"on Damage branch{'es' if len(held) > 1 else ''} {', '.join(held)}, not on Damage's main" if held else "not found in Damage"


def _where_words(on_main: bool, branches: list[str]) -> tuple[str, str]:
    """The subject naming where Hazard holds a reference, and its verb."""
    if on_main:
        return "Hazard's main", "pins"
    shown = ", ".join(branches[:3]) + (f" and {len(branches) - 3} more" if len(branches) > 3 else "")
    return f"Hazard branch{'es' if len(branches) > 1 else ''} {shown} (not on Hazard's main)", ("pins" if len(branches) == 1 else "pin")


def _loss_diff(pinned: dict[str, Any], shown: dict[str, Any]) -> list[str]:
    """What differs between two artifacts in anything that can change a loss: curve parameters, curves dropped or
    added, a unit's treatment, a unit's numeric value share."""
    pr, sr = pinned.get("records") or {}, shown.get("records") or {}
    out = []
    changed = [k for k in sr if k in pr and pr[k] != sr[k]]
    dropped, added = [k for k in sr if k not in pr], [k for k in pr if k not in sr]
    if changed:
        out.append(f"{len(changed)} curve{'s have' if len(changed) != 1 else ' has'} different parameters ({', '.join(changed[:4])})")
    if dropped:
        out.append(f"Hazard's version drops {len(dropped)} curve{'s' if len(dropped) != 1 else ''} shown here ({', '.join(dropped[:4])})")
    if added:
        out.append(f"Hazard's version adds {len(added)} curve{'s' if len(added) != 1 else ''} ({', '.join(added[:4])})")
    pu, su = pinned.get("units") or {}, shown.get("units") or {}
    for uid in sorted(set(pu) & set(su)):
        a, b = pu[uid], su[uid]
        if a.get("treatment") != b.get("treatment"):
            out.append(f"{uid} is treated as {a.get('treatment')} in Hazard's version, {b.get('treatment')} here")
        for k in sorted((set(a) | set(b)) - {"treatment"}):
            if a.get(k) != b.get(k):
                ha = f"{a[k]:.2%}" if k in a else "none"
                hb = f"{b[k]:.2%}" if k in b else "none"
                out.append(f"{uid}'s {SHARE_WORDS.get(k, k.replace('_', ' '))} is {ha} in Hazard's version, {hb} here")
    return out


def _same_curves(pinned: dict[str, Any], shown: dict[str, Any]) -> str:
    n = len(shown.get("records") or {})
    same = sum(1 for k, v in (shown.get("records") or {}).items() if (pinned.get("records") or {}).get(k) == v)
    return f"{'all ' if same == n and n > 1 else ''}{same} of the {n} curve{'s' if n != 1 else ''} shown here {'are' if same != 1 else 'is'} identical" if same != n else \
        (f"its {n} curve{'s are' if n != 1 else ' is'} identical to the ones shown here")


SNAPSHOT = CHECKOUT / "scripts" / "dashboard" / "snapshots" / "hazard_dashboard.json"
HOW_WORDS = {
    "layer_record": "the layer's own record names the artifact",
    "run_receipt": "the receipt of the run behind the layer pins the artifact's hash",
    "producer_code": "the Hazard commit that produced the layer's run pins the artifact's hash",
    "release_runs": "the stored release runs for this asset and hazard pin the artifact's hash",
}


@functools.lru_cache(maxsize=1)
def snapshot() -> dict[str, Any] | None:
    return json.loads(SNAPSHOT.read_text(encoding="utf-8")) if SNAPSHOT.exists() else None


@functools.lru_cache(maxsize=None)
def _facts(cell_id: str, sha: str) -> dict[str, Any]:
    """Curves and loss-relevant unit facts of an artifact by hash: this tree, Hazard's copies, then Damage's branches."""
    for f in sorted((ROOT / "docs" / "cells" / cell_id).rglob("*curve_artifact.json")):
        raw = f.read_bytes()
        if hashlib.sha256(raw).hexdigest() == sha:
            d = json.loads(raw)
            return {"records": _records(d), "units": _units(d)}
    for c in copies():
        if c["sha256"] == sha:
            return c
    for ref in _refs(CHECKOUT):
        for line in _git(CHECKOUT, "ls-tree", "-r", ref, f"docs/cells/{cell_id}/").stdout.decode().splitlines():
            meta, path = line.split("\t", 1)
            if path.endswith("curve_artifact.json"):
                raw = _git(CHECKOUT, "cat-file", "blob", meta.split()[2]).stdout
                if hashlib.sha256(raw).hexdigest() == sha:
                    d = json.loads(raw)
                    return {"records": _records(d), "units": _units(d)}
    return {}


def _labels(layers: list[dict[str, Any]]) -> str:
    names = [str(l.get("label") or l["id"]) for l in layers]
    return (f"Hazard's dashboard layer {names[0]}" if len(names) == 1
            else f"Hazard's dashboard layers {', '.join(names[:3])}" + (f" and {len(names) - 3} more" if len(names) > 3 else ""))


# A binding reuses another cell's curve, but Hazard runs it as its own consumer, with its own binding file; the
# source cell's layer is a different run. Where Hazard keeps each binding (the files name the source cell, not the
# binding, so they cannot be found by the binding's id).
HAZARD_BINDINGS = {
    "substation_hurricane_screening_v1": "perils/hurricane/src/hurricane/resources/substation_screening/binding.json",
    "substation_convective_wind_screening_v1": "perils/convective_wind/src/convective_wind/resources/substation_screening/binding.json",
    "substation_wildfire_screening_v1": "perils/wildfire/src/wildfire/resources/substation_screening/binding.json",
}


def for_binding(binding_id: str, shown_model: str | None, shown_docs: str | None) -> dict[str, Any]:
    """Does Hazard run this binding, where, and with which release of the source curve? Says so in words; a binding
    is never reported through its source cell's dashboard layer."""
    snap = snapshot()
    checked = f"Checked against Hazard's internal dashboard ({snap['dashboard']}) on {snap['checked_on']}." if snap else None
    path = HAZARD_BINDINGS.get(binding_id)
    found = []
    for ref, rows in (_trees() if path else {}).items():
        for oid, pth in rows:
            if pth == path:
                try:
                    d = json.loads(_blob(oid))
                except ValueError:
                    d = {}
                pin = d.get("source_pin") or {}
                found.append((ref, pin.get("cell_id"), pin.get("semantic_damage_model_version"), pin.get("documentation_revision")))
    on_layer = bool(snap and binding_id in (snap.get("cells") or {}))
    lines = []
    if not on_layer:
        lines.append("No layer on Hazard's dashboard uses this binding yet (the hurricane-on-solar layer is a different run, of the solar plant).")
    if found:
        branches = sorted({f[0] for f in found})
        src = found[0]
        same = src[2] == shown_model and src[3] == shown_docs
        lines.append(f"Hazard runs it from {path} on {'its main' if 'main' in branches else 'branch ' + ', '.join(branches[:3])}"
                     + ("" if "main" in branches else ", not on Hazard's main") + f"; that binding pins {src[1]} {src[2]}, {src[3]}"
                     + (", the release this page shows." if same else f"; this page shows {shown_model}, {shown_docs}."))
    elif path:
        lines.append(f"Hazard's binding file {path} was not found on any Hazard branch.")
    if checked:
        lines.append(checked)
    return {"state": "used" if on_layer else "not_on", "sentences": lines, "differences": [], "values": [], "value_mismatches": [], "newer": None}


def for_cell(cell_id: str, artifact_path: str | None) -> dict[str, Any]:
    """Does Hazard's dashboard use what this page shows? One of three answers, and sentences saying what its layers
    used, what the page shows, what differs in anything that can change a loss, and how that is known.

      used     a layer on Hazard's dashboard was computed with this file, or one identical in every loss-relevant fact
      differs  a layer was computed with a newer model, a revision that differs in a loss-relevant fact, or Hazard
               multiplies the curve by a different value share
      not_on   no layer on Hazard's dashboard uses this cell
    """
    snap = snapshot()
    if snap is None:
        return {"state": "unchecked", "sentences": ["No snapshot of Hazard's dashboard has been taken, so whether it uses this is not checked."],
                "differences": [], "values": [], "value_mismatches": [], "newer": None}
    shown: dict[str, Any] = {}
    if artifact_path and (ROOT / artifact_path).exists():
        raw = (ROOT / artifact_path).read_bytes()
        d = json.loads(raw)
        shown = {"sha256": hashlib.sha256(raw).hexdigest(), "model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision"),
                 "records": _records(d), "units": _units(d), "path": artifact_path,
                 "shares": {u.get("id"): u.get(INSTALLED_SHARE) for u in d.get("failure_units") or [] if isinstance(u.get(INSTALLED_SHARE), (int, float))}}
    checked = f"Checked against Hazard's internal dashboard ({snap['dashboard']}) on {snap['checked_on']}."
    entry = (snap.get("cells") or {}).get(cell_id)
    if not entry:
        refs = [c for c in copies() if c["cell_id"] == cell_id]
        held = sorted({b for c in refs for b in c["branches"]}) + (["main"] if any(c["on_main"] for c in refs) else [])
        why = (f"Hazard branch{'es' if len(held) > 1 else ''} {', '.join(held[:3])}{' and more' if len(held) > 3 else ''} hold a copy of this cell's artifact, "
               "but no layer on Hazard's dashboard uses it." if held else "Hazard's repository has no reference to this cell's artifact.")
        return {"state": "not_on", "sentences": [f"No layer on Hazard's dashboard uses this cell. {why}", checked],
                "differences": [], "values": [], "value_mismatches": [], "newer": None}
    subject = _labels(entry["layers"])
    verb = "uses" if len(entry["layers"]) == 1 else "use"
    sentences, why, values, mismatches = [], [], [], []
    newer = None
    for a in entry["artifacts"]:
        same = a["sha256"] == shown.get("sha256")
        if same:
            sentences.append(f"{subject} {verb} the file shown here ({a.get('model')}, {a.get('docs')}).")
            continue
        facts = _facts(cell_id, a["sha256"])
        diffs = _loss_diff(facts, shown) if facts else ["its curves could not be read to compare"]
        tail = (f"{_same_curves(facts, shown)}, and nothing else that can change a loss differs (the rest is wording)" if not diffs
                else f"{_same_curves(facts, shown)}; " + "; ".join(diffs)) if facts else diffs[0]
        where = f" Hazard's version is {a['where']}." if a.get("where") and a.get("model") != shown.get("model") else ""
        # same numbers, newer release in Hazard: say why it is still flagged (a version gap, not a different loss)
        if not diffs and facts and _model(a.get("model")) > _model(shown.get("model")):
            where += (" The loss is the same; it is flagged because Hazard runs a newer release than this page shows,"
                      " so the release Hazard uses should be merged here (or Hazard re-pinned).")
        words = (f"{subject} {verb} {a.get('model')}, {a.get('docs')}; this page shows {shown.get('model')}, {shown.get('docs')}. "
                 f"{tail[0].upper() + tail[1:]}.{where}")
        sentences.append(words)
        if _model(a.get("model")) > _model(shown.get("model")):
            newer = newer if newer and _model(newer["model"]) >= _model(a.get("model")) else {"model": a.get("model"), "docs": a.get("docs"), "shown": shown.get("model"), "words": words}
            why.append(words)
        elif diffs:
            why.append(words)
    # value shares: what Hazard's pins beside the artifacts its layers used multiply a unit's curve by
    used = {a["sha256"] for a in entry["artifacts"]}
    for c in copies():
        if c["sha256"] not in used:
            continue
        for v in c["values"]:
            declared = (shown.get("shares") or {}).get(v["unit"])
            row = {**v, "declared": declared, "where": _where_words("main" in v["refs"], sorted(r for r in v["refs"] if r != "main"))[0]}
            values.append(row)
            if declared is not None and "install" in v["basis"].lower() and abs(declared - v["share"]) > 1e-4:
                mismatches.append(row)
    for v in mismatches:
        line = (f"Hazard multiplies {v['unit']} by {v['share']:.2%} of installed value" + (f" ({v['note']})" if v.get("note") else "")
                + f"; the artifact shown here declares {v['declared']:.2%} of installed capex.")
        sentences.append(line)
        why.append(line)
    how = "; ".join(HOW_WORDS.get(h, h) for h in entry["how"])
    sentences.append(f"How this is known: {how}.")  # Hazard-side record gaps (entry["notes"]) stay in the snapshot, not on the page
    sentences.append(checked)
    state = "differs" if why else "used"
    return {"state": state, "sentences": sentences, "differences": why, "values": values, "value_mismatches": mismatches, "newer": newer}
