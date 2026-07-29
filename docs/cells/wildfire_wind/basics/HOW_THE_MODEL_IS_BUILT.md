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

## 6. Audit, do not inherit, numerical candidates

- The old rotor/nacelle/tower logistics use invented transfer and response assumptions and contradict their
  own tables; they are rejected.
- Wildfire-solar uses the same FSim source semantics but solar-specific Tier-4 screening ordinates; no
  numerical transfer is permitted.
- Internal turbine-fire cases describe dependencies and inspection, not external-wildfire probability.
- Wind-farm fire guidance supplies selectors and controls, not mitigation multipliers.

## 7. Fail closed and name the data program

The artifact contains zero curve records and the tests require null/withheld outputs. Promotion requires
local delivered-load evidence, affected/unaffected inventories, inspected dispositions, same-unit costs and
values, and dependency-safe assembly validation.

See the [derivation dossier](../proposed/wildfire_wind_curve_derivation_dossier__model_v0_1__docs_r1.md),
[site adapter](../proposed/SITE_CONDITION_ADAPTER_wildfire_wind__model_v0_1__docs_r1.md), and
[Hazard handoff](../../../contracts/hazard_handoff/wildfire_wind_model_v0_1_boundary.md).
