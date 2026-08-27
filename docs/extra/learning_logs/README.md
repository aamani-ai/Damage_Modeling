---
author: owner-directed (Divy) · agent-drafted
created: 2026-08-27
updated: 2026-08-27
status: active
scope: charter and index for team-shared Damage Modeling learning logs and project learning packages
---

# Damage Modeling learning logs

This folder preserves understanding gained while building and consuming Damage artifacts. It helps a teammate or future agent re-enter the work without replaying chats or reverse-engineering every repository boundary.

Material here is team-shared but non-canonical. Executable code, immutable artifacts, approved cell packages, contracts, standards, decisions, and current manifests remain authoritative.

## Two supported shapes

| Shape | Use it when | Form |
|---|---|---|
| Atomic learning | One build moment produced a short lesson worth carrying to another cell | One dated or sequential Markdown file |
| Project learning package | A sustained topic needs newcomer onboarding and repeated re-entry | Subject-named folder with linked `README.md`, `what.md`, `why.md`, and `how.md` |

The atomic log is an intake/history surface. A project package is the current synthesized mental model. Do not keep two competing current explanations for the same topic.

## How this differs from nearby folders

| Folder | Question it answers |
|---|---|
| [`discussion/`](../discussion/README.md) | What bounded question are we reasoning through before or during a decision? |
| [`plans/`](../../plans/README.md) | What work will be executed, in what order, with what done-when conditions? |
| [`tasks_history/`](../tasks_history/README.md) | What happened in a particular work session, and how can it be resumed? |
| **`learning_logs/`** | What connected understanding or transferable lesson should the next reader inherit? |
| [`method/`](../../method/README.md) and [`contracts/`](../../contracts/README.md) | What method or interface is approved and authoritative? |

Tracking a package here is a sharing promotion, not a model or method promotion. Moving approved content into a standard, contract, guide, cell package, or production implementation requires its own owner-directed workflow.

## Project learning package index

| # | Date | Created by | Related to | Doc | What it is |
|---|---|---|---|---|---|
| — | 2026-08-27 | owner-directed (Divy) · agent-drafted | Damage Core ↔ Hazard Deep | [Damage Core: evidence to Hazard-ready artifact](damage_core/README.md) | Team-shareable, non-canonical guide to the 12-step cell-definition → evidence → response/value → approval → publication → registration → Hazard-consumption lifecycle, with mirrored What/Why/How views, operating run cards, current distribution gaps, and a Wildfire × Solar worked example. |

## Atomic learning index

No Damage-local atomic entries have been added yet. Add a dated ledger row here in the same commit as the first entry.

## Package rules

Every complete package must:

1. carry the repository metadata stamp on all four managed files;
2. identify itself as team-shared and non-canonical;
3. use one stable concept sequence in What, Why, and How;
4. link each concept across all three views and route the README to them;
5. distinguish implemented, approved, published, registered, and consumed states;
6. link to authoritative evidence rather than copying it as new truth;
7. include a freshness date and refresh triggers;
8. pass the project-learning-package validator before commit.

Small discoveries should be reconciled into an existing package when they improve its current explanation. Preserve a separate atomic entry only when the build moment itself is a transferable lesson or useful historical intake.

## Adding or updating a package

```text
new chat / experiment / code finding
              │
              v
compare with the current package
              │
     ┌────────┼─────────┐
     v        v         v
   new     improve   stale/conflict
     └────────┼─────────┘
              v
update the connected README + What + Why + How views
              │
              v
verify evidence and run normal + strict validation
              │
              v
update this package ledger in the same commit
```

If authoritative documentation later becomes the complete current explanation, reduce the learning package to a re-entry/navigation layer or mark it superseded. Do not maintain silent duplicate authorities.
