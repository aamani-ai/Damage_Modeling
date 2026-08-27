---
author: owner-directed (Divy) · agent-drafted
created: 2026-08-27
updated: 2026-08-27
status: draft
scope: team-shared design reasoning and trade-offs for the Damage Core lifecycle
authority: non-canonical explanation
sharing: tracked current learning package
---

# Why the Damage Core lifecycle has these boundaries

The workflow has multiple gates because it crosses different kinds of truth: scientific evidence, executable response behavior, durable artifact identity, platform selection, observed plant facts, and Hazard results. Combining those truths into one editable table or one script looks simpler at first, but it makes errors hard to classify and old results hard to reproduce.

```text
If a final loss looks wrong, a separated system can ask:

 source problem? ─► evidence/admission
 curve problem?  ─► response derivation
 value problem?  ─► mapping/value basis
 bytes problem?  ─► publication SHA/schema
 selection issue?► registry
 plant fact issue?► resolver receipt
 hazard issue?   ─► native intensity/coupling
 rollup issue?   ─► Hazard M3/M4

A collapsed system only says: "the result changed."
```

<a id="define-cell"></a>
## 1. Why define the cell first

**Problem and need.** Without a stable peril × asset address, research expands opportunistically and artifacts acquire incompatible meanings. “Wildfire damage” could refer to a solar array, a wind turbine, a substation, or an entire facility; those objects do not share identical failure units, intensity response, spatial support, or value denominators. The cell makes the scientific question bounded before evidence or code is selected.

**Chosen design.** Define a reusable Damage cell independent of a particular plant, then state the intended use grade and output grain. This lets one approved `wildfire_solar` model serve multiple plants while the platform resolver supplies their different observed facts. It also gives decisions, artifacts, publications, and consumer tests one consistent coordinate.

Within the cell, name failure units by modeled target and failure mechanism rather than copying database component names. Damage needs an atom whose response, conditions, value endpoint, and tests remain coherent. A component can fail through several mechanisms, while evidence may support only a composite response across several components. Keeping that scientific identity separate from the platform catalog prevents database structure from silently choosing model physics.

**Alternative considered.** The simpler alternative is to begin from a plant notebook and encode whatever components are immediately available. That can produce a quick number, but the resulting method is difficult to reuse and may accidentally treat one plant’s data limitations as universal model semantics. Another alternative is one peril-wide curve, which hides asset-specific vulnerability.

**Trade-offs and assumptions.** A bounded cell requires early choices about peril vocabulary, asset taxonomy, and claim. Some choices will later need revision as evidence improves. The assumption is that the pairing is scientifically coherent enough to share response behavior across assets of that class.

**Non-claim.** A defined cell does not prove that adequate evidence exists, that a particular plant contains every failure unit, or that the resulting use is bankable.

**Revisit condition.** Revisit the cell boundary when a new asset subtype has materially different response behavior, the intensity measure changes, or consumer experience shows that one cell contains incompatible physical populations.

