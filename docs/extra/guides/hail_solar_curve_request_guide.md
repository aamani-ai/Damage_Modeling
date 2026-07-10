# Guide: Give Me A Solar Hail Curve

Use this guide when someone asks for "the solar hail curve", "hail damage curve for solar", or the curve
Hazard M3 should use for hail x solar.

## Short Answer

The current solar hail curve is the `hail_solar` cell's canonical runtime artifact:

```text
docs/cells/hail_solar/current/hail_solar__model_v1_0__docs_r7__curve_artifact.json
```

It is indexed from:

```text
docs/contracts/machine_readable_artifact_index.json
```

With no asset details, use the default archetype curve:

```text
damage_code_id: HAIL_SOLAR_PV_MODULE_V1
curve_id:       HAIL_SOLAR_DEFAULT_3P2_GBS
hazard axis:    mesh_diameter_mm
failure unit:   PV_MODULE_GLASS_CELL
model version:  model v1.0
docs revision:  docs r7
```

## Where The Current Curve Is Stored

```text
docs/cells/hail_solar/
  README.md
  current/
    hail_solar__model_v1_0__docs_r7__curve_artifact.json   # runtime contract
    known_answer_tests_hail_solar__model_v1_0__docs_r7.json
    damage_curve_records_v1_3_hail_solar_derivation_audit.xlsx
    hail_solar_curve_derivation_dossier_v1_3.md
    damage_code_metadata_spec_hail_solar_v1_3.md
  archive/
    older package/docs revisions
```

Runtime consumers should use the JSON artifact. The workbook is the human derivation/audit view.

## Normal Request Flow

```text
request: "give me a solar hail curve"
  |
  v
resolve cell
  cell_id = hail_solar
  |
  v
open artifact index
  docs/contracts/machine_readable_artifact_index.json
  |
  v
select current canonical artifact
  docs/cells/hail_solar/current/hail_solar__model_v1_0__docs_r7__curve_artifact.json
  |
  v
verify artifact
  schema_version
  cell_id
  damage_code_id
  model version
  docs revision
  sha256
  canonical_runtime_artifact = true
  |
  v
choose curve record
  asset module_archetype known?  -> matching archetype
  asset details missing?         -> default_3_2mm_glass_backsheet
  |
  v
evaluate DR(mesh_diameter_mm)
  |
  v
apply stow/exposure logic if inputs exist
  |
  v
return failure-unit damage ratio + flags
```

## What A User Can Specify

The hail x solar artifact has four practical input groups. They do different jobs.

```text
hazard input
  mesh_diameter_mm
  |
  v
selector inputs
  module_archetype / glass specs / hail test rating
  -> choose the base archetype curve
  |
  v
conditioner inputs
  mounting_type / stow_state / stow_success_probability
  -> adjust the event-time curve
  |
  v
exposure + value inputs
  array_exposure_fraction / value_profile_id or site value basis / denominator
  -> convert DR into loss; does not change fragility
```

### Knobs that change the base curve

| User input | What it does | Example |
|---|---|---|
| `module_archetype` | Directly chooses one of the three archetype curves. | `default_3_2mm_glass_backsheet` |
| `front_glass_thickness_mm` | Helps map to an archetype when `module_archetype` is not explicit. | `3.2` |
| `glass_glass_vs_backsheet` | Helps map to fragile/default archetype. | `glass_backsheet` |
| `hail_test_rating` | High-value override if a real BOM/test rating exists. | `enhanced_hail_50mm` |
| `manufacturer_model` / `bom_test_report_id` | Provenance for exact overrides. | `<module model>` / `<report id>` |

### Knobs that condition the event

| User input | What it does | Notes |
|---|---|---|
| `mounting_type` | Determines whether stow can apply. | `single_axis_tracker` generally means stow can apply. |
| `stow_state` | Chooses unstowed, stowed, or probabilistic blend. | `not_applicable`, `unstowed`, `stowed`, `unknown_probabilistic`. |
| `stow_success_probability` | Blends stowed and unstowed curves when actual state is unknown. | Use only with `stow_state: unknown_probabilistic`. |
| `stow_angle_deg` | Records explicit stow angle. | Stored for provenance; v1.3 does not continuously calibrate by angle. |
| `stow_confirmation` | Separates commanded stow from confirmed stow. | Useful when SCADA confirms actual state. |

The current stow adjustment is a low-confidence placeholder:

```text
DR = P_stowed * [0.90 * logistic(D; D50 + 8mm, k)]
   + (1 - P_stowed) * logistic(D; D50, k)
```

It is useful for scenario sensitivity, but it should be labeled as `stow_adjustment_placeholder` until
tracker/BOM-specific hail-stow data replaces it.

Wind-driven hail is a documented caveat to this placeholder, not an active runtime knob. Keep `mesh_diameter_mm`
as the curve x-axis. If event wind speed/direction and tracker orientation are available, treat them as candidate
future conditioner inputs for a model update, not as current v1.0 inputs.

