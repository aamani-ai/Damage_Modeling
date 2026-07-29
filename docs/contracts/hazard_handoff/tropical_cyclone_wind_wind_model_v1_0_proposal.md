# Tropical-cyclone wind × wind model v1.0 Hazard handoff proposal

> **Shadow/research contract only.** This model-v1.0/docs-r1 package is a noncanonical release candidate.
> It is absent from the artifact index, has no `current/` folder, and does not authorize a Hazard cutover.

## What the proposal adds

The proposal replaces the model-v0.1 zero-curve conclusion with a narrower, evidence-correct result: Jaimes
et al. publish a fitted expected repair/replacement damage-ratio family for three exact generic turbine
archetypes. The package exposes those equations only for the quarantined source-native atom
`WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`.

```text
DR(V) = 0                                                   when V <= 90 km/h
DR(V) = 1 - exp[-ln(2) * ((V - 90) / delta_V50)^rho]       when V > 90 km/h
```

| Exact selector | Curve | `delta_V50` | `rho` | Absolute wind at DR=0.5 |
|---|---|---:|---:|---:|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | `TCWW_JAIMES_1MW_44M_SCREENING` | 106.77 km/h | 8.94 | 196.77 km/h |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | `TCWW_JAIMES_2P5MW_80M_SCREENING` | 82.52 km/h | 4.54 | 172.52 km/h |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | `TCWW_JAIMES_3P3MW_100M_SCREENING` | 73.30 km/h | 4.99 | 163.30 km/h |

These are source-derived screening equations, not claims-calibrated modern-fleet curves.

## Exact runtime input boundary

If this package is later promoted, Hazard must supply all of the following without defaulting:

```yaml
pathway_id: tropical_cyclone_wind
failure_unit_id: WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
tc_peak_gust_3s_10m_kmh: <finite numeric>
turbine_archetype_id: <one exact Jaimes selector above>
source_model_assumption_set_id: JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED
actual_operating_control_state: known_consistent_with_source_assumption | known_inconsistent_with_source_assumption | unknown
event_id: <occurrence identifier>
event_family_id: <compound-event parent identifier>
```

The pinned artifact/adapter must separately verify
`hazard_axis.id=TC_PEAK_GUST_3S_10M_KMH_JAIMES`. That ID is contract identity, not a substitute for the
required numeric request field.

Range handling is contractual:

| Input | Consumer/evaluator result |
|---|---|
| `V < 0` | reject |
| `V <= 90 km/h` | DR 0 with `SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL` flag |
| `90 < V < 108 km/h` | null/withheld |
| `108 <= V <= 252 km/h` | conditionally supported scalar screening DR |
| `V > 252 km/h` | null/withheld |

NHC one-minute sustained wind, Saffir–Simpson category, hub-height wind, and any other height/averaging basis
are not accepted proxies. Hazard needs a separately reviewed, named bridge before using any of them.

## Selector and state behavior

- Select only an exact source archetype. Do not interpolate, route to the nearest rating/height, or transfer to
  a contemporary larger turbine.
- Preserve the 1 MW source discrepancy: the body/table use 44 m hub height while figure captions use 40 m.
  The package selects 44 m and emits a limitation flag.
- A known operating/control state inconsistent with the source assumption withholds the result. Unknown state
  may retain a flagged screening response but receives no protection credit.
- Do not convert the fitted Eq. 1 curve into a logistic, DS3 probability, or Eq. 12 state-mixture surrogate.

## Failure-unit, value, and exposure boundary

The curve ordinate is a conditional expected direct repair-or-replacement ratio for one source-defined
Jaimes turbine/tower exposure record relative to the paper's ambiguous `Ct(h)` replacement-cost proxy. It is
not a tower-only CWER ratio, the standard turbine-equipment assembly ratio, BOS ratio, plant physical ratio,
installed-CAPEX ratio, or TIV ratio.

Consequently:

- Hazard may not multiply the scalar by a site/OEM/CWER value until an independent valuation review approves
  an exact denominator crosswalk.
- `WT_TURBINE_EQUIPMENT_ASSEMBLY`, foundation, pad electrical, collection, GSU/substation, control/SCADA,
  civil, fieldwork, and transport all remain null/withheld—not zero.
- A qualifying turbine record is evaluated once at its turbine point. Whole-farm exposure is prohibited.
- `WT_GSU_SUBSTATION` is one facility-level exposure and must never be repeated by turbine count.
- Asset identity may be shared across solar and wind, but flood-GSU or solar-GSU response is not a TC-wind
  curve. Hazard-pathway evidence remains separate.
- Fieldwork, crane scope, and transport are allocated once after a governed damage disposition; they do not
  receive independent wind fragilities.

## Compound-event boundary

Keep one `event_family_id` while routing direct TC wind, TC-spawned tornado, debris, wind-driven rain, surge,
pluvial flood, scour/saturated-soil failure, lightning/fire, and interruption as separate causal pathways.
No pathway may charge the same failure-unit value twice.

## Pre-promotion shadow tests

1. Reproduce all 24 formula KATs and all 23 selector/range/value/withholding contract KATs.
2. Verify exact model/docs/schema/SHA pins for bundle v3, capability v3, and damage emit v2.
3. Prove one-minute/category/hub/other-axis inputs fail closed without a named bridge.
4. Prove nearest/interpolated/modern-fleet selectors fail closed.
5. Prove every uncovered failure unit emits explicit null/withheld status and cannot enter whole-plant loss.
6. Prove turbine-point exposure and facility-level GSU exposure are not multiplied at the wrong grain.
7. Complete independent equation reproduction, valuation/denominator review, and engineering applicability
   review.
8. Shadow the new proposal without changing the existing Hurricane notebook or any current artifact pin.
9. Verify rollback and removal of any future hardcoded copy before an explicit promotion decision.

Until those gates pass, scenario loss, EAL, PML, VaR, TVaR, and portfolio metrics remain withheld. The
model-v0.1 handoff remains the execution rule; model v1.0 is reviewable evidence and implementation work only.
