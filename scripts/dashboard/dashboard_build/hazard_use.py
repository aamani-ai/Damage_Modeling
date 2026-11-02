"""Which of this repository's curve artifacts Hazard itself pins.

Hazard keeps a copy of every Damage artifact it consumes (a `curve_artifact.json` beside its consumption or source
pin), on its main and on its branches. Each copy is matched to a cell by its own `cell_id`, and to the artifact this
dashboard shows by SHA-256; model version and documentation revision are compared separately, since a consumer pins
the model version (standard 17). A copy only on Hazard branches is always said to be not on Hazard's main. Where
Hazard pins a version this page does not show, the version is looked for in Damage: this tree, then Damage's
branches.
"""
from __future__ import annotations

import functools
import hashlib
import json
import re
import subprocess
from pathlib import Path
from typing import Any

from . import hazard_main
from .common import CHECKOUT, ROOT, rel


def _git(repo: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True)


def _model(v: str | None) -> tuple[int, ...]:
    return tuple(int(x) for x in re.findall(r"\d+", v or "")) or (0,)


def _refs(repo: Path) -> list[str]:
    out = _git(repo, "for-each-ref", "--format=%(refname:short)", "refs/remotes/origin").stdout.decode().split()
    return [r for r in out if r not in ("origin/HEAD", "origin")]


@functools.lru_cache(maxsize=1)
def copies() -> tuple[dict[str, Any], ...]:
    """Every distinct Damage artifact copy on Hazard's refs: its cell, versions, SHA-256, and where it sits."""
    repo = hazard_main.repo()
    if repo is None:
        return ()
    places: dict[str, list[tuple[str, str]]] = {}
    for ref in _refs(repo):
        for line in _git(repo, "ls-tree", "-r", ref).stdout.decode().splitlines():
            meta, path = line.split("\t", 1)
            if path.endswith("/curve_artifact.json"):
                places.setdefault(meta.split()[2], []).append((ref.removeprefix("origin/"), path))
    out = []
    for blob, where in places.items():
        raw = _git(repo, "cat-file", "blob", blob).stdout
        try:
            d = json.loads(raw)
        except ValueError:
            continue
        if not d.get("cell_id"):
            continue
        main = sorted({p for r, p in where if r == "main"})
        out.append({"cell_id": d["cell_id"], "model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision"),
                    "sha256": hashlib.sha256(raw).hexdigest(), "on_main": bool(main), "main_paths": main,
                    "branches": sorted({r for r, _ in where if r != "main"})})
    return tuple(sorted(out, key=lambda c: (c["cell_id"], _model(c["model"]), _model(c["docs"]))))


@functools.lru_cache(maxsize=None)
def _damage_where(cell_id: str, sha: str) -> str | None:
    """Where an artifact with this SHA-256 is in Damage: this tree, else the Damage branches that hold it."""
    for f in sorted((ROOT / "docs" / "cells" / cell_id).rglob("*curve_artifact.json")):
        if hashlib.sha256(f.read_bytes()).hexdigest() == sha:
            return f"in this repository at {rel(f)}"
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


def _where_words(c: dict[str, Any]) -> str:
    if c["on_main"]:
        return "Hazard's main"
    names = c["branches"]
    shown = ", ".join(names[:3]) + (f" and {len(names) - 3} more" if len(names) > 3 else "")
    return f"Hazard branch{'es' if len(names) > 1 else ''} {shown} (not on Hazard's main)"


def _pins_verb(c: dict[str, Any]) -> str:
    return "pins" if c["on_main"] or len(c["branches"]) == 1 else "pin"


def for_cell(cell_id: str, artifact_path: str | None) -> dict[str, Any]:
    """What Hazard pins for this cell, against the artifact the page shows."""
    if hazard_main.repo() is None:
        return {"state": "unchecked", "pins": [], "sentences": ["Hazard's main could not be read, so Hazard's pins are not checked."], "newer": None}
    shown: dict[str, Any] = {}
    if artifact_path and (ROOT / artifact_path).exists():
        raw = (ROOT / artifact_path).read_bytes()
        d = json.loads(raw)
        shown = {"sha256": hashlib.sha256(raw).hexdigest(), "model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision")}
    pins = []
    for c in (x for x in copies() if x["cell_id"] == cell_id):
        same = c["sha256"] == shown.get("sha256")
        same_model = c["model"] == shown.get("model")
        if same:
            words = f"{_where_words(c)} {_pins_verb(c)} the artifact shown here ({c['model']}, {c['docs']})."
        elif same_model:
            words = f"{_where_words(c)} {_pins_verb(c)} {c['model']} at {c['docs']}; this page shows {shown.get('docs')} of the same model."
        else:
            words = (f"{_where_words(c)} {_pins_verb(c)} {c['model']} ({c['docs']}), not the version shown here ({shown.get('model')}); "
                     f"that artifact is {_damage_where(cell_id, c['sha256'])}.")
        pins.append({**{k: c[k] for k in ("model", "docs", "sha256", "on_main", "main_paths", "branches")}, "same": same, "same_model": same_model, "words": words})
    if any(p["on_main"] and p["same"] for p in pins):
        state = "main"
    elif any(p["on_main"] and p["same_model"] for p in pins):
        state = "main_model"
    elif any(p["same"] or p["same_model"] for p in pins):
        state = "branch"
    elif pins:
        state = "other"
    else:
        state = "none"
    newer = max((p for p in pins if _model(p["model"]) > _model(shown.get("model"))), key=lambda p: _model(p["model"]), default=None)
    return {"state": state, "pins": pins, "sentences": [p["words"] for p in pins] or ["No copy of this cell's artifact was found on Hazard's main or its branches."],
            "newer": {"model": newer["model"], "docs": newer["docs"], "shown": shown.get("model"), "where": _where_words(newer), "verb": _pins_verb(newer)} if newer else None}
