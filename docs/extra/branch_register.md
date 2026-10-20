<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: active
scope: The branch register — every branch of aamani-ai/Damage_Modeling with who created it, when, when it was last touched, how it stands against main and what should happen to it — plus the branch policy proposed for the owner's confirmation. Refreshed with scripts/reference_helpers/branch_register.py in the same commit as any branch action.
-->

# Branch register

*Divy, 2026-10-20: "we have a lot of branches. Some of them are old and stale, and we need to have some idea
of who created that, when, when it was last edited, and whether it is something needed or it has become stale
and should be deleted." This file is that idea, kept current. The facts come from
[`scripts/reference_helpers/branch_register.py`](../../scripts/reference_helpers/branch_register.py); the
**What to do** column is judgment, and a branch is never deleted without its creator's agreement.*

## The register (2026-10-20, `main` after merging PR #2 and PR #4)

| Branch | Created by · on | Last by · on | Age (days) | Ahead / behind `main` | Merged | Files | What it is | What to do |
|---|---|---|---|---|---|---|---|---|
| `main` = `origin/main` | — | Divi-patel · 2026-10-20 | 0 | — | — | — | The line of record; pushed directly by the owner | — |
| `claude/dashboard-v0-5d463c` (local worktree, not yet pushed) | the V0 build session · 2026-10-20 | · 2026-10-20 | 0 | 2 / 4 | no | 188 | The dashboard Phase 0 (data build with checks and receipt, the occurrence register home) committed; V0 screens in progress — interrupted by a session limit and resumed ([plan](../plans/damage_curve_dashboard/README.md)) | **Active.** Becomes a PR that waits for the owner's screenshot review; delete after merge |
| `origin/claude/keen-sanderson-23b1d5` | the CI session · 2026-10-20 | · 2026-10-20 | 0 | 4 / 4 | no | 11 | **PR #3** — CI workflow, `validate_all.py`, `check_links.py`; red on Ubuntu for one platform-sensitive known-answer test, fix in progress | **Active.** Merge when the workflow is green; delete after merge |
| `origin/claude/ci-kat-diagnostic` | the CI session · 2026-10-20 | · 2026-10-20 | 0 | 5 / 4 | no | 13 | A temporary branch to run the KAT diagnostic on Ubuntu; its own commit message says it is to be deleted | **Delete** once PR #3 is green (the CI session's job) |
| `origin/cell/real-estate` | jll-l · (fully contained) | jll-l · 2026-10-19 | 1 | 0 / 8 | **yes** | 0 | Jung A's working branch for the five Real Estate cells; merged into `main` on 2026-10-19 | **Merged — safe to delete whenever Jung A is done pushing to it.** Nothing is lost |
| `origin/cell/flood-real-estate` | jll-l · (fully contained) | jll-l · 2026-10-12 | 8 | 0 / 56 | **yes** | 0 | The first Real Estate cell, superseded by `cell/real-estate` | **Delete** (merged; with Jung A's OK) |
| `origin/cell/winter-storm-solar-wind` | jll-l · 2026-10-12 | jll-l · 2026-10-15 | 5 | 2 / 63 | no | 55 | Two proposed cells (`winter_storm_solar` screening proxy, `winter_storm_wind` fail-closed), five notebooks, five scripts | **Decision needed (RO3):** rebase onto `main` and merge as proposals, or close with a note. It falls further behind every day |
| `origin/validation/damage-core` | jll-l · 2026-09-15 | jll-l · 2026-09-15 | 35 | 1 / 65 | no | 1 | `docs/extra/learning_logs/damage_core/VALIDATION_REPORT.md` — docs only | **Merge as a doc, then delete.** No model change; review evidence that only lives on a branch is invisible |
| `origin/review/cell-curation-audit` | jll-l · 2026-08-27 | jll-l · 2026-08-27 | 54 | 1 / 70 | no | 2 | Standard-10 review scorecards and summary (2026-08-27) under `docs/extra/learning_logs/` — docs only | **Merge as docs, then delete.** Same reason |

Tags: none. Pull requests on `origin`: #1 (`codex/publish-v2-5-implementation`, merged 2026-06-25); #2 and #4
merged 2026-10-20 (below); #3 open. Remotes: `origin` only (`aamani-ai/Damage_Modeling`); the personal fork
`Divi-patel/Damage_Modeling` is a dormant mirror at `a71ac72`, not a remote.

### Recently closed

| When | Branch | What happened |
|---|---|---|
| 2026-10-20 | `claude/modest-darwin-9c7792` — **PR #4**, reference evaluators for the two battery cells (G9) | Merged into `main` (merge commit); branch deleted on `origin` in the same action |
| 2026-10-20 | `claude/amazing-elgamal-e5550b` — **PR #2**, notebook coverage re-measured | Merged into `main` (merge commit); branch deleted on `origin` in the same action |
| 2026-10-19 | `codex/deep-damage-admission-v1` (local only, never pushed) | One commit of 2026-08-27 whose content `main` had superseded; deleted |
| 2026-10-19 | `codex/hurricane-solar-v2-1-admission` | Fully merged into `main`; deleted locally and on `origin` |
| 2026-10-19 | remote `divi` | Removed; the fork is dormant and the work account cannot push to it |

## The policy (proposed; the owner confirms)

| Rule | Why |
|---|---|
| **Names say the work.** `cell/<hazard>-<asset>` for cell curation; `review/…` and `validation/…` for review evidence; `claude/…` and `codex/…` for agent worktrees (short-lived); no personal-name branches | A name that says what the branch holds is half the register |
| **A branch lives until its PR merges or it is closed.** Merged branches are deleted within a week by their creator; turn on *Automatically delete head branches* in the GitHub repository settings | Merged branches are the ones that pile up |
| **Stale = not merged and no commit for 60 days.** A stale branch gets a row here with one of three outcomes: merge · archive · delete. The creator decides; after 90 days the owner decides | "Old" needs a number |
| **Archive before deleting anything unmerged:** `git tag archive/<branch>/<yyyy-mm-dd> <sha> && git push origin --tags`, then delete the branch | History stays reachable by tag; the branch list stays short |
| **Docs-only branches are merged as docs,** not kept hanging | A review or a validation report has no reason to wait for a model change |
| **No force-push to shared branches; an agent never deletes another person's branch** | Branches are other people's work |
| **This register changes in the same commit as the branch action** (merge, archive, delete), like the ledgers | A register that is refreshed "later" is a list of guesses |

## How to refresh

```bash
python3 scripts/reference_helpers/branch_register.py --fetch
```

Paste the table it prints over the one above, add the *What it is* and *What to do* columns by hand, and
record any branch action in *Recently closed*.
