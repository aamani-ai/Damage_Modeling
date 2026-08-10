# Hazard × asset coverage — decisions

## D-001 — Breadth before second-generation depth

**Decision:** complete governed cell coverage before resuming model-v2 deep curation.

**Reason:** a clearly withheld v0.1 package removes ambiguity, records the missing evidence, and gives the
consumer a fail-closed contract. It creates more portfolio value now than polishing a fifth or sixth version
of an already represented pair while another intended pair has no governed boundary.

## D-002 — One pair at a time

**Decision:** build, pressure-test, validate, and register one cell before opening the next.

**Reason:** this keeps source IDs, value lineages, pathway decisions, and reviewer attention bounded. Parallel
research inside one cell is acceptable; parallel cell releases are not part of this plan.

## D-003 — Scaffold is coverage, not calibration

**Decision:** count a complete model-v0.1 fail-closed package as structural coverage and report runtime-curve
coverage separately.

**Reason:** combining the two counts either hides real governance work or overstates modeling maturity.

## D-004 — Reopen the two `Later` rows after the active gap

**Decision:** after `tropical_cyclone_wind_solar`, establish `hail_wind`, then `wildfire_wind`, unless the
portfolio owner deliberately preserves their deferral.

**Reason:** the latest priority is coverage. Hail × wind is first because its exposed repeated units and
mechanical damage question are more readily bounded; wildfire × wind follows because direct heat/flame,
smoke/soot, cabling, controls, substation, and operational response require a broader pathway split.

## D-005 — Shared components remain release-local

**Decision:** use asset-neutral component anatomy and evidence fields where helpful, but keep every
hazard × asset package, numerical response, value/exposure binding, capability, and release decision local.

**Reason:** the same GSU/substation equipment can occur in both solar and wind facilities, but local hazard
demand, site position, ownership, value, and evidence differ. Shared identity does not prove shared damage.

## D-006 — Hail × wind closes as a zero-curve v0.1 scaffold

**Decision:** count `hail_wind` as structurally covered at model v0.1/docs r1, with zero runtime curve
records, then open `wildfire_wind`.

**Reason:** the evidence review supports the direct-hail mechanism, blade/BOP decomposition, candidate
contact-demand variables, and a reference value ledger, but not a matched occurrence demand → inspected
disposition → same-unit direct-cost chain. Coupon response, blade simulations, chronic coating ADF, generic
repair costs, and the mislabeled legacy real-estate curve cannot honestly parameterize economic DR.

## D-007 — Wildfire × wind closes as a pathway-aware zero-curve v0.1 scaffold

**Decision:** count `wildfire_wind` as structurally covered at model v0.1/docs r1, with zero runtime curve
records and three separately governed pathways: thermal attack, firebrand ignition, and destructive
residue/contamination.

**Reason:** FSim supplies regional conditional fire-behavior context, and public fire-science, firebrand,
material, wind-facility, electrical-disposition, and incident evidence constrain mechanisms and fields. No
reviewed source closes exogenous local attack at a named unit → inspected mutually exclusive disposition →
same-unit direct cost. The old rotor/nacelle/tower logistics, scalar hub-height attenuation, solar response,
and internal-fire occurrence statistics are therefore rejected as runtime calibration.

## D-008 — Structural breadth is complete; deep passes do not guarantee promotion

**Decision:** report the portfolio as 10/10 structurally governed and 5/10 with canonical runtime curves,
then curate the five model-v0.1 cells one at a time in the recorded queue.

**Reason:** coverage and numerical maturity answer different questions. Deep curation must attempt to close
the promotion gates, but model v1.0 is released only when an output-bearing curve is honestly supported.

## D-009 — TC-wind × wind advances narrowly to proposed model v1.0

**Decision:** accept `tropical_cyclone_wind_wind` model v1.0/docs r1 as a noncanonical partial-coverage
release candidate, then continue the coverage-first depth queue with `flood_wind` rather than treating the
remaining promotion seams as a reason to broaden the curve.

**Reason:** deeper review established that Jaimes et al. publish three fitted expected-DR equations, but only
for exact source archetypes and an ambiguous paper-native turbine/tower exposure denominator. The honest v1
therefore quarantines those curves to `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`, leaves every standard
wind-farm unit and all dollar/scenario/annual metrics withheld, and requires independent schema, valuation,
engineering, and Hazard-consumer review before promotion. This earns numeric depth without claiming generic
wind-farm coverage or changing the 5/10 canonical runtime count.

## D-010 — Flood × wind advances with one whole-substation screening atom

**Decision:** accept `flood_wind` model v1.0/docs r1 as a noncanonical partial-coverage proposal and move the
one-at-a-time deep-curation queue to `tropical_cyclone_wind_solar`.

