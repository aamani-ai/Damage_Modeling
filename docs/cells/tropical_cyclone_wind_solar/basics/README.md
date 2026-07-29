# Tropical-cyclone wind × solar — the physical idea

## The lead research result

Proposed model v1.0/docs r1 is the lead documentation state. It provides one conditional number for one
source-specific atom:

```text
Perry manual hurricane CSV
  + ground mounting
  + tracking=False
  + exact dataset-reported event maximum gust
  -> monotone visible/missing module fraction
  + uniform module-hardware value assumption
  + full replacement of visibly affected module area assumption
  -> source-specific module-material replacement proxy DR
```

The supported atom is
`PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT`. It is not a generic fixed-tilt module curve,
utility-scale curve, rack curve, whole-array curve, or observed repair-cost curve.

## Why the strict answer is still “no curve”

The evidence-earned gate remains **NO-GO**. The source cohort is mixed scale, its wind-product semantics are
incomplete, two Tier-4 assumptions create the economic meaning, the sample is clustered by hurricane, the
severe tail is sparse, Perry and Ceferino give materially different correlated endpoint views, and no
independent validation or curve-intrinsic spread is available.

The model-v1 curve therefore exists only as a deliberate coverage-first, noncanonical screening exception.
The preserved [model-v0.1 alternative](../proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
continues to return `NO_RUNTIME_CURVE` and no numeric DR or loss.

## What one supported atom does not cover

Every standard solar unit remains withheld rather than zero:

- generic fixed-tilt modules and support structure;
- tracker modules and tracker SBOS;
- foundations;
- power conversion and collection;
- GSU/substation;
- SCADA/communications;
- civil infrastructure; and
- removal, reinstall, fieldwork, freight, and other replacement support.

Scenario dollars, full-array and full-plant loss, EAL, PML, VaR, TVaR, and portfolio loss are also withheld.
No tracker, neighboring-hazard, or out-of-range fallback exists.

## Why the source axis is deliberately narrow

The input is the exact Perry dataset-reported event maximum-gust field in m/s, and evaluation is limited to
17.4–39.1 m/s. NHC sustained wind, ASCE gust, Saffir-Simpson category, array-height wind, and other products
are not aliases. The proposal withholds outside the range and does not use the isolated 48.2 m/s severe
observation as a runtime knot.

The response already contains the observed source-site module-field fraction. Applying another array
exposure fraction would double-discount it.

## Where the GSU/substation belongs

`PV_GSU_SUBSTATION` remains a separate facility-level point/yard subasset with its own exposure, value, and
hazard-response evidence needs. Asset-neutral GSU anatomy can be shared across solar and wind facilities, but
no flood, wind-farm, or module-proxy numerical response is inherited.

## Runtime and release status

```yaml
lead_research_model: model v1.0 / docs r1
strict_alternative: model v0.1 / docs r1 / NO_RUNTIME_CURVE
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_exception: deliberate_noncanonical_screening_proposal
canonical_runtime_artifact: false
package_inclusion_status: not_included
Hazard_consumer_cutover: none
scenario_and_annual_tail_outputs: withheld
```

Internal proposal validation proves reproducibility and fail-closed behavior. It does not authorize runtime
use or promotion.

## Read next

- [How the model is built](HOW_THE_MODEL_IS_BUILT.md)
- [Exact model reference](MODEL_REFERENCE.md)
- [Cell package](../README.md)
- [Model-v1 proposal overview](../proposed/README_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)
- [Model-v1 derivation dossier](../proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Strict model-v0.1 fail-closed alternative](../proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
