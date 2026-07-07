# Guide: Give Me A Solar Hail Curve

Use this guide when someone asks for "the solar hail curve", "hail damage curve for solar", or the curve
Hazard M3 should use for hail x solar.

## Short Answer

The current solar hail curve is the `hail_solar` cell's canonical runtime artifact:

```text
docs/cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json
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
docs revision:  docs r5
```

## Where The Current Curve Is Stored

```text
docs/cells/hail_solar/
  README.md
  current/
    hail_solar__model_v1_0__docs_r5__curve_artifact.json   # runtime contract
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
  docs/cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json
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

## Version Meaning

```text
package release v2.5
  = library/package delivery label

semantic damage-model version model v1.0
  = damage behavior version

documentation revision docs r5
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
evaluate failure-unit damage ratio
  |
  v
return DR + flags
  |
  v
Hazard computes EAL/PML/portfolio metrics
```

Do not create `src/` just to answer this request. The current stable contract is the JSON artifact. `src/`
waits until artifact publishing, version pinning, cloud/storage layout, and Hazard loading are designed.

## Canonical Files

- Cell entrypoint: [`../../cells/hail_solar/README.md`](../../cells/hail_solar/README.md)
- Runtime artifact: [`../../cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json`](../../cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json)
- Metadata spec: [`../../cells/hail_solar/current/damage_code_metadata_spec_hail_solar_v1_3.md`](../../cells/hail_solar/current/damage_code_metadata_spec_hail_solar_v1_3.md)
- Artifact index: [`../../contracts/machine_readable_artifact_index.json`](../../contracts/machine_readable_artifact_index.json)
- Handoff note: [`../../contracts/hazard_handoff/hail_solar_m3_canonicalization.md`](../../contracts/hazard_handoff/hail_solar_m3_canonicalization.md)
- Version registry: [`../../cells/VERSION_REGISTRY.md`](../../cells/VERSION_REGISTRY.md)
