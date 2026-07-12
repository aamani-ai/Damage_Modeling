# Known-answer tests

Every runtime curve artifact should have known-answer tests. A scaffold with no runtime curve needs withholding known-answer tests instead of synthetic curve values.

## Test record

```yaml
test_id:
cell_id:
curve_id:
pathway_id:
input:
expected_output:
tolerance:
source:
notes:
```

## Good tests

```text
- one low/no-damage point;
- one threshold/transition point;
- one high/saturation point;
- one default-selector case;
- one out-of-range warning/clamp case if applicable.
```

## Behavior-changing releases

For model updates, add old-vs-new known-answer comparisons so reviewers can see the effect of the change.

## Multi-pathway tests

Every released pathway needs an independent KAT set. Do not validate a multi-pathway cell with one global set or a boolean shift test.

Minimum per pathway:

```text
- low/no-damage point for each supported failure-unit family;
- transition point tied to that pathway's axis and evidence;
- high/saturation or upper-valid-range point;
- unit/height/duration/datum bridge fixture;
- selector/conditioner default flag where applicable;
- unsupported pathway × failure-unit withholding case;
- out-of-range behavior.
```

Minimum cross-pathway negative tests:

```text
- missing pathway_id is rejected/withheld, not defaulted;
- unknown pathway_id is rejected/withheld;
- straight-line inputs cannot select a tornado record and vice versa;
- equal numeric intensity does not collapse physically different pathways;
- an unsupported pair returns no numeric DR and NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT;
- a neighboring hurricane/tropical-cyclone identifier is not accepted as an alias;
- every emitted failure-unit result repeats the requested pathway_id and exact curve record;
- consumer fixture verifies model/docs/schema/SHA pin and fails on a stale or mismatched pin.
```

For behavior-changing multi-pathway releases, publish old-versus-new rows at the same declared physical scenario. If the legacy boolean/branch cannot map exactly to a pathway, label the prior output `unmappable_legacy_semantics`; do not invent equivalence.

## No-curve scaffold tests

When `curve_records: []`, test the contract rather than inventing ordinates:

```yaml
test_id:
cell_id:
pathway_id: <pathway_id when declared>
failure_unit_id: <failure_unit_id when declared>
input: <valid source-native hazard and metadata shape>
expected_numeric_dr: null
expected_numeric_loss: null
expected_status: withheld
expected_reason: NO_RUNTIME_CURVE
```

Also assert:

```text
- no numeric DR, scenario loss, EAL, PML, VaR, or TVaR appears;
- embedded and standalone capability declarations are identical;
- rejected/withdrawn arrays are absent from runtime-shaped curve records;
- unknown load-bearing site state withholds rather than defaulting to full exposure;
- unknown mitigation gives no credit;
- structural field/axis validation can pass without enabling damage output.
- every test input uses canonical field names from the metadata/artifact contract; aliases and documentation-only field-group labels are rejected unless an explicit migration test covers them.
```

Withholding tests are scientific guardrails, not calibration evidence.
