"""Hazard_modeling as it is on its origin/main (G18, DCD-D30) — read through git, never from its working tree.

The Hazard checkout on a machine may sit on a feature branch with uncommitted work; the dashboard shows what is
merged. Every Hazard file the build reads, and every Hazard path a page links to, is looked up on Hazard's
origin/main. By default that is GitHub's main itself: the build keeps its own blobless clone of the remote under the
gitignored `.cache/hazard_main/` and fetches it at each build (file contents download only when read). It never
fetches in, or reads the working tree of, anyone's Hazard checkout; $HAZARD_MODELING points it at one instead. A
path that is not on main is still named as not on main, with where it is: moved on main (into an `_archive/<name>/`
folder), on a named Hazard branch (linked there), or found nowhere on Hazard, which is the only broken case.
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
CACHE = CHECKOUT / ".cache" / "hazard_main"
NOT_FOUND_WORDS = "not on Hazard's main or any of its branches"


def _run(repo: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True)


@functools.lru_cache(maxsize=1)
def _remote() -> dict[str, Any]:
    """The build's own copy of GitHub's main: cloned blobless on first use, fetched on every build. When GitHub is not
    reachable the copy last fetched here is used, and the state says so."""
    if not (CACHE / ".git").exists():
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        done = subprocess.run(["git", "clone", "-q", "--filter=blob:none", "--no-checkout", f"{HAZARD_REPO_URL}.git", str(CACHE)], capture_output=True, text=True)
        return {"path": CACHE if done.returncode == 0 else None, "fetched": done.returncode == 0}
    done = _run(CACHE, "fetch", "-q", "--prune", "--filter=blob:none", "origin", "+refs/heads/*:refs/remotes/origin/*")
    return {"path": CACHE, "fetched": done.returncode == 0}


@functools.lru_cache(maxsize=1)
def repo() -> Path | None:
    """Where Hazard's main is read: $HAZARD_MODELING when set; else the build's copy of GitHub's main (`_remote`); else,
    offline with no copy yet, the gitignored repo-root symlink or a sibling of the main checkout. None when none has
    an origin/main."""
    candidates = [Path(os.environ["HAZARD_MODELING"])] if os.environ.get("HAZARD_MODELING") else []
    if not candidates and _remote()["path"] is not None:
        candidates.append(CACHE)
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
        return {"available": False, "ref": REF, "commit": None, "source": None,
                "sentence": "Hazard's main could not be read (GitHub not reachable and no copy here); Hazard links are not checked"}
    commit = _run(r, "rev-parse", REF).stdout.strip()
    if r == CACHE:
        fetched = _remote()["fetched"]
        return {"available": True, "ref": REF, "commit": commit, "remote_commit": commit if fetched else None, "behind": False if fetched else None,
                "source": "github", "fetched": fetched,
                "sentence": f"Hazard's main at {commit[:7]}, read from GitHub" + ("" if fetched else " (GitHub not reachable; the copy last fetched here)")}
    remote = _run(r, "ls-remote", "origin", "refs/heads/main")
    remote_sha = remote.stdout.split()[0] if remote.returncode == 0 and remote.stdout.strip() else None
    behind = (remote_sha != commit) if remote_sha else None
    sentence = f"Hazard's main at {commit[:7]}, read from a local Hazard checkout" + ("" if behind is False else " (GitHub's main has moved on; fetch in Hazard to refresh)" if behind else " (GitHub not reachable; not compared)")
    return {"available": True, "ref": REF, "commit": commit, "remote_commit": remote_sha, "behind": behind, "source": "checkout", "sentence": sentence}


@functools.lru_cache(maxsize=1)
def _tree() -> frozenset[str]:
    r = repo()
    if r is None:
        return frozenset()
    return frozenset(_run(r, "ls-tree", "-r", "--name-only", REF).stdout.splitlines())


@functools.lru_cache(maxsize=1)
def _branches() -> tuple[tuple[str, str, frozenset[str]], ...]:
    """Hazard's other branches as fetched here, most recently committed first: (name, head commit, its files)."""
    r = repo()
    if r is None:
        return ()
    refs = _run(r, "for-each-ref", "--sort=-committerdate", "--format=%(refname:short) %(objectname)", "refs/remotes/origin").stdout.splitlines()
    out = []
    for line in refs:
        name, sha = line.split()
        if name in ("origin/main", "origin/HEAD", "origin"):
            continue
        out.append((name.removeprefix("origin/"), sha, frozenset(_run(r, "ls-tree", "-r", "--name-only", sha).stdout.splitlines())))
    return tuple(out)


def _on_branches(p: str) -> list[tuple[str, str, bool]]:
    """The branches that hold the path, the one where it last changed first (ties by name): (name, head, is a folder)."""
    q = p.rstrip("/")
    r = repo()
    found = [(name, sha, q not in files) for name, sha, files in _branches() if q in files or any(f.startswith(q + "/") for f in files)]
    when = {name: int(_run(r, "log", "-1", "--format=%ct", sha, "--", q).stdout.strip() or 0) for name, sha, _ in found} if r else {}
    return sorted(found, key=lambda b: (-when.get(b[0], 0), b[0]))


def _is_dir(path: str) -> bool:
    p = path.rstrip("/") + "/"
    return any(t.startswith(p) for t in _tree())


ARCHIVE_SEG = re.compile(r"/_archive/[^/]+/")


def lookup(path: str) -> dict[str, Any]:
    """A Hazard path (relative to the Hazard repository root) → its state on Hazard's main and the link to open.

    state: on_main · moved (with `moved_to`) · on_branch (with `branch`, `branches`) · not_found · unchecked (Hazard's
    main could not be read). Every state but on_main says in its words that the path is not on Hazard's main."""
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
                "words": f"not on Hazard's main at this path; moved on main to {moved[0]}"}
    found = _on_branches(p)
    if found:
        name, sha, is_dir = found[0]
        names = [b for b, _, _ in found]
        where = f"branch {name}" if len(names) == 1 else f"branches {', '.join(names[:3])}" + (f" and {len(names) - 3} more" if len(names) > 3 else "")
        return {"path": p, "state": "on_branch", "branch": name, "branches": names,
                "link": f"{HAZARD_REPO_URL}/{'tree' if is_dir else 'blob'}/{sha}/{p}", "words": f"not on Hazard's main; on Hazard {where} (linked: {name})"}
    return {"path": p, "state": "not_found", "link": None, "words": NOT_FOUND_WORDS}


def read(path: str) -> bytes | None:
    """The file's bytes on Hazard's origin/main, or None when it is not there (or Hazard's main cannot be read)."""
    r = repo()
    if r is None:
        return None
    done = subprocess.run(["git", "-C", str(r), "show", f"{REF}:{path}"], capture_output=True)
    return done.stdout if done.returncode == 0 else None
