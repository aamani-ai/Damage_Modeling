# Version registry — portable package v2.5 + repository-current contracts

This registry separates **package release labels** from **semantic damage-model versions**.

The latest portable package remains the v2.5 implementation-hardening release. Repository-current runtime
state has advanced to `2026-07-10.wildfire-screening-v1`: bundle schema v2, capability schema v2, normalized
paths, pollable cell pins/changelogs, hail value/KAT publication, and the first canonical wildfire_solar
screening model. Existing four cells' intrinsic damage-ratio functions are unchanged; wildfire_solar changes
from a zero-curve scaffold to model v1.0.

On 2026-07-20, all five cells gained the complete cell-owned basics set. Human documentation advanced to
hail r8, flood r5, wind/tornado r5, strong-wind solar r4, and wildfire r4. No runtime artifact or contract was
published for these docs-only changes; consumers remain pinned to the artifact-index versions below.

> Some source dossiers and workbooks still carry earlier labels (`v1_3`, `v1_0`, or `docs_r1`) for continuity.
> The artifact index is the authoritative repository-current runtime pointer. Package v2.5 remains the portable
> baseline and must not be used by itself as a cell-runtime pin.


---

## Current cells

| Cell folder | Current semantic damage-model version | Human / runtime docs revision | Current status | Repository-current contract note |
|---|---:|---:|---|---|
| `hail_solar` | **model v1.0** | human docs r8; runtime docs r7 | Current; source docs retain `v1_3` labels | Docs r8 adds the three-file basics set. Runtime docs r7 still own the denominator/value profiles, strict logistic payload validation, KATs, and consumer-scoped tail capability. |
| `flood_solar` | **model v1.0** | human docs r5; runtime docs r4 | Current | Docs r5 adds the three-file flood/elevation basics set; runtime docs r4 remain canonical. |
| `wind_tornado_wind` | **model v1.0** | human docs r5; runtime docs r4 | Current | Docs r5 adds the three-file basics set and keeps the noncanonical v2 proposal separate; runtime docs r4 remain canonical. |
| `strong_wind_solar` | **model v1.0** | human docs r4; runtime docs r3 | Current derived cell | Docs r4 adds the three-file basics set and documents validation gaps/proposal boundaries; runtime docs r3 remain canonical. |
| `wildfire_solar` | **model v1.0** | human docs r4; runtime docs r3 | Current screening engineering proxy | Docs r4 adds the three-file basics set; runtime docs r3 retain exact FSim-class tables, value linkage, KATs, and screening flags. |

---

## Active noncanonical proposals

| Cell folder | Proposed semantic model | Proposed documentation | Status | Current-runtime effect |
|---|---:|---:|---|---|
| `wind_tornado_wind` | model v2.0 | docs r1 | Pressure-tested pathway-aware screening proposal; promotion gates remain blocked | None. Model v1.0/docs r4 remains canonical and is still the artifact-index pin. |
| `strong_wind_solar` | model v2.0 | docs r1 | Convective pathway/architecture-aware screening proposal; T4 numerical envelopes and promotion gates remain blocked | None. Model v1.0/docs r3 remains canonical and is still the artifact-index pin. |
| `tropical_cyclone_wind_wind` | model v1.0 | docs r1 | Pressure-tested source-derived screening release candidate; three exact Jaimes archetype curves cover only the quarantined source-native turbine/tower atom; denominator, modern-fleet, remaining-unit, and consumer gates remain blocked | None. No canonical cell, artifact-index entry, `current/` package, package release, or consumer cutover exists. |
| `flood_wind` | model v1.0 | docs r1 | Pressure-tested legacy FEMA whole-substation screening proposal; one source-native assembly curve is conditional, while every component/wind unit, value binding, and promotion gate remains blocked | None. No canonical cell, artifact-index entry, `current/` package, package release, or consumer cutover exists. |
| `tropical_cyclone_wind_solar` | model v1.0 | docs r1 | Pressure-tested, coverage-first screening exception; one Perry source-cohort visible-module-hardware curve is conditional on six exact acknowledgements, while generic fixed tilt, trackers, every other unit, value binding, severe tail, and promotion gates remain blocked | None. The strict evidence gate still retains model v0.1 for execution; no canonical cell, artifact-index entry, `current/` package, package release, or consumer cutover exists. |
| `hail_wind` | model v0.1 | docs r2 | Independently deep-curated, zero-curve research scaffold; seven-source and nine-claim evidence addenda strengthen mechanism, field-observation, inspection, migration, and acquisition controls, but the strict model-v1 gate remains NO-GO | None. The docs-r1 machine-shaped scaffold is unchanged; no canonical cell, artifact-index entry, package release, schema change, or consumer cutover exists. |
| `wildfire_wind` | model v0.1 | docs r1 | Pressure-tested, zero-curve research scaffold; local thermal/firebrand demand, destructive-residue disposition, exogenous attribution, site BOM/value/exposure, and dependency-safe state/cost gates remain blocked | None. No canonical cell, artifact-index entry, package release, schema change, or consumer cutover exists. |

The wind proposal introduces separate `straight_line_convective` and `tornado_direct_hit` pathways, proposed
bundle v3 / emit v2 / capability v3 contracts, an equipment-only ordered-state curve, and explicit withheld
external units. It is not a portable package release, current changelog event, or hurricane curve. See
[`wind_tornado_wind/proposed/README_wind_tornado_wind__model_v2_0__docs_r1.md`](wind_tornado_wind/proposed/README_wind_tornado_wind__model_v2_0__docs_r1.md).

