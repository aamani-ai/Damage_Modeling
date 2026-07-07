# Cell lifecycle

A cell is a hazard × asset pair such as `hail_solar`, `flood_solar`, or `strong_wind_solar`.

## States

| State | Meaning | Runtime artifact? | Metrics? |
|---|---|---:|---|
| `idea` | Candidate pair exists as a thought | No | None |
| `scope_accepted` | In/out boundary approved | No | None |
| `scaffold` | Folder, README, metadata skeleton, failure-unit candidates | No canonical runtime curve | Withheld |
| `draft` | Curves proposed but not reviewable | Maybe draft JSON | Withheld or internal only |
| `reviewable` | Dossier, evidence map, JSON artifact, workbook/audit view, capability declaration complete enough for review | Yes, proposed | Scenario-only if allowed |
| `site_adaptable` | Selectors/conditioners/exposures implemented and defaults/flags defined | Yes | Scenario loss with explicit value basis |
| `released_v1_0` | First canonical runtime curve for the cell | Yes canonical | Per capability declaration |
| `calibrated` | Claims/field/calibration evidence supports stronger claims | Yes canonical | Per capability + validation |
| `deprecated` | Retained for traceability, not canonical | Maybe legacy | Not used for new runs |
| `superseded` | Replaced by newer model or split cell | Maybe legacy | Not used for new runs |
| `archived` | Historical package artifact only | Maybe | Not used |

## Promotion gates

### scaffold → draft

```text
[ ] hazard × asset scope accepted;
[ ] failure-unit candidates listed;
[ ] engineering substrate mapping attempted;
[ ] value bucket mapping attempted;
[ ] evidence/source plan drafted;
[ ] withheld capability declaration exists.
```

### draft → reviewable

```text
[ ] curve records proposed;
[ ] hazard axis defined;
[ ] parameter tier table populated;
[ ] derivation rationale written;
[ ] JSON artifact validates structurally;
[ ] open seams/update triggers documented.
```

### reviewable → released_v1_0

```text
[ ] reviewer can answer why this curve and not another;
[ ] runtime artifact is canonical;
[ ] capability declaration is populated;
[ ] known-answer tests pass;
[ ] cap-binding/reportability policy is explicit;
[ ] release notes and registry updated.
```

## New-cell version rule

Do not call a new cell `model v1.0` merely because a folder exists. `model v1.0` means the cell has its first released runtime curve behavior.
