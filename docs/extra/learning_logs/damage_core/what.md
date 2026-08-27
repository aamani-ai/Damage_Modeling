---
author: owner-directed (Divy) · agent-drafted
created: 2026-08-27
updated: 2026-08-27
status: draft
scope: team-shared object and handoff definitions for the Damage Core lifecycle
authority: non-canonical explanation
sharing: tracked current learning package
---

# What exists in the Damage Core lifecycle

This view defines the objects, state changes, ownership, and handoffs in the 12-step lifecycle. It deliberately avoids treating a local JSON file, a published GCS package, a database selection row, and a Hazard result as the same object.

```text
scientific address
      │
      v
evidence set ──► admitted claims ──► response functions ──► value bindings
      │                                                        │
      └──────────────────── cell package ◄─────────────────────┘
                                      │
                              approved current artifact
                                      │
                         immutable publication manifest
                                      │
                             platform registry selection
                                      │
           observed asset + hazard intensity + model configuration
                                      │
                           detailed Hazard loss package
                                      │
                           governed current DB projection
```

The central grain rule is: preserve the smallest scientifically meaningful unit until the model’s declared aggregation stage. An artifact’s failure unit, a platform subsystem instance, a spatial assertion, and a plant result can be linked, but they are not interchangeable.

<a id="define-cell"></a>
## 1. Define the Damage cell

A Damage cell is the governed scientific address for one peril × asset pairing, such as `wildfire_solar`. It establishes the physical phenomenon, asset class, intended intensity measure, initial output grain, and the claim the work is trying to support. The cell is broader than one curve: it may contain multiple failure units, intensity classes, component mappings, conditions, value buckets, sources, and model/documentation identities.

Inside that cell, a **failure unit** is the smallest object for which Damage defines an independent response and value endpoint. It normally names a physical target plus a failure mechanism, such as `WSV1_MODULE_THERMAL`: Wildfire Solar Version 1, module target, thermal mechanism. That is a modeling identity, not a claim that a database component or observed plant instance exists. The same component can have several failure units when mechanisms differ; a composite failure unit can span several components when evidence supports only a shared response/value endpoint.

Its starting inputs are a requested Hazard × Asset coordinate, the intended decision use, known platform asset vocabulary, and any existing Damage coverage. Its output is a written scope that identifies inclusions, exclusions, target claim grade, owner, and open questions. The scope must distinguish the scientific coordinate from a particular plant. `wildfire_solar` defines a reusable response cell; Hayhurst is one observed plant that may consume it.

The cell’s state begins as missing or proposed. It does not become current merely because a notebook or JSON draft exists. The stable identifier becomes the route through research, packaging, validation, publication, registration, and consumption.

| Field | Example | Meaning |
|---|---|---|
| Peril | Wildfire | Physical hazard family |
| Asset | Solar | Reusable asset class |
| Intensity | Flame-length class | Hazard quantity supplied to the response |
| Failure-unit grain | Module, racking, inverter, etc. | Smallest modeled response units |
| Intended claim | Screening loss | Allowed use, not an accuracy guarantee |

