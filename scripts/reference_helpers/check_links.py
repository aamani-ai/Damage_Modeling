#!/usr/bin/env python3
"""Check relative Markdown links and same-file ``#anchors`` in the repository's documentation.

    .venv/bin/python scripts/reference_helpers/check_links.py             # the default set
    .venv/bin/python scripts/reference_helpers/check_links.py notebooks   # extra files or folders too
    .venv/bin/python scripts/reference_helpers/check_links.py --verbose   # also list the cross-repo links skipped

Default set: ``docs/**/*.md`` (except ``docs/source_drops/extracted/``, a local mirror), ``README.md`` and
``AGENTS.md``. Each break is printed as ``file:line -> target  [reason]`` and the exit status is non-zero
when any link is broken.

What counts:

* **Relative links** — inline ``[text](path)``, images ``![alt](path)``, and reference definitions
  ``[id]: path`` — must point at an existing file or directory. Existence is checked *case-sensitively*
  even on macOS, so a local run predicts the Linux CI runner. ``path#anchor`` into another file checks the
  file only.
* **Same-file anchors** ``[text](#anchor)`` must match a heading in the same file (GitHub's slug rule:
  lower-case, drop everything but word characters, spaces and hyphens, spaces to hyphens, ``-1``/``-2`` on
  repeats; ATX and setext headings) or an explicit ``<a id="…">`` / ``name="…"`` / ``id="…"`` in it.

What is skipped, and counted as skipped rather than broken:

* links with a scheme (``https:``, ``mailto:``, ``data:`` …);
* links into the five cross-project repositories ``Hazard_modeling``, ``model-gpr``, ``Learning``,
  ``infrasure-damage-curves`` and ``renewablesinfo_org`` — whether through the gitignored symlinks at the
  repository root or as a sibling checkout one level above it (``../../../../Hazard_modeling/…``, the same
  convention the substation validators use). They exist only on the owner's machine; ``--verbose`` lists them;
* anything inside fenced code blocks or inline code spans.

A link that escapes the repository to anywhere else is broken: no clone can follow it.

Standard library only.
"""
from __future__ import annotations

import argparse
import os
import re
import sys
from functools import lru_cache
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[2]

DEFAULT_PATHS = ("docs", "README.md", "AGENTS.md")
EXCLUDED_DIRS = ("docs/source_drops/extracted",)
CROSS_PROJECT_REPOS = frozenset({"Hazard_modeling", "model-gpr", "Learning", "infrasure-damage-curves", "renewablesinfo_org"})

SCHEME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9+.\-]*:")
FENCE_RE = re.compile(r"^(\s{0,3})(`{3,}|~{3,})")
INLINE_CODE_RE = re.compile(r"(`+)(?!`)(.+?)(?<!`)\1(?!`)")
INLINE_LINK_OPEN_RE = re.compile(r"\]\(")
REF_DEF_RE = re.compile(r"^\s{0,3}\[([^\]]+)\]:\s*(<[^>]*>|\S+)")
ATX_RE = re.compile(r"^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$")
SETEXT_RE = re.compile(r"^\s{0,3}(=+|-+)\s*$")
HTML_ANCHOR_RE = re.compile(r"<[^>]*\b(?:id|name)\s*=\s*[\"']([^\"']+)[\"']", re.IGNORECASE)
HTML_TAG_RE = re.compile(r"<[^>]+>")


def collect_files(paths: list[str]) -> list[Path]:
    files: list[Path] = []
    excluded = tuple((ROOT / d).resolve() for d in EXCLUDED_DIRS)
    for raw in paths:
        path = (ROOT / raw).resolve()
        candidates = sorted(path.rglob("*.md")) if path.is_dir() else [path]
        for candidate in candidates:
            if not candidate.is_file():
                print(f"warning: {raw} does not exist", file=sys.stderr)
                continue
            if any(candidate.is_relative_to(ex) for ex in excluded):
                continue
            if candidate not in files:
                files.append(candidate)
    return files


def blank_fences(text: str) -> list[str]:
    """Return the lines with fenced code blocks blanked (line count preserved)."""
    out: list[str] = []
    fence: str | None = None
    for line in text.splitlines():
        m = FENCE_RE.match(line)
        if fence is None and m:
            fence = m.group(2)[0]
            out.append("")
            continue
        if fence is not None:
            if m and m.group(2)[0] == fence:
                fence = None
            out.append("")
            continue
        out.append(line)
    return out


def github_slug(title: str) -> str:
    text = HTML_TAG_RE.sub("", title)
    text = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", text)  # links and images -> their text
    text = re.sub(r"!?\[([^\]]*)\]\[[^\]]*\]", r"\1", text)
    text = text.replace("`", "").replace("*", "")
    text = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"\1", text)  # emphasis underscores, not snake_case
    text = text.strip().lower()
    text = re.sub(r"[^\w\- ]", "", text)
    return text.replace(" ", "-")


