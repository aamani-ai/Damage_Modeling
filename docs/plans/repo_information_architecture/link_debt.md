# Repo Information Architecture — Legacy Link Debt

Status: baseline captured before Phase 4 moves.

A full-repo Markdown link check currently fails because deeper relocated docs still contain old relative links
from before the `damage_modeling` spin-out. This is known cleanup, not a regression introduced by the shallow
index work.

## Baseline

Command summary run during IA planning:

```text
total missing local Markdown links: 131
```

Grouped by source area:

| Source area | Missing links | Notes |
|---|---:|---|
| `docs/damage_curves/damage_curve_implementation` | 82 | Mostly copied source-context and old package-relative links. |
| `docs/damage_curves/damage_curve_foundations` | 27 | Mostly links to archived or Hazard_modeling principles/discussion docs. |
| `docs/extra/discussion` | 21 | Mostly archived discussion links inherited from Hazard_modeling. |
| `docs/google_drive_docs/damage_foundation_README.md` | 1 | Local README path mismatch. |

## Rule for Phase 4

Until a dedicated link-normalization pass is executed, Phase 4 should verify:

```text
all new/touched IA docs have resolving local links
canonical JSON artifact hashes are unchanged
no src/ directory exists
full-repo missing-link count does not increase above the captured baseline unless the increase is explicitly explained
```

Do not treat the current 131-link baseline as acceptable forever. It is a tracked cleanup item. It should be
addressed in a separate link-normalization phase after the low-risk information-architecture moves prove out.
