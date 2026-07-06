# Repo Information Architecture — Legacy Link Debt

Status: baseline superseded by the docs information-architecture cleanup.

The previous baseline existed because the old deliverable tree carried stale relative links. The duplicate tree
has now been removed and live docs should pass local Markdown link checks.

## Baseline

Old command summary after the foundations move:

```text
total missing local Markdown links: 104
```

Grouped by source area:

| Source area | Missing links | Notes |
|---|---:|---|
| removed `docs/damage_curves/damage_curve_implementation` | 82 | Deleted during cleanup rather than kept as a live docs tree. |
| `docs/extra/discussion` | 21 | Mostly archived discussion links inherited from Hazard_modeling. |
| `docs/google_drive_docs/damage_foundation_README.md` | 1 | Local README path mismatch. |

## Rule for Phase 4

Current rule:

```text
all new/touched IA docs have resolving local links
canonical JSON artifact hashes are unchanged
no src/ directory exists
full-repo local Markdown link check passes or any residual failure is explicitly documented
```

Do not reintroduce a duplicate extracted docs tree to hide broken links.