[Why this boundary exists](why.md#define-cell) · [How to define a cell](how.md#define-cell) · [Package gateway](README.md)

<a id="map-coverage"></a>
## 2. Map existing coverage

Coverage mapping is an inventory of what already exists at the requested address and how far each object has traveled through the lifecycle. It looks across cell documentation, current indexes, artifact JSON, validation results, GCS manifests, platform registry rows, and Hazard consumers. Its output is a coverage and disposition matrix, not a new scientific result.

The matrix must use precise states. “Exists” is insufficient because a proposed local artifact, a current approved artifact, a published artifact, and a registered artifact support different actions. Useful labels include `missing`, `evidence-only`, `proposed`, `approved-current`, `published`, `registered`, `consumed-experimentally`, `consumed-canonically`, `stale`, and `superseded`. Each row names the evidence surface and date checked.

Coverage also inventories the failure-unit and subsystem dimensions. A cell may be present but incomplete for a needed subsystem, or scientifically complete but not distributed. For example, the measured 2026-08-27 fleet included locally current `flood_wind` and `wildfire_wind` artifacts without current GCS manifests or registry rows. That is a distribution gap, not proof that their science is absent.

The output decides the work entry point: new cell, update, evidence-only addition, contract change, publication-only, registration-only, or consumer repair.

[Why inventory precedes change](why.md#map-coverage) · [How to map coverage](how.md#map-coverage) · [Package gateway](README.md)

<a id="research-evidence"></a>
## 3. Research and extract evidence

Evidence research gathers the factual material that may support response behavior, mappings, conditions, caps, and value-basis choices. Sources can include peer-reviewed studies, engineering tests, claims analyses, vendor documents, government guidance, internal evidence libraries, and governed legacy references. The object created at this stage is an evidence record, not yet an approved curve.

Each record preserves source identity, exact locator, peril and asset relevance, observed variable, measurement conditions, sample and geography, reported units, quoted or transcribed claim, interpretation, limitations, and the candidate failure unit it might inform. Source files and extracted claims remain distinguishable. A bibliography entry alone is not an extracted claim, and a claim does not automatically become model behavior.

The expected grain is one material claim per record or row, with enough provenance for a reviewer to find it again. Conflicting findings remain side by side. Unit conversions and digitization steps are explicitly recorded rather than embedded invisibly in the final curve. The handoff is an evidence ledger and supporting source package for Step 4.

The Damage Curve governance skill provides the classification and research routes. When an external ZIP or raw source drop is involved, the source-drop ingestion workflow can stage and compare it, but scientific admission still belongs to Damage review.

[Why evidence stays separate from verdicts](why.md#research-evidence) · [How to research evidence](how.md#research-evidence) · [Package gateway](README.md)

<a id="judge-evidence"></a>
## 4. Judge evidence and state uncertainty

Evidence judgment converts an evidence set into an explicit admissibility decision. Each candidate claim is accepted, rejected, deferred, or retained only as contextual support. The decision records relevance to the cell, source quality, variable compatibility, scale and geography, asset/component match, test conditions, uncertainty, conflicts, and the allowed role in derivation.

The output is an admitted evidence set plus an exclusion/conflict ledger. It can authorize a direct empirical curve segment, a bounded engineering assumption, a monotonic constraint, a cap, a condition, a reference value, or no modeled response at all. It must not disguise a judgment as source fact. If evidence supports modules but not foundations, that asymmetry remains visible.

This step also names non-claims. For example, an artifact based on reference composition does not establish observed plant composition; a sparse loss study does not establish event frequency; and a screening curve does not support a bankable use. Uncertainty can be expressed through ranges, alternative candidates, confidence labels, withheld value, or a decision to stop.

The grain remains claim-level during evaluation, then becomes a decision bundle organized by failure unit, intensity variable, and model feature. Its handoff is the defensible basis for Step 5, with owner questions clearly separated from settled choices.

[Why admission needs a gate](why.md#judge-evidence) · [How to judge evidence](how.md#judge-evidence) · [Package gateway](README.md)

<a id="derive-response"></a>
## 5. Derive the intensity-to-damage response

Response derivation turns admitted evidence into executable vulnerability behavior. The primary object is a typed response definition for each failure unit: intensity measure and units, domain, curve form or class lookup, damage-ratio output, interpolation rule, thresholds, monotonicity, caps, conditions, and behavior outside the supported domain.

The failure unit is the calculation atom because it is the smallest grain at which those fields remain internally consistent:

```text
failure-unit identity
      ├── modeled target + mechanism
      ├── intensity axis/domain
      ├── response function or class table
      ├── conditions/caps
      ├── mapped value endpoint
      └── known-answer tests
```

A platform component is instead an asset-catalog object. Mapping happens after the response unit is defined; the artifact does not rename every failure unit to match the database or infer plant anatomy from its own labels.

The result can be a continuous curve, piecewise function, discrete class table, or another schema-supported form. Its output damage ratio must have an exact meaning, normally a fraction of the mapped value bucket damaged under the specified intensity and conditions. Frequency remains outside this object; Hazard supplies event or annualized intensity evidence and later integrates loss.

Response derivation preserves the difference between directly sourced values and transformations. If reported points are digitized, normalized, interpolated, smoothed, capped, or made monotonic, those operations and their rationale are declared. Known-answer cases are created alongside the behavior, including boundary, zero, positive, cap, and invalid-input cases.

The grain is failure unit × intensity point/class × condition. It does not collapse to a plant average. For Wildfire Solar, flame-length class 4 can map `pv_module` to a damage ratio of `0.12`, while other failure units retain their own responses. Step 6 determines what value that ratio acts upon.

[Why response derivation is separate](why.md#derive-response) · [How to derive a response](how.md#derive-response) · [Package gateway](README.md)

<a id="connect-value"></a>
## 6. Connect failure units to value

Value connection defines the denominator and monetary basis to which each damage ratio applies. Its objects include failure-unit value buckets, subsystem/component mappings, reference composition weights, included and excluded costs, support/fieldwork rules, and the relationship between physical replaceable value and total installed value.

This stage does not assign a specific plant’s observed total value. It defines how a consumer can allocate an approved value basis across modeled failure units. The platform or Hazard run supplies the selected plant value assertion and labels whether it is observed, reference, default, or withheld. The Damage artifact supplies the mapping semantics and any reference composition needed for a permitted screening fallback.

Mapping and plant evidence are two independent dimensions:

| Dimension | Values | Meaning |
|---|---|---|
| Subsystem mapping | exact code join or unresolved | Broad platform category that may receive the rollup |
| Component mapping | exact code join or `subsystem_only` | Whether a finer catalog label is defensible without guessing |
| Plant evidence lane | observed, placeholder, reference-only, absent, unknown, withheld | Whether this particular plant supports the modeled anatomy/value claim |

For the executed Wildfire Solar mapping audit, all ten failure units join active subsystem codes, but only two join exact component codes:

| Failure unit | Platform subsystem | Component output | Hayhurst evidence lane in the bounded proof |
|---|---|---|---|
| Module thermal | `PV_ARRAY` | `PV_MODULE` exact | Observed subsystem/geometry |
| Racking thermal | `MOUNTING` | `subsystem_only` | Placeholder/reference calculation |
| Foundation thermal | `FOUNDATION` | `subsystem_only` | Reference-only; no subsystem record |
| Inverter thermal | `INVERTER_SYSTEM` | `subsystem_only` | Placeholder/reference calculation |
| Combiner thermal | `INVERTER_SYSTEM` | `COMBINER_BOX` exact | Placeholder/reference calculation |
| Exposed cable | `ELECTRICAL_COLLECTION` | `subsystem_only` | Placeholder/reference calculation |
| MV equipment thermal | `SUBSTATION` | `subsystem_only` | Placeholder/reference calculation |
| Grounding thermal | `GROUNDING_LIGHTNING` | `subsystem_only` | Reference-only; no subsystem record |
| SCADA thermal | `SCADA` | `subsystem_only` | Placeholder/reference calculation |
| Civil direct | `CIVIL_INFRA` | `subsystem_only` | Placeholder/reference calculation |

The ten failure units produce nine subsystem rollups because inverter and combiner both map to `INVERTER_SYSTEM`. Exact `COMBINER_BOX` vocabulary still does not establish an observed Hayhurst combiner.

```text
plant value assertion
        │
        ├── physical/direct buckets ─► failure units ─► response × value
        │
        ├── support/fieldwork line ───► allocated once by declared rule
        │
        └── excluded/withheld value ─► disclosed, not silently damaged
```

For the current Wildfire Solar reference basis, installed capex is `1120 USD/kWdc`, physical replaceable value is `877.7957 USD/kWdc`, and excluded soft cost is `242.2043 USD/kWdc`. The artifact separately identifies direct/civil and support portions. These are reference semantics, not proof of Hayhurst’s observed TIV.

Replacement support is not a failure unit or asset subsystem. It is a nonphysical value line applied once using the artifact’s declared support rule after physical failure-unit damage is calculated.

The handoff is a complete, non-overlapping value map whose totals reconcile and whose unmodeled portion is explicit.

[Why value needs its own contract](why.md#connect-value) · [How to connect value](how.md#connect-value) · [Package gateway](README.md)

<a id="package-cell"></a>
## 7. Package the Damage cell

Cell packaging assembles the scientific work into one governed human-and-machine package. The machine-readable artifact contains model identity, documentation revision, cell coordinate, intensity schema, failure units, response definitions, mappings, capabilities, cap bindings, value-basis declarations, provenance, and validation fixtures. The human-readable companion explains sources, decisions, assumptions, limitations, and allowed claims.

The artifact is not an arbitrary flattened export. Its internal layers retain distinct meanings:

```text
artifact identity and schema
        ├── hazard/intensity contract
        ├── failure units and response definitions
        ├── subsystem/component mapping
        ├── conditions, capabilities, and caps
        ├── value-basis and support rules
        ├── evidence/provenance references
        └── known-answer and validation declarations
```

Packaging also updates the cell’s current/proposed navigation and release notes as appropriate. A candidate package remains proposed until review and validation complete. Model version and documentation revision are separate because scientific behavior can remain fixed while evidence explanation improves, while a response or semantic mapping change can require a new model identity.

The output is a deterministic candidate package that another process can validate without reading a notebook. Notebooks may investigate and narrate, but the governed artifact is the interoperable product surface.

[Why a typed package matters](why.md#package-cell) · [How to package a cell](how.md#package-cell) · [Package gateway](README.md)

<a id="review-model"></a>
## 8. Review the scientific model

Model review is the explicit owner decision on the candidate’s scientific meaning and allowed claim. Its inputs are the cell scope, evidence admission ledger, derived responses, value map, machine-readable artifact, documentation, validation plan, and listed unresolved questions. Its output is an approval, conditional approval, request for revision, deferral, or rejection.

The review addresses more than whether JSON parses. It checks the intensity variable, failure-unit definitions, curve behavior, component/subsystem mapping, value denominator, caps and conditions, use grade, missing evidence, and whether a proposed default or reference composition is acceptable. It also decides whether unresolved plant-data issues are model blockers or consumer-side limitations.

For example, a Wildfire Solar artifact can validly contain foundation and grounding failure units even when Hayhurst lacks observed instances for them. The owner reviews whether those model units are scientifically defensible. The later Hazard pair review decides whether to omit them, apply an approved reference composition, or withhold a claim for that plant.

The decision is recorded in the governed cell/release surfaces, with conditions and required follow-up. An informal chat acknowledgment is useful context but is not the complete release state unless the repository’s decision workflow captures it.

[Why owner review cannot be inferred](why.md#review-model) · [How to conduct review](how.md#review-model) · [Package gateway](README.md)

<a id="validate-promote"></a>
## 9. Validate and promote the artifact

Validation proves that the approved candidate satisfies the artifact schema, scientific invariants, mapping contract, value reconciliation, capability/cap rules, known-answer tests, and repository consistency checks. Promotion changes the cell’s local state from proposed candidate to the current approved artifact for that coordinate. It does not publish to GCS or register a platform row; those are Steps 10 and 11.

Validation operates at several grains: individual response points, whole curves, failure-unit mappings, value-bucket totals, complete artifact schema, cell index/current pointer, and cross-cell repository rules. Important checks include domain coverage, monotonicity where required, bounds such as `0 ≤ damage ratio ≤ 1`, cap enforcement, deterministic serialization, unique identifiers, declared mapping cardinality, and known-answer outputs.

Promotion records the exact model version and documentation revision and preserves superseded history. “Current” therefore means the repository’s selected local scientific release, not whichever file has the newest modification time. The complete gate produces an exact artifact file ready for content hashing and durable publication.

If any invariant fails, the candidate returns to the relevant earlier step rather than being patched only in a consumer. A curve issue returns to derivation; a mapping issue returns to value/mapping review; a contract issue follows the contract-change workflow.

[Why validation precedes current status](why.md#validate-promote) · [How to validate and promote](how.md#validate-promote) · [Package gateway](README.md)

<a id="publish-artifact"></a>
## 10. Publish the approved artifact

Publication creates an immutable, content-verifiable GCS package from the exact locally current artifact. The publisher plans the target coordinate, verifies that the destination prefix is absent, uploads the artifact and supporting schema/metadata objects with create-only semantics, verifies remote hashes, and uploads `manifest.json` last. The manifest is the completion marker.

The publication manifest describes artifact identity, model/documentation version, object URIs, SHA-256 values, schema versions, source commit/provenance, creation metadata, and an embedded proposed registry row. A prefix without its final valid manifest is not a readable complete publication. Existing complete prefixes are not overwritten to make a release look current.

This is a state transition from repository-owned release to durable distribution object. It does not create a database result and it does not execute Hazard. The relevant identity is content plus coordinate, not a floating local path. Historical consumers can therefore retrieve the same bytes later even after the repository advances.

At the measured 2026-08-27 state, five original current cells and Tropical Cyclone Wind × Wind v1.2 had current GCS publications, while locally current Flood Wind and Wildfire Wind did not. That difference is exactly what this distinct step makes visible.

[Why immutable publication is required](why.md#publish-artifact) · [How to publish](how.md#publish-artifact) · [Package gateway](README.md)

<a id="register-artifact"></a>
## 11. Register the publication for platform selection

Registration converts a valid publication manifest into a queryable platform selection record. The Hazard governance registrar reads the manifest’s `registry_row`, validates its coordinate and hash-bearing fields, and inserts the row into the development platform table `damage_artifact_ref`. The registry row points to the GCS artifact; it does not duplicate curves or become the artifact itself.

The row normally carries the peril/asset coordinate, model identity, documentation revision, manifest or artifact URI, SHA-256, status, and metadata needed for selection. The database owns which publication is selectable in a workspace or environment; GCS remains the durable content owner. Registration can therefore be reviewed and changed without changing historical artifact bytes.

The exact table cardinality depends on the platform contract, but one consumer selection must resolve unambiguously to one content-pinned artifact. Duplicate active rows, mismatched SHA values, unsupported schema versions, or a row pointing at an incomplete prefix are invalid states.

As of the measured check, the development registry contained five original coordinates and did not yet contain Tropical Cyclone Wind × Wind v1.2 despite its publication. That artifact had completed Step 10 but not Step 11. Registration is the handoff from Damage distribution to Hazard’s loader.

[Why a registry is still useful](why.md#register-artifact) · [How to register](how.md#register-artifact) · [Package gateway](README.md)

<a id="consume-in-hazard"></a>
## 12. Consume the artifact in Hazard

Hazard consumption joins four independently governed inputs: a registered content-pinned Damage artifact, a resolved asset receipt, native hazard evidence, and Hazard model configuration. The loader resolves the registry coordinate, fetches GCS bytes, checks SHA and schema, parses the artifact, and runs peril-specific selector and known-answer checks before calculation.

The calculation retains the artifact’s detailed grain before aggregation:

```text
registered Damage artifact             resolved asset receipt
 failure units + mappings               observed/reference/default facts
             \                              /
              \                            /
               └─ applicable detailed rows ┘
                          │
native hazard support ─► intensity per support/failure unit
                          │
                          v
              M3 response matrix
          failure unit × intensity class/event
                          │ probability/value weighting
                          v
              physical failure-unit contributions
                          │ artifact mappings
                          v
              canonical subsystem rollups
                          + support cost applied once
                          │
                          v
              M3 plant aggregate → M4 distribution/headline
```

Every row carries enough basis to distinguish observed, reference, default, placeholder-excluded, absent, unknown, and withheld inputs. The run writes an immutable GCS package containing the input receipt URI/SHA, Damage artifact URI/SHA, model/configuration versions, detailed rows, aggregates, and manifest. The database receives a current queryable projection and pointers, not the entire immutable history.

In the Wildfire Solar example, ten failure units across six flame-length classes create 60 response combinations. Class weighting reduces these to ten physical contributions; mapping reduces those to nine subsystem totals; one separate support line completes aggregate M3. The detailed-plus-support sum reproduced aggregate M3 within approximately `1.73e-18`, which establishes implementation/accounting parity only—not curve calibration, observed composition, or value accuracy.

The current D3.5 database direction is therefore no new snapshot, run-ledger, Damage-detail, or result-family table. Immutable GCS owns full detail/history, while a thin current database projection owns selected cross-asset headlines and lineage pointers. Spatial-role/grain completion plus valuation and result-status policy remain open production gates rather than reasons to copy model physics into new tables.

For a new pair, successful local calculation is not sufficient. The admission chain is registry → GCS → SHA/schema → peril-specific known-answer test → detailed calculation → aggregate reproduction. The run’s result grade states what use the evidence supports.

[Why consumption preserves detail](why.md#consume-in-hazard) · [How to consume in Hazard](how.md#consume-in-hazard) · [Package gateway](README.md)
