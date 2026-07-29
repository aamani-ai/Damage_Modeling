# Tropical-cyclone wind x solar completion - decisions

## TCSS-D01 - Retain the exact Perry screen

**Decision:** retain model v1.0/docs-r1 numerical behavior as a noncanonical exact-source screening atom.

**Reason:** the fit and evaluator remain reproducible and fail closed within their declared boundary. The
review found no computational defect, but it also found repeated physical sites, equal-record rather than
unique-site weighting, and no validated predictive relationship. Retention is for descriptive/experimental
research, not predictive approval.

## TCSS-D02 - Advance evidence documentation only

**Decision:** classify the current pass as `EVIDENCE_ONLY_NO_OUTPUT_CHANGE` and advance human/evidence
documentation to docs r2.

**Reason:** new evidence improves provenance, physical coverage, and acquisition design but supplies no
adopted numerical response or economic parameter.

## TCSS-D03 - No Hazard gust bridge

**Decision:** prohibit identity or fixed-factor mapping from Hazard's modeled 3-second gust to the Perry
dataset-reported event maximum gust.

**Reason:** the study-level Visual Crossing provider is known, but row-level product, query, contributing
stations, duration, reference frame, and uncertainty lineage are not.

## TCSS-D04 - Fixed and tracker routes remain separate

**Decision:** do not reuse the fixed/nontracking Perry response for trackers and do not grant a generic stow
credit.

**Reason:** attained state, drive/lock, control power, geometry, cycling, and architecture materially affect
demand. The current evidence does not observe those fields with response and economics.

## TCSS-D05 - Preserve the tail withhold

**Decision:** retain 39.1 m/s as the runtime ceiling and the Perry 48.2 m/s point as audit only.

**Reason:** one severe Perry row and incompatible Mawar/Yagi audits cannot define a tail law.

## TCSS-D06 - Reuse strong-wind structure, not numbers

**Decision:** reuse the neighboring strong-wind cell's anatomy, field roles, value controls, dependency
rules, evaluator patterns, and tests while requiring tropical-cyclone-specific calibration.

**Reason:** similar solar equipment does not make convective and tropical-cyclone loading histories
interchangeable.

## TCSS-D07 - Treat GSU and support as separate subjects

**Decision:** retain GSU/substation, electrical, SCADA, civil, and replacement support as separately located,
valued, and withheld units.

**Reason:** module observations do not transfer to those subjects. Regulatory cost buckets also show why
support must be allocated once rather than embedded in multiple curves.

## TCSS-D08 - Expect a major version for portable v2

**Decision:** expect a portable 3-second-gust or normalized-demand model with fixed/tracker routes to require
model v2.0.

**Reason:** accepted inputs, selectors, target population, and output applicability would change materially.
A compatible new exact-source atom could be minor, but none is currently earned.
