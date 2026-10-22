"""Hazard_modeling as it is on its origin/main (G18, DCD-D30) — read through git, never from its working tree.

The Hazard checkout on a machine may sit on a feature branch with uncommitted work; the dashboard shows what is
merged. Every Hazard file the build reads, and every Hazard path a page links to, is looked up on Hazard's
origin/main as last fetched on this machine (the build never fetches in Hazard). A path that is not there is
either moved on main (into an `_archive/<name>/` folder) or on a Hazard branch, not on its main yet.
"""
from __future__ import annotations

import functools
import os
import re
import subprocess
from pathlib import Path
from typing import Any

from .common import CHECKOUT

REF = "origin/main"
HAZARD_REPO_URL = "https://github.com/aamani-ai/Hazard_Modeling"
ON_BRANCH_WORDS = "on a Hazard branch, not on its main yet"


def _run(repo: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True)


@functools.lru_cache(maxsize=1)
def repo() -> Path | None:
    """Where Hazard_modeling is on this machine: $HAZARD_MODELING, the gitignored repo-root symlink, or a sibling of the
    main checkout (a worktree resolves it through git's common directory). None when no candidate is a git repository."""
    candidates = [Path(os.environ["HAZARD_MODELING"])] if os.environ.get("HAZARD_MODELING") else []
    candidates.append(CHECKOUT / "Hazard_modeling")
    done = _run(CHECKOUT, "rev-parse", "--git-common-dir")
    if done.returncode == 0:
        candidates.append((CHECKOUT / done.stdout.strip()).resolve().parent.parent / "Hazard_modeling")
    for c in candidates:
        if c.exists() and _run(c, "rev-parse", "--verify", "--quiet", REF).returncode == 0:
            return c
    return None


@functools.lru_cache(maxsize=1)
def state() -> dict[str, Any]:
    """Hazard's origin/main commit here, and whether GitHub's main has moved past it (checked read-only, ls-remote)."""
    r = repo()
    if r is None:
        return {"available": False, "ref": REF, "commit": None, "sentence": "Hazard_modeling was not found on this machine; Hazard links are not checked"}
    commit = _run(r, "rev-parse", REF).stdout.strip()
    remote = _run(r, "ls-remote", "origin", "refs/heads/main")
    remote_sha = remote.stdout.split()[0] if remote.returncode == 0 and remote.stdout.strip() else None
    behind = (remote_sha != commit) if remote_sha else None
    sentence = f"Hazard's main at {commit[:7]}" + ("" if behind is False else " (GitHub's main has moved on; fetch in Hazard to refresh)" if behind else " (GitHub not reachable; not compared)")
    return {"available": True, "ref": REF, "commit": commit, "remote_commit": remote_sha, "behind": behind, "sentence": sentence}


@functools.lru_cache(maxsize=1)
def _tree() -> frozenset[str]:
    r = repo()
    if r is None:
        return frozenset()
    return frozenset(_run(r, "ls-tree", "-r", "--name-only", REF).stdout.splitlines())


def _is_dir(path: str) -> bool:
    p = path.rstrip("/") + "/"
    return any(t.startswith(p) for t in _tree())


ARCHIVE_SEG = re.compile(r"/_archive/[^/]+/")


def lookup(path: str) -> dict[str, Any]:
    """A Hazard path (relative to the Hazard repository root) → its state on Hazard's main and the link to open.

    state: on_main · moved (with `moved_to`) · on_branch · unchecked (no Hazard checkout here)."""
    p = path.strip().lstrip("/").split("#")[0].rstrip(".,;)")
    st = state()
    if not st["available"]:
        return {"path": p, "state": "unchecked", "link": f"{HAZARD_REPO_URL}/blob/main/{p}", "words": None}
    blob = f"{HAZARD_REPO_URL}/{'tree' if _is_dir(p) else 'blob'}/{st['commit']}/{p}"
    if p.rstrip("/") in _tree() or _is_dir(p):
        return {"path": p, "state": "on_main", "link": blob, "words": None}
    moved = sorted(t for t in _tree() if ARCHIVE_SEG.search(t) and ARCHIVE_SEG.sub("/", t) == p)
    if moved:
        return {"path": p, "state": "moved", "moved_to": moved[0], "link": f"{HAZARD_REPO_URL}/blob/{st['commit']}/{moved[0]}",
                "words": f"moved on Hazard's main to {moved[0]}"}
    return {"path": p, "state": "on_branch", "link": None, "words": ON_BRANCH_WORDS}


def read(path: str) -> bytes | None:
    """The file's bytes on Hazard's origin/main, or None when it is not there (or no Hazard checkout is found)."""
    r = repo()
    if r is None:
        return None
    done = subprocess.run(["git", "-C", str(r), "show", f"{REF}:{path}"], capture_output=True)
    return done.stdout if done.returncode == 0 else None
