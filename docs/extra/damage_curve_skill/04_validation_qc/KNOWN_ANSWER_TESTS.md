# Known-answer tests

Every runtime curve artifact should have at least one known-answer test.

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
