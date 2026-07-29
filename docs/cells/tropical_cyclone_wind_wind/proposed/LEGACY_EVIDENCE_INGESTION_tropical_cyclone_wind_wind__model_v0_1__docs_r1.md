# Legacy evidence ingestion — tropical_cyclone_wind_wind

## Intake record

```yaml
intake_id: TCWW-LEGACY-20260728
cell_id: tropical_cyclone_wind_wind
operating_mode: inside_repo
change_class: NEW_CELL_SCAFFOLD
source_ids:
  - LEG-TCWW-001
  - LEG-TCWW-002
source_repository_or_location:
  - infrasure-damage-curves
  - Hazard_modeling
source_paths:
  - infrasure-damage-curves/research/HURRICANE_x_WIND.md
  - Hazard_modeling/Notebooks/hurricane/wind_farm/m3_damage/01_damage.py
source_pins:
  legacy_repository_commit: 12653b2c3d5a013c9524228243ea666c35bb3814
  legacy_memo_blob: d94162e593acc33dde914d9ebedb6256e4772dae
  hazard_repository_commit: 63a01ca190d14fc87ecf9879abcfb7dad21625be
  hazard_placeholder_blob: 5f673dc941290ca4d1607f59f73a803103855441
reviewed_on: 2026-07-28
runtime_output_change: false
semantic_damage_model_version: model v0.1
lifecycle_state: scaffold
package_release: unreleased
model_version_change: new scaffold identity; no released runtime model
```

## Item-level disposition

| Legacy item | Claimed role | Exact source/locator | Reproduced? | Decision | Reason | Permitted future use |
|---|---|---|---:|---|---|---|
| 1-minute 10 m hurricane axis | universal curve axis | memo lines 28-46 | Partly | demote | valid NHC upstream quantity; not turbine demand | source-field semantics and bridge input |
| `alpha=0.077` height factor | global hub/surface bridge | lines 44-46, 374-376, 792-808 | Yes | reject | fixed water/coastal profile cannot represent all onshore sites/events | comparison fixture only |
| `1.10` duration conversion | global 10-min to 1-min bridge | same | Yes | reject | convention/source chain does not reproduce the memo table and omits uncertainty | comparison fixture only |
| blade logistic | economic DR | lines 231-250, 581 | Yes | reject | event anchors do not provide local demand, failure denominator, or same-unit cost | discovery leads |
| hub logistic | economic DR | lines 253-264, 582 | Yes | reject | proxy-adapted without direct calibration | none numeric |
| pitch logistic | economic DR | lines 266-277, 583 | Yes | reject | explicitly expert judgment; grid loss is not destruction | conditioner inventory |
| rotor aggregate logistic | aggregate DR | lines 279-302, 584 | Yes | reject | does not reproduce its own weighted components/asymptote | regression fixture |
| tower logistic | collapse/DR | lines 363-425, 585 | Yes | reject | transforms Rose axis/form/endpoint and invents weighted yaw median | native Rose source lead only |
| nacelle logistic | economic DR | master table line 586 | Yes | reject | proxy-adapted; no direct source endpoint | mechanism leads |
| foundation logistic | wind DR | lines 507-570, 587 | Yes | reject | mixes wind, surge, rain/soil, scour, and slope pathways | boundary leads |
| legacy category table | known answers | lines 591-602 | Yes | reject | several displayed ordinates disagree with the printed equation | migration comparison only |
| topographic `1.3-1.5x` / x0 shift | site modifier | lines 633-645 | No qualified chain | reject | unsupported generic multiplier | future bridge research question |
| offshore `15-25%` increment | adaptation | lines 647-651 | No | reject | unsupported and out of onshore wind-only scope | none |
| Hazard copied convective curve | current hurricane M3 | `01_damage.py` lines 75-110 | Yes | reject as calibration | wrong pathway equivalence and mixed TIV/exposure | frozen regression fixture |
| Hazard tower/foundation/civil zeros | coverage decision | lines 79-105 | Yes | reject | absent evidence was converted into zero response | migration negative test |
| Hazard `0.65` asset cap | loss cap | lines 84-110, 168-169 | Yes | reject | hardcoded aero share on an ungoverned TIV basis | old-vs-new fixture |

## Reproducible numerical audit

### Legacy ordinary logistic

```text
f(x) = L / (1 + exp[-k(x-x0)])
```

Using the printed parameters:

| Check | Printed table | Recalculated | Difference | Disposition |
|---|---:|---:|---:|---|
| blade at 130 mph (`L=.90,k=.0669,x0=118`) | 0.5690 | 0.6215 | +0.0525 | table not a KAT |
| nacelle at 96 mph (`L=.65,k=.0541,x0=130`) | 0.0690 | 0.0891 | +0.0201 | table not a KAT |
| foundation at 130 mph (`L=.50,k=.0722,x0=155`) | 0.0590 | 0.0706 | +0.0116 | table not a KAT |

For `L<1`, `f(x0)=L/2`, not absolute DR 0.5. Calling every `x0` a “50% damage threshold” changes the
meaning. The appendix's 10%/50%/90% inversion initially assumes `L=1` and later adds a caveat; the master
table mixes fractions of cap with absolute DR.

