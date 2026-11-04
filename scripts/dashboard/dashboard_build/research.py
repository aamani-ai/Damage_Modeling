"""The research so far behind a hazard with no damage curve (scripts/dashboard/research_index.json).

Each entry names a document in this repository or in Hazard's and the document's own conclusion. `for_pair` returns
the entries for an asset × hazard with a link that opens: a Damage path at the commit GitHub has (link_commit), a
Hazard path on its main or else on the branch that holds it (said so). A path that cannot be found is reported by
`problems()` for the build's check rather than shown as a dead link.
"""
from __future__ import annotations

import functools
import json
from pathlib import Path
from typing import Any

from . import hazard_main
from .common import CHECKOUT, ROOT

INDEX = CHECKOUT / "scripts" / "dashboard" / "research_index.json"
REPO_URL = "https://github.com/aamani-ai/Damage_Modeling"


@functools.lru_cache(maxsize=1)
def _entries() -> tuple[dict[str, Any], ...]:
    return tuple(json.loads(INDEX.read_text(encoding="utf-8"))["entries"]) if INDEX.exists() else ()


def _resolve(e: dict[str, Any], link_commit: str) -> dict[str, Any]:
    if e["repo"] == "damage":
        ok = (ROOT / e["path"]).exists()
        return {**e, "found": ok, "link": f"{REPO_URL}/blob/{link_commit}/{e['path']}" if ok else None, "where": "in this repository"}
    if e.get("branch"):  # the content is only on that branch, even where main has a file at the same path
        hit = next(((name, sha) for name, sha, files in hazard_main._branches() if name == e["branch"] and e["path"] in files), None)
        if hit:
            return {**e, "found": True, "link": f"{hazard_main.HAZARD_REPO_URL}/blob/{hit[1]}/{e['path']}", "where": f"not on Hazard's main; on Hazard branch {hit[0]}"}
    h = hazard_main.lookup(e["path"])
    where = {"on_main": "on Hazard's main", "moved": h.get("words"), "on_branch": h.get("words"), "not_found": h.get("words"),
             "unchecked": "in Hazard's repository (not checked)"}.get(h["state"], h.get("words"))
    return {**e, "found": h["state"] in ("on_main", "moved", "on_branch", "unchecked"), "link": h.get("link"), "where": where}


def for_pair(asset: str, hazard: str, link_commit: str) -> list[dict[str, Any]]:
    """The research for one asset × hazard, most specific first (the asset's own, then what applies to every asset)."""
    own = [e for e in _entries() if e["hazard"] == hazard and e["asset"] == asset]
    every = [e for e in _entries() if e["hazard"] == hazard and e["asset"] == "*"]
    return [{k: v for k, v in _resolve(e, link_commit).items() if k in ("title", "finding", "link", "where", "repo", "path", "found")} for e in own + every]


def problems(link_commit: str) -> list[str]:
    return [f"{e['repo']}: {e['path']}" for e in _entries() if not _resolve(e, link_commit)["found"]]
