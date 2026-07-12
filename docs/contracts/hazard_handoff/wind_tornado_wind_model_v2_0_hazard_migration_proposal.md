# wind_tornado_wind proposed model v2.0 — Hazard migration proposal

> **Do not cut over yet.** `wind_tornado_wind@model_v1_0__docs_r4` remains the canonical Damage Modeling pin.
> Model v2.0/docs r1 is a noncanonical, pathway-aware screening proposal and is intentionally absent from the
> artifact index.

## Outcome of the redesign

The consumer seam changes from one normalized curve family plus a tornado shift—or separate hardcoded
whole-TIV curves—to one pinned cell with two required first-class pathways:

```text
straight_line_convective
tornado_direct_hit
```

Each pathway has its own axis, bridge, evidence, capability, bounds, and rejection rules. Both return
conditional severity for one turbine-equipment assembly only. Foundation, collection/substation, civil, and
support costs are not silently inherited.

Hurricane/tropical-cyclone wind is not delivered by this model. The existing consumer convenience route that
reuses a generic strong-wind curve for TC events must be retired only when a separately governed TC workstream
exists; it must not be redirected into either v2 pathway.

## Contract versions proposed for migration

```yaml
cell_id: wind_tornado_wind
damage_code_id: WIND_TORNADO_WIND_PATHWAY_V2_PROPOSED
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
artifact_schema: damage_curve_record_bundle.v3
emit_schema: damage_emit.v2
capability_schema: capability_declaration.v3
canonical_runtime_artifact: false
current_runtime_pin: wind_tornado_wind@model_v1_0__docs_r4
future_required_pin: model + docs + schema + immutable artifact sha256
```

The immutable SHA must be computed only after the proposal is frozen and promoted. Do not pin a working-tree
hash or infer a pin from the portable package label.

## Required M2 → M3 request contract

### Common fields

```yaml
pathway_id: straight_line_convective | tornado_direct_hit
turbine_archetype: generic_modern_onshore_tubular_multi_mw_screening_v1
event_id: required for loss
operational_state: explicit value preferred; missing materializes as flagged unknown
pitch_availability: explicit value preferred; missing materializes as flagged unknown
yaw_availability: explicit value preferred; missing materializes as flagged unknown
```

### Straight-line convective

```yaml
pathway_id: straight_line_convective
rotor_effective_3s_gust_mps: preferred
# OR
hub_height_3s_gust_mps: permitted flagged proxy
iec_ve50_mps: required positive explicit value
ten_meter_3s_gust_mps: optional source lineage only; never the evaluated axis
convective_profile_bridge_id: required if the 10 m source is carried
parent_convective_event_id: required where outflows are nested under one storm system
exposed_turbine_count_or_fraction: required for loss
turbine_equipment_value_per_unit: required for loss
```

A 10 m gust must be converted upstream through a named convective-profile bridge into the separately delivered
rotor/hub field. The source 10 m value and bridge ID may then travel with the request for provenance; the
evaluator never performs or infers the conversion. Do not preserve the old fallback that treats 10 m and hub
wind as equal. Flag inputs below 28 m/s or above 55 m/s; reject above 70 m/s.

### Tornado direct hit

```yaml
pathway_id: tornado_direct_hit
tornado_rotor_effective_peak_horizontal_speed_mps: preferred
# OR
tornado_hub_height_peak_3s_gust_mps: permitted qualified proxy
tornado_input_basis: rotor_resolved_wind_field | qualified_hub_height_proxy | radar_profile_bridge
tornado_profile_bridge_id: required
ef_class: optional context only; never a numeric wind substitute
event_family_id: required for compound/TC context
tornado_track_id: required for loss
turbine_id: required for unit loss
turbine_intersection_or_exposed_count: required for loss
turbine_equipment_value_per_unit: required for loss
debris_environment: explicit value or unknown
```

An EF rating is context, not a wind measurement. EF-only input must fail closed. Farm-lease overlap must not be
treated as a turbine hit.

## Required emit handling

The v2 emit carries `pathway_id` at the emit and every failure-unit-result level. The consumer must preserve:

- `scalar_central_dr`;
- named `scenario_drs` for lower/central/upper resistance;
- state ensemble/probabilities when requested;
- every limitation, proxy, extrapolation, and withheld reason code;
- exact model/docs/schema/SHA provenance;
- the turbine-equipment denominator and site value identity.

Resistance scenarios are nonprobabilistic and unweighted. Do not average them into one vulnerability
distribution. Frequency-driven annual tails remain the consumer's responsibility, but they are not authorized
from this noncanonical proposal.

## Step-by-step migration

### Step 0 — freeze and characterize the legacy paths

Record fixed-fixture outputs from:

1. canonical Damage model v1.0;
2. the hardcoded Hazard M3 curve dictionaries;
3. the reconstructed M4 curve dictionaries.

Verify that M3 and M4 legacy copies agree before removal. Preserve results only as audit fixtures; do not use
them as v2 calibration targets.

### Step 1 — add a shadow bundle-v3 loader

Implement schema-version dispatch that can read proposed bundle v3 in a nonreportable shadow path. The loader
must:

- verify exact cell/model/docs/schema/SHA;
- require unique pathway IDs;
- select one record only after exact pathway routing;
- reject missing/unknown pathways and unsupported failure units;
- compare the embedded and standalone capability objects;
- surface limitation/reason codes without coercion.

Bundle v2 remains the production route during this step.

