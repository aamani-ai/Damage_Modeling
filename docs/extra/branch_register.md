<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-22
status: active
scope: The branch register — every branch of aamani-ai/Damage_Modeling with who created it, when, when it was last touched, how it stands against main and what should happen to it — plus the branch policy proposed for the owner's confirmation. Refreshed with scripts/reference_helpers/branch_register.py in the same commit as any branch action.
-->

# Branch register

*Divy, 2026-10-20: "we have a lot of branches. Some of them are old and stale, and we need to have some idea
of who created that, when, when it was last edited, and whether it is something needed or it has become stale
and should be deleted." This file is that idea, kept current. The facts come from
[`scripts/reference_helpers/branch_register.py`](../../scripts/reference_helpers/branch_register.py); the
**What to do** column is judgment, and a branch is never deleted without its creator's agreement.*

## The register (2026-10-22, after the dashboard merge)

Every branch an agent session opened this week is merged or gone (below). What remains on `origin` is
`main`, the one `dashboard` branch and Jung A's five branches. The `dashboard` branch was merged as PR #8 and deleted on
2026-10-22; a new `dashboard` started from `main` the same day for the preview link fix (PR #9) (`DCD-D25`); the owner asked on 2026-10-20 that no agent branch stay open once its work
is merged, and that Jung A's branches are hers to decide.

| Branch | Created by · on | Last by · on | Age (days) | Ahead / behind `main` | Merged | Files | What it is | What to do |
|---|---|---|---|---|---|---|---|---|
| `main` = `origin/main` | — | D-ivyy (the PR #8 merge) · 2026-10-22 | 0 | — | — | — | The line of record; pushed directly by the owner | — |
| `origin/dashboard` | Divi-patel (agent session) · 2026-10-22 | Divi-patel · 2026-10-22 | 0 | 1 / 0 | no | 8 | **The one dashboard branch** (`DCD-D25`), new from `main` at `638e88a`: the preview build's source links stay inside the repository. **PR #9** | **Active.** Merge when its CI passes and the owner agrees, then delete; the next iteration starts a new one |
| `origin/cell/real-estate` | jll-l · (fully contained) | jll-l · 2026-10-19 | 3 | 0 / — | **yes** | 0 | Jung A's working branch for the five Real Estate cells; merged into `main` on 2026-10-19 | **Merged — safe to delete whenever Jung A is done pushing to it.** Nothing is lost |
| `origin/cell/flood-real-estate` | jll-l · (fully contained) | jll-l · 2026-10-12 | 10 | 0 / — | **yes** | 0 | The first Real Estate cell, superseded by `cell/real-estate` | **Delete** (merged; with Jung A's OK) |
| `origin/cell/winter-storm-solar-wind` | jll-l · 2026-10-12 | jll-l · 2026-10-15 | 7 | 2 / — | no | 55 | Two proposed cells (`winter_storm_solar` screening proxy, `winter_storm_wind` fail-closed), five notebooks, five scripts | **Decision needed (RO3):** rebase onto `main` and merge as proposals, or close with a note. It falls further behind every day |
| `origin/validation/damage-core` | jll-l · 2026-09-15 | jll-l · 2026-09-15 | 37 | 1 / — | no | 1 | `docs/extra/learning_logs/damage_core/VALIDATION_REPORT.md` — docs only | **Merge as a doc, then delete.** No model change; review evidence that only lives on a branch is invisible |
| `origin/review/cell-curation-audit` | jll-l · 2026-08-27 | jll-l · 2026-08-27 | 56 | 1 / — | no | 2 | Standard-10 review scorecards and summary (2026-08-27) under `docs/extra/learning_logs/` — docs only | **Merge as docs, then delete.** Same reason |

*"Behind" is left blank for Jung A's rows because `main` moved by six merge commits on 2026-10-20; the script
prints the current number.* Tags: none. Pull requests on `origin`: #1 (`codex/publish-v2-5-implementation`,
merged 2026-06-25); #2, #3, #4, #5 and #6 merged 2026-10-20 (below); #7 closed when its branch was renamed to `dashboard`, its commits carried by #8; #8 merged 2026-10-22 (below); #9 open, from the new `dashboard`. Remotes: `origin` only
(`aamani-ai/Damage_Modeling`); the personal fork `Divi-patel/Damage_Modeling` is a dormant mirror at
`a71ac72`, not a remote. No local-only branches or extra worktrees remain (cleaned 2026-10-20 and 2026-10-21).

### Recently closed

| When | Branch | What happened |
|---|---|---|
| 2026-10-22 | `dashboard` — **PR #8**, the damage-curve dashboard's iterations 2 and 3, accepted by the owner on the running app (`DCD-D35`) | Merged into `main` as merge commit `85aedf6`, which keeps every commit the review records name; branch deleted on `origin` and locally under the branch policy; the next dashboard iteration starts a new `dashboard` from `main` (`DCD-D25`) |
| 2026-10-21 | `claude/dashboard-iteration-2-8df11e` | **Renamed to `dashboard`** on GitHub (PR #7 follows it); the old local branch and its session worktree removed |
| 2026-10-21 | `claude/dashboard-iteration-2-da2f33` | A duplicate build of iteration 2 by a second session that had failed to start and was restarted; superseded by PR #7; deleted locally and on `origin`, worktree removed |
| 2026-10-21 | a detached scratch checkout of PR #6 under the V0 session's scratchpad | Worktree removed |
| 2026-10-20 | `claude/dashboard-v1-battery-75e6ea` — **PR #6**, the two battery cells drawn through their evaluators (stacked on PR #5) | Merged into `main` as one merge commit that carried PR #5's commits too; branch deleted on `origin`; the session's worktree and local branch removed |
| 2026-10-20 | `claude/dashboard-v0-5d463c` — **PR #5**, the dashboard's data build and the V0 battery slice (accepted by the owner on the running app, `DCD-D17`) | Merged into `main` through PR #6's branch; branch deleted on `origin`; worktree and local branch removed |
| 2026-10-20 | `claude/keen-sanderson-23b1d5` — **PR #3**, CI: validators, tests and link check | Merged into `main` (merge commit) once its workflow was green; branch deleted on `origin`; worktree and local branch removed |
| 2026-10-20 | `claude/ci-kat-diagnostic` | The CI session's temporary branch for the Ubuntu known-answer diagnostic; deleted by that session once the diagnosis was recorded |
| 2026-10-20 | `claude/modest-darwin-9c7792` — **PR #4**, reference evaluators for the two battery cells (G9) | Merged into `main` (merge commit); branch deleted on `origin`; worktree and local branch removed |
| 2026-10-20 | `claude/amazing-elgamal-e5550b` — **PR #2**, notebook coverage re-measured | Merged into `main` (merge commit); branch deleted on `origin`; worktree and local branch removed |
| 2026-10-20 | `claude/jolly-gauss-75e6ea` (local only) | The evaluator-wiring session's first worktree branch, never pushed and empty; removed with the worktree |
| 2026-10-19 | `codex/deep-damage-admission-v1` (local only, never pushed) | One commit of 2026-08-27 whose content `main` had superseded; deleted |
| 2026-10-19 | `codex/hurricane-solar-v2-1-admission` | Fully merged into `main`; deleted locally and on `origin` |
| 2026-10-19 | remote `divi` | Removed; the fork is dormant and the work account cannot push to it |

## The policy (proposed; the owner confirms)

| Rule | Why |
|---|---|
| **Names say the work.** `cell/<hazard>-<asset>` for cell curation; `review/…` and `validation/…` for review evidence; `claude/…` and `codex/…` for agent worktrees (short-lived); no personal-name branches | A name that says what the branch holds is half the register |
| **A branch lives until its PR merges or it is closed.** Merged branches are deleted within a week by their creator; turn on *Automatically delete head branches* in the GitHub repository settings. **An agent branch is deleted in the same action as its merge** (owner direction, 2026-10-20) | Merged branches are the ones that pile up |
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
