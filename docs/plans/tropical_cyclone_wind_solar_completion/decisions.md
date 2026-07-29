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

**Later scope note:** this remains the correct semantic classification and evidence conclusion. TCSS-D09
records the owner's subsequent authority to build an explicitly synthetic model-v2 candidate before the
promotion evidence arrives; it does not recast that candidate as evidence-earned.

## TCSS-D09 - Build v2 as a noncanonical synthetic-T4 exception

**Decision:** create model v2.0/docs r1 with five records: one unchanged Perry source-compatibility record
and four cell-local synthetic-T4 records for fixed-tilt module/support and qualified-tracker
module/structural-BOS failure units.

**Reason:** after reviewing the docs-r2 NO-GO, the owner explicitly chose bounded coverage and interface
testing now. The generic parameters are therefore governed assumptions, not TC calibration. Model v0.1 and
model v1.0 stay preserved as separate strict and source-specific choices, and the normal one-cell-at-a-time
queue still proceeds to `wildfire_wind`.

## TCSS-D10 - Compare strong-wind numerical identity without transferring authority

**Decision:** record byte equality between the TC cell-local synthetic parameters and the
strong-wind-derived solar normalized-response candidate only as a post-adoption audit fingerprint.

**Reason:** numerical identity makes the synthetic assumption visible and avoids an invented TC adjustment;
it does not supply tropical-cyclone evidence. The shared comparison candidate never populates the TC bundle,
is not a runtime dependency, and owns no TC axis, selectors, value, capability, or release decision.

## TCSS-D11 - Keep proposal validation separate from promotion

**Decision:** permit the v2 package to pass internal machine, contract, and adversarial proposal checks while
leaving portable-axis, tracker validation, calibration, severe-tail, economics, remaining-unit, compound,
consumer, and maintainer promotion gates blocked.

## TCSS-D12 — Correct v2 into a usable coverage-complete screening model

**Decision:** advance the lead from model v2.0 to model v2.1. Preserve the five v2.0 records, add five
site-facility Tier-4 curves for foundation, power/collection, GSU, SCADA, and civil, and assemble the complete
named physical replacement-value profile into plant DR, loss per kWdc, installed-capex physical loss
fraction, and optional scenario dollars.

**Reason:** v2.0's withholding discipline made the commissioned screening product unusable. A proxy should
carry an honest grade and update trigger, not suppress the result it was built to provide. Annual/tail metrics,
BI, and compound rain/debris/surge/tornado mechanisms remain outside the v2.1 wind-only damage output.

**Reason:** validated implementation means the synthetic research contract behaves as declared; it does not
make the underlying assumptions empirical. Do not create `current/`, update the artifact index or changelog,
ship a package, or authorize Hazard cutover without a later explicit promotion action.
