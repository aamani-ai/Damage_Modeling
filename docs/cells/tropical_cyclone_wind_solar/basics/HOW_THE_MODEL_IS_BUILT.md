# Tropical-cyclone wind × solar — how the model is built

## The seven-step path

```text
1 define the asset and pathway
2 decompose physical failure units
3 define the candidate demand and same-unit ordinate
4 split the reference value row by row
5 bind value and exposure to the same subject
6 specify selectors, conditioners, and the TC bridge
7 publish a curve only when the full evidence chain closes
```

Model v0.1 completes the structure and stops at step 7 with an explicit withheld result.

## 1. Keep the pathway narrow

The exact pathway is `tropical_cyclone_wind`. Surge/flood, spawned tornado, debris impact, wind-driven rain,
hail, and lightning route separately but preserve one `event_family_id`. This prevents a hurricane label or
wind speed from silently choosing a curve and lets the consumer control duplicate value charges.

## 2. Reuse anatomy, not numbers

Solar anatomy and the Q1-2025 value ledger are reused from the strong-wind work. TC event identity and source-
wind semantics are reused from the TC wind-farm work. Every numerical vulnerability response is re-earned.

The main candidate units are:

| Architecture | Module unit | Structure unit |
|---|---|---|
| Fixed tilt | `PV_FIXED_TILT_MODULE_FIELD` | `PV_FIXED_TILT_SUPPORT_STRUCTURE` |
| Tracker | `PV_TRACKER_MODULE_FIELD` | `PV_TRACKER_SBOS_ASSEMBLY` |

Foundation, power conversion/collection, GSU/substation, SCADA, and civil remain explicit and withheld. They
are not assigned zero.

## 3. Separate source wind from component demand

NHC maximum sustained wind is one-minute wind at 10 m in unobstructed exposure. A component curve cannot use
that value directly unless a reviewed bridge produces matching local demand.

For fixed tilt, the bridge must reconcile local net pressure with design net-pressure capacity on the same
load-case, geometry, height, terrain, coefficient, and duration basis. For trackers, it must produce tracker-
normal local wind on the exact Ucrit qualification basis and preserve duration/cycling and attained state.

No global gust factor, power-law exponent, pressure coefficient, or generic Ucrit is active.

## 4. Pressure-test the strongest candidate

Ceferino et al. provide a Bayesian lognormal probability of site-level extensive clip/racking failure for 14
large Caribbean ground-mounted sites. The reported ground-mounted posterior summaries are retained in the
audit layer. They are not runtime parameters because the source does not separate fixed tilt from trackers,
does not map to one failure unit, and does not provide same-unit repair cost.

Perry remote sensing and the St Croix case add field prevalence and mechanism constraints. Design and
qualification sources add bridge and selector requirements. None closes the entire demand-to-cost chain.

## 5. Reconcile value without turning it into vulnerability

The 2024-USD/kWdc reference ledger reconciles:

```text
direct hardware       656.9814571503722
physical              877.7957023626668
excluded              242.20429763733296
installed            1120.0
module + mounting     401.2045774673221
```

Value is a denominator after a qualified damage state exists. A value share is not a fragility, severity,
cap, or exposure fraction. Replacement support is allocated once after repair scope is known.

## 6. Fail closed at the consumer seam

The artifact contains `curve_records: []`, its capability declares every numeric metric withheld, and the
known-answer tests require valid inputs to return null with `NO_RUNTIME_CURVE`. They also reject missing or
wrong pathways, category-only inputs, incomplete wind metadata, cross-axis candidate use, missing/unsupported
architecture, favorable tracker defaults, whole-plant exposure for a GSU, and compound-route blending.

## 7. What promotion requires

A model-v1 release needs independently reviewed architecture-specific bridges; exact target-system and
attained-state applicability; all-severity, mutually exclusive failure-unit dispositions; same-unit direct
cost; site BOM/value/exposure; support allocation; uncertainty and validation; artifact/schema/KAT review;
and an explicit Hazard cutover. It is a new model-behavior change, not a documentation edit.

## Binding package

- [Seven-step audit](../proposed/SEVEN_STEP_AUDIT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
- [Site-condition adapter](../proposed/SITE_CONDITION_ADAPTER_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
- [Evidence and numerical audit](../proposed/NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
- [Promotion gates](../proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
- [Exact model reference](MODEL_REFERENCE.md)
