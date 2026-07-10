# Hazard handoff — wildfire × solar research to runtime boundary

> **Superseded for runtime.** Model v1.0 docs r3 is now canonical. Use
> [`wildfire_solar_model_v1_0_hazard_migration.md`](wildfire_solar_model_v1_0_hazard_migration.md). This file
> remains the model v0.1 promotion audit.

Contract date: 2026-07-10
Damage Modeling state: `wildfire_solar` model v0.1, docs r2
Canonical runtime curve: none

## Required downstream disposition

Hazard may use FSim burn probability and conditional flame-length probabilities for regional wildfire
hazard screening and frequency analysis. It must not describe a numerical wildfire × solar physical-loss
result as coming from Damage Modeling until a canonical `wildfire_solar` runtime artifact is released.

Current response from this repository:

```json
{
  "cell_id": "wildfire_solar",
  "semantic_damage_model_version": "model v0.1",
  "documentation_revision": "docs r2",
  "canonical_runtime_artifact": false,
  "status": "WITHHELD",
  "reason": "NO_RUNTIME_CURVE"
}
```

## Audited current consumer seam

The local Hazard implementation was reviewed read-only. Its proxy path currently:

1. assigns representative flame lengths to the six FSim bins, including `15 ft` for the open-ended `12+ ft`
   class;
2. converts those representatives to Byram fireline intensity in `kW/m`;
3. evaluates capex-weighted, anchored subsystem logistic functions that are not calibrated in this repository;
4. leaves approximately 30% of value as implicit zero-damage coverage and caps the blended result near 56%;
5. treats the pre-integrated regional occurrence as `p_hit=1` with no solar-site/local-attack coupling;
6. applies the resulting ratio to TIV and passes it into the frequency/tail engine.

The consumer labels this path legacy/proxy and nonreportable. That label is necessary but not sufficient for
a production seam: the numbers can still be mistaken for a Damage Modeling curve or reused outside the
screening context. The path fails the source-native-axis, site-transfer, failure-unit, coverage and value-basis
gates and must not be canonicalized.

## Two permitted operating modes

| Mode | Required inputs | Damage result | Permitted Hazard outputs |
|---|---|---|---|
| `regional_screening` | FSim BP, conditional FLPs, product vintage/imputation state | None | Hazard ranking, burn frequency/severity descriptors, data-quality flags; no physical loss metric |
| `site_loss` | Qualified local attack by component zone, BOM/protection selectors, released failure-unit models, same-unit exposed values | Sum of qualified unit/zone direct losses | Conditional loss and frequency-driven EAL/tail metrics, subject to cell capability and consumer controls |

Until model v1.0 exists, only `regional_screening` is available from the canonical seam.

## Immediate Hazard actions

1. Keep the current proxy isolated behind an explicit `legacy_proxy_nonreportable` mode or disable it.
2. Prevent proxy wildfire loss, EAL, PML, VaR and TVaR from entering reportable portfolio/benchmark outputs.
3. Do not rename the proxy to `damage_modeling`, `curated`, `v1`, or `canonical`.
4. Preserve the six source-native FLP probabilities and burn probability separately; do not invent FIL6 or
   continuous severity values at the Damage Modeling boundary.
5. For canonical execution, fail closed when `wildfire_solar` is absent from the runtime artifact index.
6. Expose the screening/site-loss mode in output metadata so a hazard-only result cannot be mistaken for loss.
7. Pin future consumption to `cell model version + docs revision + artifact SHA`, not package v2.5 alone.

This handoff documents required consumer behavior; it does not modify the Hazard repository.

## Candidate future site-loss request

A future request should be shaped around component-zone exposure rather than FSim fireline intensity:

```text
cell_id
event_id
zone_id
failure_unit_id
component_quantity_and_value
BOM_and_installation_selectors
direct_flame_contact_state
radiant_heat_flux_kw_m2
convective_heat_flux_kw_m2
exposure_duration_s
ember_attack_state
transfer_model_or_measurement_id
uncertainty_basis
```

FSim identifiers may travel as provenance and upstream event context. They do not replace local attack
fields.

## Value and coverage rules

Hazard must consume the DR against the exact denominator declared by each failure-unit artifact. It must not:

- apply a component DR to full installed TIV;
- set whole-site exposed fraction to one because a 270 m FSim pixel burns;
- use capex weights as both vulnerability and value allocation;
- assign zero damage to uncovered subsystems without an approved coverage role;
- apply support/logistics costs as an independent fragility curve;
- combine physical destruction with outage, BI, smoke/ash derating, PSPS, financial terms or policy limits.

The cell owns conditional physical vulnerability. Hazard owns burn frequency, compound-Poisson aggregation,
financial terms, portfolio accumulation and frequency-driven tails.

## Tail-capability clarification

`NO_RUNTIME_CURVE` withholds every loss metric because no conditional physical-loss input exists. Once a
curve is released, any capability limit on curve-intrinsic spread does not by itself prohibit Hazard from
computing a tail generated by its own frequency/event engine. Hazard must clearly distinguish:

```text
curve-intrinsic uncertainty/tail    owned and declared by Damage Modeling
frequency/event-driven tail         owned and declared by Hazard
```

## Migration acceptance tests

Migration is complete only when:

- the canonical artifact index resolves `wildfire_solar` to a released model v1.0 artifact;
- its SHA, model version and docs revision match the consumer pin;
- payload schema, equation and KATs validate in Hazard;
- site-loss mode supplies every required local attack, selector and value field;
- missing/unknown/out-of-domain inputs fail closed;
- one failure-unit DR is applied only to its declared exposed-value denominator;
- zonal/unit losses and support-cost allocation reconcile without double counting;
- the legacy proxy path is not reachable from canonical/reportable execution;
- Hazard independently verifies known-answer rows and boundary cases.

Until all tests pass, the only canonical response is `WITHHELD: NO_RUNTIME_CURVE`.
