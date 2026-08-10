# How the wildfire × wind model is built

## 1. Fence the peril

The cell models an external wildfire acting on the facility as a receptor. Endogenous turbine/electrical
fire and lightning have different frequency and causation and remain outside this cell.

## 2. Preserve source-native hazard semantics

USFS FSim supplies burn probability and six flame-length probabilities conditional on burning. Frequency
stays downstream in Hazard. No bin midpoint, Byram intensity, or fixed-distance heat conversion is invented
for the damage model.

## 3. Split delivered-load pathways

Thermal attack needs flame contact and radiant/convective flux histories with duration. Firebrand ignition
needs particle flux/count, size/mass, combustion state, deposition, accumulation, ingress, wind, and contact
history. Destructive residue contamination is deferred and requires an attributable physical endpoint.

## 4. Select dependency-safe units

One `WT_TURBINE_FIRE_ASSEMBLY` repeats at turbine points and prevents additive blade/nacelle/tower charges
after dependent ignition. Pad, collection, each GSU apparatus group, controls/met/O&M, foundation, and civil
subjects remain separately located units.

## 5. Bind value at the same grain

The NREL reference ledger reconciles 1,623 USD/kW of physical value and 345 USD/kW of excluded value. It is
not a site SOV. Electrical and civil rows need allocation, and support/logistics are charged once after final
disposition.

## 6. Admit a bounded owner-authorized screening exception

- The old rotor/nacelle/tower logistics use invented transfer and response assumptions and contradict their
  own tables; they are rejected.
- Primary substation and equipment evidence supports nonzero electrical vulnerability and places steel-
  enclosed pad apparatus below polymeric/electronic control packages, but does not calibrate ordinates.
- Under explicit owner authorization, two cell-local Tier-4 categorical profiles are adopted for those exact
  units. Their numerical identity to wildfire-solar profiles is an audit fingerprint, not evidence transfer
  or a shared runtime dependency.
- Internal turbine-fire cases describe dependencies and inspection, not external-wildfire probability.
- Wind-farm fire guidance supplies selectors and controls, not mitigation multipliers.

## 7. Emit partially and fail closed everywhere else

The model-v1 artifact contains two records and fourteen numerical KATs. Exact product, assumption set, class,
pathway, and failure unit are mandatory. Noninteger states, firebrand fallback, unsupported units, implicit
values, and whole-farm aggregation fail closed. Model v0.1 remains the no-curve alternative. Promotion still
requires local delivered-load evidence or explicit continued proxy approval, affected/unaffected
inventories, inspected dispositions, same-unit costs and values, and dependency-safe validation.

See the [current model-v1 dossier](../current/wildfire_wind_curve_derivation_dossier__model_v1_0__docs_r1.md),
[deep-research memo](../proposed/DEEP_RESEARCH_AND_DECISION_MEMO_wildfire_wind__model_v1_0__docs_r1.md), and
[Hazard proposal](../../../contracts/hazard_handoff/wildfire_wind_model_v1_0_partial_screening_proposal.md).
