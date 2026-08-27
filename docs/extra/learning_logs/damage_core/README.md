---
author: owner-directed (Divy) · agent-drafted
created: 2026-08-27
updated: 2026-08-27
status: draft
scope: team-shared newcomer and re-entry learning package for Damage Core and Hazard consumption
authority: non-canonical explanation; linked repository contracts, standards, code, and manifests remain authoritative
sharing: tracked current learning package
---

# Damage Core: from evidence to a Hazard-ready damage artifact

This package explains the complete path from deciding that a Hazard × Asset damage cell is needed to using a content-pinned artifact in a Hazard run. It is both a learning aid and an operating map. A reader should finish it knowing:

- what each stage produces;
- why the stage exists and what can go wrong if it is skipped;
- how to run or request each stage;
- which repository owns each truth;
- where the current artifact fleet has completed or has not completed the distribution path.

The shortest correct summary is:

> Damage owns the vulnerability method and failure-unit mapping. The asset database owns what is observed at a particular plant. GCS preserves the exact approved Damage artifact. The platform registry selects that artifact. Hazard combines the selected artifact with observed asset facts, hazard intensity, and value, retains detailed loss rows, then produces governed aggregates.

This is the tracked, team-shared current learning package. It remains non-canonical: it does not change a Damage standard, approve a curve, publish an artifact, register a database row, or change a Hazard result.

## The whole process on one page

The 12 steps are grouped into six phases. Steps 1–9 create and approve the scientific object. Steps 10–11 distribute its exact bytes. Step 12 consumes it without confusing Damage truth with plant truth.

```text
PHASE A · FRAME
  1 Define cell ───────────────► 2 Map coverage
       What peril × asset?          What exists, is absent, or is stale?
              │
              v
PHASE B · RESEARCH
  3 Research evidence ────────► 4 Judge evidence
       Curves, claims, sources      Admissibility, conflicts, uncertainty
              │
              v
PHASE C · BUILD
  5 Derive response ──────────► 6 Connect value
       Intensity → damage ratio     Failure unit → value basis
              │
              v
PHASE D · GOVERN
  7 Package cell ─────────────► 8 Review model ─────────────► 9 Validate/promote
       Typed artifact + docs        Scientific owner verdict      KATs + current index
              │
              v
PHASE E · DISTRIBUTE
  10 Publish artifact ────────► 11 Register artifact
       Immutable GCS bytes          Queryable platform pointer
              │
              v
PHASE F · CONSUME
  12 Consume in Hazard
       Registry → GCS → SHA/schema → selector/KAT → detailed M3 → governed M4
              │
              └──────── observations or new evidence feed a classified update ───────┐
                                                                                       └─► Step 1, 3, or 4
```

This sequence is ordered, but it is not a claim that every scientific iteration starts from nothing. An evidence-only addition can enter at Step 3, a contract change enters through the change classifier before Step 7, and a Hazard observation can reopen an existing cell. The classification determines which gates must be rerun.

## Three truths that must stay separate

```text
 DAMAGE REPOSITORY                 ASSET PLATFORM                   HAZARD REPOSITORY
 -----------------                --------------                   -----------------
 What can fail?                   What is at this plant?           What intensity reached it?
 How does it respond?             At what observed grain?          Which response applies?
 What subsystem does it map to?   Which facts are unknown?         What loss follows?
 What value-bucket semantics?     Which geometry/value assertion?  What can be aggregated?
          │                               │                                 │
          └──────── approved artifact ────┼──── resolved asset receipt ─────┘
                                          v
                                one reproducible Hazard run
                                          │
                              detailed GCS result + DB headline
```

The Damage artifact can say that a `pv_module` failure unit maps to the `PV_ARRAY` subsystem and `PV_MODULE` component. It cannot prove that a given plant has a surveyed module polygon, a known module count, or an observed module value. Those facts come from the platform resolver. Conversely, the database should not reproduce the scientific curves merely because a plant row needs to use them.

## Failure unit, subsystem, component, and plant evidence