### Knobs that change exposure or loss, not fragility

| User input | What it does | Example |
|---|---|---|
| `array_exposure_fraction` | Scales the affected PV array value. | `0.72` if only 72% of the array is hit by damaging hail. |
| `exposure_basis` | Explains where exposure fraction came from. | `full_site_default`, `footprint_overlay`, `scenario`. |
| `value_profile_id` | Selects a published value allocation and denominator pair. | `HAIL_HAZARD_REFERENCE_ADAPTER_V1` |
| `site_value_basis` | Replaces the reference profile with project-specific values. | Schedule of values + support allocation. |
| `at_risk_fraction` | Optional share of the selected module inventory that is applicable. | `0.90`; do not reuse the old generic 0.75/0.8 examples. |
| `denominator` | Labels the requested percentage. | `physical_replaceable_base` or `installed_capex`. |
| `value_bucket` | Links the DR to the failure-unit valuation ledger. | `PV_ARRAY_MODULE_EXPOSED` |

These inputs are important for loss, but they do not choose the logistic fragility curve.

The artifact publishes two reference profiles. `HAIL_DIRECT_MODULE_HARDWARE_ONLY_V1` is the direct module
hardware floor: 33.176% of physical base / 26.001% of installed capex. The Hazard-compatible
`HAIL_HAZARD_REFERENCE_ADAPTER_V1` also assigns all general replacement fieldwork to module damage: 45.350%
of physical base / 35.543% of installed capex. The latter reproduces Hazard's former hardcoded `0.3554`, but
it is a T4 allocation scenario and must be selected explicitly.

## Archetype Choice

The artifact contains one failure unit and three selectable logistic archetype curves:

| Curve ID | Selector | Use when |
|---|---|---|
| `HAIL_SOLAR_FRAGILE_THIN_GG` | `fragile_thin_glass_glass` | Thin / fragile glass-glass module behavior is known. |
| `HAIL_SOLAR_DEFAULT_3P2_GBS` | `default_3_2mm_glass_backsheet` | Generic/default solar PV module when details are missing. |
| `HAIL_SOLAR_HARDENED_THICKER` | `hail_hardened_thicker_glass` | Hail-hardened or thicker-glass module behavior is known. |

Default rule:

```text
if module_archetype is missing:
  use HAIL_SOLAR_DEFAULT_3P2_GBS
  emit DEFAULT_SELECTOR_USED flag
```

## Default Curve Parameters

The default curve is logistic:

```text
DR(D) = max_DR / (1 + exp(-k * (D - D50)))
```

For `HAIL_SOLAR_DEFAULT_3P2_GBS`:

```text
D50_mm   = 52.696
k_per_mm = 0.165912
max_DR   = 1.0
```

Example values:

| MESH-equivalent hail diameter | Default DR |
|---:|---:|
| 25 mm | 0.010 |
| 35 mm | 0.050 |
| 45 mm | 0.218 |
| 50 mm | 0.390 |
| 55 mm | 0.594 |
| 65 mm | 0.885 |
| 75 mm | 0.976 |

## Example Requests

### 1. Generic solar hail curve

Use when the user has no asset-specific module or tracker information.

```yaml
mesh_diameter_mm: 50
module_archetype: default_3_2mm_glass_backsheet
mounting_type: fixed_tilt
stow_state: not_applicable
array_exposure_fraction: 1.00
```

Resulting base curve:

```text
curve_id = HAIL_SOLAR_DEFAULT_3P2_GBS
DR_50mm  ~= 0.390
flags    = generic/default selector if module data was missing
```

### 2. Single-axis tracker, unstowed

Use when the asset is a tracker site but was not stowed for the event.

```yaml
mesh_diameter_mm: 50
module_archetype: default_3_2mm_glass_backsheet
mounting_type: single_axis_tracker
stow_state: unstowed
array_exposure_fraction: 1.00
```

Result:

```text
curve_id = HAIL_SOLAR_DEFAULT_3P2_GBS
DR_50mm  ~= 0.390
```

The tracker mounting type matters for metadata, but without stow the event curve is the unstowed base curve.

### 3. Single-axis tracker, confirmed stowed

Use when the tracker was actually stowed for the event.

```yaml
mesh_diameter_mm: 50
module_archetype: default_3_2mm_glass_backsheet
mounting_type: single_axis_tracker
stow_state: stowed
stow_angle_deg: 60
stow_confirmation: confirmed_by_SCADA
array_exposure_fraction: 1.00
```

Result with current placeholder adjustment:

```text
base DR_50mm       ~= 0.390
stowed DR_50mm     ~= 0.130
flags              = stow_adjustment_placeholder
```

### 4. Single-axis tracker, stow state unknown

Use when stow was possible but actual event state is uncertain.

