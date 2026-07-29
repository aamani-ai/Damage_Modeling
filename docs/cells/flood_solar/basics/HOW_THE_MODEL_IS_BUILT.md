# Flood × Solar -- How the Model Is Built

**Use this page to understand the reasoning chain from curated evidence to the runtime damage-code package.**
For measurement basics and an intuitive example, start with the [basics README](README.md). For exact fields,
ordinates, versions, and sources, use the [model reference](MODEL_REFERENCE.md).

```yaml
cell_id: flood_solar
cell_model_version: model v1.0
human_documentation_revision: docs r5
canonical_runtime_pin: flood_solar@model_v1_0__docs_r4
canonical_artifact_sha256: a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

## Source hierarchy

```text
canonical runtime behavior
    ../current/flood_solar__model_v1_0__docs_r4__curve_artifact.json

governed rationale and interface
    ../current/flood_solar_curve_derivation_dossier_v1_0.md
    ../current/flood_solar_damage_code_metadata_spec_v1_0.md

governed supporting evidence and value basis
    ../../../evidence/ingestion/flood_solar_evidence_update_memo__model_v1_0__docs_r2.md
    ../../../method/value_basis/solar_wind_value_breakdown.xlsx
    ../../../source_drops/context/v2_5/substrate_decomposition.md

reader-friendly synthesis
    basics/README.md
    basics/HOW_THE_MODEL_IS_BUILT.md
    basics/MODEL_REFERENCE.md
```

If this explanation conflicts with the canonical artifact, stop and reconcile the documentation. Do not
silently change runtime behavior to make the prose look consistent.

---

## The complete build path

```text
STAGE 0  QUESTION     What physical loss are we modeling?
STAGE 1  EVIDENCE     What may each source support?
STAGE 2  GRAIN        What actually fails, at what unit?
STAGE 3  AXIS         What event intensity indexes each curve?
STAGE 4  FORM         What mathematical representation fits the mechanism?
STAGE 5  ADJUSTMENTS  What selects, conditions, or exposes the curve/value?
STAGE 6  EMIT         What may the damage cell honestly return?
STAGE 7  SHIP         What exact package does the consumer pin?
```

---

## Stage 0 -- The modeling question

### Decisive question

> What are we building a curve for, and why cannot flood be represented by one plant-level number?

The current cell models **direct physical destruction** to failure-unit value buckets for a specified flood
event. Floodwater interacts with equipment elevation, openings, terminals, conduit paths, drainage, and flow.
Two components at the same site can therefore have different local intensity and replacement consequences.

```text
NOT: site flood depth -> whole-plant solar DR

YES: event state + component geometry
       -> failure-unit local intensity
       -> failure-unit DR
       -> explicit value/exposure assembly
