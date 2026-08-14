# Tropical-cyclone wind × onshore Wind Farm basics

**Start here.** Model v1.1 is a canonical, partial screening model for the shared 20×5 MW Wind Farm. It uses
one explicit owner-approved proxy; it is not a target-matched modern-turbine or full-plant damage model.

```yaml
cell_id: tropical_cyclone_wind_wind
cell_model_version: model v1.1
documentation_revision: docs r1
consumer_pin: tropical_cyclone_wind_wind@model_v1_1__docs_r1
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1_1
canonical_runtime_artifact: true
```

## Five ideas to remember

1. **The numerical curve is not invented.** It is the unchanged Jaimes 3.3 MW / 100 m expected-damage
   equation already governed in model v1.0.
2. **The target match is an explicit assumption.** The canonical target is 5 MW / 100 m. It qualifies only
   through the exact proxy, asset-profile and value-basis identities; there is no nearest-neighbor inference.
3. **No capacity scaling occurs.** Rated power identifies the target. The DR is never multiplied by `5/3.3`.
4. **Coverage is visibly partial.** Rotor+nacelle+tower cover 0.63 of project TIV. The other 0.37 is withheld,
   not zero.
5. **Hazard still owns the risk calculation.** Damage returns conditional DR and its limits; Hazard evaluates
   node gusts, event losses, frequency, EAL/PML and caps.

## The supported flow

```text
Hurricane 3-second gust at every turbine node
             │ exact 10 m, km/h axis
             ▼
named 5 MW target → unchanged Jaimes 3.3 MW response
             │ no capacity-ratio adjustment
             ▼
mean node DR × 0.63 of project TIV
             │
             ├── covered loss, capped at 0.63 of TIV
             └── remaining 0.37 withheld and disclosed
```

## Speed behavior

| Gust | Named 5 MW proxy |
|---:|---|
| `0–90 km/h` | source-assumed zero |
| `90–108 km/h` | flagged zero completion rule |
| `108–252 km/h` | unchanged Jaimes equation |
| above `252 km/h` | flagged `max_dr=1` cap |

The three exact source-native selectors from v1.0 remain available and keep their original withheld-range
behavior. A generic 4 MW, 5 MW, 6 MW, different hub-height or different axis request still fails closed.

## What may be reported

Screening-grade conditional DR, event loss, EAL and PML may be reported only for the named canonical profile
and must show both percent of the `$88.2M` covered value and percent of the `$140M` full TIV. It is not a
bankable estimate, field/claims calibration, or statement that the uncovered 37% is immune.

Next: [how the model is built](HOW_THE_MODEL_IS_BUILT.md) · [exact model reference](MODEL_REFERENCE.md) ·
[canonical package](../current/README.md).