```yaml
mesh_diameter_mm: 50
module_archetype: default_3_2mm_glass_backsheet
mounting_type: single_axis_tracker
stow_state: unknown_probabilistic
stow_success_probability: 0.60
array_exposure_fraction: 1.00
```

Result with current placeholder adjustment:

```text
DR_50mm ~= 0.60 * stowed_DR + 0.40 * unstowed_DR
        ~= 0.234
flags   = stow_unknown, stow_adjustment_placeholder
```

Important: `stow_success_probability` is an event-time state probability. It is not hail frequency.

### 5. Hail-hardened module

Use when module specs or a hail test rating justify the hardened archetype.

```yaml
mesh_diameter_mm: 50
module_archetype: hail_hardened_thicker_glass
mounting_type: single_axis_tracker
stow_state: unstowed
hail_test_rating: enhanced_hail_50mm
array_exposure_fraction: 1.00
```

Result:

```text
curve_id = HAIL_SOLAR_HARDENED_THICKER
DR_50mm  ~= 0.129
```

### 6. Partial hail swath / exposure overlay

Use when the curve DR applies only to the portion of the array hit by damaging hail.

```yaml
mesh_diameter_mm: 50
module_archetype: default_3_2mm_glass_backsheet
mounting_type: single_axis_tracker
stow_state: unstowed
array_exposure_fraction: 0.72
exposure_basis: footprint_overlay
value_profile_id: HAIL_HAZARD_REFERENCE_ADAPTER_V1
denominator: installed_capex
value_bucket: PV_ARRAY_MODULE_EXPOSED
```

Interpretation:

```text
base failure-unit DR ~= 0.390
array exposure       = 72% of array value touched
value profile        = module hardware + named support-cost allocation
```

The curve gives the physical failure-unit DR. The consumer/value layer converts that into dollars or TIV loss.

## Version Meaning

```text
portable package baseline v2.5
  = latest assembled library/package delivery
  = not the repository-current cell pin

semantic damage-model version model v1.0
  = damage behavior version

documentation revision docs r7
  = proof trail / contract / wrapper revision
```

Practical rule:

```text
package version changed != curve behavior changed
model version changed   = damage-code behavior changed
docs revision changed   = docs/provenance/contract changed
```

## Hazard Integration Rule

Hazard should consume the curve, not copy and maintain a second curve library.

```text
Hazard M2/M3 input
  mesh_diameter_mm
  module_archetype or module specs
  stow state / stow probability if available
  exposure fraction if available
  |
  v
load pinned hail_solar JSON artifact
  |
  v
validate bundle v2 + SHA and run known-answer tests
  |
  v
evaluate failure-unit damage ratio
  |
  v
select explicit value profile or site basis; return DR/loss + flags
  |
  v
Hazard computes EAL/PML/VaR/TVaR from its annual loss distribution
```

The annual metrics may be frequency-driven even though the curve carries no intrinsic vulnerability spread.
Hazard must attach `CURVE_INTRINSIC_SPREAD_NOT_CARRIED` and may not claim vulnerability uncertainty was sampled.

Do not create `src/` just to answer this request. The current stable contract is the JSON artifact. `src/`
waits until artifact publishing, version pinning, cloud/storage layout, and Hazard loading are designed.

## Canonical Files

- Cell entrypoint: [`../../cells/hail_solar/README.md`](../../cells/hail_solar/README.md)
- Runtime artifact: [`../../cells/hail_solar/current/hail_solar__model_v1_0__docs_r7__curve_artifact.json`](../../cells/hail_solar/current/hail_solar__model_v1_0__docs_r7__curve_artifact.json)
- Known-answer tests: [`../../cells/hail_solar/current/known_answer_tests_hail_solar__model_v1_0__docs_r7.json`](../../cells/hail_solar/current/known_answer_tests_hail_solar__model_v1_0__docs_r7.json)
- Cell changelog: [`../../cells/hail_solar/CHANGELOG.json`](../../cells/hail_solar/CHANGELOG.json)
- Metadata spec: [`../../cells/hail_solar/current/damage_code_metadata_spec_hail_solar_v1_3.md`](../../cells/hail_solar/current/damage_code_metadata_spec_hail_solar_v1_3.md)
- Artifact index: [`../../contracts/machine_readable_artifact_index.json`](../../contracts/machine_readable_artifact_index.json)
- Handoff note: [`../../contracts/hazard_handoff/hail_solar_m3_canonicalization.md`](../../contracts/hazard_handoff/hail_solar_m3_canonicalization.md)
- Consumer contract v2: [`../../contracts/hazard_handoff/hail_solar_consumer_contract_v2.md`](../../contracts/hazard_handoff/hail_solar_consumer_contract_v2.md)
- Version registry: [`../../cells/VERSION_REGISTRY.md`](../../cells/VERSION_REGISTRY.md)
