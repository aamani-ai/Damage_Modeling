#!/usr/bin/env python3
"""Read-only branch register: every local and remote branch with who created it and when (first commit off
main), who last touched it and when, how it stands against main, whether it is merged, and how many files
it changes. Prints a Markdown table for docs/extra/branch_register.md.

Run from anywhere in the repository:
    python3 scripts/reference_helpers/branch_register.py            # from the refs already fetched
    python3 scripts/reference_helpers/branch_register.py --fetch    # fetch and prune first
Nothing is written; the recommendation column is added by hand in the register.
"""
from __future__ import annotations

import datetime
import subprocess
import sys


def git(*args: str) -> str:
    return subprocess.run(["git", *args], capture_output=True, text=True, check=True).stdout.strip()


def is_ancestor(a: str, b: str) -> bool:
    return subprocess.run(["git", "merge-base", "--is-ancestor", a, b], capture_output=True).returncode == 0


def main() -> None:
    if "--fetch" in sys.argv[1:]:
        subprocess.run(["git", "fetch", "--all", "--prune", "-q"], check=False)
    today = datetime.date.today()
    head = git("rev-parse", "--short", "main")
    fmt = "%(refname)|%(refname:short)|%(objectname:short)|%(authorname)|%(committerdate:short)|%(subject)"
    refs = git("for-each-ref", "--sort=-committerdate", f"--format={fmt}", "refs/heads", "refs/remotes").splitlines()
    print(f"*Generated {today} at `main` = `{head}`. Ahead / behind count commits not on `main` / not on the branch.*\n")
    print("| Branch | Last commit | Last by · on | Age (days) | Created by · on (first commit off main) | Ahead / behind | Merged into main | Files vs main |")
    print("|---|---|---|---|---|---|---|---|")
    for line in refs:
        ref, short, sha, author, cdate, subject = line.split("|", 5)
        if ref.endswith("/HEAD"):
            continue  # origin/HEAD is a pointer, not a branch
        age = (today - datetime.date.fromisoformat(cdate)).days
        if short in ("main", "origin/main"):
            ahead = behind = "—"; merged = "—"; first = "—"; files = "—"
        else:
            behind, ahead = git("rev-list", "--left-right", "--count", f"main...{short}").split()
            merged = "yes" if is_ancestor(short, "main") else "no"
            off_main = git("log", "--reverse", "--format=%an · %ad", "--date=short", f"main..{short}").splitlines()
            first = off_main[0] if off_main else "— (fully contained in main)"
            files = str(len(git("diff", "--name-only", git("merge-base", "main", short), short).splitlines()))
        subject = subject.replace("|", "/")
        print(f"| `{short}` | `{sha}` {subject[:70]} | {author} · {cdate} | {age} | {first} | {ahead} / {behind} | {merged} | {files} |")


if __name__ == "__main__":
    main()
