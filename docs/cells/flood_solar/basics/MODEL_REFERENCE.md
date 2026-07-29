# Flood × Solar Model Reference

**Use this page for exact lookup.** It collects the canonical runtime identity, failure-unit records, curve
ordinates, fields, value links, evidence tiers, capabilities, validation status, and a complete illustrative
event assembly.

For a first explanation, use the [basics README](README.md). For the evidence-to-SHIP reasoning, use
[How the model is built](HOW_THE_MODEL_IS_BUILT.md).

```yaml
cell_id: flood_solar
damage_code_id: FLOOD_SOLAR_ELECTRICAL_INUNDATION_V1
cell_model_version: model v1.0
human_documentation_revision: docs r5
canonical_runtime_documentation_revision: docs r4
canonical_runtime_pin: flood_solar@model_v1_0__docs_r4
artifact_schema: damage_curve_record_bundle.v2
capability_schema: capability_declaration.v2
canonical_artifact_sha256: a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

---

## 1. Authority and interpretation rules

| Question | Authority |
|---|---|
| Exact runtime fields, records, parameters, and capability | [Canonical JSON artifact](../current/flood_solar__model_v1_0__docs_r4__curve_artifact.json) |
| Derivation rationale and evidence narrative | [Derivation dossier](../current/flood_solar_curve_derivation_dossier_v1_0.md) |
| Human-readable input/output contract | [Metadata specification](../current/flood_solar_damage_code_metadata_spec_v1_0.md) |
| Workbook audit views | [Workbook manifest](../current/workbook_sheet_manifest_flood_solar_v1_0.md) |
| Repository-current pin and SHA | [Artifact index](../../../contracts/machine_readable_artifact_index.json) |

Interpretation guardrails:

```text
- A damage ratio is physical repair/replacement cost divided by failure-unit replacement value.
- Piecewise ordinates are deterministic severity points, not an uncertainty distribution.
- Example geometry and values are class-template teaching inputs, not asset observations.
- Missing datum, geometry, value basis, or required pathway input must not be replaced silently.
- The runtime artifact wins if an older dossier, notebook, or Google Drive snapshot conflicts.
```

---

## 2. Canonical failure-unit inventory

| ID | Subsystem | Component | Treatment | Axis | `f_kind` |
|---|---|---|---|---|---|
| `FS_INV` | `INVERTER_SYSTEM` | `INVERTER` | `primary_nonzero` | `local_depth_above_component_datum_m` | `site_geometry` |
| `FS_SWG` | `SUBSTATION` | `SWITCHGEAR` | `primary_nonzero` | `local_depth_above_component_datum_m` | `site_geometry` |
| `FS_XFMR` | `SUBSTATION` | `TRANSFORMER_MAIN` | `primary_nonzero` | `local_depth_above_component_datum_m` | `site_geometry` |
| `FS_COMB` | `INVERTER_SYSTEM` | `COMBINER_BOX + DC_PROTECTION` | `primary_secondary` | `local_depth_above_component_datum_m` | `site_geometry` |
| `FS_SCADA` | `SCADA` | `MONITORING_SYSTEM` | `secondary` | `local_depth_above_component_datum_m` | `site_geometry` |
| `FS_CABLE` | `ELECTRICAL_COLLECTION` | `CABLE_AC + CABLE_DC` | `conditional_secondary` | `depth_pathway_termination_exposure` | `site_geometry` |
| `FS_PVMOD` | `PV_ARRAY` | `PV_MODULE` | `conditional_secondary` | `depth_above_module_lower_edge_m` | `site_geometry` |
| `FS_FOUND` | `FOUNDATION` | `FOUNDATION_BASE` | `conditional_secondary` | `flow_velocity_or_scour_proxy` | `site_geometry` |

### Coverage reconciliation

| Subject | Current disposition |
|---|---|
| Site drainage and flood defense | Exposure/protection state; no separate canonical v1.0 damage curve |
| Civil roads/access/fencing | Reviewed in dossier; no runtime curve record in the canonical artifact |
| Mounting/racking debris load | Separate mechanism candidate; no current runtime record |
| Above-water equipment with no alternate ingress | Direct-depth pathway conceptually DR approximately 0 |

This table prevents two errors: forcing a weak nonzero curve onto every subsystem, and forgetting reviewed
subjects merely because they do not carry a runtime curve.

`FS_CABLE` uses a pathway/termination exposure axis whose unit and construction formula are not fully pinned
in the current JSON. `FS_FOUND` is a velocity-or-scour screening proxy; its x value must not always be
presented as a pure site-measured flow velocity.

---

## 3. Canonical curve ordinates

### 3.1 Depth/pathway curves

All values below are failure-unit DRs from the canonical JSON artifact.

| Curve / axis value | 0.00 | 0.02 | 0.05 | 0.15 | 0.30 | 0.60 | 1.00 | 1.50 | 2.00 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `FS_INV` inverter | 0.00 | 0.05 | 0.25 | 0.75 | 0.95 | 1.00 | 1.00 | 1.00 | 1.00 |
| `FS_SWG` switchgear | 0.00 | 0.10 | 0.40 | 0.85 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| `FS_XFMR` transformer/control | 0.00 | 0.03 | 0.10 | 0.25 | 0.45 | 0.65 | 0.80 | 0.95 | 1.00 |
| `FS_COMB` combiner/DC | 0.00 | 0.10 | 0.35 | 0.80 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| `FS_SCADA` monitoring/control | 0.00 | 0.15 | 0.45 | 0.90 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| `FS_CABLE` cable/pathway | 0.00 | 0.02 | 0.05 | 0.10 | 0.15 | 0.25 | 0.40 | 0.55 | 0.65 |
| `FS_PVMOD` module submersion | 0.00 | 0.05 | 0.10 | 0.30 | 0.60 | 0.85 | 1.00 | 1.00 | 1.00 |

### 3.2 Foundation velocity/scour proxy

| Curve / velocity or proxy | 0.0 | 0.5 | 1.0 | 1.5 | 2.0 | 3.0 | 4.0 |
|---|---:|---:|---:|---:|---:|---:|---:|
| `FS_FOUND` foundation/scour | 0.00 | 0.00 | 0.05 | 0.15 | 0.35 | 0.70 | 1.00 |

This is a T4 conditional placeholder. When material, replace it with site hydraulics/geotechnics or forensic
evidence rather than presenting the generic proxy as calibrated truth.

### 3.3 Evaluation behavior

```text
curve form:           piecewise_linear
y-axis:               failure_unit_damage_ratio
depth valid range:    0 to 2.0 m
extrapolation policy: clamp_or_warn
interpolation:        straight line between neighboring ordinates
```

For two points `(x1, DR1)` and `(x2, DR2)`:

```text
DR(x) = DR1 + ((x - x1) / (x2 - x1)) x (DR2 - DR1)
```

Never extrapolate a new physical mechanism merely because a numeric function can return a value.

---

## 4. ASCII curve views

Each bar uses approximately 20 characters for DR `1.00`.

### Inverter depth curve

```text
local depth   DR     visual
0.00 m       0.00   |
0.02 m       0.05   |#
0.05 m       0.25   |#####
0.15 m       0.75   |###############
0.30 m       0.95   |###################
0.60 m       1.00   |####################
1.00 m       1.00   |####################
2.00 m       1.00   |####################
```

### Transformer/control curve

```text
local depth   DR     visual
0.00 m       0.00   |
0.02 m       0.03   |#
0.05 m       0.10   |##
0.15 m       0.25   |#####
0.30 m       0.45   |#########
0.60 m       0.65   |#############
1.00 m       0.80   |################
1.50 m       0.95   |###################
2.00 m       1.00   |####################
```

### Foundation/scour proxy

```text
axis value        DR     visual
0.0 m/s-or-proxy  0.00   |
0.5 m/s-or-proxy  0.00   |
1.0 m/s-or-proxy  0.05   |#
1.5 m/s-or-proxy  0.15   |###
2.0 m/s-or-proxy  0.35   |#######
3.0 m/s-or-proxy  0.70   |##############
4.0 m/s-or-proxy  1.00   |####################
```

The flatter transformer curve reflects the current engineering assumption that evaluation/reconditioning
may remain possible longer than for power electronics or switchgear. It is not claims calibration.

---

## 5. Input and output field dictionary

### 5.1 Hazard and geometry inputs

| Field | Unit | Requirement | Meaning | Missing/incompatible behavior |
|---|---:|---|---|---|
| `water_surface_elevation_m` | m | Preferred | Absolute event WSE | Use only with compatible equipment datum. |
| `site_flood_depth_m` | m | Accepted fallback | Water above local grade | Requires component height above the same grade. |
| `flow_velocity_mps` | m/s | Conditional | Input for `FS_FOUND` | Withhold/raise if foundation pathway is requested and missing. |
| `duration_hr` | hr | Optional/deferred | Time above threshold | Flag only; no universal numeric v1.0 adjustment. |
| `contamination_class` | enum | Optional | Fresh/brackish/salt/sewage/chemical/unknown | Flag/open seam. |
| `component_critical_elevation_m` | m | Required for preferred depth bridge | Absolute first-vulnerable-point elevation | Fail closed if datum is incompatible/unknown. |
| `component_critical_height_above_grade_m` | m | Required for fallback bridge | Critical point above local grade | Do not substitute an undocumented equipment height. |
| `equipment_pad_elevation_m` | m | Supporting | Pad absolute elevation | Not automatically the critical point. |
| `module_lower_edge_elevation_m` | m | Conditional | Direct module-submersion threshold | Needed when `FS_PVMOD` is evaluated. |
| `cable_trench_or_pullbox_elevation_m` | m | Conditional | Cable/conduit pathway elevation | Needed to resolve pathway exposure. |
| `fraction_value_exposed` | 0--1 | Required for scenario loss | Fraction of failure-unit value touched | Missing value basis means scenario loss is withheld. |

### 5.2 Static selectors

| Canonical field | Aliases/examples | Current runtime effect |
|---|---|---|
| `enclosure_rating` | `equipment_ip_or_nema_rating`; NEMA 3R/4/4X/6/6P, IP65/IP67 | Qualification/flag field; no alternate numeric enclosure curve is published in the current artifact. |
| `enclosure_rating_system` | NEMA/IP | Distinguishes rating basis. |
| `transformer_type` | liquid-filled, dry-type, cast-resin, unknown | Qualification/flag field and future variant candidate; no alternate numeric transformer curve is published. |
| `cable_location_rating` | alias `cable_wet_location_rating` | Qualification/flag field and future variant candidate; no alternate numeric cable curve is published. |

The narrative metadata spec also discusses equipment mounting and substation configuration as useful asset
metadata. They are not canonical numeric modifiers in the current JSON artifact.

### 5.3 Conditioners and axis bridge

| Field | Current treatment | Numerical v1.0 modifier? |
|---|---|---:|
| `conduit_water_path_present` | Open-seam flag or supported variant selection | No universal multiplier |
| `component_critical_elevation_m` | Horizontal axis bridge `max(0,WSE-z)` | Yes, through local depth only |
| `energized_state` | Narrative conditioner/open seam | No universal multiplier |
| `shutdown_before_flood` | Narrative conditioner/open seam | No universal multiplier |
| `duration_hr` | Deferred conditioner | No |
| contamination/salinity | Deferred conditioner | No |
| flood defense/drainage state | Exposure/protection information | No blanket credit |

### 5.4 Outputs

| Output | Meaning |
|---|---|
| `failure_unit_damage_ratio` | Deterministic direct-physical DR for one failure unit |
| `curve_id` | Canonical curve record used |
| `curve_version` / model pin | Version identity used by consumer |
| `local_depth_m` or pathway intensity | Evaluated curve x value |
| selector/conditioner/open-seam flags | Metadata and limitations carried with result |
| evidence tier/limitation | Strength and known boundary of parameterization |

### 5.5 Workbook and field-name compatibility notes

- In the supporting workbook's `Site_Inputs` sheet, values such as `0.35` and `0.72` under
  `critical_elevation_m` are used as **heights above local grade**, not absolute elevations from the project
  vertical datum. Treat them as illustrative geometry and do not silently load them as absolute elevations.
- The legacy field `fraction_of_component_value_exposed` is optional workbook-era wording. The canonical
  scenario-loss field is `fraction_value_exposed`; it is required only when assembling loss, not when
  evaluating a scalar failure-unit DR.

---

## 6. Failure-unit value crosswalk

The damage cell owns the link target/basis. The consumer supplies the actual value and exposure. Values are
not embedded in the canonical flood artifact.

| Failure unit | Required value bucket | Example source |
|---|---|---|
| `FS_INV` | `INVERTER_SYSTEM / INVERTER` | EPC cost split or valuation ledger |
| `FS_SWG` | `SUBSTATION / SWITCHGEAR` | Substation cost split |
| `FS_XFMR` | `SUBSTATION / TRANSFORMER_MAIN` | Transformer line item |
| `FS_COMB` | `INVERTER_SYSTEM / COMBINER_BOX + DC_PROTECTION` | DC electrical BOS split |
| `FS_SCADA` | `SCADA / MONITORING_SYSTEM` | Controls/communications split |
| `FS_CABLE` | `ELECTRICAL_COLLECTION / CABLE_AC + CABLE_DC` | Collection-system valuation |
| `FS_PVMOD` | `PV_ARRAY / PV_MODULE` | Module supply + install value |
| `FS_FOUND` | `FOUNDATION / FOUNDATION_BASE` | Civil/foundation cost split |

Assembly:

```text
loss_i = DR_i x value_i x fraction_value_exposed_i
total conditional event loss = sum(loss_i)
```

Guardrails:

```text
- Do not apply a component DR to total project TIV.
- Do not allocate the same support/logistics cost to multiple failure units.
- Do not treat exposure fraction as intrinsic vulnerability.
- Keep illustrative values out of observed asset ledgers.
- Reconcile value buckets so the denominator and cap are explicit.
```

---

## 7. Parameter tier and update-trigger register

| Parameter/rule | Curve(s) | Tier | Current basis | Update trigger |
|---|---|---|---|---|
| Local-depth bridge `h_i=max(0,WSE-z_i_crit)` | All depth curves | T2 | DOE/FEMP + FEMA elevation/freeboard logic | Change only if axis semantics change |
| Electrical depth-damage points | `FS_INV`, `FS_SWG`, `FS_XFMR`, `FS_COMB`, `FS_SCADA` | T3 | Mechanism/form sourced; exact values engineered | Claims, OEM, or forensic depth-damage data |
| Cable/pathway points | `FS_CABLE` | T3 | Wet-equipment/pathway mechanism; engineered percentages | Cable/termination outcome data plus routing |
| Module-submersion points | `FS_PVMOD` | T3 | Submersion mechanism; engineered percentages | Module flood/claims/forensic outcomes |
| Foundation velocity/scour points | `FS_FOUND` | T4 | Generic conditional screening proxy | Site hydraulic/geotechnical or forensic model |
| Enclosure/conduit fields | Relevant electrical records | T3 | Mechanism supported; numeric adjustment deferred | Qualified OEM/site test or outcome data |
| Transformer type | `FS_XFMR` | Open seam | Construction may change disposition | Asset metadata plus calibrated variant evidence |
| Duration/contamination/salinity | Relevant records | Open seam | Mechanism plausible/source-supported | Endpoint-matched outcome evidence |

### Evidence status vocabulary used here

```text
T2  public laboratory evidence, engineering standard, or physics bridge
T3  engineering proxy or adjacent empirical evidence
T4  expert judgment / explicit placeholder
```

Tier describes support for a parameter at its endpoint and grain. It is not a generic score for the publisher.

---

## 8. Capability and reportability

### 8.1 What the cell populates

```text
failure-unit scalar DR                         supported
scenario loss with explicit value/exposure     supported
curve-intrinsic vulnerability spread           not carried
populated emit modes                            scalar_mean, discrete_state_table
```

The discrete state table is the deterministic set of piecewise ordinates. It is **not** a probability or
uncertainty distribution.

### 8.2 What a downstream consumer may compute

| Metric/object | Rule |
|---|---|
| Event scenario loss | Requires explicit value and exposure basis. |
| Frequency-driven annual loss distribution | Requires sampled hazard frequency/intensity coupling and caps applied inside simulation. |
| EAL | Consumer-computable only when prerequisites and cap-binding preflight pass. |
| PML/VaR/TVaR | Consumer-computable only from a validated annual loss distribution. |
| Vulnerability uncertainty distribution | Not supported by this deterministic curve artifact. |

Required limitation flags:

```text
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY
```

Cap policy:

```text
owner: downstream consumer
mode:  fail closed
if checks fail: withhold affected metric or use full capped simulation
```

---

## 9. Complete illustrative event assembly

This example is copied from the runtime walkthrough inputs and recalculated from the canonical curve points.
It is **class-template teaching material**, not an observed asset or universal value allocation.

```text
WSE:                     101.00 m
illustrative ground:     100.00 m
foundation velocity:       1.60 m/s
```

| ID | Local intensity | DR | Illustrative value | Exposed | Conditional loss |
|---|---:|---:|---:|---:|---:|
| `FS_INV` | 0.28 m | 0.9233 | $12.0M | 0.80 | $8.8640M |
| `FS_SWG` | 0.16 m | 0.8600 | $4.5M | 0.60 | $2.3220M |
| `FS_XFMR` | 0.35 m | 0.4833 | $8.0M | 0.50 | $1.9333M |
| `FS_COMB` | 0.45 m | 1.0000 | $2.5M | 0.90 | $2.2500M |
| `FS_SCADA` | 0.08 m | 0.5850 | $1.2M | 0.40 | $0.2808M |
| `FS_CABLE` | 0.65 m | 0.2688 | $5.0M | 0.70 | $0.9406M |
| `FS_PVMOD` | 0.00 m | 0.0000 | $55.0M | 0.30 | $0.0000M |
| `FS_FOUND` | 1.60 m/s | 0.1900 | $7.0M | 0.50 | $0.6650M |
| **Total** | -- | -- | **$95.2M** | -- | **$17.2558M** |

```text
conditional event loss / illustrative value basis
    = $17.255758M / $95.2M
    = 18.13%