A **failure unit** is the smallest object for which Damage independently defines a hazard response, conditions, value endpoint, and known-answer tests. It is a modeling unit: what the Damage calculation evaluates. It is not automatically a platform component, an observed piece of equipment, or one final reporting row.

```text
Damage failure unit
  = physical target + failure mechanism + response/value contract

WSV1_MODULE_THERMAL
 │     │       │
 │     │       └── mechanism: thermal damage
 │     └────────── target: module
 └──────────────── Wildfire × Solar model/version namespace
```

The name carries the modeled target and mechanism because the same physical component can have several failure mechanisms, while several components can sometimes share one defensible response/value endpoint. A database component name alone cannot express that scientific distinction.

| Layer | Question it answers | Wildfire Solar example | What it does not prove |
|---|---|---|---|
| Failure unit | What receives its own response calculation? | `WSV1_MODULE_THERMAL` | That a module was observed at a particular plant |
| Platform subsystem | Which broad equipment category receives the rollup? | `PV_ARRAY` | Component-level anatomy |
| Platform component | Which finer catalog code is an exact match? | `PV_MODULE` | That the plant has an observed component instance |
| Plant evidence lane | What is actually known for this plant? | observed, placeholder, reference-only, absent, unknown, or withheld | Universal asset composition |

The joins must therefore be read in two separate directions:

```text
VOCABULARY COMPATIBILITY                         PLANT EVIDENCE
failure unit ─► subsystem/component code         resolved asset fact ─► observed?
               exact or subsystem-only                                reference?
                                                                         absent?

an exact code join does not cross the gap and become an observation
```

This distinction is the reason a model can support subsystem-level screening while still refusing a “fully observed plant” claim.

## How to read this package

Start with the question you have:

| Reader need | Start here |
|---|---|
| “What are the objects and handoffs?” | [What](what.md) |
| “Why do we need these boundaries and gates?” | [Why](why.md) |
| “How do I run the work or ask an agent to run it?” | [How](how.md) |
| “Where is a specific stage explained in all three views?” | Use the concept crosswalk below |
| “What is true right now?” | Read the dated current-state section below, then verify the live manifests and registry |

The three deep views use the same concepts in the same order. Every concept ends with reciprocal routes, so a reader can move from definition to reasoning to procedure without searching.

## Concept crosswalk

