# Validation report — flood_wind current model v1.0 / docs r1

**Release status: PASS for canonical partial-screening use.**

Validated surfaces:

- bundle-v3 and embedded capability-v3 schema validation;
- exact current-path references and canonical release flags;
- 15 formula KATs, 6 withheld-state KATs, and 16 fail-closed input/error tests;
- exact FEMA knot transcription and in-range linear interpolation;
- no clamp above 10 ft, no negative depth, no non-freshwater fallback;
- common publisher planning and shared Hazard bundle-v3 load/KAT execution;
- explicit same-substation value/exposure requirement and assembly/component double-count guard.

The pass does not upgrade the model beyond its declared legacy-source screening grade or make annual/portfolio
metrics complete. The release decision records the accepted evidence limitations.