```

ASCII loss contribution:

```text
FS_INV    $8.864M  |##############################
FS_SWG    $2.322M  |########
FS_COMB   $2.250M  |########
FS_XFMR   $1.933M  |#######
FS_CABLE  $0.941M  |###
FS_FOUND  $0.665M  |##
FS_SCADA  $0.281M  |#
FS_PVMOD  $0.000M  |
```

The visual demonstrates why value linkage matters: the largest plant value bucket (`FS_PVMOD`) contributes
zero direct-submersion loss in this example because its lower edge remains above the WSE.

### 9.1 What a compact `damage_emit.v1` object looks like

This abbreviated object shows the contract shape for two failure units. The flag strings are illustrative
reader aids, not a newly governed runtime vocabulary.

```yaml
schema_version: damage_emit.v1
cell_id: flood_solar
damage_code_id: FLOOD_SOLAR_ELECTRICAL_INUNDATION_V1
model_version: model v1.0
emit_mode: scalar_mean
hazard_input_used:
  water_surface_elevation_m: 101.00
  vertical_reference: illustrative_common_project_datum
selectors_used:
  enclosure_rating: unknown
conditioners_used:
  conduit_water_path_present: unknown
exposure_used:
  value_basis_status: illustrative_class_template
failure_unit_results:
  - failure_unit_id: FS_INV
    curve_id: FS_INV
    subsystem: INVERTER_SYSTEM
    component: INVERTER
    scalar_mean_dr: 0.9233333333
    metadata_flags: [ILLUSTRATIVE_CLASS_TEMPLATE_GEOMETRY, ENCLOSURE_RATING_UNKNOWN]
  - failure_unit_id: FS_PVMOD
    curve_id: FS_PVMOD
    subsystem: PV_ARRAY
    component: PV_MODULE
    scalar_mean_dr: 0.0
    metadata_flags: [MODULE_LOWER_EDGE_ABOVE_WSE]
