# Known-answer tests

Every runtime curve artifact should have known-answer tests. A scaffold with no runtime curve needs withholding known-answer tests instead of synthetic curve values.

## Test record

```yaml
test_id:
cell_id:
curve_id:
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

## No-curve scaffold tests

When `curve_records: []`, test the contract rather than inventing ordinates:

```yaml
test_id:
cell_id:
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
