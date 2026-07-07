# Validation report - damage_curve_skill two-mode update

**Date:** 2026-07-07
**Status:** PASS

## Checks

| Check | Result |
|---|---|
| Bundle structure validation | PASS |
| Governance self-tests | PASS |
| OpenAI skill validator | PASS |
| Exactly one `SKILL.md` | PASS |
| `agents/openai.yaml` present | PASS |
| Two-mode `inside_repo` / `outside_package` guidance present | PASS |
| Repo Markdown local links | PASS |
| Repo JSON syntax | PASS |
| Accidental `src/` directory check | PASS |

## Bundle validation output

```json
{
  "status": "PASS",
  "file_count": 93
}
```

## Governance self-test output

```json
{
  "status": "PASS",
  "cases": 5
}
```

## Repo validation output

```text
PASS markdown links checked: 249 files
PASS JSON syntax checked: 16 files
No src/ directory found.
```