```

### Boundary

| Included | Downstream or excluded |
|---|---|
| Direct physical repair/replacement DR | Hazard frequency and event catalogs |
| Failure-unit scenario loss with explicit value/exposure | EAL/PML/VaR/TVaR computation |
| Electrical inundation and conditional module/cable/foundation records | Business interruption and downtime |
| Runtime flags and capability limits | Insurance terms and portfolio accumulation |

The foundation/scour record exists as a **conditional T4 screening proxy**. It does not turn the cell into a
site hydraulic or geotechnical model.

---

## Stage 1 -- Evidence

### Decisive question

> What does each source authorize, and what does it explicitly not authorize?

The cell uses **curation**, not a regression over one homogeneous claims dataset. Each source is assigned a
specific role.

| Evidence ID | Source role | Supports | Does not support |
|---|---|---|---|
| `DOE_FEMP_PV_FLOOD` | Solar flood mechanisms | Submersion, raising equipment, conduit paths, drainage/scour mitigation | Final numerical DR ordinates for each PV component |
| `NEMA_GD1_2019` | Wet electrical-equipment disposition | Replacement/evaluation/reconditioning framing | Continuous solar-specific depth curves |
| `NEMA_GD1_2016_PDF` | Equipment category detail | Switchgear, breakers, electronics, transformers, cable categories | Universal current OEM disposition or solar-specific severity |
| `NEMA_ENCLOSURE_TYPES` | Selector context | Rain/hosedown versus Type 6/6P submersion protection | Replacement cost or a universal DR modifier |
| `FEMA_P348` | Elevation/protection framing | Raising utility systems and using freeboard/critical elevation | Bespoke PV-component ordinates |
| `USACE_HEC_FIA` | Curve-form precedent | Tabular depth-percent relationships and interpolation | Solar-specific numbers |
| `ANZGEO_2023_SCOUR_CONTEXT` | Mechanism context | Scour depends on moving water/site conditions | A transferable site-independent foundation curve |

### Evidence-to-parameter conclusion

```text
local-depth bridge                         -> T2 source/physics anchored
electrical depth-damage ordinates          -> T3 engineering parameterization
enclosure/conduit adjustment fields        -> T3 mechanism anchored; numeric form deferred
foundation velocity/scour ordinates        -> T4 conditional placeholder
```

This distinction is fundamental: a source may support the **mechanism** or **curve form** without supporting
the exact percentages. Standards anchor the reasoning; they are not secretly treated as claims curves.

See the complete [parameter tier table](MODEL_REFERENCE.md#7-parameter-tier-and-update-trigger-register).

---

## Stage 2 -- Grain and coverage

### Decisive question

> Which physical subjects need their own curve records because failure, exposure, value, or evidence differs?

```text
solar generation asset
|
+-- INVERTER_SYSTEM
|   +-- FS_INV   inverter power electronics
|   `-- FS_COMB  combiner box + DC protection
|
+-- SUBSTATION
|   +-- FS_SWG   switchgear
|   `-- FS_XFMR  transformer/control area
|
+-- SCADA
|   `-- FS_SCADA monitoring/control electronics
|
+-- ELECTRICAL_COLLECTION
|   `-- FS_CABLE cable/conduit/termination pathway
|
+-- PV_ARRAY
|   `-- FS_PVMOD module direct-submersion pathway
|
`-- FOUNDATION
    `-- FS_FOUND foundation/scour screening pathway
```

Technology and configuration remain attributes. For example, `liquid_filled` is a transformer type, not a
new physical hierarchy level.

### Repository-current runtime coverage

| ID | Physical subject | Canonical treatment | Why separate? |
|---|---|---|---|
| `FS_INV` | Inverter | `primary_nonzero` | Power electronics can become high-loss after ingress. |
| `FS_SWG` | Switchgear | `primary_nonzero` | Steep replacement/evaluation consequences after ingress. |
| `FS_XFMR` | Main transformer/control area | `primary_nonzero` | Material value and different salvageability logic. |
| `FS_COMB` | Combiner + DC protection | `primary_secondary` | Distinct small electrical enclosures and value bucket. |
| `FS_SCADA` | Monitoring/control system | `secondary` | Sensitive electronics but smaller value bucket. |
| `FS_CABLE` | AC/DC cable and pathway | `conditional_secondary` | Wet cable, terminations, pull boxes, and conduit paths differ from cabinets. |
| `FS_PVMOD` | PV module | `conditional_secondary` | Only direct-submersion curve when water reaches lower edge. |
| `FS_FOUND` | Foundation base | `conditional_secondary` | Velocity/scour mechanism, not depth-driven cabinet ingress. |

The canonical artifact is authoritative for these labels. Older worked-reference prose described combiner
and SCADA as primary; docs r5 uses the runtime classifications above.

### Reviewed but not separate runtime curves

```text
SITE_DRAINAGE / FLOOD_DEFENSE
    -> protection/exposure state, not an automatically damaged value bucket

CIVIL_INFRA / access/fencing/roads
    -> reviewed, but no canonical v1.0 curve record in this artifact

MOUNTING / RACKING_STRUCTURE
    -> reviewed as asset anatomy, but no separate canonical flood v1.0 curve record

equipment above waterline with no alternate ingress
    -> conceptual DR approximately 0 for the direct-depth pathway
```

Absence of a nonzero curve does not mean the subsystem was forgotten. It means the current evidence, pathway,
or materiality decision did not justify another runtime record.

---

## Stage 3 -- Axis

### Decisive question

> What hazard quantity drives damage at each failure unit?

### Accepted depth bridge