| # | Stable concept | What it means | Definition | Reasoning | Procedure |
|---:|---|---|---|---|---|
| 1 | Define cell | Establish the exact peril × asset scientific address and intended claim | [What](what.md#define-cell) | [Why](why.md#define-cell) | [How](how.md#define-cell) |
| 2 | Map coverage | Determine whether the address is missing, present, proposed, stale, or complete | [What](what.md#map-coverage) | [Why](why.md#map-coverage) | [How](how.md#map-coverage) |
| 3 | Research evidence | Gather source material and extract claims without prematurely choosing a curve | [What](what.md#research-evidence) | [Why](why.md#research-evidence) | [How](how.md#research-evidence) |
| 4 | Judge evidence | Decide what evidence is admissible and how uncertainty or conflict is represented | [What](what.md#judge-evidence) | [Why](why.md#judge-evidence) | [How](how.md#judge-evidence) |
| 5 | Derive response | Convert admitted evidence into typed intensity-to-damage behavior | [What](what.md#derive-response) | [Why](why.md#derive-response) | [How](how.md#derive-response) |
| 6 | Connect value | Bind failure units to value buckets without hiding unmodeled or support value | [What](what.md#connect-value) | [Why](why.md#connect-value) | [How](how.md#connect-value) |
| 7 | Package cell | Assemble the machine-readable artifact and its human-readable evidence package | [What](what.md#package-cell) | [Why](why.md#package-cell) | [How](how.md#package-cell) |
| 8 | Review model | Obtain the owner’s explicit scientific and claim-grade decision | [What](what.md#review-model) | [Why](why.md#review-model) | [How](how.md#review-model) |
| 9 | Validate/promote | Run contract, curve, mapping, and known-answer gates before marking current | [What](what.md#validate-promote) | [Why](why.md#validate-promote) | [How](how.md#validate-promote) |
| 10 | Publish artifact | Write exact approved bytes to an immutable GCS prefix with manifest last | [What](what.md#publish-artifact) | [Why](why.md#publish-artifact) | [How](how.md#publish-artifact) |
| 11 | Register artifact | Add the published coordinate, URI, and SHA to the platform selection table | [What](what.md#register-artifact) | [Why](why.md#register-artifact) | [How](how.md#register-artifact) |
| 12 | Consume in Hazard | Load, verify, select, calculate detailed loss, aggregate, and receipt the run | [What](what.md#consume-in-hazard) | [Why](why.md#consume-in-hazard) | [How](how.md#consume-in-hazard) |

## The repeated unit of work

A “cell” is not a database row and not a Hazard output. It is the governed Damage scientific address for a peril × asset pairing, with a model identity, documentation revision, failure units, response functions, mappings, and value-basis declarations. Publication and registration add distribution coordinates; they do not change the underlying scientific meaning.

| Object | Example | Owner | Mutable? |
|---|---|---|---|
| Damage cell | `wildfire_solar` | Damage | Revised through governed work |
| Current local artifact | `wildfire_solar__model_v1_0__docs_r3__curve_artifact.json` | Damage | Replaced by promotion, never edited after release |
| Published prefix | content-specific GCS run root | Damage publisher | Create-only |
| Publication manifest | hashes, schemas, registry row, provenance | Damage publisher | Completion marker; immutable |
| Registry row | Damage artifact coordinate and GCS pointer | Platform/Hazard governance | Controlled platform state |
| Asset receipt | resolved plant facts used for a run | Platform resolver + run writer | Immutable per run |
| Hazard result package | detailed and aggregate results plus inputs/versions | Hazard | Immutable per run |
| Current DB projection | current headline risk fields and artifact pointer | Platform/Hazard | Queryable current state |

## Current measured distribution status

This section is an as-of measurement, not a timeless rule. It was checked on 2026-08-27 against the local Damage current index, available GCS manifests, the development `damage_artifact_ref` table, and the current Hazard loaders. Recheck those surfaces before relying on the counts.

| Artifact group | Steps 8–9: approved/current locally | Step 10: published to GCS | Step 11: registered in dev DB | Step 12: canonical live consumer path |
|---|---:|---:|---:|---:|
| Hail Solar, Flood Solar, Strong Wind Solar, Tornado Wind, Wildfire Solar | Yes | Yes | Yes | Mixed by Hazard path; loader seam exists |
| Tropical Cyclone Wind × Wind v1.2 | Yes | Yes | No at the measured time | No canonical registered Deep path yet |
| Flood Wind, Wildfire Wind | Yes | No current manifest found | No | No |
| Proposed Hurricane Solar work | Not through the full approval gate | No | No | Local/proposed use only |

The important interpretation is not “the Damage system is unfinished.” The scientific package, durable publication, platform registration, and Hazard consumption are separate gates. Some cells are scientifically current without being distributed, and some Hazard experiments deliberately consume a local proposed artifact. A production Deep pair should not blur those states.

## The first operational milestone for a new Deep pair

For a new Hazard × Asset pair, the first planning action is a pair-local admission audit:

```text
pair requested
    │
    ├─ Is the Damage cell defined and scientifically current? ── no ─► Steps 1–9
    │
    ├─ Is the exact current artifact published with SHA/schema? ─ no ─► Step 10
    │
    ├─ Is that publication registered for selection? ─────────── no ─► Step 11
    │
    ├─ Can Hazard pass a peril-specific known-answer test? ───── no ─► repair Step 12 adapter
    │
    └─ yes ─► admit the pair to bounded Deep execution
```

This makes the missing step explicit. It prevents an experiment from being mistaken for a production-ready pair and avoids forcing every hazard through a blanket rewrite.

## A compact Wildfire × Solar example

The current Wildfire Solar artifact declares ten failure units and six wildfire flame-length classes. Evaluating every modeled combination produces `10 × 6 = 60` response rows. Probability-weighting the six classes then produces one loss contribution per failure unit. Those ten contributions roll into nine platform subsystem totals because inverter and combiner are distinct failure units that both map to `INVERTER_SYSTEM`. A separate replacement-support line is added once because labor/logistics support is cost, not physical equipment.

```text
10 failure units × 6 wildfire classes
                  ↓
       60 response combinations
                  ↓ class-probability weighting
       10 physical loss contributions
                  ↓ artifact-declared mapping
       9 platform subsystem totals
                  +
       1 nonphysical support-cost line
                  ↓
       plant aggregate M3 loss
```

All ten failure units match exact platform subsystem codes. Only `PV_MODULE` and `COMBINER_BOX` match exact platform component codes; the other eight are intentionally `subsystem_only` rather than guessed. This describes reporting vocabulary, not observed Hayhurst anatomy. The Hayhurst receipt currently supports the PV-array lane with observed-source geometry. Its other modeled subsystem contributions remain placeholder/reference-only or absent and must retain those labels, including the combiner even though `COMBINER_BOX` is a valid component code.

For flame-length class 4, the artifact’s module damage ratio is `0.12`. With its reference module value of `291.214851 USD/kWdc`, the illustrative direct module loss is:

```text
direct module loss
  = damage ratio × mapped reference value
  = 0.12 × 291.214851 USD/kWdc
  = 34.94578212 USD/kWdc
```

That number is not yet a plant loss. Hazard must still apply the plant’s selected value basis, exposure/support logic, spatial evidence, and event probability. Detailed failure-unit-by-intensity rows should remain available before M4 aggregation so reviewers can see exactly where an aggregate came from. In the recent bounded experiment, summing the detailed physical contributions plus the support line reproduced aggregate M3 within approximately `1.73e-18`. That is an accounting/implementation parity check; it does not validate the scientific curves, reference composition, or plant observations.

### Current D3.5 questions—not yet production authorization

| Owner question | Current experiment-supported direction | Still open |
|---|---|---|
| Reporting grain | Ten failure units; exact subsystem rollups; component reporting only for exact codes; support separate | Owner acceptance of the Version-1 claim boundary |
| Database boundary | Detailed immutable history in GCS; thin current headline and lineage pointers in the database; no new snapshot/run-ledger/Damage-detail/result-family table | Spatial semantics plus valuation and result-status policy |
| Scientific direction | Accept low-risk Hayhurst as a valid end-to-end method proof; common-period zero PMLs are expected from rare occurrence | Owner acceptance and a later predeclared high-risk contrast |

These are review decisions. They do not authorize branch integration, production extraction, a database write, or serving.

## Newcomer questions

### What is a Damage failure unit, and why is it not simply called a component?

A failure unit is the smallest modeled object with its own hazard response, conditions, value endpoint, and known-answer checks. The name emphasizes what the model evaluates, not merely what the equipment catalog calls an object. One physical component can have several failure mechanisms that need different curves; conversely, a defensible composite failure unit can cover several components when the evidence and value endpoint cannot support a finer split. The artifact maps each failure unit to platform subsystem/component vocabulary afterward. This separation lets Damage science improve without forcing the asset database to copy curve structure, and lets richer plant observations enter later without redesigning every response.

### Does a Damage artifact prove that the equipment exists at a plant?

No. A Damage artifact defines a response vocabulary: failure units, intensity measures, damage ratios, subsystem/component mappings, conditions, caps, and value-bucket semantics. It says what the model is capable of representing. The platform resolver supplies plant evidence: observed subsystem instances, component specifications, geometry, capacity, provenance, confidence, and explicit unknowns. Hazard intersects those two inputs. If the artifact contains a foundation curve but the plant receipt has no observed foundation instance, Hazard must not relabel that curve as observed plant detail. It may use an approved reference or default composition only when the method allows it, and the resulting rows and claim grade must state that basis.

### Does an exact subsystem or component mapping mean that equipment was observed?

No. “Exact” means the Damage label joins an active platform vocabulary code without fuzzy interpretation. It answers where a calculated contribution may be reported. Observation is a separate question answered by the resolved plant facts. In the Wildfire Solar example, all ten failure units have exact subsystem-code joins and two have exact component-code joins, but Hayhurst currently has observed evidence only for its PV-array subsystem lane. The other rows remain placeholder/reference-only or absent as appropriate. Even an exact `COMBINER_BOX` code cannot become an observed combiner instance unless the platform receipt supplies that evidence.

### Why are publishing and registration two different steps?

Publishing answers “where are the exact approved bytes, and can they change?” Registration answers “which published artifact should this platform execution select?” The Damage publisher writes a create-only GCS package, calculates hashes, verifies remote bytes, and writes `manifest.json` last as the completion marker. The platform registrar reads the manifest’s embedded registry row and writes the coordinate, URI, and SHA into `damage_artifact_ref`. Keeping these acts separate lets Damage control the artifact while platform governance controls selection. It also makes partial states visible: an artifact can be scientifically approved but unpublished, or published but not yet selectable. A production consumer requires both gates.

### Can Hazard run from a local artifact before Step 10 or Step 11?

Yes for a bounded experiment if it is explicitly labeled local, proposed, and non-production. That can be useful for testing a selector, checking response shapes, or discovering database gaps before committing to a release. It is not equivalent to a registered production run. A local path can move, its bytes can be edited, and another checkout may not contain the same artifact. The experiment must record the local file SHA, source commit, model identity, and its non-claim. Promotion requires the exact approved artifact to pass Step 9, be published in Step 10, registered in Step 11, and then pass the Hazard consumer’s schema, SHA, mapping, and peril-specific known-answer gates.

### Why keep failure-unit and subsystem rows before aggregating to the plant?

Early plant averaging destroys auditability and can produce scientifically incorrect joins. Different failure units can have different curves, caps, conditions, value bases, spatial support, and evidence grades. A single plant-level number cannot show whether a loss came from modules, inverters, substation equipment, or a support-cost rule. It also makes later asset-detail improvements hard to use because the information was discarded upstream. The safer order is to calculate at the artifact’s declared failure-unit grain, attach observed/reference/default status, roll up through the declared subsystem mapping, and only then form the M4 plant result. The aggregate is still available, but it remains reproducible from retained detailed rows.

### Do detailed failure-unit results require another database table?

Not under the current D3.5 direction. The complete failure-unit, subsystem, support-line, diagnostic, and historical result belongs in the immutable GCS run package, where its exact inputs and versions can be preserved. The relational database should retain a thin current result for cross-asset queries and serving, together with manifest/input/Damage pointers and hashes. A new detail table would be justified only by a concrete repeated query that cannot be served from the governed package or a typed projection. Spatial-semantics repair and valuation/status policy remain real database work, but they do not require copying Damage physics or full run history into new tables.

### What happens when the database only knows panels and a substation?

The pipeline models what it can support and states what it cannot. It should create observed claims for the panel/PV-array and substation evidence that passes resolver validation. Other artifact failure units can be marked absent, unknown, placeholder, reference, default, or withheld according to the contract; those labels are not interchangeable. A reference composition may support a screening result if the owner accepts that claim, but it does not become observed subsystem detail. Later, when the platform adds a valid inverter or foundation instance, the same artifact and consumer flow can admit it without redesigning M3. The resolver supplies a richer plant receipt, the selector exposes the new mapped failure unit, and the detailed calculation expands naturally.

### Are zero or near-zero Wildfire losses evidence that the method failed?

No. A low-risk site can correctly produce many zero intensity or zero damage rows. The scientific test is whether the chain treats zero support, below-threshold intensity, no-damage response, and missing data as distinct states. A zero calculated from valid native FSim exposure and an applicable curve is a result. An unknown caused by missing geometry or an unavailable artifact is not zero. Known-answer tests should include both positive and zero cases so a broken selector cannot pass by returning zeros for everything. For the Hayhurst example, low expected annual loss can still validate the full live-resolver → observed geometry → native hazard → Damage → M4 chain.

### What does “current” mean for a Damage artifact?

“Current” is coordinate-specific and should be read with its scope. The local current index identifies the repository’s approved artifact for a peril × asset cell. A GCS current publication means the exact package was durably written and completed by a valid manifest. A platform registry row means the publication can be selected by consumers. A Hazard implementation package identifies the method and result currently served for a pair. These are related but not identical states. A new local current artifact does not silently update GCS, the registry, or Hazard. Operators must move through each explicit gate and keep immutable earlier releases available for historical reproduction.

### Why store a SHA and an input receipt when the database already has current facts?

Current database facts can improve after a run: geometry may be corrected, subsystem detail may be added, or a value assertion may be superseded. Without a receipt, an old result could appear to have used today’s inputs even though it used yesterday’s. The run therefore stores the exact resolved asset input in its immutable GCS package and records its URI and SHA. The Damage artifact is likewise content-pinned. This is not a pre-run snapshot table or a second editable source of truth. It is run evidence: the database remains live for new runs, while each completed result retains the exact input bytes and model/damage versions needed to explain or compare it.

### When does a Damage change require a new model version?

The change classifier and versioning policy decide this before editing. A scientific response change—such as a new curve shape, condition, cap, failure-unit meaning, or materially different mapping—usually changes model identity. Documentation or evidence improvements that do not alter executable semantics can advance the documentation revision. A contract/schema change follows its own governed route because consumers may need migration work. A source addition alone does not automatically justify a new model if the admitted scientific behavior remains identical. Never decide solely from the number of changed files. Classify the semantic effect, list affected consumers, run the required validation suite, and obtain the owner’s release verdict.

### Where should learning, scientific truth, and operating instructions live?

This local package is for comprehension and repeatability; it can explain across repository boundaries and record current gaps. Damage standards and contracts remain the authority for definitions, artifact structure, mapping, publication, and reportability. Damage workflows and guides remain the authority for repeatable operating steps. Cell folders hold cell-specific evidence, decisions, artifacts, and current pointers. Hazard’s repository contract and pair guides govern the consumer and result surfaces. If learning reveals a real defect, the next action is not to silently edit this package alone. Classify the change, update the authoritative surface through its normal review path, then refresh this explanation so it continues to point at current truth.

## Authority and evidence used

The package was grounded in the following surfaces, in descending order of authority for their subject:

1. Executable schemas, publishers, registrars, loaders, tests, and current artifacts.
2. Damage standards, contracts, workflows, release guides, and cell packages.
3. Hazard’s repository contract, Deep asset contract, build guide, and consumer code.
4. Dated experiment results and live status checks.
5. Discussion notes and repository status prose, used only where they agree with current code and manifests.

Important linked entry points:

- [Damage Curve skill](../../../extra/damage_curve_skill/SKILL.md)
- [Damage end-to-end architecture](../../../method/standards/13_end_to_end_damage_work_architecture.md)
- [Add-new-cell workflow](../../../extra/damage_curve_skill/01_workflows/ADD_NEW_CELL_WORKFLOW.md)
- [Validation and QC guide](../../../extra/damage_curve_skill/04_validation_qc/VALIDATION_QC_GUIDE.md)
- [Machine-readable artifact standard](../../../contracts/standards/20_machine_readable_artifact_standard.md)
- [Asset-to-artifact mapping standard](../../../contracts/standards/24_asset_to_artifact_mapping_standard.md)
- [Durable publication standard](../../../contracts/standards/23_durable_publication_standard.md)
- [Artifact release guide](../../../guides/releasing_a_damage_artifact.md)
- [Hazard Damage registrar](../../../../Hazard_modeling/scripts/governance/register_damage_artifacts.py)
- [Hazard Deep Damage loader](../../../../Hazard_modeling/drivers/deep/src/deep/damage_loader.py)

## Package limits and refresh triggers

This team-shared package explains the as-built system as of 2026-08-27. Refresh the current-state matrix when any of the following occurs:

- a current local artifact is promoted;
- a GCS Damage manifest is added or archived;
- `damage_artifact_ref` gains or loses a coordinate;
- Hazard replaces a local/vendored Damage path with the registered loader;
- the artifact schema, cap-binding rules, or asset-to-artifact mapping standard changes;
- the first corrected Wildfire × Solar detailed Deep execution establishes a better worked example.
- the D3.5 owner review changes the proposed reporting-grain, database, or scientific-direction conclusions.

The scientific and operational authorities linked above take precedence if this explanatory package becomes stale.
