# Validation/QC guide

Minimum checks before release:

## Structural checks

```text
[ ] required files exist;
[ ] JSON artifacts parse;
[ ] schemas/required fields present;
[ ] exactly one canonical runtime artifact per released cell;
[ ] deprecated artifacts are blocked or marked non-canonical.
```

## Semantic checks

```text
[ ] failure-unit grain is right;
[ ] x-axis and units are consistent with M2;
[ ] value basis is explicit;
[ ] selectors/conditioners/exposures are not mixed;
[ ] parameter tier table covers load-bearing parameters;
[ ] derivation rationale explains source choices.
```

## Runtime checks

```text
[ ] known-answer values pass;
[ ] edge cases outside valid range warn/clamp as expected;
[ ] default metadata creates flags;
[ ] capability declaration gates metrics;
[ ] cap-binding policy is fail-closed where required.
```

## Release checks

```text
[ ] old-vs-new comparison for behavior changes;
[ ] no model bump for docs-only changes;
[ ] release notes include explicit non-changes;
[ ] zip integrity test passes.
```
