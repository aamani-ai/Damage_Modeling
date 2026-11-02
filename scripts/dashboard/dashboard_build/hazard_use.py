"""Which of this repository's curve artifacts Hazard itself uses, and how surely.

Hazard references a Damage artifact in three ways, each read here from Hazard's git (main and branches):
  - a copy: Hazard keeps our artifact (any `*artifact.json`) beside its consumption, source or binding pin;
  - a hash in its code: a SHA-256 literal in Hazard's source equal to one of our artifacts;
  - a path in its code: Hazard's source loads `damage_modeling/docs/cells/...` from a local Damage checkout, which
    checks the model version but not the bytes.
Each is matched to a cell and compared with the artifact this dashboard shows: by SHA-256, and by model version and
documentation revision apart (a consumer pins the model version, standard 17). A reference only on Hazard branches
is always said to be not on Hazard's main. A newer pinned version has its curves compared with the ones shown, and
is looked for in Damage (this tree, then Damage's branches). The value shares Hazard's pins multiply a curve by are
compared with the share the artifact declares on the same basis.
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


@functools.lru_cache(maxsize=1)
def code_refs() -> tuple[dict[str, Any], ...]:
    """Hazard's main source files that name a Damage artifact path or carry a SHA-256 literal."""
    out = []
    for oid, path in _trees().get("main", []):
        if not CODE_FILES.match(path):
            continue
        text = _blob(oid).decode("utf-8", "replace")
        paths = sorted({m.group(1) for m in CODE_PATH.finditer(text)})
        shas = sorted(set(HEX64.findall(text)))
        if paths or shas:
            out.append({"file": path, "paths": paths, "shas": shas})
    return tuple(out)


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


def for_cell(cell_id: str, artifact_path: str | None) -> dict[str, Any]:
    """Does Hazard use what this page shows? One of three answers, and a sentence per reference saying what Hazard
    uses, what the page shows, and what differs in anything that can change a loss.

      used      Hazard's main uses this file, or a revision identical in every loss-relevant fact
      differs   Hazard (main or a branch) uses a newer model, a revision that differs in a loss-relevant fact, or
                multiplies the curve by a different value share
      not_main  Hazard's main does not use it: only branches hold an identical copy, or nothing was found
    """
    if hazard_main.repo() is None:
        return {"state": "unchecked", "pins": [], "sentences": ["Hazard's repository could not be read, so whether Hazard uses this is not checked."],
                "differences": [], "values": [], "value_mismatches": [], "newer": None}
    shown: dict[str, Any] = {}
    if artifact_path and (ROOT / artifact_path).exists():
        raw = (ROOT / artifact_path).read_bytes()
        d = json.loads(raw)
        shown = {"sha256": hashlib.sha256(raw).hexdigest(), "model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision"),
                 "records": _records(d), "units": _units(d), "path": artifact_path,
                 "shares": {u.get("id"): u.get(INSTALLED_SHARE) for u in d.get("failure_units") or [] if isinstance(u.get(INSTALLED_SHARE), (int, float))}}
    pins: list[dict[str, Any]] = []

    def add(kind: str, model: str | None, docs: str | None, sha: str | None, on_main: bool, branches: list[str], facts: dict[str, Any],
            values: list[dict[str, Any]], code_file: str | None = None) -> None:
        same = sha is not None and sha == shown.get("sha256")
        same_model = model == shown.get("model")
        diffs = [] if same else _loss_diff(facts, shown)
        subj, verb = ("Hazard's main code (" + code_file + ")", "uses") if code_file else _where_words(on_main, branches)
        if same:
            words = f"{subj} {verb} the file shown here ({model}, {docs})."
        else:
            head = f"{subj} {verb} {model}, {docs}; this page shows {shown.get('model')}, {shown.get('docs')}"
            tail = (f"{_same_curves(facts, shown)}, and nothing else that can change a loss differs (the rest is wording)" if not diffs
                    else f"{_same_curves(facts, shown)}; " + "; ".join(diffs))
            where = f" Hazard's version is {_damage_where(cell_id, sha)}." if sha and not same_model else ""
            words = f"{head}. {tail[0].upper() + tail[1:]}.{where}"
        pins.append({"kind": kind, "model": model, "docs": docs, "same": same, "same_model": same_model, "on_main": on_main, "branches": branches,
                     "differences": diffs, "words": words, "values": values})

    for c in (x for x in copies() if x["cell_id"] == cell_id):
        add("copy", c["model"], c["docs"], c["sha256"], c["on_main"], c["branches"], c, c["values"])
    ours = _ours(cell_id)
    for ref in code_refs():
        hashed = [s_ for s_ in ref["shas"] if s_ in ours]
        if hashed:
            t = ours[hashed[0]]
            add("code_hash", t["model"], t["docs"], hashed[0], True, [], t, [], ref["file"])
            continue
        loaded = [p for p in ref["paths"] if f"docs/cells/{cell_id}/" in p]
        if loaded:  # by path only: the model version is checked, the bytes are not
            t = next((v for v in ours.values() if v["path"] == loaded[0]), None)
            add("code_path", t["model"] if t else None, t["docs"] if t else None, None, True, [], t or {}, [], ref["file"])
    # value shares: what Hazard's pins multiply a unit's curve by, against the installed-basis share the artifact declares
    values, mismatches = [], []
    for p in pins:
        for v in p["values"]:
            declared = (shown.get("shares") or {}).get(v["unit"])
            row = {**v, "declared": declared, "where": _where_words("main" in v["refs"], sorted(r for r in v["refs"] if r != "main"))[0]}
            values.append(row)
            if declared is not None and "install" in v["basis"].lower() and abs(declared - v["share"]) > 1e-4:
                mismatches.append(row)
    newer = max((p for p in pins if _model(p["model"]) > _model(shown.get("model"))), key=lambda p: _model(p["model"]), default=None)
    main_same_model = [p for p in pins if p["on_main"] and (p["same"] or p["same_model"])]
    differs_on_main = [p for p in main_same_model if p["differences"]]
    if newer or mismatches or (differs_on_main and not any(p["same"] for p in main_same_model)):
        state = "differs"
    elif main_same_model:
        state = "used"
    else:
        state = "not_main"
    share_lines = [f"{v['where']} ({v['pin']}) multiplies {v['unit']} by {v['share']:.2%} of installed value"
                   + (f" ({v['note']})" if v.get("note") else "") + f"; the artifact shown here declares {v['declared']:.2%} of installed capex."
                   for v in mismatches]
    sentences = [p["words"] for p in pins] + share_lines or [
        "No copy, hash or path of this cell's artifact was found in Hazard's repository; Hazard may still use curves of its own."]
    # the lines that say why a cell differs, for the note at the top of its page, its Review task and the build check
    why = ([newer["words"]] if newer else []) + [p["words"] for p in differs_on_main if p is not newer] + share_lines
    return {"state": state, "pins": [{k: p[k] for k in ("kind", "model", "docs", "same", "same_model", "on_main", "branches", "differences", "words")} for p in pins],
            "sentences": sentences, "differences": why if state == "differs" else [], "values": values, "value_mismatches": mismatches,
            "newer": {"model": newer["model"], "docs": newer["docs"], "shown": shown.get("model"), "words": newer["words"]} if newer else None}
