# Legacy evidence ingestion — wildfire_solar research scaffold

## Intake record

```yaml
intake_id: WS-INTAKE-001
cell_id: wildfire_solar
operating_mode: inside_repo
change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE within NEW_CELL_SCAFFOLD
source_id: LEGACY_DIVI_WILDFIRE_SOLAR_2026
source_repository: Divi-patel/infrasure-damage-curves
source_path: research/WILDFIRE_x_SOLAR.md
source_commit_sha: 12653b2c3d5a013c9524228243ea666c35bb3814
source_blob_sha: 64142f9873256fc6b09deb497af795b310a47985
source_immutable_url: https://github.com/Divi-patel/infrasure-damage-curves/blob/12653b2c3d5a013c9524228243ea666c35bb3814/research/WILDFIRE_x_SOLAR.md
source_version_label: v1.0 / March 2026
reviewed_on: 2026-07-09
runtime_output_change: false
model_version_change: false
package_release_change: false
```

The legacy document is preserved as source-discovery and hypothesis input. It is not an authority for curve calibration. Every numerical converter, threshold aggregation, weight, curve, modifier, event anchor, and uncertainty statement was re-tested against its cited endpoint and the current failure-unit/value architecture.

## Governed disposition

| Legacy material | Source role | Decision | Reason |
|---|---|---|---|
| Physical damage vs smoke/soiling vs PSPS split | scope | retain concept | These are different loss pathways and denominators. This cell keeps only exogenous physical burnover. |
| Radiation, convection, direct flame and ember mechanisms | mechanism | retain ontology | They define required exposure channels; the legacy heat-transfer percentages are unsupported and rejected. |
| Fireline intensity/flame length as landscape fire-behavior variables | hazard context | retain conditionally | Use only source-native FSim classes/probabilities in Gen-1. They are not component demand. |
| `q = 0.35 × I / d`, `C = 0.35`, and canonical `d = 10 m` | axis bridge | reject | No exact calibrated locator or applicability domain; omits flame geometry, radiative fraction, view factor, convection, contact, wind, shielding and duration. |
| PV, cable and material laboratory references | component mechanism | re-source individually | Only exact specimen/exposure/endpoint observations survive. |
| Component onset/50%/failure tables | fragility | reject | Material properties and ignition observations were converted into invented population/economic endpoints. |
| Component/BOM/subsystem weights | value aggregation | reject | Material fractions are not independent replacement units or economic loss shares; most source cells lack exact lineage. |
| Six logistic curves and master DR tables | curve calibration | reject | No target observations, fit objective or replacement rule; equations also contradict the displayed tables. |
| Vegetation, burial, enclosures, barriers and access | site-condition hypotheses | retain qualitatively | They become measured selector/conditioner/exposure fields; they receive no generic percentage credit. |
| Camp Fire, utility liability, residential insured loss and hypothetical solar events | calibration | reject | None pairs utility-scale solar component damage/economic loss with local exposure. |
| ±35–60% midpoint bands, ±15–25% caps, factor-of-two and “order-of-magnitude reliable” claims | uncertainty | reject | No sample, elicitation protocol, distribution, coverage target or calibration supports them. |
| Event tracking, forensics, lab testing and structured elicitation | research agenda | retain and strengthen | These are appropriate routes to the missing calibration objects. |

## Reproducible numerical audit

### Legacy logistic equations contradict their master table

The document defines `DR(I) = L / (1 + exp(-k × (I - x0)))`. Re-evaluation gives:

| Legacy subsystem | `L` | `k` | `x0` | Formula DR at `I=0` | Formula DR at `I=200` | Legacy table at `I=200` |
|---|---:|---:|---:|---:|---:|---:|
| PV module | 0.95 | 0.00130 | 2,100 | 5.82% | 7.41% | 2% |
| mounting | 0.80 | 0.00060 | 3,600 | 8.27% | 9.21% | 1% |
| inverter | 0.95 | 0.00210 | 1,300 | 5.82% | 8.58% | 1% |
| substation | 0.95 | 0.00140 | 1,900 | 6.21% | 8.05% | 1% |
| electrical | 0.65 | 0.00080 | 2,500 | 7.75% | 8.91% | 1% |
| civil | 0.75 | 0.00090 | 2,100 | 9.84% | 11.49% | 4% |

The curves therefore create material damage at zero intensity and materially exceed their own low-intensity table. This is an implementation/QA failure in addition to the calibration failure.

### Legacy flame-length inverse table contradicts its displayed equation

The document prints `F_H = 0.0775 × I^0.46`. Inverting that exact equation yields:

