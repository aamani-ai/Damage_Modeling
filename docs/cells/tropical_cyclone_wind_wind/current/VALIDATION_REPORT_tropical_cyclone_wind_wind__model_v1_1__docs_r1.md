# Validation report — tropical_cyclone_wind_wind model v1.1

**Validation date:** 2026-08-14  
**State:** repository-current release gates pass; durable publication is verified separately by its receipt.

| Check | Result |
|---|---:|
| model-v1.0 exact-record reproduction | 24 / 24 pass |
| canonical 5 MW proxy known answers | 9 / 9 pass |
| negative proxy-contract tests | 4 / 4 pass |
| value-crosswalk/cap arithmetic tests | 2 / 2 pass |
| JSON schemas | bundle v3, capability v3 and emit v2 pass |
| workbook topology | 4 / 4 required sheets pass |
| full Hurricane consumer grid | 13,085 / 13,085 QA pass |

These checks prove the declared contract: old source-native results do not move; the named target route uses
the unchanged 3.3 MW source parameters; no capacity-ratio scaling occurs; the two proxy-only range-completion
branches are explicit; and loss cannot exceed the 0.63 covered-value boundary.

They do not prove the source curve is predictive for a modern 5 MW turbine. That is the owner-approved
screening assumption and the reason the release remains partial and replacement-ready.