**Reason:** FEMA Hazus-MH 2.1 Table 7.9 supplies an exact legacy whole-substation depth-damage series, but it
does not supply component curves. The proposal therefore preserves one mutually exclusive
`FW_HAZUS_GSU_SUBSTATION_ASSEMBLY` record on its source-native 0–10 ft grade-depth axis while leaving every
GSU component, turbine, collection, foundation, civil, support, value-binding, annual, and tail output
withheld. Hazus 7.0's mapping-only/disabled status makes the record screening-only; no canonical artifact,
package release, or Hazard cutover is authorized. This improves numerical coverage without decomposing a
facility-level source table by assumption or changing the 5/10 canonical runtime count.

## D-011 — TC-wind × solar advances only as a coverage-first screening exception

**Decision:** accept `tropical_cyclone_wind_solar` model v1.0/docs r1 as a noncanonical, partial-coverage
screening proposal and move the one-at-a-time deep-curation queue to `hail_wind`. Preserve the independently
valid model-v0.1 package as the strict fail-closed execution alternative.

**Reason:** the recovered Perry manual dataset supports a reproducible, monotone relationship between its
dataset-reported event maximum gust and visible/missing module fraction for a mixed-scale ground/nontracking
source cohort. It does not observe economic DR. The proposal therefore quarantines the fit to
`PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT` and requires explicit uniform-module-value,
full-visible-replacement, source-population, source-wind-product, architecture, and composite-causation
acknowledgements. The strict evidence-earned gate remains **NO-GO / retain model v0.1** because wind-product
semantics, utility-scale transfer, disposition/cost, severe-tail stability, uncertainty, independent
validation, and broader unit/value coverage remain unresolved. No canonical artifact, `current/` package,
scenario/annual/tail output, or Hazard cutover is authorized; the 5/10 canonical runtime count is unchanged.

## D-012 — Hail × wind deep curation retains model v0.1/docs r2

**Decision:** classify the `hail_wind` deep pass as `EVIDENCE_ONLY_NO_OUTPUT_CHANGE`, retain model v0.1 and
its unchanged docs-r1 machine-shaped scaffold, advance the human/evidence package to docs r2, and move the
one-at-a-time queue to `wildfire_wind`.

**Reason:** two independent reviews found materially better blade-impact physics, field-observation,
simulation, test-method, inspection, and migration evidence, but no source-native occurrence chain from
delivered blade contact through mutually exclusive inspected disposition to same-blade direct economic
damage ratio. Unlike the owner-authorized Perry solar exception, even a narrow hail/blade atom would require
unsupported mappings from source hail to contact history, coupon/simulation response to field state
probability, and field state to repair/replacement cost. No numerical record, bundle-v3 artifact, canonical
package, schema change, or Hazard cutover is therefore created. A future Tier-4 structured-elicitation model
requires a separate explicit owner decision and would be a `MODEL_BEHAVIOR_CHANGE`.

## D-013 — TC-wind × solar deep curation retains model v1.0/docs r2

**Decision:** classify the reopened `tropical_cyclone_wind_solar` pass as
`EVIDENCE_ONLY_NO_OUTPUT_CHANGE`, retain the noncanonical model-v1.0/docs-r1 runtime proposal byte-for-byte,
advance human/evidence documentation to docs r2, and return the one-at-a-time queue to `wildfire_wind`.

**Reason:** independent sampling/fit, axis, tracker/tail, economic/value, and failure-unit reviews found no
computational defect in the pinned Perry transformation, but no validated prediction even for an unseen
source-compatible site, portable Hazard 3-second-gust bridge, tracker calibration, severe-tail law, or
same-unit economic response for another unit. Perry identifies
Visual Crossing at study level, yet its released rows omit the query/station/reference-frame lineage needed
for transfer. New Mawar, Yagi, FPL, FEMA, owner, SEC, DOE/NLR, and OEM evidence strengthens occurrence
coverage and acquisition design without supplying an adopted parameter. A future portable fixed/tracker
contract is expected to be a major model-v2 change and requires the recorded owner/adjuster evidence package.

**Later scope note:** D-013 remains the evidence-earned conclusion and promotion standard. D-014 records a
subsequent owner-authorized synthetic exception that supersedes only the instruction to wait before creating
a v2 research candidate; it does not supersede any blocked evidence or promotion gate.

## D-014 — TC-wind × solar receives an out-of-queue synthetic model-v2 candidate

**Decision:** accept `tropical_cyclone_wind_solar` model v2.0/docs r1 as a noncanonical research/interface
candidate with five records: one unchanged Perry source-compatibility record and four cell-local
synthetic-T4 fixed-tilt/tracker records. Preserve model v0.1 and model v1.0 as the strict no-curve and narrow
source-derived alternatives. Keep `wildfire_wind` next in the coverage queue.

