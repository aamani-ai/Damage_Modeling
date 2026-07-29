# Tropical-cyclone wind × solar — model reference

## Version and artifact

```yaml
cell_id: tropical_cyclone_wind_solar
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PROPOSED_V0_1
pathway_id: tropical_cyclone_wind
semantic_model_version: model v0.1
documentation_revision: docs r1
schema_envelope: damage_curve_record_bundle.v1
lifecycle_state: scaffold
canonical_runtime_artifact: false
curve_record_count: 0
artifact_sha256: 2b3753e8bdcef3e3c91c8afb7ca12d67b15cd236873e97c908d6ccccb4748ae1
runtime_reason: NO_RUNTIME_CURVE
```

The v1 bundle schema is used only as a noncanonical zero-curve envelope because repository-current v2/v3
schemas require at least one curve record. It is not a runtime publication exception.

## Failure units

| ID | Coverage role | Natural subject | v0.1 output |
|---|---|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | primary candidate | module/row/block | withheld |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | primary candidate | row/block | withheld |
| `PV_TRACKER_MODULE_FIELD` | exact-system primary candidate | module/row/block | withheld |
| `PV_TRACKER_SBOS_ASSEMBLY` | exact-system primary candidate | row/block | withheld |
| `PV_FOUNDATION` | separate physical candidate | row/point/zone after split | withheld, not zero |
| `PV_POWER_CONVERSION_AND_COLLECTION` | split-required candidate | point + line/network | withheld, not zero |
| `PV_GSU_SUBSTATION` | shared-component binding | shared point/yard polygon | withheld, not zero |
| `PV_SCADA_COMMUNICATIONS` | split-required candidate | point/network | withheld, not zero |
| `PV_CIVIL_INFRA` | split-required candidate | line/network/polygon/point | withheld, not zero |
| `PV_REPLACEMENT_SUPPORT` | allocate-once support | repair scope | no intrinsic DR |

## Intended ordinate

```text
DR_u(x,s) = E[direct repair-or-replacement cost of failure unit u
              / pre-event direct replacement value of failure unit u
              | delivered local TC-wind demand x and verified state s]
```

The ordinate is defined but withheld. No current formula evaluates it.

## Candidate source equation — audit only

Ceferino ground-mounted extensive site failure:

```text
q(w; v, beta) = Phi((ln(w) - ln(v)) / beta)
```

Source-native posterior summaries: `v ≈ 90 m/s`, `beta ≈ 0.15`; the source reports a posterior-mean 10–90%
transition near `73–116 m/s`. A deterministic median-parameter diagnostic is not the paper's posterior-mean
curve. All values remain audit-only and are absent from runtime records and KAT expected outputs.

## Required identity and source fields

```yaml
required_identity:
  - event_id
  - event_family_id
  - pathway_id  # exact tropical_cyclone_wind
required_source_wind_for_research_state:
  - source_wind_speed_mps
  - source_wind_height_m
  - source_wind_averaging_period_s
  - source_wind_exposure_standard
  - source_wind_product_id
  - source_wind_valid_time
```

`saffir_simpson_category` is context only. It cannot replace the fully referenced numerical source object.

## Architecture-specific candidate demand

| Architecture | Research candidate | Mandatory qualification |
|---|---|---|
| Fixed tilt | local event net pressure / qualified design net-pressure capacity | same sign/load case, geometry, zone, coefficient, height, terrain, gust/duration, edition, capacity meaning, uncertainty, validity |
| Tracker | tracker-normal local wind / exact-system Ucrit plus history/state | exact system, layout/row, angle, drive/lock, stiffness/damping, direction, turbulence/profile, speed basis, duration/cycling, qualification, uncertainty, validity |

Neither axis is frozen. No cross-architecture or strong-wind fallback exists.

## Reference value ledger

| Bucket | 2024 USD/kWdc | Runtime role |
|---|---:|---|
| Module | 291.21485143992487 | reference only |
| Mounting | 109.98972602739727 | reference only |
| Foundation | 31.12448715327472 | withheld |
| Power conversion + collection | 116.83772835067089 | withheld |
| Mixed MV/substation | 106.50466417910448 | withheld; site split required |
| SCADA | 1.31 | withheld |
| Direct hardware | 656.9814571503722 | reconciliation only |
| Civil | 31.223744292237445 | withheld |
| Replacement support | 189.59050092005714 | allocate once; rule open |
| Physical | 877.7957023626668 | reconciliation only |
| Excluded | 242.20429763733296 | outside physical denominator |
| Installed | 1120.0 | reporting reference only |

## Output and capability

```yaml
failure_unit_scalar_dr:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE]
scenario_loss_given_value_basis:
  value: null
  status: withheld
  reason_codes_include: [NO_RUNTIME_CURVE]
scalar_eal_pml_var_tvar:
  value: null
  status: withheld
```

Standalone capability SHA-256:
`c8bafb3cde61f85f22c7f3b7a10e7ac4bdcb6787f6a7c45d2be7662130e34a60`.

Known-answer fixture SHA-256:
`ed59cf93fa0403e9a852c820fc5f3f9c7e7217aeb3aa76d02fecf53e5a605e14`.

## Stable rejection behavior

- `EVENT_ID_REQUIRED`
- `EVENT_FAMILY_ID_REQUIRED`
- `PATHWAY_ID_REQUIRED`
- `UNSUPPORTED_PATHWAY_ID`
- `CATEGORY_NOT_DAMAGE_AXIS`
- `SOURCE_WIND_METADATA_INCOMPLETE`
- `SOURCE_AXIS_MISMATCH`
- `ARRAY_ARCHITECTURE_REQUIRED`
- `UNSUPPORTED_ARRAY_ARCHITECTURE`
- `WHOLE_PLANT_EXPOSURE_DEFAULT_PROHIBITED`
- `COMPOUND_ROUTE_SEPARATE`

## Authoritative files

- [Curve artifact](../proposed/tropical_cyclone_wind_solar__model_v0_1__docs_r1__curve_artifact.json)
- [Capability](../proposed/tropical_cyclone_wind_solar__model_v0_1__docs_r1__capability.json)
- [Known-answer tests](../proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v0_1__docs_r1.json)
- [Metadata contract](../proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v0_1__docs_r1.md)
- [Derivation dossier](../proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v0_1__docs_r1.md)
- [Validation report](../proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
