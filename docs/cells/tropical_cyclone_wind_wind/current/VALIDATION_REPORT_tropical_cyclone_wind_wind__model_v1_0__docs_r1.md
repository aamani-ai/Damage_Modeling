# Validation report — tropical-cyclone wind × wind model v1.0/docs r1 release

Validation date: 2026-08-09
Result: **PASS — canonical source-native partial-screening release**

## Release checks

```text
model-v0.1 scaffold validator: PASS, 763 checks
preserved proposal scientific validator: PASS, 5,764 checks
formula known-answer tests: 24
contract known-answer tests: 23
Hazard common-loader KAT replay: PASS, 47/47
Hazard common-loader suites: PASS, 15 passed / 1 skipped
bundle/capability schema validation: PASS
embedded/standalone capability equality: PASS
publisher planning and current-release gates: PASS, 6 passed
```

The evaluator reproduces all three midpoint identities and the source-native zero/core/gap/high-domain
behavior. It rejects missing or unsupported turbine selectors, the wrong source assumption set, Saffir-
Simpson category, NHC one-minute wind, hub-height wind, alternate units, and neighboring pathways. Unknown
control state is flagged without credit; a known inconsistent state withholds.

All unsupported wind-farm units return null with reason codes. The common scenario-loss helper reads the
capability declaration and refuses value binding with `SOURCE_DENOMINATOR_CROSSWALK_NOT_APPROVED`. No full-
TIV, annual, or tail path is opened.

## Preserved research baseline

The proposed model-v1 bytes and model-v0.1 scaffold remain unchanged under `../proposed/`. The current artifact
changes only release metadata, canonical paths, capability status, and the release KAT status; its curve
parameters and numerical behavior match the validated proposal.

## Remaining limitations

- The Jaimes curves are analytical/source-derived and not field- or claims-calibrated.
- The source value denominator remains ambiguous and is not approved for dollars.
- The exact source archetypes do not cover the Amazon Gamesa G114-2.0 MW example or a generic modern fleet.
- Non-tower turbine modes and all BOP/facility units remain unsupported.
- Intrinsic spread and annual/tail outputs remain withheld.
