# Decisions

## 1. Damage curve = physical destruction only
**Decision.** The damage curve maps intensity → physical repair/replacement damage ratio. Disruption
(downtime → business-interruption, derating) is a **separate additive stage** (methodology §7 + §9), not in
the curve. **Rationale.** Keeps the curve a clean, sourceable physical object; BI/economic loss can exceed
replacement value and must not be capped with physical damage. Drove the hail-M3 wording fix.

## 2. Spin damage modeling into its own repo
**Decision.** Move the damage-curve discipline out of `Hazard_modeling` into a sibling `damage_modeling`
repo; `Hazard_modeling` becomes a **consumer** at M3. **Rationale.** Building the curve properly is a deep,
evidence-hungry discipline with its own cadence and multiple consumers (hazard M3, CONUS grid, underwriting).
It's also the boundary the library already drew ("does not own EAL/PML"). Reduces clutter in the hazard
engine.

## 3. Relocate by move, not copy — with a tombstone
**Decision.** The damage section is maintained in **one home** (`damage_modeling`); the `Hazard_modeling`
copy is deleted, leaving a single redirect README. **Rationale.** The platform's prior production bug was
**version drift between two copies**. One home prevents recurrence. Because the content isn't reliably in
git, the delete was gated on a **copy-verified-identical** check (115/115 files).

## 4. EAL/PML boundary — computation vs declaration
**Decision.** Metric *computation* (EAL/PML/VaR) and the ship/withhold decision belong to the **consumer**
(hazard repo). What stays on the damage side is the **emit object** + a per-curve **capability declaration**
(`metrics_supportable`, `cap_binding`, `spread_carried`). **Rationale.** Only the curve knows whether it can
support an honest tail. The curve *declares*; the consumer *computes and enforces*. This demoted the old
"metrics/tail-honesty" question to a contract field + a shared principle ("never fabricate a tail from a
mean").

## 5. Emit object resolved (carried from the foundations)
**Decision.** Emit object is set by the **first downstream nonlinearity**: scalar where linear; interface
**distribution-ready**, content scalar-v1 / per-source; tail metrics **withheld, not caveated** under scalar.
The cap is already nonlinear, so scalar-EAL is honest only while the cap rarely binds. **Rationale.** Directly
inoculates against the old model's tail failure. The open seam is **secondary uncertainty / the spread**.

## 6. Evidence harvest = co-curation of EXISTING cells, not new pairs
**Decision.** The legacy `infrasure-damage-curves` repo is used to **strengthen/cross-validate the curves we
already have** — not to stand up new hazard×asset pairs (those are added directly in the implementation
folder). **Rationale.** Our method/structure is the keeper; the old repo's value is its **evidence** (weak
method, strong references). P3: a reference is input, not authority — take sources, re-derive across the
boundary.

## 7. Ingestion = docs-revision; model changes are a separate decision
**Decision.** Folding adopted references/cross-checks into a cell's evidence map + assumption register is a
**docs revision** (no DR change → no cell-model-version bump, per standard 17). Anything that would change DR
for the same input (flood: transformer-type selector, salinity, duration; wind: yaw conditioner, tornado-shift
refinement, IEC class offsets) is a **candidate v1.1 model change** — flagged, not bundled. **Rationale.**
Keeps versioning honest and separates cheap/safe evidence-adds from real curve movement.

## 8. Symlink set + scope-and-story placement
**Decision.** `damage_modeling` carries `infrasure-damage-curves` (evidence source), `Hazard_modeling`
(consumer), `model-gpr`, `Learning`, `renewablesinfo_org`; `Hazard_modeling` gets a `damage_modeling` symlink
back. The scope-and-story lives **in the relocated `docs/damage_curves/`** so it travels with the section.
**Rationale.** Bidirectional navigability without re-coupling; the anchor doc belongs with the content it
anchors.
