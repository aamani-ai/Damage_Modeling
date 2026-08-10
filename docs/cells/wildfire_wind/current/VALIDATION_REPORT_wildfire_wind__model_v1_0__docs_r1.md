# Validation report — wildfire_wind current model v1.0 / docs r1

**Release status: PASS for canonical partial-screening use.**

Validated surfaces:

- bundle-v3 and embedded capability-v3 schema validation;
- exact current-path references and canonical release flags;
- 14 formula KATs and 6 negative/fail-closed contract tests;
- exact integer FSim states 0–6, bounded monotone DR, and no interpolation fallback;
- exact source-product and Tier-4 assumption-set acknowledgement;
- explicit null/reason codes for all withheld failure units;
- common publisher planning and shared Hazard bundle-v3 load/KAT execution;
- explicit same-unit value/exposure requirement and shared-GSU double-count guard.

The pass verifies implementation and honest labeling. It does not convert the Tier-4 ordinates into empirical
calibration, infer local equipment heat flux, or make annual/portfolio metrics complete.