capability_declaration_ref:
  cell_pin: flood_solar@model_v1_0__docs_r4
  limitation_flags:
    - CURVE_INTRINSIC_SPREAD_NOT_CARRIED
    - TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY
cap_binding_preflight_ref: null
```

`cap_binding_preflight_ref: null` is not permission to publish EAL or a tail metric. It says that the
downstream prerequisite/cap check has not been supplied; the affected metric must remain withheld until it
passes.

---

## 10. Validation and reviewer checklist

### Current validation status

| Check | Status |
|---|---|
| Canonical JSON parses | Required/passing in repository validation |
| Artifact SHA matches index | `a08e77...` matches |
| Failure-unit/curve IDs reconcile | Eight failure units / eight curve records |
| Curve values remain within 0--1 | Yes |
| Selectors, conditioners, exposure separated | Yes |
| Capability v2 embedded | Yes |
| Standalone canonical known-answer JSON published | **No** for flood_solar |
| Notebook walkthroughs available | Yes; saved outputs useful |
| Notebook source paths/API fully repository-current | **No**; source cells use removed docs-r3 paths and the former capability-v1 `metrics_supportable` key |

The absence of a published flood KAT file is a validation gap, not evidence that the curve is wrong. It should
be addressed in later runtime/notebook work without inventing new behavior.

### Reviewer checklist

```text
[ ] Correct cell, semantic model, runtime docs, schema, and SHA are pinned.
[ ] WSE and equipment elevations share a documented vertical reference.
[ ] Each failure unit uses its own supported axis and curve.
[ ] FS_FOUND is evaluated only with explicit velocity/scour input and T4 warning.
[ ] Curve interpolation uses canonical ordinates; out-of-range behavior clamps/warns.
[ ] No narrative-only conditioner is assigned an invented numeric multiplier.
[ ] Each DR is linked to a non-overlapping failure-unit value bucket.
[ ] Exposure fraction scales value, not fragility.
[ ] Example values remain labeled class-template.
[ ] Annual/tail metrics remain downstream and satisfy capability prerequisites.
[ ] Open seams and limitation flags travel with the result.
```

---

## 11. Source register

| Evidence ID | Source | Main use | Link |
|---|---|---|---|
| `DOE_FEMP_PV_FLOOD` | DOE/FEMP, Preventing and Mitigating Flood Damage to PV Systems | Solar mechanisms, elevation, conduit paths | [DOE/FEMP](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems) |
| `NEMA_GD1_2019` | NEMA GD 1, Evaluating Water-Damaged Electrical Equipment | Replacement/evaluation framing | [NEMA](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment) |
| `NEMA_GD1_2016_PDF` | NEMA GD 1 open guide | Equipment-category detail | [PDF](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf) |
| `NEMA_ENCLOSURE_TYPES` | NEMA enclosure types | Rating/selector meaning | [NEMA enclosure types](https://www.nema.org/docs/default-source/products-document-library/nema-enclosure-types.pdf) |
| `FEMA_P348` | FEMA / Building America utility flood guide | Elevation/protection framing | [Building America](https://basc.pnnl.gov/library/protecting-building-utility-systems-flood-damage-principles-and-practices-design-and) |
| `USACE_HEC_FIA` | USACE HEC-FIA depth-percent relationships | Tabular form/interpolation precedent | [HEC-FIA](https://www.hec.usace.army.mil/confluence/fiadocs/fiatechref/latest/direct-damage/depth-percent-damage-relationships-direct-damage) |
| `KETJOY_2022` | Ketjoy et al. 2022 | Empirical module depth-percent context/sanity check | [Evidence update memo](../../../evidence/ingestion/flood_solar_evidence_update_memo__model_v1_0__docs_r2.md) |
| `NERC_2022_SUBSTATION` | NERC 2022 substation case | Shallow-depth switchgear/SCADA case evidence | [Evidence update memo](../../../evidence/ingestion/flood_solar_evidence_update_memo__model_v1_0__docs_r2.md) |
| `ANZGEO_2023_SCOUR_CONTEXT` | Scour context ingested in evidence co-curation | Mechanism validation only | [Evidence update memo](../../../evidence/ingestion/flood_solar_evidence_update_memo__model_v1_0__docs_r2.md) |
| `IEEE_C57` | IEEE C57 transformer guidance family | Future transformer-type selector support; no numeric v1.0 modifier | [Evidence update memo](../../../evidence/ingestion/flood_solar_evidence_update_memo__model_v1_0__docs_r2.md) |
| `IEC_61701_DURATION` | IEC 61701 plus duration taxonomy | Future salinity/duration conditioner support; no numeric v1.0 modifier | [Evidence update memo](../../../evidence/ingestion/flood_solar_evidence_update_memo__model_v1_0__docs_r2.md) |
| `SOLAR_VALUATION` | Internal solar/wind valuation source | Value-link basis | [Value workbook](../../../method/value_basis/solar_wind_value_breakdown.xlsx) |
| `SUBSTRATE` | Internal substrate decomposition | Physical vocabulary | [Substrate decomposition](../../../source_drops/context/v2_5/substrate_decomposition.md) |

Sources are inputs, not universal authorities. Consult the dossier for permitted and prohibited inference.

---

## 12. Version history and non-change statement

| Layer | Current state |
|---|---|
| Semantic damage model | model v1.0 |
| Canonical runtime artifact | docs r4, bundle v2, capability v2 |
| Human basics documentation | docs r5 |
| Portable package baseline | library v2.5 |
| Repository publication status | canonical in repository; not a newly assembled portable package |

Docs r5 adds reader-friendly explanations and this three-file basics set. It does not change curve forms,
ordinates, axes, selectors, conditioners, exposure logic, value mapping, artifact/schema, or output meaning.
Identical inputs still produce identical runtime DRs under the docs r4 artifact.