[What the cell is](what.md#define-cell) · [How to define it](how.md#define-cell) · [Package gateway](README.md)

<a id="map-coverage"></a>
## 2. Why map coverage before building

**Problem and need.** Repositories often contain several partial representations of the same work: an evidence note, a proposed artifact, a current local artifact, a GCS publication, a registry row, and a local Hazard adapter. Without a coverage map, an agent may rebuild valid science, overwrite a newer direction, or describe a distribution gap as a curve gap. The need is to classify the actual missing state before changing anything.

**Chosen design.** Inspect all lifecycle surfaces and record a dated disposition matrix. This follows the broader one-current-representation principle while preserving immutable history. The matrix separates scientific completeness from publication, registration, and consumption, so work begins at the earliest genuinely missing gate.

**Alternative considered.** One alternative is to trust a README status paragraph. It is fast, but status prose can lag executable code and live manifests. Another is to scan only current artifact files, which misses whether consumers can resolve them. A full repository rewrite is also an alternative, but it spends effort without first identifying measured duplication or a broken boundary.

**Trade-offs and assumptions.** Coverage mapping costs time and can expose conflicting status claims that require owner judgment. It assumes the investigator can read the relevant repositories and, for live status, the development GCS and database. A dated map will itself become stale, so evidence links matter more than its counts.

**Non-claim.** A row marked `approved-current` does not imply it is published, registered, or production-consumed. A missing registry row does not prove the scientific model is invalid.

**Revisit condition.** Revisit coverage whenever a release, manifest, registry migration, consumer cutover, or contract change alters one of the measured surfaces.

[What coverage records](what.md#map-coverage) · [How to map it](how.md#map-coverage) · [Package gateway](README.md)

<a id="research-evidence"></a>
## 3. Why research must preserve extracted claims

**Problem and need.** A list of citations is insufficient for curve work because reviewers need to know exactly which reported quantity, test condition, component, and uncertainty supports each model choice. Without claim-level extraction, a later contributor cannot tell whether a curve came from measured damage, expert judgment, an insurance loss ratio, or an undocumented interpolation.

**Chosen design.** Preserve source identity and extracted claims before admission. Keep raw or governed source material, exact locators, units, context, limitations, and candidate model relevance. This makes evidence reusable even if the eventual model decision changes and prevents the final JSON from becoming the only place where source interpretation survives.

**Alternative considered.** The lightweight alternative is to copy a curve from a legacy library and cite the library. That may be defensible as a temporary proposed baseline, but it inherits unknown transformations and weakens review. Another alternative is broad autonomous web collection; it increases volume but can lower traceability unless every claim is normalized and judged.

**Trade-offs and assumptions.** Claim extraction is labor-intensive, especially for figures that require digitization or unit conversion. It assumes access rights permit the source to be stored or at least precisely referenced. Sparse evidence may remain sparse after careful research; the process improves honesty, not necessarily certainty.

**Non-claim.** A well-recorded source does not prove the claim is applicable to the target cell, and multiple citations do not automatically create independent evidence.

**Revisit condition.** Revisit the evidence set when a new primary source, claims dataset, engineering test, or source-quality correction could materially affect response, mapping, cap, condition, or allowed use.

[What an evidence record contains](what.md#research-evidence) · [How to research](how.md#research-evidence) · [Package gateway](README.md)

<a id="judge-evidence"></a>
## 4. Why evidence admission is a separate judgment

**Problem and need.** Relevant-looking evidence can still be incompatible with the model. A study may use a different intensity definition, asset construction, geography, damage denominator, event scale, or repair-cost basis. Without a separate admission decision, source facts silently become scientific choices and conflicts disappear inside a smooth curve.

**Chosen design.** Judge each material claim and record its role: admitted directly, admitted with transformation, contextual only, deferred, or rejected. State uncertainties and non-claims beside the decision. This preserves a defensible chain from source to executable behavior and gives the owner a focused review surface.

**Alternative considered.** One alternative is to average all available estimates. That can appear objective but assumes comparability and independence that may not exist. Another is to choose the most conservative estimate by default. Conservative relative to one denominator may be misleading relative to another, and an unsupported upper value is not automatically safer science. Deferring a failure unit is sometimes better than inventing precision.

**Trade-offs and assumptions.** Judgment introduces expert discretion and may slow automation. It requires explicit assumptions about transferability and use grade. The benefit is that discretion becomes reviewable instead of hidden. Uncertainty labels are only useful if later consumers preserve them.

**Non-claim.** Admission does not prove universal truth, eliminate uncertainty, or validate a specific plant’s composition. Rejection does not mean a source is poor in every context.

**Revisit condition.** Revisit the verdict when evidence changes, a consumer exposes an incompatible denominator, or model validation shows behavior outside the admitted evidence envelope.

[What the judgment produces](what.md#judge-evidence) · [How to judge](how.md#judge-evidence) · [Package gateway](README.md)

<a id="derive-response"></a>
## 5. Why response derivation stays explicit and typed

**Problem and need.** Hazard needs executable behavior, while sources usually provide observations, ranges, class descriptions, or sparse points. Without an explicit derivation layer, interpolation, normalization, capping, and threshold choices become invisible code details. That makes two implementations of the “same” curve disagree and makes boundary failures hard to detect.

**Chosen design.** Represent each failure unit’s intensity-to-damage behavior in a typed schema with exact units, domain, interpolation, conditions, caps, and known-answer cases. A failure-unit ID combines its model namespace, physical target, and mechanism so `module thermal` remains distinguishable from another module failure pathway. Keep frequency outside the Damage response so the same severity model can be coupled to appropriate Hazard occurrence evidence.

**Alternative considered.** A free-form Python function is simpler for one notebook, but it lacks a portable contract and can conceal unsupported extrapolation. A single asset-average curve reduces row count but prevents correct mapping and later observed-subsystem use. Making every database component one failure unit appears tidy but incorrectly assumes that asset taxonomy and vulnerability mechanisms have identical cardinality. Fixed class tables may be preferable to continuous interpolation when evidence is genuinely categorical.

**Trade-offs and assumptions.** Typed response forms constrain what can be represented and may require schema evolution for novel behavior. Composite failure units sacrifice component detail; splitting one component by mechanism adds rows and mapping work. Interpolation rules carry assumptions between observed points. Monotonicity can be appropriate for many severity responses but should not be imposed when physics supports non-monotonic behavior.

**Non-claim.** A precise schema does not make sparse evidence precise, and a passing known-answer test does not prove real-world calibration or event frequency. A failure-unit name does not assert that the target is observed at any particular plant.

**Revisit condition.** Revisit derivation when new data changes response shape, a supported condition cannot be expressed, consumer implementations disagree, or validation identifies implausible boundary behavior.

[What a response definition is](what.md#derive-response) · [How to derive it](how.md#derive-response) · [Package gateway](README.md)

<a id="connect-value"></a>
## 6. Why value mapping is not embedded in the curve

**Problem and need.** A damage ratio has no financial meaning without a denominator. Applying a module damage ratio to total installed plant cost can overstate loss; omitting support or soft costs without disclosure can understate or mislabel coverage. Without a separate value map, physical vulnerability and accounting assumptions become inseparable.

**Chosen design.** Let Damage declare the value-bucket semantics and failure-unit mapping, while the platform/Hazard run supplies the selected plant value assertion. Treat subsystem/component code compatibility and plant evidence as separate dimensions: an exact code join authorizes a reporting address, while observed/reference/placeholder status determines the claim. Preserve direct physical, support/fieldwork, excluded soft cost, and withheld value as distinct lines. Allocate support once using a declared rule after direct damage is computed.

**Alternative considered.** A single percent-of-TIV curve is convenient and may be acceptable for some coarse external models, but it cannot use richer observed subsystem data and can double-count mixed buckets. Fuzzy component matching could force every failure unit into a finer output, but it would invent precision for composite labels such as transformer/switchgear. Another alternative is storing all component costs in the asset database as universal truth. That confuses reference model composition with observed plant valuation and creates maintenance obligations the database cannot support.

**Trade-offs and assumptions.** Detailed mapping adds rows and requires stable identifiers across Damage and platform vocabularies. `subsystem_only` reporting is less detailed but more honest than guessed component attribution. Reference weights remain assumptions when observed allocation is unavailable. Support allocation can affect subsystem rollups even if the plant total is unchanged, so its rule must be visible.

**Non-claim.** A reference cost composition does not prove the plant’s observed TIV or component replacement cost. An exact subsystem/component code join does not prove an observed plant instance. A reconciled total does not prove every bucket is independently accurate.

**Revisit condition.** Revisit value mapping when the platform gains observed subsystem value, the Damage component set changes, support-cost semantics change, or aggregate parity fails after a consumer update.

[What value connection contains](what.md#connect-value) · [How to connect value](how.md#connect-value) · [Package gateway](README.md)

<a id="package-cell"></a>
## 7. Why the cell needs both machine and human packages

**Problem and need.** Code needs deterministic fields, while reviewers need evidence, reasoning, limitations, and allowed-use explanation. Without a machine artifact, every consumer reinterprets prose. Without human documentation, a valid JSON file can be structurally correct yet scientifically opaque.

**Chosen design.** Package one typed artifact with companion cell documentation and evidence references. Keep model identity separate from documentation revision so explanatory improvements do not falsely appear to change scientific behavior. Make mappings, capabilities, cap bindings, and value semantics first-class rather than consumer-side conventions.

**Alternative considered.** A notebook-only package combines narrative and execution, but notebooks are stateful, hard to validate as interfaces, and unsuitable as production publishers. A database-only representation makes querying convenient but weakens source-controlled review and durable release identity. A single flat table is simpler until conditional curves, composite failure units, or several mappings appear.

**Trade-offs and assumptions.** Dual human/machine surfaces can drift, so validation must cross-check them and current navigation. The schema imposes maintenance and may need migration. The assumption is that deterministic serialization and typed identifiers are worth that cost for cross-repository use.

**Non-claim.** Packaging does not approve the science, publish it, register it, or show that a Hazard pair is production-ready. Documentation completeness does not substitute for executable tests.

**Revisit condition.** Revisit the package contract when consumers need a meaning that cannot be represented, repeated drift appears between docs and JSON, or a simpler representation can preserve the same tested semantics.

[What the package contains](what.md#package-cell) · [How to package it](how.md#package-cell) · [Package gateway](README.md)

<a id="review-model"></a>
## 8. Why owner review is an explicit gate

**Problem and need.** Many model choices are not mechanically decidable: evidence transferability, acceptable conservatism, reference composition, claim grade, and whether a missing subsystem blocks release. Without owner review, a passing validator can be mistaken for scientific approval and agent-made assumptions can become product truth.

**Chosen design.** Present a bounded decision package that separates settled evidence, proposed choices, unresolved questions, non-claims, and validation evidence. Record the owner verdict and any conditions in the governed release surfaces. This preserves accountability while still allowing agents to do the heavy research, extraction, comparison, and test preparation.

**Alternative considered.** Automatic promotion after tests is appropriate for purely mechanical changes but not for new scientific meaning. Informal chat approval is faster, yet it can omit conditions and is hard for later maintainers to discover. Committee review for every documentation correction would be excessive; the change classifier identifies when scientific review is required.

**Trade-offs and assumptions.** Review creates a scheduling dependency and can become vague if the package asks broad questions. It assumes the owner receives concise alternatives and consequences rather than raw files alone. Conditional approval requires follow-up tracking so the condition is not forgotten.

**Non-claim.** Owner acceptance does not eliminate model uncertainty, certify a bankable use, or prove observed plant completeness. It confirms the declared method and claim within stated limits.

**Revisit condition.** Revisit approval when scientific semantics, mapping, allowed use, material evidence, or unresolved conditions change; documentation-only clarification can follow the lighter classified path.

[What review decides](what.md#review-model) · [How to run review](how.md#review-model) · [Package gateway](README.md)

<a id="validate-promote"></a>
## 9. Why validation and promotion precede distribution

**Problem and need.** A syntactically valid artifact can still have negative ratios, broken caps, ambiguous mappings, unreconciled value, duplicate identifiers, or wrong known-answer outputs. Without a promotion gate, “current” can mean only “newest file,” and downstream systems can publish an object that the repository itself has not accepted.

**Chosen design.** Run layered validation, prove deterministic behavior, and then update the cell’s current pointer/index while preserving superseded releases. Distribution operates only on the exact promoted file. This separates scientific current status from GCS and database states while connecting them through hashes and identities.

**Alternative considered.** Consumers could validate every local candidate on load, but that repeats work and allows unapproved objects to circulate. Validation only during publication is another alternative; it delays feedback and makes local current status unreliable. Deleting superseded versions would simplify the tree but destroy historical reproduction and review context.

**Trade-offs and assumptions.** Comprehensive gates increase test maintenance and can block a release for an overly strict invariant. Some scientific properties cannot be proven by unit tests and remain owner judgments. The validation suite assumes its fixtures cover meaningful boundaries, not only happy paths.

**Non-claim.** Passing tests does not prove empirical calibration, complete uncertainty characterization, or production consumption. Local promotion does not update GCS or the platform registry.

**Revisit condition.** Revisit validation rules when a false pass reaches a consumer, a valid model form is blocked, schema semantics change, or a known incident reveals a missing invariant.

[What validation and promotion create](what.md#validate-promote) · [How to validate and promote](how.md#validate-promote) · [Package gateway](README.md)

<a id="publish-artifact"></a>
## 10. Why publication is immutable and manifest-last

**Problem and need.** Local repository paths can move, branches differ, and files can be edited. Hazard results need the exact approved Damage bytes years later. A multi-object upload can also fail partway; without a completion rule, consumers may read a partial package as valid.

**Chosen design.** Publish to an absent GCS prefix with create-only writes, verify content hashes, and upload `manifest.json` last. The manifest is both inventory and completion marker. A consumer refuses a prefix without the valid final manifest and verifies the selected artifact SHA before use.

```text
unsafe overwrite                    governed publication
----------------                    --------------------
same URI, changing bytes            new absent prefix
unknown partial upload              objects first
consumer trusts path                remote SHA verification
no completion signal                manifest last
old run cannot reproduce            historical prefix retained
```

**Alternative considered.** A mutable `latest.json` is simpler for callers but can silently change historical meaning. Packaging the bytes only in Git is insufficient for deployed consumers and large durable artifacts. A database blob could preserve bytes, but it duplicates object storage and couples scientific release size to operational tables.

**Trade-offs and assumptions.** Immutability consumes storage and requires new coordinates for corrected releases. Failed partial prefixes need explicit inspection rather than blind retry. The design assumes GCS durability and permission controls are governed correctly.

**Non-claim.** Publication does not make the model scientifically better, select it for a workspace, or execute Hazard. A valid SHA proves byte identity, not scientific validity.

**Revisit condition.** Revisit the publication protocol if storage guarantees, schema packaging, atomicity mechanisms, or consumer requirements materially change; never weaken historical reproducibility merely for a shorter URI.

[What gets published](what.md#publish-artifact) · [How to publish safely](how.md#publish-artifact) · [Package gateway](README.md)

<a id="register-artifact"></a>
## 11. Why a platform registry exists in addition to GCS

**Problem and need.** GCS can store many valid immutable releases, but it does not by itself express which coordinate a development workspace or production consumer should select. Hard-coded URIs in Hazard code spread selection policy across repositories and require code changes for every approved release.

**Chosen design.** Store a small queryable row in `damage_artifact_ref` that points to the content-pinned publication and carries its coordinate and SHA. The registrar consumes the manifest-provided row so registration cannot invent a different identity. Hazard resolves the row, then independently verifies GCS content.

**Alternative considered.** A single GCS `current` pointer is simpler but does not naturally support workspace/variant selection, relational validation, or platform access rules. Embedding full curves in the registry would remove a fetch, but it creates duplicate mutable scientific content and makes cross-repository hash discipline harder. Hard-coding local files remains acceptable only for explicitly bounded experiments.

**Trade-offs and assumptions.** The registry adds a database migration and operational handoff. It can drift from GCS if inserts are manual or validation is weak. The approach assumes active-row cardinality and environment rules are explicit and that production cannot be touched by a development workflow.

**Non-claim.** A registry row does not contain the scientific artifact, prove that the GCS prefix is complete, or guarantee a Hazard adapter supports the schema. Registration is selection eligibility, not automatic release to every surface.

**Revisit condition.** Revisit the registry design when platform selection needs richer workspace/variant semantics, stale rows become common, or a governed manifest discovery service can provide equal queryability and access control with less state.

[What registration creates](what.md#register-artifact) · [How to register](how.md#register-artifact) · [Package gateway](README.md)

<a id="consume-in-hazard"></a>
## 12. Why Hazard must verify, retain detail, and receipt the run

**Problem and need.** Final plant loss joins scientific response, observed asset facts, hazard support, value, and configuration. These inputs evolve independently. Without verification and an immutable receipt, old results can no longer be explained. Without detailed rows, an apparently small aggregate change cannot be traced to a curve, mapping, geometry, value assertion, or support rule.

**Chosen design.** Resolve registry → fetch GCS → verify SHA/schema → run peril-specific known-answer checks → intersect artifact mappings with labeled plant facts → calculate failure-unit rows → apply support once → roll up to subsystems and plant → write immutable run evidence and a current database projection. Full detail and history stay in GCS; the relational database keeps only selected current headlines, availability/value status, and lineage pointers. This keeps the asset database live for new runs without recreating a snapshot, run-ledger, or Damage-detail lifecycle.

**Alternative considered.** Loading the newest local artifact is convenient but not deployable or reproducible. Averaging hazard at plant level before response reduces data volume but can erase different subsystem supports and nonlinear response. Storing every detailed row in a new relational table improves ad hoc querying but duplicates immutable history and creates another retention/version lifecycle before a real cross-run query has earned it. A typed relational detail projection can be reconsidered later if an actual consumer needs it.

**Trade-offs and assumptions.** Detailed execution costs more object storage and requires consumers to open a run package for full anatomy. Reference/default composition may be necessary for screening when observations are incomplete, but it lowers the claim. The design assumes every basis label and artifact/input SHA is propagated to outputs and that the thin database projection defines zero, unavailable, withheld, failed, and stale separately.

**Non-claim.** A complete technical chain does not make a result bankable, convert placeholders into observations, or resolve conflicting plant capacity automatically. Exact detail-to-aggregate parity proves calculation/accounting consistency, not scientific calibration or observed composition. Zero is not interchangeable with unknown.

**Revisit condition.** Revisit the consumer contract when output queries require a new governed projection, observed subsystem data expands, a new artifact mapping form appears, or aggregate reproduction and detailed parity no longer hold.

[What Hazard consumption produces](what.md#consume-in-hazard) · [How to consume it](how.md#consume-in-hazard) · [Package gateway](README.md)