def anchors_in(lines: list[str], raw_text: str) -> set[str]:
    slugs: dict[str, int] = {}
    anchors: set[str] = set()

    def add(title: str) -> None:
        base = github_slug(title)
        n = slugs.get(base, 0)
        slugs[base] = n + 1
        anchors.add(base if n == 0 else f"{base}-{n}")

    previous = ""
    for line in lines:
        m = ATX_RE.match(line)
        if m:
            add(m.group(2))
            previous = ""
            continue
        if SETEXT_RE.match(line) and previous.strip() and not previous.lstrip().startswith(("|", "-", "*", "+", ">")):
            add(previous)
            previous = ""
            continue
        previous = line
    for m in HTML_ANCHOR_RE.finditer(raw_text):
        anchors.add(m.group(1))
    return anchors


def read_destination(line: str, start: int) -> str | None:
    """Parse the destination of an inline link whose ``(`` is at ``start``; None when unparsable."""
    i = start
    if i < len(line) and line[i] == "<":
        end = line.find(">", i + 1)
        return None if end < 0 else line[i + 1 : end]
    depth = 0
    j = i
    while j < len(line):
        c = line[j]
        if c in " \t":
            break
        if c == "(":
            depth += 1
        elif c == ")":
            if depth == 0:
                break
            depth -= 1
        j += 1
    return line[i:j] if j > i else None


def links_in(lines: list[str]) -> list[tuple[int, str]]:
    found: list[tuple[int, str]] = []
    for number, line in enumerate(lines, start=1):
        for m in INLINE_LINK_OPEN_RE.finditer(line):
            dest = read_destination(line, m.end())
            if dest:
                found.append((number, dest))
        m = REF_DEF_RE.match(line)
        if m:
            dest = m.group(2)
            found.append((number, dest[1:-1] if dest.startswith("<") else dest))
    return found


@lru_cache(maxsize=None)
def _entries(directory: Path) -> frozenset[str]:
    try:
        return frozenset(p.name for p in directory.iterdir())
    except OSError:
        return frozenset()


def exists_case_sensitive(path: Path) -> bool:
    """True when every component of ``path`` exists with exactly this spelling (Linux semantics on macOS)."""
    try:
        relative = path.relative_to(ROOT)
    except ValueError:
        return path.exists()
    current = ROOT
    for part in relative.parts:
        if part not in _entries(current):
            return False
        current = current / part
    return True


def classify(resolved: Path) -> str:
    """``inside`` the repository, ``cross-project`` (symlink or sibling checkout), or ``outside``."""
    for base in (ROOT, ROOT.parent):
        try:
            parts = resolved.relative_to(base).parts
        except ValueError:
            continue
        if base == ROOT:
            return "cross-project" if parts and parts[0] in CROSS_PROJECT_REPOS else "inside"
        return "cross-project" if parts and parts[0] in CROSS_PROJECT_REPOS else "outside"
    return "outside"


class Counts:
    def __init__(self) -> None:
        self.checked = 0
        self.scheme = 0
        self.cross_project = 0


def check_file(path: Path, counts: Counts, verbose: bool) -> list[str]:
    raw = path.read_text(encoding="utf-8", errors="replace")
    lines = blank_fences(raw)
    anchors = anchors_in(lines, raw)  # headings keep their inline-code text, as GitHub's slugs do
    link_lines = [INLINE_CODE_RE.sub(" ", line) for line in lines]  # links inside inline code are not links
    rel = path.relative_to(ROOT).as_posix()
    breaks: list[str] = []

    for number, dest in links_in(link_lines):
        dest = dest.strip()
        if not dest or SCHEME_RE.match(dest):
            counts.scheme += 1
            continue
        target, _, fragment = dest.partition("#")
        target = unquote(target)
        if not target:
            counts.checked += 1
            if fragment and fragment not in anchors:
                breaks.append(f"{rel}:{number} -> #{fragment}  [no such heading or anchor in this file]")
            continue
        joined = ROOT / target[1:] if target.startswith("/") else path.parent / target
        resolved = Path(os.path.normpath(joined))  # normalise ``..`` without following symlinks
        kind = classify(resolved)
        if kind == "cross-project":
            counts.cross_project += 1
            if verbose:
                print(f"skip {rel}:{number} -> {dest}  [cross-project repository]")
            continue
        counts.checked += 1
        if kind == "outside":
            breaks.append(f"{rel}:{number} -> {dest}  [resolves outside the repository]")
        elif not exists_case_sensitive(resolved):
            breaks.append(f"{rel}:{number} -> {dest}  [no such file or directory]")
    return breaks


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("paths", nargs="*", help="extra files or folders (repo-relative) to check as well")
    parser.add_argument("--verbose", action="store_true", help="also print every cross-project link skipped")
    args = parser.parse_args(argv)

    files = collect_files([*DEFAULT_PATHS, *args.paths])
    counts = Counts()
    breaks: list[str] = []
    for path in files:
        breaks.extend(check_file(path, counts, args.verbose))

    for line in breaks:
        print(line)
    print(
        f"{len(files)} files · {counts.checked} relative links and anchors checked · "
        f"{counts.cross_project} into cross-project repositories skipped · {counts.scheme} URLs skipped · "
        f"{len(breaks)} broken"
    )
    return 1 if breaks else 0


if __name__ == "__main__":
    sys.exit(main())
