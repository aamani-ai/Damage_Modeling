---
author: owner-directed (Divy) · agent-drafted
created: 2026-08-27
updated: 2026-08-27
status: draft
scope: team-shared repeatable operator runbook for the Damage Core lifecycle
authority: non-canonical explanatory companion to linked workflows and standards
sharing: tracked current learning package
---

# How to run the Damage Core lifecycle

This is the operator view. Every section is a run card with an outcome, required inputs, owner, ordered actions, pass and stop gates, handoff, and a request that can be copied to another agent. The linked Damage workflow or standard remains authoritative if a detail changes.

Before any step:

1. Read the target repository’s `AGENTS.md` and preserve unrelated work.
2. Identify whether the task is read-only, proposed work, an approved current-state change, GCS publication, development registration, or production consumption.
3. Run the [Damage change classifier](../../../extra/damage_curve_skill/00_governance/CHANGE_CLASSIFIER.md) before editing canonical Damage surfaces.
4. Keep production credentials, production database state, and public results out of an exploratory run.
5. Record exact repository commits, artifact identities, dates, and live surfaces inspected.

The normal operator handoff looks like this:

```text
scope card
   ↓
coverage/disposition matrix
   ↓
evidence + admission ledger
   ↓
response + value design
   ↓
candidate cell package
   ↓ owner verdict
validated local current artifact
   ↓ publish receipt
GCS manifest
   ↓ registration review
development registry row
   ↓ consumer admission test
Hazard run package + DB projection
```

<a id="define-cell"></a>
## 1. Define the cell — run card

**Outcome:** an unambiguous scope card for one peril × asset cell, with intended use and no false release claim.

| Item | Required content |
|---|---|
| Starting inputs | Requested peril, asset, consumer need, known intensity data, known database facts |
| Primary owner | Damage scientific owner; Hazard owner supplies consumer need |
| Primary authority | [Add-new-cell workflow](../../../extra/damage_curve_skill/01_workflows/ADD_NEW_CELL_WORKFLOW.md) |
| Output | Cell ID, scope boundary, candidate failure units, intended claim, open questions, initial state |

**Procedure**

1. Normalize the address as `<hazard>_<asset>`. Split materially different physical pathways instead of hiding them under an ambiguous label.
2. Run the change classifier. Use `NEW_CELL_SCAFFOLD` when there is no reviewed runtime curve and `NEW_CELL_MODEL_RELEASE` only when the complete scientific release is actually intended.
3. Write the scope answers required by Phase 1 of the workflow: included damage mechanisms, explicitly deferred mechanisms, candidate hazard axis, relevant asset metadata, plausible failure units, and implicated value buckets.
4. For every candidate failure unit, state the physical target, failure mechanism, independent response reason, value endpoint, and whether the unit is one component, a split mechanism on one component, or a defensible composite.
5. Give the unit a stable model-scoped ID. Do not use a platform component code as the ID unless the scientific unit genuinely has the same meaning and cardinality.
6. State the consumer claim: exploratory, screening, calibrated, or another governed grade. Name what the result will not support.
7. Record whether the cell is plant-independent and which details the platform must later provide.
8. Identify the owner decisions needed before evidence research expands.

**Failure-unit candidate card**

| Field | Question |
|---|---|
| ID | Is it stable and model-scoped? |
| Target | What physical thing or composite is acted upon? |
| Mechanism | How does it fail under this peril? |
| Separate response | Why can this not safely share another unit’s curve? |
| Value endpoint | What denominator does its damage ratio act on? |
| Platform mapping | Exact component, subsystem-only, or unresolved? |
| Plant dependency | Which observed facts will later determine applicability? |

**Pass gate:** another reader can distinguish this cell from adjacent hazards/assets, list its v1 inclusions and exclusions, and explain why it is a scaffold, candidate, or update. **Stop gate:** the hazard pathway, intensity definition, asset boundary, or intended claim is still ambiguous.

**Illustrative example:** `wildfire_solar` is reusable Damage science. `Hayhurst wildfire analysis` is not a new cell; it is a plant-specific Hazard consumption of that cell.

**Copyable request**

> Use the Damage Curve Library Governance skill to define the `<hazard>_<asset>` cell. Run the change classifier, read the add-new-cell workflow, and return a scope card with included/deferred mechanisms, candidate intensity axis, failure units, value buckets, intended claim grade, database facts the consumer will require, owner questions, and explicit non-claims. Do not create a v1.0 release or numeric curve unless the evidence and review gates justify it.

**Handoff:** give the scope card and cell ID to Step 2.

