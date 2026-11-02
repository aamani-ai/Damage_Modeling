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
                    "branches": sorted({r for r, _ in where if r != "main"}), "records": _records(d), "values": values})
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
        out[hashlib.sha256(raw).hexdigest()] = {"path": rel(f), "model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision")}
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


def _curve_diff(pinned: dict[str, Any], shown: dict[str, Any]) -> str:
    same = [k for k in shown if k in pinned and pinned[k] == shown[k]]
    changed = [k for k in shown if k in pinned and pinned[k] != shown[k]]
    dropped = [k for k in shown if k not in pinned]
    added = [k for k in pinned if k not in shown]
    if not changed and not dropped and not added:
        return f"its {len(same)} curve{'s are' if len(same) != 1 else ' is'} identical to the ones shown here"
    parts = [f"{len(same)} of the {len(shown)} curves shown here are identical"]
    if changed:
        parts.append(f"{len(changed)} {'have' if len(changed) != 1 else 'has'} different parameters ({', '.join(changed[:4])})")
    if dropped:
        parts.append(f"it drops {len(dropped)} ({', '.join(dropped[:4])})")
    if added:
        parts.append(f"it adds {len(added)} ({', '.join(added[:4])})")
    return "; ".join(parts)


def for_cell(cell_id: str, artifact_path: str | None) -> dict[str, Any]:
    """What Hazard uses of this cell, against the artifact the page shows."""
    if hazard_main.repo() is None:
        return {"state": "unchecked", "pins": [], "sentences": ["Hazard's main could not be read, so what Hazard uses is not checked."],
                "newer": None, "values": [], "value_mismatches": []}
    shown: dict[str, Any] = {}
    if artifact_path and (ROOT / artifact_path).exists():
        raw = (ROOT / artifact_path).read_bytes()
        d = json.loads(raw)
        shown = {"sha256": hashlib.sha256(raw).hexdigest(), "model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision"),
                 "records": _records(d), "path": artifact_path,
                 "shares": {u.get("id"): u.get(INSTALLED_SHARE) for u in d.get("failure_units") or [] if isinstance(u.get(INSTALLED_SHARE), (int, float))}}
    pins: list[dict[str, Any]] = []
    for c in (x for x in copies() if x["cell_id"] == cell_id):
        subj, verb = _where_words(c["on_main"], c["branches"])
        same, same_model = c["sha256"] == shown.get("sha256"), c["model"] == shown.get("model")
        if same:
            words = f"{subj} {verb} the artifact shown here by hash ({c['model']}, {c['docs']})."
        elif same_model:
            words = f"{subj} {verb} {c['model']} at {c['docs']} by hash; this page shows {shown.get('docs')} of the same model."
        else:
            words = (f"{subj} {verb} {c['model']} ({c['docs']}) by hash, not the version shown here ({shown.get('model')}); "
                     f"{_curve_diff(c['records'], shown.get('records') or {})}. That artifact is {_damage_where(cell_id, c['sha256'])}.")
        pins.append({"kind": "copy", "model": c["model"], "docs": c["docs"], "same": same, "same_model": same_model, "on_main": c["on_main"],
                     "branches": c["branches"], "hash": True, "words": words, "values": c["values"]})
    ours = _ours(cell_id)
    for ref in code_refs():
        hashed = [s for s in ref["shas"] if s in ours]
        loaded = [p for p in ref["paths"] if f"docs/cells/{cell_id}/" in p]
        if not hashed and not loaded:
            continue
        target = ours[hashed[0]] if hashed else None
        path = target["path"] if target else loaded[0]
        file_model = target["model"] if target else (lambda m: f"model v{m.group(1)}.{m.group(2)}" if m else None)(re.search(r"model_v(\d+)_(\d+)", path))
        same = (hashed[0] == shown.get("sha256")) if hashed else (path == shown.get("path"))
        same_model = file_model == shown.get("model")
        how = "by hash" if hashed else "by path from a local Damage checkout, checking the model version but not the bytes"
        if same:
            words = f"Hazard's main code ({ref['file']}) loads the artifact shown here {how}."
        else:
            words = f"Hazard's main code ({ref['file']}) loads {path} {how}; this page shows {shown.get('path')}."
        pins.append({"kind": "code_hash" if hashed else "code_path", "model": file_model, "docs": target["docs"] if target else None, "same": same,
                     "same_model": same_model, "on_main": True, "branches": [], "hash": bool(hashed), "words": words, "values": []})
    newer = max((p for p in pins if _model(p["model"]) > _model(shown.get("model"))), key=lambda p: _model(p["model"]), default=None)
    if newer:
        state = "newer"
    elif any(p["on_main"] and p["same"] and p["hash"] for p in pins):
        state = "main"
    elif any(p["on_main"] and p["same_model"] and p["hash"] for p in pins):
        state = "main_model"
    elif any(p["on_main"] and (p["same"] or p["same_model"]) for p in pins):
        state = "main_path"
    elif any(p["same"] or p["same_model"] for p in pins):
        state = "branch"
    elif pins:
        state = "older"
    else:
        state = "none"
    # value shares: what Hazard's pins multiply a unit's curve by, against the installed-basis share the artifact declares
    values, mismatches = [], []
    for p in pins:
        for v in p["values"]:
            declared = (shown.get("shares") or {}).get(v["unit"])
            row = {**v, "declared": declared, "where": _where_words("main" in v["refs"], sorted(r for r in v["refs"] if r != "main"))[0]}
            values.append(row)
            if declared is not None and "install" in v["basis"].lower() and abs(declared - v["share"]) > 1e-4:
                mismatches.append(row)
    sentences = [p["words"] for p in pins] or [
        "No copy, hash or path of this cell's artifact was found in Hazard's repository; Hazard may still use curves of its own."]
    for v in mismatches:
        sentences.append(f"{v['where']} ({v['pin']}) multiplies {v['unit']} by {v['share']:.2%} of installed value"
                         + (f" ({v['note']})" if v.get("note") else "") + f"; the artifact shown here declares {v['declared']:.2%} of installed capex.")
    return {"state": state, "pins": [{k: p[k] for k in ("kind", "model", "docs", "same", "same_model", "on_main", "branches", "hash", "words")} for p in pins],
            "sentences": sentences, "values": values, "value_mismatches": mismatches,
            "newer": {"model": newer["model"], "docs": newer["docs"], "shown": shown.get("model"), "words": newer["words"]} if newer else None}