| Flame length | Recalculated `I` (kW/m) | Legacy table `I` (kW/m) |
|---:|---:|---:|
| 1.2 m | 386 | 130 |
| 2.4 m | 1,742 | 450 |
| 3.4 m | 3,715 | 880 |
| 4.6 m | 7,167 | 1,500 |
| 7.6 m | 21,349 | 3,500 |
| 15.0 m | 93,601 | 10,000 |

This table is unusable even before considering that flame length, FLI and local equipment exposure are different quantities. The proposed cell consequently uses exact source-native FIL bins only and prohibits continuous midpoint reconstruction.

### Legacy FLI-to-flux bridge lacks a calibration basis

The legacy formula produces `70 kW/m²` for `I=2,000 kW/m` at 10 m and labels a generic comparison table “observed.” No observation identifiers, flame geometry, sensor orientation, duration or exact equation locator are supplied. Cohen's USDA synthesis reports that a severe homogeneous black-body calculation produced `70 kW/m²` at 10 m while the experimental maximum total incident heat flux was `46 kW/m²`; the simple severe model overestimated measured transfer. That result is residential/wildland transfer evidence, not a replacement converter, but it directly defeats the claim that one universal coefficient is already validated.

## Source corrections

| Legacy citation/use | Correction | Governed use |
|---|---|---|
| “Wang et al. 2015” for DOI `10.3390/ma8074210` | The article is Yang et al. (2015). | Retain exact small-specimen ignition observations only. |
| “Xiaoyu et al. 2025,” DOI/article `113140` | The linked PII corresponds to Yue Wang et al., *single-glass and double-glazed photovoltaic modules*, DOI `10.1016/j.solmat.2025.113528`. | Source lead only unless the full experiment and endpoint are mapped. It is not an independent confirmation of every legacy threshold. |
| “Sullivan 2003” at `WF02069` as line-source validation | No exact locator is supplied for `C=0.35`; the cited review identity is inconsistent with the claim. | Reject converter; retain only general fire-model context if independently sourced. |
| Butler & Cohen (1998) as measured universal validation | The paper is a theoretical radiation/view-factor safety-zone model. | Supports geometry/view-factor dependence only. |
| IEC 60332 as cable critical-heat-flux evidence | IEC flame-propagation testing is not a generic external-radiation fragility curve. | Do not infer `q` thresholds or installed-cable DR. |
| IP54/IP65 as fire buffering | IP codes address ingress, not a time-rated fire enclosure. | Capture an independently documented fire/enclosure rating or give no credit. |
| Transformer-oil flash point as transformer damage state | Fluid property does not determine tank heating, rupture, ignition or equipment replacement. | Capture fluid/BOM as a selector; no curve. |
| Camp/Thomas hypothetical solar losses | Explicitly unconfirmed in the legacy file. | Never use as validation or calibration. |

## Material retained from the source-discovery pass

The pass materially improved the research scaffold in four ways without adopting a curve:

1. it confirmed the need to split physical burnover, smoke/ash production effects and PSPS;
2. it expanded the candidate failure-unit and site-condition inventory;
3. it identified exact primary studies that can constrain future flux/time models;
4. it supplied a concrete list of field, laboratory and elicitation data still required.

The row-level decisions and exact URLs are in:

- `SOURCE_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv`;
- `CLAIM_PARAMETER_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv`;
- `PARAMETER_TIER_TABLE_wildfire_solar__model_v0_1__docs_r1.csv`.

## Impact assessment

```yaml
same_inputs_same_outputs: true
curve_records_before: 0
curve_records_after: 0
failure_unit_DR: withheld
scenario_loss: withheld
scalar_EAL: withheld
PML_VaR_TVaR: withheld
cell_model_version: model v0.1 unchanged
documentation_revision: docs r1 unchanged
promotion_status: proposed
review_status: pressure_tested
documentation_status: working_revision
revision_note: evidence integrated before first released/canonical documentation checkpoint
schema_version: unchanged
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
```

## Promotion evidence still required

- a validated landscape-FIL/event-fire-behavior to component-zone radiant/convective/contact/duration bridge;
- a separately governed firebrand/ember attack pathway if it will emit damage;
- representative module, installed-cable, enclosure, inverter, transformer, control and racking response data with exact BOM and duration;
- post-exposure electrical/EL/structural inspection criteria tied to repair or replacement decisions;
- component-zone inventory and exposed/protected value allocation;
- field or claims events including unaffected units, local exposure reconstruction and invoices;
- a documented uncertainty model or structured expert elicitation protocol.

Until those gates pass, numerical curves remain withheld rather than softened.
