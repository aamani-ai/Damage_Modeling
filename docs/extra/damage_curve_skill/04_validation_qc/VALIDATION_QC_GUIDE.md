# Validation/QC guide

Minimum checks before release:

## Structural checks

```text
[ ] required files exist;
[ ] JSON artifacts parse;
[ ] governed CSV registers are rectangular: every row has exactly the header column count, with no missing or extra fields;
[ ] schemas/required fields present;
[ ] metadata, JSON, site adapter, and known-answer tests use one canonical input-field contract; aliases and documentation groups are explicit;
[ ] multi-pathway artifacts declare unique pathway IDs and pathway-specific axes/bridges;
[ ] every curve record, failure-unit output fixture, capability row, and KAT resolves to one declared pathway ID;
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
[ ] derivation rationale explains source choices;
[ ] seven-step audit records an outcome and blocker for every step;
[ ] source IDs and claim-level source IDs resolve to the source register;
[ ] exact locators and permitted/prohibited inference are present;
[ ] legacy numerical claims reproduce or are explicitly rejected;
[ ] site adapter includes missing/default rules and a double-counting matrix;
[ ] row-level value crosswalk reconciles direct/support/excluded value;
[ ] pathway-filtered evidence and parameter decisions resolve independently for every supported pair;
[ ] neighboring and compound pathways have an explicit ownership/double-count boundary.
```

## Runtime checks

```text
[ ] known-answer values pass;
[ ] edge cases outside valid range warn/clamp as expected;
[ ] default metadata creates flags;
[ ] capability declaration gates metrics;
[ ] cap-binding policy is fail-closed where required;
[ ] no-curve scaffold returns NO_RUNTIME_CURVE with no numeric DR/loss;
[ ] embedded and standalone capability declarations match;
[ ] rejected or withdrawn numbers are absent from runtime-shaped artifacts;
[ ] missing/unknown pathway_id fails closed without a default;
[ ] unsupported pathway × failure-unit pairs return no numeric fallback;
[ ] pathway-specific KATs and cross-pathway negative tests pass;
[ ] consumer fixture verifies the exact cell-model/docs/schema/SHA pin.
```

## Numerical pressure-test checks

```text
[ ] proposed equations match displayed tables/charts;
[ ] zero-input, boundary, inverse conversion, and asymptotic behavior checked;
[ ] source endpoint matches the modeled failure/replacement endpoint;
[ ] dollar stress tests name the denominator and remain labeled audit-only when synthetic;
[ ] support/logistics are not independently damaged and scaled again;
[ ] uncertainty bands have a calibration/elicitation basis or are rejected;
[ ] identical intensity values on different pathways do not imply identical demand, records, or output;
[ ] a legacy boolean/shift maps only when semantics are exact; otherwise it is audit-only.
```

## Release checks

```text
[ ] old-vs-new comparison for behavior changes;
[ ] no model bump for docs-only changes;
[ ] release notes include explicit non-changes;
[ ] consumer migration, dual-read/cutover, and rollback rules are tested before canonical promotion;
[ ] hurricane/tropical-cyclone scope is explicitly delivered or explicitly excluded;
[ ] zip integrity test passes.
```