```text
h_i = max(0, WSE - z_i_crit)

h_i       local depth above failure unit i's critical point
WSE       event water-surface elevation
z_i_crit  component critical elevation in the same vertical datum
```

When only site depth above grade exists:

```text
h_i = max(0, site_flood_depth - critical_height_above_grade_i)
```

### Runtime axes

| Record | Internal axis |
|---|---|
| `FS_INV`, `FS_SWG`, `FS_XFMR`, `FS_COMB`, `FS_SCADA` | `local_depth_above_component_datum_m` |
| `FS_CABLE` | `depth_pathway_termination_exposure` -- a pathway index whose unit/formula is not fully pinned in the JSON |
| `FS_PVMOD` | `depth_above_module_lower_edge_m` |
| `FS_FOUND` | `flow_velocity_mps_or_scour_proxy` in curve record; a screening velocity/scour proxy, not universally pure measured velocity |

The main hazard-axis record has a valid range of `0` to `2.0 m` and an extrapolation policy of
`clamp_or_warn`.

### Rejected alternatives

| Candidate | Decision | Why |
|---|---|---|
| One plant-level site depth | Rejected | Erases component freeboard and entry-height differences. |
| Full depth × duration surface | Rejected for v1.0 | Public evidence is not dense enough by failure unit. |
| Flow velocity for electrical cabinets | Rejected as primary electrical axis | Ingress is controlled first by local water reach/pathway. |
| Depth for foundation scour | Rejected as sufficient | Scour requires moving-water and site geotechnical context. |

Elevation changes the **x value**. It does not automatically change intrinsic equipment fragility.

---

## Stage 4 -- Curve form

### Decisive question

> What representation matches threshold-like water entry while remaining auditable?

Flood electrical damage is treated as a state progression:

```text
dry
 |
 v
water reaches an opening/pathway
 |
 v
partial ingress / contamination
 |
 v
critical controls or electronics wet
 |
 v
replacement or major reconditioning
```

### Alternatives

| Form | Decision | Reason |
|---|---|---|
| Hard step | Rejected | Too brittle for uncertain elevations, openings, sealing, waves, and contamination. |
| Logistic | Rejected as default | Imposes a smooth transition where equipment guidance is more state/threshold oriented. |
| Piecewise-linear depth-percent | Accepted | Keeps every threshold visible and supports transparent interpolation. |
| Discrete damage states | Compatible view | The deterministic ordinates may also be read as a state table, not an uncertainty distribution. |

All eight canonical runtime records use `piecewise_linear`. Seven depth/pathway curves use points from 0 to
2.0 m; the foundation proxy uses 0 to 4.0 m/s/proxy units.

```text
DR
1.0 |                     switchgear / combiner / SCADA ______
0.8 |              ______/
0.6 |         ____/                 transformer rises slower
0.4 |     ___/                _____/
0.2 | ___/              _____/
0.0 +----+----+----+----+----+----+---- local depth
     0   .02  .05  .15  .30  .60  1.0 m
```