[What this step creates](what.md#define-cell) · [Why it comes first](why.md#define-cell) · [Package gateway](README.md)

<a id="map-coverage"></a>
## 2. Map coverage — run card

**Outcome:** a dated, evidence-backed matrix showing the cell’s scientific, publication, registration, and Hazard-consumption states.

**Starting inputs:** the cell ID from Step 1, Damage and Hazard repository access, and read access to the intended GCS environment and development modeling database when live status matters. The investigator owns the audit; owners decide disposition where evidence conflicts.

**Procedure**

1. Inspect `docs/cells/<cell>/` for `current/`, `proposed/`, `archive/`, README, derivation dossier, metadata spec, known-answer tests, validation report, and changelog.
2. Inspect `docs/contracts/machine_readable_artifact_index.json` and recompute the current artifact SHA rather than trusting filename recency.
3. Inspect the governed GCS namespace for a completed `manifest.json` matching the exact model/docs identity.
4. Inspect `damage_artifact_ref` in the development modeling plane for a matching URI and SHA. Never print the database URL.
5. Search Hazard code, tests, plans, notebooks, and implementation docs for local, vendored, registered, and production consumption.
6. Classify each surface and recommend `keep`, `complete`, `repair`, `supersede`, or `archive`; do not delete merely because two names look similar.

A useful local inventory command is:

```bash
jq -r '.artifacts[] | [.cell_id, .consumer_pin, .sha256, .path] | @tsv' \
  docs/contracts/machine_readable_artifact_index.json
```

**Pass gate:** every status statement cites an exact file, manifest, row, or code path and a date. **Stop gate:** current and proposed identities conflict, the GCS prefix is partial, the database plane is uncertain, or unrelated work would be displaced.

**Real example:** on 2026-08-27, Tropical Cyclone Wind × Wind v1.2 was locally current and published but absent from the development registry. Flood Wind and Wildfire Wind were locally current but no current manifests or registry rows were found. Those are distinct missing gates.

**Copyable request**

> Audit `<cell_id>` across Damage current/proposed/archive, the machine-readable index and SHA, GCS publication manifests, the development `damage_artifact_ref` registry, and Hazard consumers. Return a dated disposition matrix that separates approved-local, published, registered, experimental-consumer, and canonical-consumer states. Do not mutate or consolidate anything; flag conflicts for owner review.

**Handoff:** route to the earliest missing step: Step 3 for scientific gaps, Step 10 for publication-only gaps, Step 11 for registration-only gaps, or Step 12 for consumer gaps.

[What coverage means](what.md#map-coverage) · [Why it precedes change](why.md#map-coverage) · [Package gateway](README.md)

<a id="research-evidence"></a>
## 3. Research and extract evidence — run card

**Outcome:** a traceable claim-level evidence package, not an unreviewed replacement curve.

| Input | Owner/check |
|---|---|
| Scope and failure-unit candidates | From Steps 1–2 |
| Existing source register and legacy library | Investigator checks duplication and provenance |
| New papers, reports, claims, tests, or source drop | Investigator records rights and exact locator |
| Research questions | Scientific owner confirms priorities |
| Primary authority | [Evidence-ingestion workflow](../../../extra/damage_curve_skill/01_workflows/EVIDENCE_INGESTION_WORKFLOW.md) |

**Procedure**

1. Classify each source’s role and quality tier using the current evidence workflow.
2. Preserve source identity: title, authors/organization, date, URL or repository path, page/figure/table locator, and retrieval date.
3. Extract one material claim per record. Record original units, test conditions, sample/geography, asset/component, damage endpoint, and exact limits.
4. Build the source-to-parameter map. A source can support a mechanism without supporting a threshold, ordinate, converter, or whole-asset transfer.
5. Reproduce equations, digitized points, and displayed tables. Record every unit conversion and numerical discrepancy.
6. Compare with legacy evidence and existing cell sources; retain conflicts rather than averaging them silently.
7. Classify whether the new evidence changes outputs, changes only rationale, contradicts the current model correctly, or exposes a model defect.

```text
source file/report
      ↓ exact locator
extracted claim
      ↓ units + conditions + endpoint
source-to-parameter candidate
      ↓ Step 4 judgment
admitted use / contextual only / rejected / deferred
```

**Pass gate:** every load-bearing numerical or mechanistic claim can be traced to a locator and a permitted inference. **Stop gate:** the source cannot be lawfully accessed, units or endpoint cannot be reconciled, or the proposed number cannot be reproduced.

**Copyable request**

> Use the Damage evidence-ingestion workflow for `<cell_id>` and research question `<question>`. Preserve source files or precise locators, extract claim-level records with original units and conditions, build the source-to-parameter map, reproduce proposed equations/tables, compare legacy material, and classify whether outputs would change. Return evidence and conflict ledgers; do not choose or edit the canonical curve yet.

**Handoff:** submit the evidence ledger, reproduction notes, and conflicts to Step 4.

[What evidence research produces](what.md#research-evidence) · [Why claim extraction matters](why.md#research-evidence) · [Package gateway](README.md)

<a id="judge-evidence"></a>
## 4. Judge evidence — run card

**Outcome:** an admitted evidence set with explicit rejections, uncertainty, and permitted model roles.

**Starting inputs:** Step 3’s claim-level ledger, the cell scope, existing parameters, current response behavior, the intended claim grade, and owner review questions. The scientific owner owns the final judgment; the agent prepares comparison and pressure testing.

**Procedure**

1. For each claim, compare hazard variable, units, asset/component, damage endpoint, construction, geography, test/event conditions, and value denominator with the target cell.
2. Assign a role: direct parameter evidence, transformation evidence, qualitative mechanism support, boundary/cap evidence, contextual comparator, deferred, or rejected.
3. Assign the parameter tier and explain why higher-quality evidence is or is not available. Use the [parameter-tier guide](../../../extra/damage_curve_skill/02_design_guides/PARAMETER_TIER_AND_RATIONALE.md).
4. Pressure-test proposed numerical use: zero and boundaries, inverse conversions, asymptotes, source endpoints, dollar denominators, uncertainty bands, and pathway identity.
5. Present competing interpretations and consequences. Do not average conflicting claims unless a reviewed synthesis method justifies it.
6. Record accepted transformations, uncertainties, non-claims, open seams, and the exact trigger that would reopen each decision.
7. Obtain the owner’s bounded verdict before Step 5 uses a disputed choice.

**Decision table**

| Verdict | Meaning | Next action |
|---|---|---|
| Admit directly | Source variable and endpoint align | Parameter candidate |
| Admit with transformation | Transformation is reproducible and justified | Preserve formula and uncertainty |
| Context only | Relevant but not parameter evidence | Cite in rationale, not curve |
| Defer | Potential value, unresolved condition | Track trigger; no numeric fallback |
| Reject | Incompatible or irreproducible | Preserve reason; exclude runtime numbers |

**Pass gate:** every proposed model feature has an admitted basis or a clearly labeled owner assumption. **Stop gate:** the only support requires an unjustified converter, incompatible endpoint, or false precision.

**Illustrative example:** a wildfire source may support module thermal damage as a mechanism while failing to support a specific flame-length-class damage ratio. Admit the mechanism, defer the ordinate, and avoid a smooth invented curve.

**Copyable request**

> Review the claim ledger for `<cell_id>`. For each material claim, decide direct admission, transformed admission, context, deferral, or rejection; assign parameter tier; pressure-test numbers and endpoints; preserve conflicts; list uncertainty, non-claims, and reopen triggers; and prepare the exact owner questions. Do not alter the runtime artifact until the owner verdict is recorded.

**Handoff:** send the admitted parameter/method bundle to Step 5 and value/mapping claims to Step 6.

[What evidence judgment is](what.md#judge-evidence) · [Why it is separate](why.md#judge-evidence) · [Package gateway](README.md)

<a id="derive-response"></a>
## 5. Derive the response — run card

**Outcome:** one typed, reproducible intensity-to-damage definition per supported failure unit, with known-answer cases.

**Primary authorities:** [x-axis selection](../../../extra/damage_curve_skill/02_design_guides/X_AXIS_SELECTION.md), [curve-form selection](../../../extra/damage_curve_skill/02_design_guides/CURVE_FORM_SELECTION.md), and the cell’s admitted evidence. The Damage modeler prepares the derivation; the scientific owner approves its meaning.

**Procedure**

1. Define the incoming intensity variable, units, valid domain, spatial/time support, and exact M2-to-M3 handoff.
2. Choose the response form that matches evidence: discrete class lookup, continuous/piecewise curve, formula, or a withheld response. Record rejected alternatives.
3. Confirm that each failure unit’s target, mechanism, response, and value endpoint form one coherent calculation atom. Split a unit when mechanisms require different functions; keep a composite only when evidence/value cannot defend a finer split.
4. Name the unit with a model/version namespace plus target and mechanism. Keep its subsystem/component mapping in separate fields.
5. For every failure unit, declare curve parameters, interpolation, thresholds, conditions, extrapolation behavior, and cap binding.
6. Keep selector, conditioner, exposure modifier, and damage response distinct. A site condition should not silently change the base curve when it belongs in a declared adapter.
7. Calculate expected outputs independently for zero, lower/upper boundary, interior positive, cap, invalid/missing, and unsupported failure-unit cases.
8. Compare old and new outputs when updating a cell. List maximum and decision-relevant differences.
9. Emit deterministic records in the current artifact schema, but retain proposed state until Steps 8–9.

```text
native hazard evidence
       ↓ unit/pathway check
intensity presented to Damage
       ↓ selector/conditioner eligibility
failure-unit response f(intensity)
       ↓ cap and domain policy
damage ratio in [0, 1] or explicit withheld/error state
```

**Naming worked example**

```text
WSV1_MODULE_THERMAL
 │     │       │
 │     │       └── mechanism used to choose/justify the response
 │     └────────── physical target receiving that response
 └──────────────── model/version namespace preventing ambiguous reuse

separate mapping fields:
  subsystem_code = PV_ARRAY
  component_label = PV_MODULE
```

If future evidence distinguishes several module failure mechanisms, they may become separate failure units even though they still map to `PV_MODULE`. If evidence supports one composite electrical response, one failure unit may remain `subsystem_only` rather than inventing component splits.

**Worked example:** for Wildfire Solar, flame-length class 4 gives `pv_module DR = 0.12` in the current artifact. This test proves the class lookup. It does not include event frequency or plant value.

**Pass gate:** independent known-answer calculations reproduce the artifact, supported ranges behave as declared, and unsupported inputs fail closed. **Stop gate:** the axis cannot be matched to Hazard M2, curve behavior is irreproducible, or the evidence does not justify numeric output.

**Copyable request**

> Derive the `<cell_id>` response from the admitted evidence. Use the axis and curve-form guides; define units/domain/pathway, response form, interpolation, thresholds, conditions, caps, invalid behavior, and one record per failure unit. Produce independent zero/boundary/interior/cap/negative known-answer cases and an old-vs-new comparison when applicable. Keep frequency and plant value outside the response and fail closed where evidence is insufficient.

**Handoff:** send typed response records and KATs to Step 6 for value binding, then Step 7 packaging.

[What response derivation creates](what.md#derive-response) · [Why it is typed](why.md#derive-response) · [Package gateway](README.md)

<a id="connect-value"></a>
## 6. Connect value — run card

**Outcome:** a non-overlapping failure-unit/subsystem/value crosswalk that can accept observed or permitted fallback value without double counting.

**Primary authorities:** [failure-unit selection](../../../extra/damage_curve_skill/02_design_guides/FAILURE_UNIT_SELECTION.md), [value-crosswalk guide](../../../extra/damage_curve_skill/02_design_guides/VALUE_CROSSWALK_GUIDE.md), and [asset-to-artifact mapping standard](../../../contracts/standards/24_asset_to_artifact_mapping_standard.md).

**Procedure**

1. List each artifact failure unit and its declared subsystem/component labels. For composite units, declare the exact component set or a defensible `subsystem_only` mapping.
2. Join subsystem labels against the active platform subsystem-code catalog; fail on missing or ambiguous codes.
3. Join component labels independently. Record `exact` only for a literal canonical code; otherwise record `subsystem_only` rather than using fuzzy matching.
4. In a separate pass, join the mapped unit to the resolved plant receipt and label its evidence lane: observed, placeholder, reference-only, absent, unknown, or withheld. Do not infer observation from catalog compatibility.
5. Assign the response role: primary/secondary nonzero, conditioner only, exposure only, reviewed near-zero, or deferred.
6. Map each failure unit to direct vulnerable value. Separate mixed rows that need allocation.
7. Identify support/logistics/fieldwork value, define its allocation rule, and guarantee it is applied once after direct damage—not independently damaged and scaled again.
8. Identify soft, sunk, nonphysical, or otherwise excluded value. Record withheld value explicitly.
9. Reconcile row totals to the declared value basis and test zero/full-damage limits.
10. Define consumer behavior for every evidence lane. Do not let an unknown share default to one.

```text
failure unit      subsystem             value treatment
------------      ---------             ---------------
pv_module      ─► PV_ARRAY/PV_MODULE ─► direct vulnerable bucket
inverter       ─► INVERTER_SYSTEM    ─► direct vulnerable bucket
field support  ─► separate value line ─► allocated once by declared rule
soft cost      ─► no physical mapping ─► excluded/withheld and disclosed
```

Run the audit as two separate joins:

```text
PASS A · VOCABULARY
failure unit ─► exact subsystem code ─► exact component OR subsystem_only

PASS B · PLANT EVIDENCE
mapped failure unit ─► resolved plant record ─► observed/reference/placeholder/absent/unknown

Never replace PASS B with the success of PASS A.
```

**Wildfire mapping example:** ten failure units pass the subsystem-code join. Inverter and combiner both map to `INVERTER_SYSTEM`, so ten physical contributions later form nine subsystem totals. Only `PV_MODULE` and `COMBINER_BOX` pass the exact component-code join. Hayhurst observation is narrower still: the PV-array lane is observed; the combiner remains a placeholder/reference calculation despite its exact component code.

**Worked example:** `0.12 × 291.214851 USD/kWdc = 34.94578212 USD/kWdc` is the Wildfire Solar module direct loss for class 4 under the reference module value. It is not a Hayhurst whole-plant loss. The plant run must label whether the value is observed or reference.

**Pass gate:** direct + support + excluded/withheld categories reconcile exactly and every modeled failure unit has an unambiguous mapping. **Stop gate:** fuzzy name matching, overlapping value rows, unclear denominator, or support double counting remains.

**Copyable request**

> Build or audit the `<cell_id>` failure-unit-to-subsystem/component and value crosswalk. Use Standard 24 and the value guide; preserve exact mapping cardinality; separate direct, mixed, support-once, excluded, and withheld value; reconcile totals; and specify observed/reference/default/absent/placeholder/unknown consumer behavior. Return row-level equations and parity tests. Do not write reference weights into the platform as observed facts.

**Handoff:** provide the response records, mapping, value basis, and reconciliation tests to Step 7.

[What value connection is](what.md#connect-value) · [Why it is separate](why.md#connect-value) · [Package gateway](README.md)

<a id="package-cell"></a>
## 7. Package the cell — run card

**Outcome:** a deterministic proposed cell package whose machine and human surfaces say the same thing.

**Starting inputs:** approved scope, evidence/admission registers, derivation, failure-unit and value crosswalks, capability stance, KATs, and version classification. The Damage author assembles; reviewers verify consistency.

**Procedure**

1. Follow the [machine-readable artifact standard](../../../contracts/standards/20_machine_readable_artifact_standard.md) and [package assembly guide](../../../extra/damage_curve_skill/05_release/PACKAGE_ASSEMBLY_GUIDE.md).
2. Create or update the cell README, curve-derivation dossier, metadata spec, JSON curve artifact, known-answer tests, validation report draft, changelog, and useful workbook/audit views.
3. Set exact `cell_id`, semantic model version, documentation revision, artifact/capability schema versions, canonical/proposed state, and package status.
4. Embed failure units, pathway/intensity schema, curve records, mappings, conditions, capability declarations, cap bindings, value semantics, provenance, and update triggers.
5. Ensure rejected or withdrawn numerical arrays do not remain in runtime-shaped records. A valid no-curve scaffold uses empty curve records and `NO_RUNTIME_CURVE` behavior.
6. Serialize deterministically and calculate the candidate SHA. Cross-check every human description against the machine object.

**Artifact review sketch**

```text
human dossier says "foundation deferred"
                 │
                 ├─ JSON has no active foundation curve
                 ├─ capability does not imply full coverage
                 ├─ KAT expects withheld/no numeric output
                 └─ release note names the non-change
```

**Pass gate:** a fresh reader can identify every executable choice and the artifact is independently parseable without notebook state. **Stop gate:** docs and JSON disagree, identity fields conflict, rejected numbers remain executable, or a scaffold pretends to be v1.0.

**Illustrative example:** the Wildfire Solar current artifact is a bundle-v2 object with ten failure units and explicit mappings. A corrected Hazard experiment should read these mappings directly rather than create a handwritten six-group substitute.

**Copyable request**

> Assemble the proposed `<cell_id>` package using Standard 20 and the package guide. Reconcile README, derivation dossier, metadata spec, artifact JSON, KATs, capability/cap bindings, value/mapping declarations, validation draft, changelog, and identity fields. Calculate a deterministic SHA, list rejected numbers kept out of runtime records, and keep the package proposed until scientific review and validation pass.

**Handoff:** send the complete candidate and a concise decision packet to Step 8.

[What the package contains](what.md#package-cell) · [Why human and machine views coexist](why.md#package-cell) · [Package gateway](README.md)

<a id="review-model"></a>
## 8. Review the model — run card

**Outcome:** a recorded owner verdict on scientific method, mapping, capability, and allowed use.

**Primary authorities:** the cell package, [release decision tree](../../../extra/damage_curve_skill/00_governance/RELEASE_DECISION_TREE.md), reportability rules, and the applicable Damage standards. The scientific owner decides; the author prepares a compact, evidence-backed review.

**Procedure**

1. Start with an answer-first summary: proposed coordinate/version, what behavior changes, why, quantitative effect, intended claim, and unresolved risks.
2. Present the evidence chain by failure unit: source → admitted claim → derivation → curve/KAT → value/mapping.
3. Show alternatives rejected and their consequences. Separate Damage-model questions from plant-data questions.
4. Review curve shapes, axes, endpoints, conditions, caps, mappings, support allocation, excluded/withheld value, and capability declarations.
5. Review old-vs-new behavior when updating, including positive, zero, boundary, and unsupported cases.
6. Ask exact decisions, such as “accept reference composition for screening?” rather than “does this look good?”
7. Record `approve`, `approve with named conditions`, `revise`, `defer`, or `reject`, including non-claims and required follow-up.

| Review question | Damage owner decides | Consumer owner later decides |
|---|---:|---:|
| Is the module curve defensible? | Yes | Uses approved artifact |
| Does foundation map to the declared subsystem? | Yes | Verifies plant evidence |
| Does Hayhurst actually have observed foundation data? | No | Yes, from resolver |
| Is a reference-composition screening claim acceptable? | Declares capability | Accepts pair/result grade |

**Pass gate:** the verdict covers scientific semantics and allowed claims, not only file structure. **Stop gate:** owner choices remain implicit, conditions lack an owner/date, or a plant-data gap is being “fixed” inside the Damage artifact.

**Copyable request**

> Prepare an owner review for `<cell_id> <model/docs identity>`. Give the proposed verdict first, then the evidence-to-curve chain, mappings/value basis, old-vs-new outputs, capability and claim grade, alternatives, non-claims, unresolved questions, and exact approve/revise choices. Record the owner’s decision and conditions in the governed release surfaces; do not infer approval from passing tests alone.

**Handoff:** approved or conditionally approved packages move to Step 9; revisions return to the relevant scientific step.

[What review decides](what.md#review-model) · [Why it is explicit](why.md#review-model) · [Package gateway](README.md)

<a id="validate-promote"></a>
## 9. Validate and promote — run card

**Outcome:** the exact approved artifact is verified and becomes the repository’s local current release for its cell.

**Primary authorities:** [validation/QC guide](../../../extra/damage_curve_skill/04_validation_qc/VALIDATION_QC_GUIDE.md), [reportability rules](../../../extra/damage_curve_skill/04_validation_qc/REPORTABILITY_RULES.md), and the update/new-cell workflow selected by classification.

**Procedure**

1. Run structural checks: required files, JSON/schema, rectangular registers, unique IDs/pathways, canonical input fields, and one runtime artifact per released cell.
2. Run semantic checks: grain, units, value basis, selector/conditioner separation, evidence resolution, site-condition and double-counting rules, mapping, and row-level value reconciliation.
3. Run runtime and numerical checks: KATs, invalid ranges, defaults/flags, caps, no-curve fail-closed behavior, pathway negatives, equations, endpoints, asymptotes, and support-once behavior.
4. Run old-vs-new and consumer-pin checks for behavior or schema changes.
5. Execute the repository suite from the Damage repository:

```bash
.venv/bin/python -m pytest tests -q
```

6. Complete the validation report and release note with explicit non-changes.
7. At owner-authorized promotion, preserve the prior current package in its archive coordinate, install the approved package under `current/`, update `docs/cells/VERSION_REGISTRY.md`, update `docs/contracts/machine_readable_artifact_index.json` with the exact SHA, and update governed manifests/change lists required by the workflow.
8. Recompute SHA after the final move and rerun relevant tests. Never alter the artifact after recording the index hash.

```text
candidate ─► schema ─► semantics ─► KATs ─► value parity ─► consumer pin
                 any failure ───────────────► return to owning step
all pass + owner approval ─► archive prior current ─► promote exact candidate
```

**Pass gate:** tests and validation report pass, index SHA matches bytes, one current artifact exists, prior history is preserved, and capability/claim remain honest. **Stop gate:** any mismatch, failing consumer migration, or conditional owner item blocks current status.

**Copyable request**

> Validate the approved `<cell_id>` candidate using the full Damage QC guide. Run structural, semantic, runtime, numerical, mapping/value, KAT, old-vs-new, and consumer-pin gates. Return the validation report and exact SHA. Only if owner authorization is explicit, promote it atomically to local current, preserve the prior current package in archive, update the version registry/index/manifests, and rerun tests. Do not publish to GCS in this step.

**Handoff:** the exact indexed current artifact and KATs go to Step 10.

[What validation/promotion mean](what.md#validate-promote) · [Why they precede distribution](why.md#validate-promote) · [Package gateway](README.md)

<a id="publish-artifact"></a>
## 10. Publish the artifact — run card

**Outcome:** an immutable GCS package with verified bytes and a final valid manifest.

**Starting inputs:** a Step 9 current artifact present in the machine-readable index, matching local SHA, its KATs/schema/supporting files, GCS credentials, target environment, and explicit authorization to publish. The Damage repository owns this act. Follow the [artifact release guide](../../../guides/releasing_a_damage_artifact.md) and [durable publication standard](../../../contracts/standards/23_durable_publication_standard.md).

**Procedure**

1. Recompute the local hash and compare it with the index:

```bash
shasum -a 256 docs/cells/<cell>/current/<artifact>.json
.venv/bin/damage-publish plan --cell <cell_id> --env dev
```

2. Inspect the plan: coordinate, model/docs identity, source commit, target prefix, local files, hashes, schemas, and embedded registry row.
3. Confirm the prefix is absent and that the environment/bucket are correct. A partial prefix is a stop requiring inspection.
4. When authorized, execute create-only publication:

```bash
.venv/bin/damage-publish run --cell <cell_id> --env dev
```

5. Publish schemas only when a genuinely new schema version must join the governed schema set:

```bash
.venv/bin/damage-publish schemas --env dev
```

6. Inspect the local publication receipt and remote `manifest.json`. Recompute or use the publisher’s remote verification to confirm every object hash and that the manifest was written last.

**Pass gate:** one complete manifest names all required files, remote SHA values match, the consumer pin matches Step 9, and no existing prefix was overwritten. **Stop gate:** index/local SHA disagreement, unexpected target, existing/partial prefix, credential ambiguity, or schema mismatch.

**Real example:** Tropical Cyclone Wind × Wind v1.2 had a completed current manifest on 2026-08-27. That allowed byte-stable distribution even though Step 11 registration had not yet occurred.

**Copyable request**

> Plan publication for `<cell_id>` from the Damage current index using the durable publication standard. Report local/index SHA agreement, exact target prefix, files/schemas, source commit, and embedded registry row. Stop on any existing or partial prefix. After I explicitly approve the plan, run create-only development publication, verify remote bytes, confirm `manifest.json` was written last, and return the publication receipt. Do not register the database or touch production.

**Handoff:** provide the manifest URI, artifact URI/SHA, coordinate, and registry row to Step 11.

[What publication creates](what.md#publish-artifact) · [Why it is immutable](why.md#publish-artifact) · [Package gateway](README.md)

<a id="register-artifact"></a>
## 11. Register the artifact — run card

**Outcome:** the completed publication becomes selectable from the development platform registry without copying scientific bytes into the database.

**Starting inputs:** a valid Step 10 manifest, development modeling-plane connectivity, GCS read credentials, and explicit authorization to modify the development registry. Hazard/platform governance owns registration. The current registrar is [register_damage_artifacts.py](../../../../Hazard_modeling/scripts/governance/register_damage_artifacts.py).

**Procedure**

1. Ensure the development database tunnel or approved connection is active. The script guards against the known production host and asserts modeling-plane sentinel tables after connecting.
2. From the Hazard repository, run the dry run first:

```bash
.venv/bin/python scripts/governance/register_damage_artifacts.py --env dev --dry-run
```

3. Review every row listed. The current script discovers all completed development manifests, so the review must account for the complete set rather than only the requested cell.
4. Check each row’s artifact ID, version, peril, technology, status, GCS URI, and SHA against its manifest. Check for deliberate supersession decisions; the registrar does not automatically demote an older row.
5. When authorized, run without `--dry-run`:

```bash
.venv/bin/python scripts/governance/register_damage_artifacts.py --env dev
```

6. Read back `damage_artifact_ref` through a guarded query and verify that the exact coordinate resolves to one intended active pin. Never expose connection strings in logs or documentation.

**Pass gate:** registry and manifest identities match, the development plane is proven, the row is queryable, and active selection is unambiguous. **Stop gate:** production marker, wrong database plane, missing/incomplete manifest, SHA difference, unexplained duplicate selection, or unintended rows in the dry run.

**Illustrative example:** registering the published Tropical Cyclone Wind × Wind v1.2 manifest would complete its measured missing Step 11, but it would not automatically prove a Hazard pair or update a dashboard.

**Copyable request**

> Audit the completed development Damage manifests and run the Hazard registrar in `--dry-run`. Reconcile every proposed row to manifest URI/SHA and report current `damage_artifact_ref` effects, duplicates, and supersession questions. After I explicitly approve the reviewed set, register only through the guarded development workflow and read back the exact coordinate. Never touch production or copy curve bytes into the database.

**Handoff:** give the verified registry row and manifest pin to Step 12.

[What registration creates](what.md#register-artifact) · [Why the registry is separate](why.md#register-artifact) · [Package gateway](README.md)

<a id="consume-in-hazard"></a>
## 12. Consume in Hazard — run card

**Outcome:** a governed Hazard run that proves artifact integrity, uses labeled plant facts, retains detailed loss rows, reproduces its aggregate, and writes immutable run evidence before any current DB projection.

**Starting inputs:** registered Damage row, published manifest/artifact/KATs/schema, resolved asset input receipt, native hazard data, pair dossier, model configuration, value assertion, and intended claim grade. Hazard owns execution; Damage owns response semantics; the platform owns asset facts. Begin with the [Deep Damage loader](../../../../Hazard_modeling/drivers/deep/src/deep/damage_loader.py) and its tests.

**Procedure**

1. Resolve the intended `damage_artifact_ref` row; do not select “newest file.” Load the manifest and artifact, then verify registry SHA, manifest SHA, actual bytes, and published schema.
2. Execute the artifact’s physics/curve KATs in the Hazard evaluator. Add a peril-specific positive and zero case when the generic KAT does not prove the adapter.
3. Fetch the live resolved asset object and write its exact JSON as an immutable input receipt for the run. Preserve facility, generator, subsystem, component, geometry, and value grains.
4. Classify every potentially applicable failure unit as observed, reference, default, absent, placeholder-excluded, unknown, or withheld. Never convert a placeholder into an observed claim.
5. Sample native hazard support at the declared geometry/grain. Apply a governed fallback geometry only when observed boundaries are unavailable, and label the fallback.
6. Produce M3 rows at failure-unit × hazard class/event × relevant asset support. Attach mapping identity, input basis, response, mapped value, direct loss, and flags.
7. Apply support/fieldwork value once through the artifact-declared rule. Create canonical subsystem rollups from artifact mappings, then M4 plant aggregates.
8. Prove that detailed direct + support rows reproduce each subsystem and plant aggregate exactly. Preserve zero, unknown, and withheld as different states.
9. Write the immutable GCS run package first: input-receipt URI/SHA, Damage manifest/artifact URI/SHA, hazard source pins, code/config versions, detailed rows, rollups, aggregate, validation, and final manifest.
10. Only after the manifest is complete, write the eligible current database projection and its manifest pointer. Verify the intended served surface separately.

```text
INTEGRITY GATE
registry row ─► manifest exists ─► bytes SHA ─► schema ─► KAT
                                                        │ pass
                                                        v
SCIENTIFIC JOIN
asset receipt ─► basis labels ─┐
native hazard ─► support rows ─┼─► detailed M3 ─► support once ─► subsystem ─► plant M4
Damage map ────► failure units ┘
                                                        │ exact parity
                                                        v
STORAGE GATE
GCS objects ─► run manifest last ─► current DB projection ─► served verification
```

**Corrected Wildfire × Solar worked example:** the current artifact has ten failure units across six flame classes, so the first auditable response table has `10 × 6 = 60` failure-unit-class rows before plant/event weighting, plus separately governed support allocation. Hayhurst’s observed PV-array geometry can support module exposure. Other subsystem rows must carry their actual observed/reference/default/absent status. The artifact’s declared mappings replace the experiment’s handwritten six-group diagnostic. The retained detailed rows must reproduce the existing aggregate if only representation changed.

The complete executed reduction is:

```text
60 failure-unit/class rows
      ↓ weight six classes by P(class | fire)
10 physical failure-unit contributions
      ↓ group by exact subsystem code
 9 subsystem totals
      + one nonphysical replacement-support line
      ↓
aggregate conditional M3 loss
```

The parity invariant is:

```text
aggregate_M3
  = Σ(physical failure-unit loss contributions)
    + replacement-support allocation applied once

absolute difference in the bounded proof ≈ 1.73 × 10⁻¹⁸
```

Treat this as a calculation and accounting assertion. It does not establish that the response functions are calibrated, that reference weights are observed Hayhurst values, or that all mapped subsystems exist at Hayhurst.

**D3.5 output-storage direction**

| Output | Proposed owner | Current interpretation |
|---|---|---|
| Full failure-unit/class detail, subsystem rollups, support line, diagnostics, run history | Immutable GCS package | Preserve exact bytes and lineage |
| Current cross-asset headline and manifest/input/Damage pointers | Thin database projection | Query and serve current eligible state |
| Snapshot bank, run-ledger, Damage-detail table, new result family | None proposed | Do not add without a demonstrated query/use case |
| Spatial role/grain semantics | Platform asset data | Repair before production |
| Observed/reference/withheld valuation and zero/unavailable/stale status | Platform/Hazard policy | Decide before D4 serving |

This is an owner-review direction, not authorization to change the database.

**Verification commands for the loader seam**

```bash
.venv/bin/python -m pytest \
  drivers/deep/tests/test_damage_loader.py \
  drivers/deep/tests/test_damage_loader_v3.py -q
```

Add pair-specific tests and the canonical Hazard suite required by `AGENTS.md` before production extraction. If the pair has no canonical executor yet, stop after the bounded experiment and owner milestone review; do not invent a production claim.

**Pass gate:** integrity gates pass; detailed-to-aggregate parity is exact; basis/unknown/withheld labels survive; GCS manifest is complete before DB write; and the served result carries the accepted grade. **Stop gate:** missing registry/publication/KAT, unresolved mapping, false observed claim, value conflict without policy, missing native source pin, aggregate mismatch, or incomplete manifest.

**Copyable request**

> Build a bounded `<hazard> × <asset>` Hazard consumption proof from the registered Damage artifact. Resolve registry → GCS, verify SHA/schema, run artifact and peril-specific KATs, fetch and receipt live asset facts, separately audit vocabulary mapping and plant evidence, label every failure unit’s observed/reference/default/absent/placeholder/unknown/withheld basis, retain detailed M3 rows, apply support once, roll up through artifact mappings, and prove exact aggregate parity. Keep full detail in immutable GCS and propose relational detail only for a demonstrated query. Stop for owner review before a database change, production extraction, or public serving.

**Handoff:** return the answer-first assessment, run manifest, detailed/aggregate parity report, database-change observations, and owner decisions. New evidence or a model defect re-enters the classifier at Step 1, 3, or 4.

[What Hazard consumption produces](what.md#consume-in-hazard) · [Why it retains detail and receipts](why.md#consume-in-hazard) · [Package gateway](README.md)

## Fast routing table for operators

| Situation | Start at | Mandatory route |
|---|---:|---|
| Brand-new peril × asset address | 1 | New-cell workflow through owner review and validation |
| New paper, no output change expected | 3 | Evidence ingestion; confirm classification |
| Curve, mapping, or selector changes outputs | 2/3 | Existing-cell update + model/version gates |
| Required artifact field meaning changes | Classifier | Schema-contract workflow + consumer migration |
| Current local artifact has no GCS manifest | 10 | Publication plan, approval, create-only run |
| Valid GCS manifest has no DB row | 11 | Dry-run registrar, reconcile, approve, register |
| Registered artifact lacks canonical pair consumer | 12 | Pair dossier, bounded experiment, KAT/parity, owner review |
| Hazard exposes a scientific model defect | 3 or 4 | Preserve run evidence; reopen Damage decision |
| Database gains new observed subsystem detail | 12 | Rerun resolver/selector; no Damage change unless mapping cannot express it |

## What to save after every run

At minimum, preserve:

- the request and classified change event;
- repository commits and live environments inspected;
- input identities and hashes;
- outputs and validation evidence;
- owner questions, verdicts, and non-claims;
- stop conditions encountered;
- the exact next lifecycle step and responsible repository.

This record prevents the next operator from inferring state from file age or a conversational summary alone.