### Step 2 — repair event identity before curve routing

Create explicit, disjoint occurrence identities:

```text
parent convective event -> local straight-line outflow demands
tornado event/track -> struck turbine demands
tropical cyclone event -> separate future route
TC-spawned tornado -> separately identified child with one parent-event partition
```

Do not infer pathway from speed, EF category, folder name, or an old Boolean.

### Step 3 — repair the wind-height/profile seam

For straight-line convective events, prefer rotor-effective wind; otherwise deliver a documented hub proxy.
Do not apply an ordinary boundary-layer power law to downburst/tornado fields by default.

For tornadoes, carry the wind reference height, basis, and profile bridge ID. EF classes cannot be sampled as
if they were direct turbine-local measurements without an independently qualified wind-field bridge.

### Step 4 — repair exposure grain

M2 must produce turbine IDs/counts or fractions, not one whole-site exposure scalar. Maintain separate future
exposure objects for:

- turbine points;
- foundations;
- collection lines;
- substation points;
- civil/access networks or polygons.

For tornadoes, a track intersecting a lease is not sufficient; resolve turbine intersection/exposed count. Do
not multiply a struck-turbine DR by a swept fraction of full TIV.

### Step 5 — repair value and support assembly

Apply equipment DR only to explicit turbine-equipment value:

```text
direct equipment loss
  = sum_exposed_turbines(DR_equipment * turbine_equipment_value_per_unit)
```

Do not apply it to foundation, external electrical, civil, `1,623 USD/kW` physical reference value, or installed
TIV. Treat those units as withheld until separate qualified curves/exposures exist. Allocate fieldwork/logistics
once after repair scope is known; no default proportional coefficient is authorized.

### Step 6 — remove downstream curve duplication

M3 must evaluate the one pinned Damage artifact. M4 must consume M3 emits; it must not reconstruct fragility
dictionaries. Remove or make unreachable:

- hardcoded subsystem CAPEX weights used as a vulnerability denominator;
- strong-wind/tornado logistic dictionaries in M3;
- duplicated dictionaries in M4;
- the rule that tornado DR must exceed straight DR at every equal numeric gust;
- the legacy full-TIV cap interpretation.

### Step 7 — correct the frequency and annual-loss seam

Before reportable annual metrics:

- verify regional-to-site thinning and Fano/negative-binomial parameterization at the correct grain;
- distinguish event rate from annual-maximum severity distributions;
- preserve sampled GPD/tail behavior when the occurrence model declares it;
- apply occurrence and annual caps inside the simulation at the correct failure-unit/site basis;
- co-sample disjoint event families without TC/tornado/straight overlap;
- retain the screening vulnerability and nonprobabilistic-scenario limitations in every result.

Damage Modeling does not own or validate the final frequency model merely by publishing a curve.

### Step 8 — dual-read and explain differences

Run a fixed fixture grid through v1, both legacy Hazard copies, and proposed v2. Carry at least:

- pathway and exact delivered wind basis;
- explicit IEC `Ve50` for straight wind;
- central and both resistance scenarios;
- equipment, physical-reference-equivalent, and installed-reference-equivalent labels;
- exposed turbine count and equipment value;
- every rejection and limitation flag.

Differences are expected. They must be explained by pathway physics, curve form, axis, denominator, exposure,
or withheld coverage—not tuned back to old EAL/PML headlines.

### Step 9 — promotion rehearsal and cutover

Only after all Damage and Hazard gates pass:

1. freeze the exact artifact and compute SHA-256;
2. test the final model/docs/schema/SHA pin in a clean consumer environment;
3. rehearse rollback to the recorded canonical v1 artifact pin;
4. update Damage registry/index/changelog/release note atomically;
5. switch the Hazard canonical route to v2;
6. prove v1 and hardcoded curve paths are unreachable from canonical execution;
7. rerun end-to-end M2→M3→M4 fixtures and annual-metric convergence checks.

## Minimum migration tests

| Test | Required result |
|---|---|
| Missing `pathway_id` | Reject, no default |
| Same numeric speed sent to both pathways | Route to distinct records/axes; never treat as equivalence proof |
| Straight input above 70 m/s | Withhold, no clamp |
| Straight 10 m gust without named bridge | Reject |
| Tornado EF rating without qualified speed | Reject |
| Tornado missing profile bridge ID | Reject |
| Tropical-cyclone event | Reject from this model |
| Unsupported turbine archetype | Reject |
| Foundation/external/civil request | Null numeric result with reason code |
| Full-TIV value passed as equipment value | Reject denominator mismatch |
| Missing turbine count/value for loss | Return DR only or withhold loss |
| Scenario averaging without weights | Reject/prohibit |
| M4 attempts to reconstruct curve | Test failure |
| Artifact SHA mismatch | Fail closed |
| TC-spawned tornado appears in both catalogs | Test failure |

## Rollback

Before cutover, v1 remains untouched. After cutover, rollback must select the recorded v1 artifact pin through the
same governed loader. Do not restore hardcoded curves, silently remap v2 pathway inputs to v1, rewrite emitted
provenance, or force-push history.

## Current decision

This handoff is an implementation proposal, not a release notice. Hazard should use it to build a shadow
adapter and repair the load-bearing seams, then return the exact validation evidence to Damage Modeling. No
reportable result may claim model v2.0 until the promotion matrix is closed and the canonical artifact index
contains the immutable v2 pin.
