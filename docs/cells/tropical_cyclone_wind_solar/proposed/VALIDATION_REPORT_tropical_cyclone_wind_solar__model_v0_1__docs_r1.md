# Validation report — tropical_cyclone_wind_solar model v0.1/docs r1

## Result

```yaml
status: PASS
cell_id: tropical_cyclone_wind_solar
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
canonical_runtime_artifact: false
curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
consumer_cutover: none
```

Passing means the proposed zero-curve package is structurally coherent, source-resolved, fail-closed, and
reviewable. It does **not** mean that a tropical-cyclone wind × solar damage curve has been calibrated.

## Package validator

Command:

```bash
python3 scripts/reference_helpers/validate_tropical_cyclone_wind_solar_v0_1_scaffold.py
```

Result:

```text
PASS tropical_cyclone_wind_solar model v0.1/docs r1 scaffold
checks=868
counts=sources:19,claims:30,parameters:47,value_rows:18,
       failure_units:10,kats:16,workbook_sheets:12,local_links:51
```

## Exact artifact pins

| Artifact | SHA-256 |
|---|---|
| Curve bundle | `2b3753e8bdcef3e3c91c8afb7ca12d67b15cd236873e97c908d6ccccb4748ae1` |
| Capability | `c8bafb3cde61f85f22c7f3b7a10e7ac4bdcb6787f6a7c45d2be7662130e34a60` |
| Known-answer tests | `ed59cf93fa0403e9a852c820fc5f3f9c7e7217aeb3aa76d02fecf53e5a605e14` |
| Audit workbook | `54e126234cf41da494dec77a6a9458b0d1ffa69ecf43cf413803eebb5c20b1bb` |

These hashes identify the proposed research package only. They are not consumer runtime pins.

## Invariants checked

### Lifecycle and schema envelope

- `cell_id`, damage-code ID, model/docs labels, lifecycle, and proposed state are exact;
- `canonical_runtime_artifact=false` and `curve_records=[]`;
- v1 bundle schema subset validation passes;
- the v1 schema is explicitly limited to a noncanonical zero-curve envelope because repository-current v2/v3
  schemas require at least one record;
- runtime publication through this exception is prohibited; and
- the cell is absent from the canonical machine-readable artifact index.

### Capability and KAT behavior

- embedded and standalone capability declarations are identical;
- all six dependent metrics are withheld and include `NO_RUNTIME_CURVE`;
- spread and populated emit modes remain empty;
- 16 KATs contain no numeric DR/loss expected output;
- valid fixed-tilt and tracker requests still withhold;
- identity/pathway/category/source-axis/architecture/state/exposure/compound-route rejections are stable;
- no strong-wind fallback exists; and
- the GSU remains withheld rather than zero.

### Evidence and provenance

- 19 source records, 30 claims, and 47 parameter/rule rows are rectangular and uniquely keyed;
- every claim/parameter source ID resolves;
- exact locators, permitted inference, prohibited inference, and tier values are populated;
- Ceferino is isolated as a source-native site extensive-failure probability candidate;
- Perry and St Croix remain field/mechanism constraints;
- the median-parameter diagnostic is not called the posterior-mean curve;
- legacy memo and Hazard placeholder commits/blobs/numbers are retained only in rejection/regression audit;
  and
- no numerical candidate is serialized in runtime-shaped records.

### Failure units, GSU, value, and exposure

- all ten governed unit IDs are present exactly once;
- fixed and tracker candidate units remain separate;
- `PV_POWER_CONVERSION_AND_COLLECTION` and `PV_GSU_SUBSTATION` are separate withheld units;
- GSU exposure grain is `shared_point_or_yard_polygon` and no array exposure default is allowed;
- all 18 core Q1-2025 rows and exact source values are preserved;
- direct `656.9814571503722`, physical `877.7957023626668`, installed `1120`, and module + mounting
  `401.2045774673221` reconcile within `1e-12`; and
- reference value, support, and whole-site exposure cannot create loss while the curve array is empty.

### Candidate and legacy math

- the Ceferino median-parameter diagnostic is bounded, monotone, and equals 0.5 at 90 m/s;
- its 73–116 m/s fixtures span below 0.1 to above 0.9 without being treated as the paper's integrated
  posterior mean;
- rejected anchored legacy logistics reproduce the pinned 90, 180, and 300 mph headline fixture outputs;
- the mid-tilt sensitivity remains above the stow case at the tested event; and
- the hardcoded legacy TIV weights reconcile to one while remaining prohibited for runtime.

### Workbook and links

- XLSX ZIP integrity passes and the exact 12-sheet order matches the manifest;
- all 13 formula-driven QA assertions display `PASS`;
- formula error scan found no `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A`;
- candidate and legacy formulas reference visible input fixtures;
- all 12 sheets rendered successfully and were visually inspected for clipping, overlap, headers, and blank
  formula outputs; and
- 51 cell/package/index/handoff local links resolve.

## Repository regressions

| Validator | Result |
|---|---|
| repository-current runtime contracts | PASS — 5 canonical artifacts |
| `flood_wind` model v0.1 scaffold | PASS — 701 checks / 87 links |
| `tropical_cyclone_wind_wind` model v0.1 scaffold | PASS — 705 checks / 58 links |
| `strong_wind_solar` model v2 proposal | PASS |
| `wind_tornado_wind` model v2 proposal | PASS — 14,902 semantic assertions |

The tropical-cyclone wind × wind documentation repair changed no artifact/capability/KAT/workbook hash.

## Release decision

```yaml
model_v0_1_scaffold: accepted_for_repository_research_coverage
runtime_curve: withhold
artifact_index_entry: none
package_release: none
Hazard_pin_change: none
next_promotion_event: separately_classified_model_v1_0_behavior_change
```

The package is ready to serve as the governed coverage boundary and evidence-acquisition roadmap. It is not
ready to calculate damage or loss.