The solar-wind proposal routes one `straight_line_convective` pathway through separate rigid fixed-tilt
pressure and qualified-tracker instability axes; it adds dependency-controlled module/structure records and
explicitly excludes hurricane, tornado and nonconvective wind. See
[`strong_wind_solar/proposed/README_strong_wind_solar__model_v2_0__docs_r1.md`](strong_wind_solar/proposed/README_strong_wind_solar__model_v2_0__docs_r1.md).

The tropical-cyclone wind proposal reuses the wind-asset anatomy while keeping TC wind as a distinct
pathway. Model v1.0 corrects the earlier evidence interpretation and carries three source-derived expected-DR
curves for exact Jaimes turbine archetypes on their native 3-second-gust-at-10-m axis. The curve denominator
is quarantined to `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`; the standard equipment assembly, foundation,
electrical/GSU/control, civil, support, dollar loss, and consumer annual/tail metrics remain withheld. See
[`tropical_cyclone_wind_wind/`](tropical_cyclone_wind_wind/README.md).

The flood-wind proposal keeps the hazard × asset release unit and the non-runtime, asset-neutral flood-
electrical method substrate. Model v1.0 adds the exact legacy FEMA Hazus-MH 2.1 whole-substation response as
one quarantined, mutually exclusive screening atom; component-local disposition/cost remains unsupported,
and current Hazus 7.0 disables electric-power loss results. Site exposure, ownership, value, capability, and
release remain cell responsibilities. See [`flood_wind/`](flood_wind/README.md).

The tropical-cyclone wind × solar proposal reuses solar anatomy/value and TC event/pathway semantics without
reusing neighboring numerical response. Model v1.0 is a deliberate, noncanonical coverage-first exception:
it fits one equal-site-weighted monotone curve to Perry's ground/nontracking visible-module fraction and
quarantines it to `PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT`. Its mixed-scale population,
dataset-native wind field, two Tier-4 economic bridge assumptions, event clustering, endpoint conflict, and
sparse severe tail prevent an evidence-earned or canonical release. Generic fixed tilt, trackers, rack,
foundation, electrical/GSU/control, civil, support, dollar loss, and annual/tail metrics remain withheld. The
independently valid model-v0.1 package remains the strict fail-closed alternative. See
[`tropical_cyclone_wind_solar/`](tropical_cyclone_wind_solar/README.md).

The hail × wind proposal separates observed/radar hail descriptors from the future blade-contact demand
bridge and keeps blades, exposed nacelle subjects, towers, turbine-pad electrical, collection, GSU, controls,
civil subjects, and support at their own physical/spatial grains. Public coupon, simulation, degradation, and
repair-cost evidence does not close an occurrence demand → inspected disposition → same-unit cost chain, so
every candidate remains audit-only. Docs r2 also records the developing ISO test route, FM post-hail
inspection workflow, bounded field non-damage observation, active wrong-asset legacy mappings, and exact
consumer migration guardrails. See [`hail_wind/`](hail_wind/README.md).

The wildfire × wind proposal preserves FSim as regional event context while withholding any direct mapping
to unit heat flux, firebrand dose, or economic loss. It uses a dependency-safe turbine-fire assembly and
separately located BOP/GSU units; public mechanism, guidance, material, internal-fire, and single-event
evidence does not close an exogenous local attack → inspected disposition → same-unit cost chain. See
[`wildfire_wind/`](wildfire_wind/README.md).

---

## Package release history summary

| Package release | Main change | Cell model changes? |
|---|---|---:|
| v1.3 | Hail × solar derivation audit package | Hail model already at v1.0 behavior; docs improved. |
| v1.6 | Flood × solar v1.0 derived cell | Yes: flood_solar model v1.0 introduced. |
| v2.0 | Wind/tornado × wind v1.0 derived cell | Yes: wind_tornado_wind model v1.0 introduced. |
| v2.1 | Evidence-ingestion and versioning governance | No. |
| v2.2 | Legacy evidence co-curation ingestion; validation/caveat/model-change distinction added to standard 16 | No. |
| v2.3 | Hazard-pathway scope splitting standard + strong_wind_solar v0.1 scaffold | New scaffold only; no DR curve parameters. |
| v2.4 | Strong wind × solar model v1.0 derived curve package | Yes: strong_wind_solar model v1.0 introduced. |
| v2.5 | Implementation hardening: JSON runtime artifacts, capability declarations, cap-binding gates, field-name alignment, handoff notes | No semantic DR changes. |

Post-package repository contract history is pollable from each cell's `CHANGELOG.json` and the v2 artifact
index. It is not assigned a new package number until a portable release is deliberately assembled.

---

## Repository-current cells outside portable package v2.5

| Cell folder | Semantic model version | Documentation revision | Lifecycle / promotion / review state | Canonical runtime artifact? |
|---|---:|---:|---|---:|
| `wildfire_solar` | model v1.0 | human docs r4; runtime docs r3 | released repository-current screening proxy; model v0.1 scaffold retained as research/rejection audit | Yes, repository-current |

The portable v2.5 package does not contain `wildfire_solar`. The repository-current artifact index now does.
Model v1.0 is deliberately a Tier 4 absolute engineering proxy constrained by Tier 2/3 evidence; it uses exact
source-native categorical states and does not claim a physical FSim-to-heat-flux converter. A future
site-calibrated model remains dependent on local-attack, inspected-disposition, cost, and coverage evidence.

---

## Practical rule

```text
Package version changed ≠ damage curve changed.
Cell damage-model version changed = damage-code behavior changed.
Documentation revision changed = proof trail / contract / implementation wrapper changed, but same inputs produce the same DRs.
v0.1 scaffold = structure accepted but runtime DR not yet parameterized.
v1.0 = first derived runtime curve package for the cell.
```
