# 20 · Shared component substrate standard

**Purpose:** reuse an intrinsic component response across hazard × asset cells without duplicating exposure, value, ownership, or runtime authority.

## 1. Governing rule

A cell remains the project-management, capability, and consumer-handoff unit. A shared substrate is a reusable method layer below the cell.

    cell = hazard × asset scope and release boundary
      -> binds component presence, exposure, value, ownership, selectors, and capability

    shared component = equipment × mechanism × compatible construction
      -> defines intrinsic axis semantics, evidence lineage, and candidate response identity

The asset label must not select a different curve when the equipment, mechanism, axis, ordinate, and compatibility key are materially identical.

## 2. What the common layer may own

- equipment and failure-unit family identity;
- physical failure mechanism and pathway;
- intrinsic x-axis and y-axis definitions;
- selector vocabulary and exact compatibility rules;
- source/claim lineage;
- candidate shared-response identity, version, and limitations.

## 3. What every cell must still own

- component presence and coverage role;
- local datum, spatial object, flood defense, and exposed fraction;
- fixed and event-time metadata actually available;
- value bucket, same-unit denominator, ownership, and insured inclusion;
- support/logistics allocation and double-count controls;
- cell-specific withhold behavior, model version, capability, and release.

Same curve does not mean same loss. Two cells can share intrinsic DR and still produce different physical loss because exposure and value differ.

## 4. Compatibility key

Numeric inheritance is disabled unless all load-bearing fields match or a sourced variant/bridge exists:

| Dimension | Minimum check |
|---|---|
| equipment | component family, voltage/function, construction, enclosure, internal vulnerable parts |
| mechanism | same direct physical pathway; inundation cannot stand in for scour or debris |
| axis | same quantity, unit, datum, spatial/temporal support, valid range, and extrapolation |
| ordinate | same-unit direct repair/replacement cost ratio with the same denominator |
| selectors | transformer type, insulation/cooling, enclosure/submersion listing, cable construction, indoor/outdoor configuration |
| conditioners | duration, contamination/salinity, energized/shutdown state, warning/isolation, water path |
| evidence endpoint | disposition/cost endpoint is transferable to the target population |

An asset name such as `solar` or `wind` is context, not a compatibility key.

## 5. Binding pattern

    shared_response_id + shared_response_version + shared_response_sha
      + exact compatibility key
      + cell-local component instance
      + local exposure transform
      + ownership and same-unit value
      -> failure-unit direct physical loss

Support/logistics is allocated once after damaged units and disposition are known. Dependency, downtime, BI, curtailment, revenue, frequency, and tail metrics remain downstream.

## 6. Non-runtime reference stage

A shared catalog under `docs/method/shared_components/` is non-runtime unless a contract explicitly says otherwise. It cannot be loaded as a curve bundle, referenced by the artifact index, or used to bypass a cell's `NO_RUNTIME_CURVE` state.

At this stage, cells may record four reuse levels:

- `definition` — vocabulary only;
- `axis` — intrinsic exposure semantics;
- `evidence` — shared source lineage;
- `candidate_curve` — pinned numeric candidate, audit only.

Only `runtime_approved` may populate an output-bearing cell bundle.

## 7. Future runtime promotion

A shared runtime mechanism is a `SCHEMA_CONTRACT_CHANGE`. It requires:

1. at least two cells proving exact compatibility;
2. a versioned intrinsic response record and SHA;
3. cell-binding schema and missing-state rules;
4. equality KATs for compatible bindings and rejection KATs for mismatches;
5. model-version impact review for every bound cell;
6. self-contained materialized cell artifacts or a separately approved multi-artifact loader;
7. dual-read shadowing, rollback, changelogs, artifact-index updates, and consumer migration.

Changing a shared numeric response cannot silently change a cell. The cell pin and semantic-version decision remain explicit.