**Reason:** after the docs-r2 evidence audit correctly concluded that public evidence had not earned a
portable v2, the owner explicitly authorized a coverage-first Tier-4 assumption build. That authority
permits an honest, machine-governed proposal; it does not turn assumptions into hurricane calibration.
Unsupported units and all value/full-plant/scenario/annual/tail outputs remain withheld. No `current/`,
artifact-index, changelog, package-release, canonical-promotion, or Hazard-cutover action is authorized, so
the portfolio remains 10/10 structurally governed and 5/10 canonical runtime.

## D-015 — Numerical identity is an audit comparison, not shared evidence

**Decision:** treat the v2 cell-local synthetic parameters' byte equality to the solar-wind normalized
response candidate as a post-adoption audit fingerprint only. The comparison profile is not tropical-cyclone
evidence, does not populate the TC artifact, and is not a runtime shared dependency.

**Reason:** the comparison values originated with the neighboring strong-wind proposal, but similar solar
equipment and normalized numbers do not make convective and tropical-cyclone hazard histories
interchangeable. The TC cell independently owns its Tier-4 adoption decision, axis bridges, selectors,
failure-unit binding, artifact, capability, release, and promotion evidence.

## D-016 — TC-wind × solar must be usable as a complete screening curve

**Decision:** advance the lead proposal from model v2.0 to model v2.1. Preserve v2.0's five records, add
numeric Tier-4 foundation, power/collection, GSU, SCADA, and civil records, and assemble the complete named
physical replacement-value profile into plant DR, loss per kWdc, installed-capex physical loss fraction, and
optional scenario dollars.

**Reason:** v2.0 optimized withholding and auditability to the point that the requested end-to-end screening
use case was unavailable. Proxy grade should control labeling, review, and update priority; it should not
eliminate the output the proxy was commissioned to provide. Frequency, EAL, tails, BI, and compound mechanisms
remain outside this wind-only damage-cell output. No canonical cutover is authorized by this decision.

## D-017 — Wildfire × wind advances as a two-unit Tier-4 screening proposal

**Decision:** accept `wildfire_wind` model v1.0/docs r1 as a noncanonical partial-coverage proposal with two
records: `WT_PAD_ELECTRICAL` and `WT_GSU_PROTECTION_CONTROL_DC`. Preserve model v0.1 as the strict
evidence-earned zero-curve alternative. Do not create `current/`, publish a package, add an artifact-index
entry, or authorize Hazard cutover.

**Reason:** the owner explicitly requested a visible risk output even if only one or two subsystems can be
supported. New primary substation modeling, NEMA fire/heat disposition guidance, and USFS infrastructure
evidence make nonzero electrical vulnerability and the relative ordering physically credible, but they do
not calibrate FSim-class economic DR. The arrays are therefore cell-local Tier-4 assumptions with an exact
assumption acknowledgement, categorical-state guards, no implicit value, and all unsupported units and
metrics withheld. Their numerical identity to two wildfire-solar profiles is an audit fingerprint only—not
shared evidence or a runtime dependency.

## D-018 — Promote flood × wind and wildfire × wind as canonical partial-screening v1

**Decision:** on 2026-08-08, promote both model-v1.0/docs-r1 packages into `current/`, add bundle-v3 artifact-
index pins and changelogs, release the bundle-v3/capability-v3/emit-v2 producer seam, and validate both through
the common Hazard loader. Preserve every proposal and model-v0.1 package as audit history.

**Reason:** the owner explicitly wants bounded risk representation even when only one or two subsystems are
supportable and accepts screening-grade accuracy. Canonical here means governed and executable, not complete
or calibrated. Flood remains one legacy FEMA whole-substation atom; wildfire remains two Tier-4 electrical
units. Unsupported units are null/withheld, scenario dollars require exact same-unit value and exposure, and
annual/tail/portfolio completeness remains withheld. Canonical runtime coverage changes from 5/10 to 7/10.

## D-019 — Promote tropical-cyclone wind × wind as source-native partial-screening v1

**Decision:** on 2026-08-09, promote the existing model-v1.0/docs-r1 Jaimes package into `current/`, add its
bundle-v3 artifact-index pin and changelog, and support it in the common Hazard loader. Preserve model v0.1
and the noncanonical v1 package as audit history. Do not widen the released selectors, failure unit, axis,
value basis, or output capability.

**Reason:** the two-phase scientific work was already complete: v0.1 established an honest no-curve boundary,
then v1 recovered three exact source-published expected-DR functions for one quarantined turbine/tower atom.
The bounded result is useful as conditional severity even when a seasonal outlook is below normal, because
frequency and damage conditional on intensity are separate. Canonical means governed and executable, not a
generic modern-fleet or whole-farm claim. Unmatched assets, including the Gamesa G114-2.0 MW example, standard
wind-farm units, dollars, EAL, and tail outputs remain withheld. Repository-current canonical coverage changes
from 7/10 to 8/10; external object-store/registry activation remains a separate release act.