### Rotor aggregation

The stated component weights are blade 55%, hub 25%, pitch 20%. Their caps imply:

```text
0.55(0.90) + 0.25(0.70) + 0.20(0.75) = 0.82
```

The published aggregate cap is `0.88`. At 130 mph, the weighted component equations produce about `0.5666`,
while the aggregate equation produces about `0.6505`. The aggregate is not a reproducible weighted fit.

### Rose conversion and endpoint

The memo correctly prints Rose's native log-logistic tower-buckling form:

```text
P(u) = (u/alpha)^beta / [1 + (u/alpha)^beta]
u = 10-minute hub-height wind in knots
```

It then replaces that with an ordinary logistic on one-minute 10 m mph. No refit is documented. The table
lists 140 knots as about 133 mph, but the memo's own appendix computes about 147 mph using its `0.83` and
`1.10` factors. The source-specific `1/1.12` averaging convention produces yet another value when the full
direction of conversion is followed. The governed action is to preserve native units, not choose a number
from an inconsistent range.

At 50 m/s hub-height 10-minute wind (`97.19 knots`), the Rose perpendicular non-yaw equation gives roughly
`0.00112` single-turbine buckling probability. A 50-turbine expected count is about `0.056`; under an
independence illustration the probability of one or more is about `5.5%`. These are native-axis audit values,
not a like-for-like test of the memo's Category-3 farm statement, which begins from a different surface-wind
range and height conversion. Storm category, per-turbine structural probability, expected count, and farm
occurrence probability must remain distinct.

### Legacy Hazard implementation

```text
CAPEX = rotor 0.26 + nacelle 0.21 + tower 0.16 + foundation 0.12
      + substation 0.09 + electrical 0.09 + civil 0.07

TC curve evaluated only for rotor/nacelle/substation/electrical
asymptotic whole-TIV reach = 0.65
tower/foundation/civil = 0
```

The implementation applies one turbine/node gust family to mixed turbine, line, point, and civil values and
labels unsupported units zero. It is reproducible software behavior but not a governed vulnerability model.

## Endpoint and transfer audit

| Source observation | Tested population/BOM | Exposure and duration | Measured endpoint | Legacy inference | Transfer decision |
|---|---|---|---|---|---|
| Punta Lima/Maria narrative | one 13-turbine farm, older Vestas type | no turbine-local demand series | farm-level damage narrative and cost estimate | calibrate blade/rotor curve | reject; no matched denominator/units |
| Rose Table 1 | NREL 5-MW reference tower | modeled TC, 10-min hub wind, two yaw states | tower-buckling probability | generic tower economic DR on surface mph | reject; native validation only |
| Usagi field/analysis | 25 older 600-kW coastal turbines | one typhoon and stop states | tower/blade failure counts/mechanisms | generic multi-component curve anchors | retain case severity only |
| Harvey shutdown report | non-coincident/low-exposure facilities | operational curtailment | shutdown/resumption narrative | zero physical-damage anchor | reject absence inference |
| Laura radar-dome damage | radar structure | different asset/BOM | structural damage | nacelle calibration | reject asset analogy |

## Citation identity corrections

| Legacy/current citation/use | Verified identity/locator | Correction | Governed use |
|---|---|---|---|
| `NREL/TP-5000-88195` called Hurricane Resilient Wind Plant Design | `88195` is Assessment of Offshore Wind Energy Opportunities and Challenges in the U.S. Gulf of Mexico | intended report is NREL/TP-5000-66869, Hurricane Resilient Wind Plant Concept Study | adjacent mechanism/boundary only |
| “Xu, Feng, Chen, Zhu (2021)” DTU case | Chen, Li, and Tang (2016), DOI `10.1088/1742-6596/753/4/042003` | correct author/year/title | case/mechanism lead only |
| DOI `10.1002/we.2600` authors misstated | Martin del Campo, Pozos-Estrada, Pozos-Estrada (2021) | correct citation | modeled tower/TMD validation only |
| Rose original only | PNAS correction DOI `10.1073/pnas.1211974109` | add correction; it affects risk Eqs. 6 and 8, not tower Eq. 5/Table 1 | citation completeness |

## Impact assessment

```yaml
same_inputs_same_outputs: no runtime evaluator exists before or after
curve_records_before: 0
curve_records_after: 0
withheld_metrics:
  - failure-unit DR
  - scenario loss
  - scalar EAL
  - PML
  - VaR
  - TVaR
cell_model_version: model v0.1
lifecycle_state: scaffold
documentation_revision: docs r1
schema_version: unchanged
package_release: unreleased
```

## Promotion evidence still required

- qualified onshore TC event-to-turbine demand bridge;
- representative archetype/state routing;
- all-severity damage-state and repair/disposition evidence;
- same-unit costs or an explicitly approved structured elicitation;
- foundation/electrical/civil coverage decisions;
- support allocation;
- consumer event/exposure/value migration and pinned artifacts.