This plot is schematic. Use the exact [curve tables](MODEL_REFERENCE.md#3-canonical-curve-ordinates).

---

## Stage 5 -- Adjustments

### Decisive question

> What changes the selected curve, event state, local intensity, or touched value?

| Concept | Flood examples | Correct effect |
|---|---|---|
| **Selector** | `enclosure_rating`, `transformer_type`, `cable_location_rating` | Record qualification or missing-data flags. The current artifact declares these fields but contains no alternate numeric variants. |
| **Conditioner** | `conduit_water_path_present`, energized/shutdown state, duration, contamination | Adjust or flag event/pathway state only when a governed rule exists. |
| **Axis bridge / geometry** | `component_critical_elevation_m` | Changes local depth through the WSE-minus-elevation formula. |
| **Exposure** | `fraction_value_exposed` | Scales the part of the value bucket touched. |
| **Value** | Failure-unit replacement value | Supplies the DR denominator and loss basis. |

```text
raised inverter pad
    -> smaller local depth
    -> same intrinsic curve

Type 6P qualified enclosure
    -> record qualification in current v1.0
    -> no DR change unless a future governed model publishes a supported variant

half of inverter stations in flood swath
    -> fraction_value_exposed = 0.5
    -> value scaling, not fragility change
```

The canonical model carries conduit presence as a flag/open seam and does **not** apply a universal numeric
conduit, duration, salinity, energized-state, or defense multiplier.

---

## Stage 6 -- Emit

### Decisive question

> What may this cell honestly return, and what belongs to a downstream consumer?

The primary output grain is the failure unit.

```text
event + metadata
    -> curve ID and local intensity
    -> deterministic failure-unit DR
    -> flags, versions, evidence limitations
```

### Capability v2 interpretation

| Item | Current status |
|---|---|
| Failure-unit scalar DR | Supported |
| Scenario loss | Supported with explicit value and exposure basis |
| Intrinsic vulnerability spread | Not carried |
| Populated emit modes | `scalar_mean`, `discrete_state_table` |
| Frequency-driven annual loss distribution | Consumer-supported only with sampled frequency/intensity coupling and caps |
| EAL | Consumer-computable with prerequisites |
| PML/VaR/TVaR | Consumer-computable only from a validated annual loss distribution |

The damage artifact does not itself calculate annual metrics. A downstream result must preserve the flags
`CURVE_INTRINSIC_SPREAD_NOT_CARRIED` and `TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY` when applicable.

Cap binding is consumer-enforced and fail-closed. If required caps are not applied inside the simulation,
withhold the affected metric or use a full capped simulation.

---

## Stage 7 -- Ship

### Decisive question

> What exact object does the consumer receive and pin?

```text
cell:                 flood_solar
damage code:          FLOOD_SOLAR_ELECTRICAL_INUNDATION_V1
semantic model:       model v1.0
runtime docs:         docs r4
artifact schema:      damage_curve_record_bundle.v2
capability schema:    capability_declaration.v2
consumer pin:         flood_solar@model_v1_0__docs_r4
SHA-256:              a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d
```

The human basics set advances to docs r5 without republishing the runtime artifact. Runtime consumers remain
on the exact docs r4 artifact tuple until a deliberate artifact release occurs.

```text
poll artifact index
    -> compare model + runtime docs + schemas + SHA
    -> validate JSON
    -> supply site geometry, value, and exposure
    -> evaluate each supported failure unit
    -> assemble event loss downstream
```

---

## Cross-reference map

| Question | Friendly explanation | Exact/governed detail |
|---|---|---|
| What is local depth? | [Basics §3](README.md#3-the-physical-picture) | [Metadata spec §3](../current/flood_solar_damage_code_metadata_spec_v1_0.md#3-required-exposure-geometry) |
| What fails? | [Stage 2](#stage-2----grain-and-coverage) | [Artifact `failure_units`](../current/flood_solar__model_v1_0__docs_r4__curve_artifact.json) |
| Where did numbers come from? | [Stage 1](#stage-1----evidence) | [Dossier §3 and §8](../current/flood_solar_curve_derivation_dossier_v1_0.md#3-evidence-map) |
| What are the exact curves? | [Model reference §3](MODEL_REFERENCE.md#3-canonical-curve-ordinates) | [Artifact `curve_records`](../current/flood_solar__model_v1_0__docs_r4__curve_artifact.json) |
| What fields are needed? | [Model reference §5](MODEL_REFERENCE.md#5-input-and-output-field-dictionary) | [Metadata spec](../current/flood_solar_damage_code_metadata_spec_v1_0.md) |
| What may consumers report? | [Stage 6](#stage-6----emit) | [Capability standard](../../../contracts/standards/21_capability_and_cap_binding_standard.md) |
| What remains uncertain? | [Model reference §7](MODEL_REFERENCE.md#7-parameter-tier-and-update-trigger-register) | [Dossier §13](../current/flood_solar_curve_derivation_dossier_v1_0.md#13-open-seams-and-update-triggers) |

---

## Documentation-only non-change statement

This page explains the existing model. It does not alter failure-unit coverage, axes, curve form, ordinates,
selectors, conditioners, exposure logic, value mapping, artifact/schema, or outputs. Identical inputs still
produce identical runtime DRs under flood_solar model v1.0/docs r4.
